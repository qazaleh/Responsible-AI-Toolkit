from __future__ import annotations

import json
import re
from collections import defaultdict
from datetime import datetime
from typing import Any

from agent_log.schemas import EvaluationResponse, Finding, Scores, Status, Summary


REQUIRED_FIELDS = [
    'event_id',
    'timestamp',
    'session_id',
    'agent_id',
    'event_type',
    'status',
]

TRACEABILITY_START = {'session_started', 'session_start'}
TRACEABILITY_REQUEST = {'user_request_received', 'user_request', 'request_received'}
TRACEABILITY_RESPONSE = {'agent_response_generated', 'final_response', 'response_generated'}
TRACEABILITY_COMPLETE = {'session_completed', 'session_complete', 'completed'}
TOOL_REQUEST = {'tool_call_requested', 'tool_requested', 'tool_request'}
TOOL_COMPLETION = {'tool_call_completed', 'tool_completed', 'tool_result_received'}


class AgentLogEvaluationService:
    def health(self) -> dict[str, str]:
        return {
            'status': 'ok',
            'service': 'responsible-ai-agent-log',
            'mode': 'deterministic-rule-based',
        }

    def evaluate_jsonl_bytes(
        self,
        content: bytes,
        filename: str = 'uploaded.jsonl',
    ) -> EvaluationResponse:
        text = content.decode('utf-8-sig')
        events = self._parse_jsonl(text)
        if not events:
            return self._empty_response(filename)
        return self._evaluate_events(events)

    def _parse_jsonl(self, text: str) -> list[dict[str, Any]]:
        events: list[dict[str, Any]] = []

        for line_number, line in enumerate(text.splitlines(), start=1):
            stripped = line.strip()
            if not stripped:
                continue

            try:
                payload = json.loads(stripped)
            except json.JSONDecodeError as exc:
                raise ValueError(f'Invalid JSON object on line {line_number}: {exc.msg}.') from exc

            if not isinstance(payload, dict):
                raise ValueError(f'Line {line_number} must contain a JSON object.')

            payload['_line_number'] = line_number
            events.append(payload)

        return events

    def _evaluate_events(self, events: list[dict[str, Any]]) -> EvaluationResponse:
        findings: list[Finding] = []
        missing_fields: set[str] = set()

        sessions = self._group_by_session(events)
        summary = Summary(
            total_events=len(events),
            total_sessions=len(sessions),
            total_agents=len({str(event.get('agent_id')).strip() for event in events if self._has_value(event.get('agent_id'))}),
            total_tool_calls=self._count_tool_calls(events),
            failed_events=len([event for event in events if self._is_failed_event(event)]),
        )

        required_field_coverage = self._evaluate_required_fields(events, findings, missing_fields)
        traceability = self._evaluate_traceability(events, sessions, findings, missing_fields)
        tool_call_visibility = self._evaluate_tool_visibility(events, findings, missing_fields)
        authorization_evidence = self._evaluate_authorization(events, findings, missing_fields)
        data_lineage = self._evaluate_data_lineage(events, findings, missing_fields)
        operational_logging = self._evaluate_operational_logging(events, findings, missing_fields)

        overall = self._score(
            self._average(
                [
                    required_field_coverage,
                    traceability,
                    tool_call_visibility,
                    authorization_evidence,
                    data_lineage,
                    operational_logging,
                ]
            )
        )

        scores = Scores(
            overall_audit_readiness=overall,
            traceability=traceability,
            tool_call_visibility=tool_call_visibility,
            authorization_evidence=authorization_evidence,
            data_lineage=data_lineage,
            operational_logging=operational_logging,
        )

        overall_status = self._overall_status_label(
            required_field_coverage=required_field_coverage,
            category_scores=[
                traceability,
                tool_call_visibility,
                authorization_evidence,
                data_lineage,
                operational_logging,
            ],
        )

        status = Status(
            overall=overall_status,
            traceability=self._status_label(traceability),
            tool_call_visibility=self._status_label(tool_call_visibility),
            authorization_evidence=self._status_label(authorization_evidence),
            data_lineage=self._status_label(data_lineage),
            operational_logging=self._status_label(operational_logging),
        )

        return EvaluationResponse(
            summary=summary,
            scores=scores,
            status=status,
            missing_fields=sorted(missing_fields),
            findings=findings,
            recommendations=self._build_recommendations(
                required_field_coverage=required_field_coverage,
                traceability=traceability,
                tool_call_visibility=tool_call_visibility,
                authorization_evidence=authorization_evidence,
                data_lineage=data_lineage,
                operational_logging=operational_logging,
            ),
        )

    def _empty_response(self, filename: str) -> EvaluationResponse:
        findings = [
            Finding(
                category='traceability',
                severity='high',
                message='No log events were found in the uploaded JSONL file.',
                evidence=f'{filename} did not contain any JSON objects.',
            )
        ]

        return EvaluationResponse(
            summary=Summary(
                total_events=0,
                total_sessions=0,
                total_agents=0,
                total_tool_calls=0,
                failed_events=0,
            ),
            scores=Scores(
                overall_audit_readiness=0,
                traceability=0,
                tool_call_visibility=0,
                authorization_evidence=0,
                data_lineage=0,
                operational_logging=0,
            ),
            status=Status(
                overall='fail',
                traceability='fail',
                tool_call_visibility='fail',
                authorization_evidence='fail',
                data_lineage='fail',
                operational_logging='fail',
            ),
            missing_fields=REQUIRED_FIELDS.copy(),
            findings=findings,
            recommendations=[
                'Upload newline-delimited JSON objects with the mandatory event envelope fields populated.',
            ],
        )

    def _evaluate_required_fields(
        self,
        events: list[dict[str, Any]],
        findings: list[Finding],
        missing_fields: set[str],
    ) -> int:
        coverage_values: list[float] = []
        evidence_parts: list[str] = []

        for field_name in REQUIRED_FIELDS:
            present = sum(1 for event in events if self._has_value(event.get(field_name)))
            coverage = present / len(events)
            coverage_values.append(coverage)
            if coverage < 1:
                missing_fields.add(field_name)
                evidence_parts.append(f'{field_name} missing in {len(events) - present}/{len(events)} events')

        if evidence_parts:
            findings.append(
                Finding(
                    category='required_field_coverage',
                    severity=self._severity_from_ratio(min(coverage_values)),
                    message='Mandatory event envelope fields are incomplete.',
                    evidence='; '.join(evidence_parts),
                )
            )

        return self._score(self._average(coverage_values))

    def _evaluate_traceability(
        self,
        events: list[dict[str, Any]],
        sessions: dict[str, list[dict[str, Any]]],
        findings: list[Finding],
        missing_fields: set[str],
    ) -> int:
        if not sessions:
            findings.append(
                Finding(
                    category='traceability',
                    severity='high',
                    message='No valid session_id values were found, so action chains cannot be reconstructed.',
                    evidence='All events are missing session_id or contain blank session identifiers.',
                )
            )
            missing_fields.add('session_id')
            return 0

        started = 0
        requested = 0
        responded = 0
        completed = 0
        reconstructable = 0
        missing_session_events: list[str] = []

        action_events = [event for event in events if self._requires_action_order(event)]
        action_events_with_order = sum(
            1 for event in action_events if self._is_int_like(event.get('action_order'))
        )
        action_order_ratio = (
            action_events_with_order / len(action_events) if action_events else 1.0
        )
        if action_order_ratio < 1:
            missing_fields.add('action_order')

        for session_id, session_events in sessions.items():
            if any(self._event_matches(event, TRACEABILITY_START) for event in session_events):
                started += 1
            else:
                missing_session_events.append(f'{session_id}: session_started')

            if any(self._event_matches(event, TRACEABILITY_REQUEST) for event in session_events):
                requested += 1
            else:
                missing_session_events.append(f'{session_id}: user_request_received')

            if any(self._event_matches(event, TRACEABILITY_RESPONSE) for event in session_events):
                responded += 1
            else:
                missing_session_events.append(f'{session_id}: agent_response_generated')

            if any(self._event_matches(event, TRACEABILITY_COMPLETE) for event in session_events):
                completed += 1
            else:
                missing_session_events.append(f'{session_id}: session_completed')

            if self._session_reconstructable(session_events):
                reconstructable += 1

        total_sessions = len(sessions)
        score = self._score(
            self._average(
                [
                    started / total_sessions,
                    requested / total_sessions,
                    responded / total_sessions,
                    completed / total_sessions,
                    action_order_ratio,
                    reconstructable / total_sessions,
                ]
            )
        )

        if missing_session_events:
            findings.append(
                Finding(
                    category='traceability',
                    severity=self._severity_from_ratio(
                        min(
                            [
                                started / total_sessions,
                                requested / total_sessions,
                                responded / total_sessions,
                                completed / total_sessions,
                                reconstructable / total_sessions,
                            ]
                        )
                    ),
                    message='Lifecycle traceability events are incomplete for one or more sessions.',
                    evidence='; '.join(missing_session_events[:8]),
                )
            )

        if action_order_ratio < 1:
            findings.append(
                Finding(
                    category='traceability',
                    severity=self._severity_from_ratio(action_order_ratio),
                    message='Action ordering is incomplete for action, tool, or final-response events.',
                    evidence=f'action_order missing in {len(action_events) - action_events_with_order}/{len(action_events)} trace events',
                )
            )

        if reconstructable < total_sessions:
            findings.append(
                Finding(
                    category='traceability',
                    severity=self._severity_from_ratio(reconstructable / total_sessions),
                    message='Some sessions cannot be reconstructed by timestamp or action_order.',
                    evidence=f'{total_sessions - reconstructable}/{total_sessions} sessions lack a complete sortable sequence',
                )
            )

        return score

    def _evaluate_tool_visibility(
        self,
        events: list[dict[str, Any]],
        findings: list[Finding],
        missing_fields: set[str],
    ) -> int:
        tool_events = [event for event in events if self._is_tool_event(event)]
        if not tool_events:
            return 100

        requests = [event for event in tool_events if self._event_matches(event, TOOL_REQUEST)]
        completions = [event for event in tool_events if self._event_matches(event, TOOL_COMPLETION)]
        tool_name_ratio = self._field_ratio(tool_events, 'tool_name')
        input_ratio = self._field_ratio(requests, 'tool_input_summary', default_when_empty=0.0)
        output_ratio = self._field_ratio(completions, 'tool_output_summary', default_when_empty=0.0)

        request_ids = {
            str(event.get('tool_call_id')).strip()
            for event in requests
            if self._has_value(event.get('tool_call_id'))
        }
        completion_ids = {
            str(event.get('tool_call_id')).strip()
            for event in completions
            if self._has_value(event.get('tool_call_id'))
        }
        known_ids = request_ids | completion_ids
        matched_ids = request_ids & completion_ids

        expected_calls = max(len(requests), len(completions), len(known_ids), 1)
        request_ratio = len(requests) / expected_calls
        completion_ratio = len(completions) / expected_calls
        symmetry_ratio = (
            min(len(requests), len(completions)) / max(len(requests), len(completions))
            if requests or completions
            else 1.0
        )
        id_match_ratio = len(matched_ids) / len(known_ids) if known_ids else 1.0

        missing_id_count = sum(
            1
            for event in requests + completions
            if not self._has_value(event.get('tool_call_id'))
        )
        if missing_id_count:
            missing_fields.add('tool_call_id')

        if tool_name_ratio < 1:
            missing_fields.add('tool_name')
        if input_ratio < 1:
            missing_fields.add('tool_input_summary')
        if output_ratio < 1:
            missing_fields.add('tool_output_summary')

        score = self._score(
            self._average(
                [
                    request_ratio,
                    completion_ratio,
                    symmetry_ratio,
                    tool_name_ratio,
                    input_ratio,
                    output_ratio,
                    id_match_ratio,
                ]
            )
        )

        if request_ratio < 1 or completion_ratio < 1 or symmetry_ratio < 1:
            findings.append(
                Finding(
                    category='tool_call_visibility',
                    severity=self._severity_from_ratio(min(request_ratio, completion_ratio, symmetry_ratio)),
                    message='Tool-call request and completion coverage is incomplete.',
                    evidence=f'{len(requests)} request events, {len(completions)} completion events across {expected_calls} expected tool calls',
                )
            )

        if tool_name_ratio < 1:
            findings.append(
                Finding(
                    category='tool_call_visibility',
                    severity=self._severity_from_ratio(tool_name_ratio),
                    message='Tool events are missing tool_name values.',
                    evidence=f'tool_name missing in {len(tool_events) - sum(1 for event in tool_events if self._has_value(event.get("tool_name")))}/{len(tool_events)} tool events',
                )
            )

        if input_ratio < 1:
            findings.append(
                Finding(
                    category='tool_call_visibility',
                    severity=self._severity_from_ratio(input_ratio),
                    message='Tool request events are missing tool_input_summary values.',
                    evidence=f'tool_input_summary missing in {len(requests) - sum(1 for event in requests if self._has_value(event.get("tool_input_summary")))}/{len(requests)} request events',
                )
            )

        if output_ratio < 1:
            findings.append(
                Finding(
                    category='tool_call_visibility',
                    severity=self._severity_from_ratio(output_ratio),
                    message='Tool completion events are missing tool_output_summary values.',
                    evidence=f'tool_output_summary missing in {len(completions) - sum(1 for event in completions if self._has_value(event.get("tool_output_summary")))}/{len(completions)} completion events',
                )
            )

        if known_ids and id_match_ratio < 1:
            findings.append(
                Finding(
                    category='tool_call_visibility',
                    severity=self._severity_from_ratio(id_match_ratio),
                    message='tool_call_id values do not fully connect request and completion records.',
                    evidence=f'{len(matched_ids)}/{len(known_ids)} tool_call_id values matched across request and completion events',
                )
            )

        if missing_id_count:
            findings.append(
                Finding(
                    category='tool_call_visibility',
                    severity='medium',
                    message='Some tool request or completion events do not carry tool_call_id values.',
                    evidence=f'tool_call_id missing in {missing_id_count}/{len(requests) + len(completions)} request/completion events',
                )
            )

        return score

    def _evaluate_authorization(
        self,
        events: list[dict[str, Any]],
        findings: list[Finding],
        missing_fields: set[str],
    ) -> int:
        required_ratio = self._field_ratio(events, 'human_approval_required')
        result_ratio = self._field_ratio(events, 'human_approval_result')
        approval_required_events = [
            event for event in events if self._is_truthy(event.get('human_approval_required'))
        ]
        conditional_ratio = self._field_ratio(
            approval_required_events,
            'human_approval_result',
            default_when_empty=1.0,
        )

        if required_ratio < 1:
            missing_fields.add('human_approval_required')
        if result_ratio < 1 or conditional_ratio < 1:
            missing_fields.add('human_approval_result')

        score = self._score(self._average([required_ratio, result_ratio, conditional_ratio]))

        if required_ratio < 1:
            findings.append(
                Finding(
                    category='authorization_evidence',
                    severity=self._severity_from_ratio(required_ratio),
                    message='human_approval_required is not populated on every event.',
                    evidence=f'human_approval_required missing in {len(events) - sum(1 for event in events if self._has_value(event.get("human_approval_required")))}/{len(events)} events',
                )
            )

        if result_ratio < 1:
            findings.append(
                Finding(
                    category='authorization_evidence',
                    severity=self._severity_from_ratio(result_ratio),
                    message='human_approval_result is not populated on every event.',
                    evidence=f'human_approval_result missing in {len(events) - sum(1 for event in events if self._has_value(event.get("human_approval_result")))}/{len(events)} events',
                )
            )

        if conditional_ratio < 1:
            findings.append(
                Finding(
                    category='authorization_evidence',
                    severity=self._severity_from_ratio(conditional_ratio),
                    message='Approval decisions are missing for events that require human approval.',
                    evidence=f'human_approval_result missing in {len(approval_required_events) - sum(1 for event in approval_required_events if self._has_value(event.get("human_approval_result")))}/{len(approval_required_events)} approval-required events',
                )
            )

        return score

    def _evaluate_data_lineage(
        self,
        events: list[dict[str, Any]],
        findings: list[Finding],
        missing_fields: set[str],
    ) -> int:
        presence_ratio = self._field_ratio(events, 'data_accessed')
        list_like_ratio = self._list_like_ratio(events, 'data_accessed')
        tool_events = [event for event in events if self._is_tool_event(event)]
        tool_data_ratio = (
            sum(
                1
                for event in tool_events
                if self._has_value(event.get('data_accessed'))
                and self._is_list_like(event.get('data_accessed'))
            )
            / len(tool_events)
            if tool_events
            else 1.0
        )

        if presence_ratio < 1 or list_like_ratio < 1 or tool_data_ratio < 1:
            missing_fields.add('data_accessed')

        score = self._score(self._average([presence_ratio, list_like_ratio, tool_data_ratio]))

        if presence_ratio < 1:
            findings.append(
                Finding(
                    category='data_lineage',
                    severity=self._severity_from_ratio(presence_ratio),
                    message='data_accessed is not present on every event.',
                    evidence=f'data_accessed missing in {len(events) - sum(1 for event in events if self._has_value(event.get("data_accessed")))}/{len(events)} events',
                )
            )

        if list_like_ratio < 1:
            findings.append(
                Finding(
                    category='data_lineage',
                    severity=self._severity_from_ratio(list_like_ratio),
                    message='Some data_accessed values are not list-like.',
                    evidence=f'list-like data_accessed missing in {len(events) - sum(1 for event in events if self._has_value(event.get("data_accessed")) and self._is_list_like(event.get("data_accessed")))}/{len(events)} events',
                )
            )

        if tool_data_ratio < 1:
            findings.append(
                Finding(
                    category='data_lineage',
                    severity=self._severity_from_ratio(tool_data_ratio),
                    message='Tool-related events are missing data lineage evidence.',
                    evidence=f'data_accessed missing or malformed in {len(tool_events) - sum(1 for event in tool_events if self._has_value(event.get("data_accessed")) and self._is_list_like(event.get("data_accessed")))}/{len(tool_events)} tool events',
                )
            )

        return score

    def _evaluate_operational_logging(
        self,
        events: list[dict[str, Any]],
        findings: list[Finding],
        missing_fields: set[str],
    ) -> int:
        status_ratio = self._field_ratio(events, 'status')
        latency_candidates = [
            event
            for event in events
            if not self._event_matches(event, TRACEABILITY_START | TRACEABILITY_COMPLETE)
        ]
        latency_ratio = self._field_ratio(
            latency_candidates,
            'latency_ms',
            default_when_empty=1.0,
        )
        failed_events = [event for event in events if self._is_failed_event(event)]
        error_code_ratio = self._field_ratio(
            failed_events,
            'error_code',
            default_when_empty=1.0,
        )

        if status_ratio < 1:
            missing_fields.add('status')
        if latency_ratio < 1:
            missing_fields.add('latency_ms')
        if error_code_ratio < 1:
            missing_fields.add('error_code')

        score = self._score(self._average([status_ratio, latency_ratio, error_code_ratio]))

        if latency_ratio < 1:
            findings.append(
                Finding(
                    category='operational_logging',
                    severity=self._severity_from_ratio(latency_ratio),
                    message='latency_ms is missing for operational events.',
                    evidence=f'latency_ms missing in {len(latency_candidates) - sum(1 for event in latency_candidates if self._has_value(event.get("latency_ms")))}/{len(latency_candidates)} operational events',
                )
            )

        if failed_events and error_code_ratio < 1:
            findings.append(
                Finding(
                    category='operational_logging',
                    severity=self._severity_from_ratio(error_code_ratio),
                    message='Failed events are missing error_code values.',
                    evidence=f'error_code missing in {len(failed_events) - sum(1 for event in failed_events if self._has_value(event.get("error_code")))}/{len(failed_events)} failed events',
                )
            )

        return score

    def _build_recommendations(self, **scores: int) -> list[str]:
        ordered: list[str] = []
        seen: set[str] = set()

        def add(message: str) -> None:
            if message not in seen:
                ordered.append(message)
                seen.add(message)

        if scores['required_field_coverage'] < 100:
            add('Populate event_id, timestamp, session_id, agent_id, event_type, and status on every log line.')
        if scores['traceability'] < 80:
            add('Emit session_started, user_request_received, agent_response_generated, and session_completed events for every session.')
        if scores['tool_call_visibility'] < 80:
            add('Record both tool_call_requested and tool_call_completed events with tool_name, summaries, and consistent tool_call_id values.')
        if scores['authorization_evidence'] < 80:
            add('Capture human_approval_required and human_approval_result consistently, especially when approval gates are triggered.')
        if scores['data_lineage'] < 80:
            add('Store data_accessed as a list-like structure on every data-touching event, especially for tool calls.')
        if scores['operational_logging'] < 80:
            add('Populate latency_ms for operational events and attach error_code to every failed event.')

        return ordered

    def _group_by_session(self, events: list[dict[str, Any]]) -> dict[str, list[dict[str, Any]]]:
        grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
        for event in events:
            session_id = event.get('session_id')
            if self._has_value(session_id):
                grouped[str(session_id).strip()].append(event)
        return dict(grouped)

    def _count_tool_calls(self, events: list[dict[str, Any]]) -> int:
        tool_events = [event for event in events if self._is_tool_event(event)]
        if not tool_events:
            return 0

        requests = [event for event in tool_events if self._event_matches(event, TOOL_REQUEST)]
        completions = [event for event in tool_events if self._event_matches(event, TOOL_COMPLETION)]
        known_ids = {
            str(event.get('tool_call_id')).strip()
            for event in requests + completions
            if self._has_value(event.get('tool_call_id'))
        }

        fallback = len(tool_events) if not requests and not completions else 0
        return max(len(requests), len(completions), len(known_ids), fallback)

    def _session_reconstructable(self, session_events: list[dict[str, Any]]) -> bool:
        all_timestamps_parse = all(
            self._parse_timestamp(event.get('timestamp')) is not None for event in session_events
        )
        action_events = [event for event in session_events if self._requires_action_order(event)]
        all_action_orders_present = bool(action_events) and all(
            self._is_int_like(event.get('action_order')) for event in action_events
        )
        return all_timestamps_parse or all_action_orders_present

    def _requires_action_order(self, event: dict[str, Any]) -> bool:
        labels = self._event_labels(event)
        if self._is_tool_event(event):
            return True
        return any(
            label in TRACEABILITY_RESPONSE
            or 'action' in label
            or 'final_response' in label
            for label in labels
        )

    def _is_tool_event(self, event: dict[str, Any]) -> bool:
        labels = self._event_labels(event)
        return bool(
            self._has_value(event.get('tool_name'))
            or self._has_value(event.get('tool_call_id'))
            or any(label in TOOL_REQUEST or label in TOOL_COMPLETION or 'tool' in label for label in labels)
        )

    def _event_matches(self, event: dict[str, Any], candidates: set[str]) -> bool:
        return bool(self._event_labels(event) & candidates)

    def _event_labels(self, event: dict[str, Any]) -> set[str]:
        labels = set()
        for key in ('event_type', 'action'):
            if self._has_value(event.get(key)):
                labels.add(self._normalize_label(str(event.get(key))))
        return labels

    def _normalize_label(self, value: str) -> str:
        return re.sub(r'_+', '_', re.sub(r'[^a-z0-9]+', '_', value.strip().lower())).strip('_')

    def _field_ratio(
        self,
        events: list[dict[str, Any]],
        field_name: str,
        default_when_empty: float = 1.0,
    ) -> float:
        if not events:
            return default_when_empty
        present = sum(1 for event in events if self._has_value(event.get(field_name)))
        return present / len(events)

    def _list_like_ratio(self, events: list[dict[str, Any]], field_name: str) -> float:
        if not events:
            return 1.0
        present_and_valid = sum(
            1
            for event in events
            if self._has_value(event.get(field_name)) and self._is_list_like(event.get(field_name))
        )
        return present_and_valid / len(events)

    def _is_list_like(self, value: Any) -> bool:
        if isinstance(value, (list, tuple, set)):
            return True
        if isinstance(value, str):
            stripped = value.strip()
            if not stripped:
                return False
            if stripped.startswith('[') and stripped.endswith(']'):
                try:
                    parsed = json.loads(stripped)
                except json.JSONDecodeError:
                    return False
                return isinstance(parsed, list)
            return any(separator in stripped for separator in (',', ';', '|'))
        return False

    def _is_truthy(self, value: Any) -> bool:
        if isinstance(value, bool):
            return value
        if isinstance(value, (int, float)):
            return value != 0
        if isinstance(value, str):
            return value.strip().lower() in {'true', '1', 'yes', 'y', 'required', 'approved_required'}
        return False

    def _is_failed_event(self, event: dict[str, Any]) -> bool:
        status = str(event.get('status', '')).strip().lower()
        return status in {'failed', 'failure', 'error'}

    def _parse_timestamp(self, value: Any) -> datetime | None:
        if not self._has_value(value):
            return None
        candidate = str(value).strip()
        if candidate.endswith('Z'):
            candidate = f'{candidate[:-1]}+00:00'
        try:
            return datetime.fromisoformat(candidate)
        except ValueError:
            return None

    def _is_int_like(self, value: Any) -> bool:
        if isinstance(value, bool) or value is None:
            return False
        try:
            int(value)
        except (TypeError, ValueError):
            return False
        return True

    def _has_value(self, value: Any) -> bool:
        if value is None:
            return False
        if isinstance(value, str):
            return bool(value.strip())
        return True

    def _average(self, values: list[float]) -> float:
        if not values:
            return 0.0
        return sum(values) / len(values)

    def _score(self, value: float) -> int:
        return max(0, min(100, int(round(value * 100 if value <= 1 else value))))

    def _status_label(self, score: int) -> str:
        if score >= 80:
            return 'pass'
        if score >= 50:
            return 'partial'
        return 'fail'

    def _overall_status_label(
        self,
        required_field_coverage: int,
        category_scores: list[int],
    ) -> str:
        if required_field_coverage < 80 or any(score < 50 for score in category_scores):
            return 'fail'
        if required_field_coverage < 100 or any(score < 80 for score in category_scores):
            return 'partial'
        return 'pass'

    def _severity_from_ratio(self, ratio: float) -> str:
        if ratio < 0.5:
            return 'high'
        if ratio < 0.85:
            return 'medium'
        return 'low'
