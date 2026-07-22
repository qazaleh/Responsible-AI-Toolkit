import json
import unittest

from fastapi.testclient import TestClient

from agent_log.service import AgentLogEvaluationService
from main import app


class AgentLogApiTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(app)
        cls.service = AgentLogEvaluationService()

    def _post_jsonl(self, payload: str):
        return self.client.post(
            '/evaluate',
            files={'file': ('events.jsonl', payload.encode('utf-8'), 'application/x-ndjson')},
        )

    def test_health_endpoint(self) -> None:
        response = self.client.get('/health')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'ok')

    def test_valid_jsonl_upload(self) -> None:
        payload = '\n'.join(
            [
                json.dumps(
                    {
                        'event_id': 'evt-1',
                        'timestamp': '2026-07-22T10:00:00Z',
                        'session_id': 'session-1',
                        'agent_id': 'agent-1',
                        'event_type': 'session_started',
                        'action': 'session-start',
                        'status': 'success',
                        'latency_ms': 4,
                        'human_approval_required': False,
                        'human_approval_result': 'not_required',
                        'data_accessed': [],
                    }
                ),
                json.dumps(
                    {
                        'event_id': 'evt-2',
                        'timestamp': '2026-07-22T10:00:02Z',
                        'session_id': 'session-1',
                        'agent_id': 'agent-1',
                        'event_type': 'user_request_received',
                        'action': 'capture-request',
                        'action_order': 1,
                        'status': 'success',
                        'latency_ms': 8,
                        'human_approval_required': False,
                        'human_approval_result': 'not_required',
                        'data_accessed': [],
                    }
                ),
                json.dumps(
                    {
                        'event_id': 'evt-3',
                        'timestamp': '2026-07-22T10:00:03Z',
                        'session_id': 'session-1',
                        'agent_id': 'agent-1',
                        'event_type': 'tool_call_requested',
                        'action': 'tool-request',
                        'action_order': 2,
                        'tool_name': 'policy_lookup',
                        'tool_input_summary': 'Fetch policy guidance.',
                        'tool_call_id': 'tool-1',
                        'status': 'success',
                        'latency_ms': 12,
                        'human_approval_required': True,
                        'human_approval_result': 'approved',
                        'data_accessed': ['policy_catalog'],
                    }
                ),
                json.dumps(
                    {
                        'event_id': 'evt-4',
                        'timestamp': '2026-07-22T10:00:04Z',
                        'session_id': 'session-1',
                        'agent_id': 'agent-1',
                        'event_type': 'tool_call_completed',
                        'action': 'tool-complete',
                        'action_order': 3,
                        'tool_name': 'policy_lookup',
                        'tool_input_summary': 'Fetch policy guidance.',
                        'tool_output_summary': 'Policy guidance returned.',
                        'tool_call_id': 'tool-1',
                        'status': 'success',
                        'latency_ms': 44,
                        'human_approval_required': True,
                        'human_approval_result': 'approved',
                        'data_accessed': ['policy_catalog'],
                    }
                ),
                json.dumps(
                    {
                        'event_id': 'evt-5',
                        'timestamp': '2026-07-22T10:00:05Z',
                        'session_id': 'session-1',
                        'agent_id': 'agent-1',
                        'event_type': 'agent_response_generated',
                        'action': 'final-response',
                        'action_order': 4,
                        'status': 'success',
                        'latency_ms': 15,
                        'human_approval_required': True,
                        'human_approval_result': 'approved',
                        'data_accessed': ['policy_catalog'],
                    }
                ),
                json.dumps(
                    {
                        'event_id': 'evt-6',
                        'timestamp': '2026-07-22T10:00:06Z',
                        'session_id': 'session-1',
                        'agent_id': 'agent-1',
                        'event_type': 'session_completed',
                        'action': 'session-complete',
                        'status': 'success',
                        'latency_ms': 3,
                        'human_approval_required': True,
                        'human_approval_result': 'approved',
                        'data_accessed': [],
                    }
                ),
            ]
        )

        response = self._post_jsonl(payload)
        body = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(body['summary']['total_events'], 6)
        self.assertEqual(body['summary']['total_sessions'], 1)
        self.assertEqual(body['summary']['total_tool_calls'], 1)
        self.assertGreaterEqual(body['scores']['overall_audit_readiness'], 80)

    def test_invalid_jsonl_line_returns_400(self) -> None:
        response = self._post_jsonl('{"event_id": "evt-1"}\nnot-json\n')

        self.assertEqual(response.status_code, 400)
        self.assertIn('Invalid JSON object on line 2', response.json()['detail'])

    def test_missing_required_fields_are_reported(self) -> None:
        payload = '\n'.join(
            [
                json.dumps(
                    {
                        'event_id': 'evt-1',
                        'timestamp': '2026-07-22T10:00:00Z',
                        'agent_id': 'agent-1',
                        'event_type': 'session_started',
                        'status': 'success',
                        'human_approval_required': False,
                        'human_approval_result': 'not_required',
                        'data_accessed': [],
                    }
                )
            ]
        )

        response = self._post_jsonl(payload)
        body = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertIn('session_id', body['missing_fields'])
        self.assertEqual(body['status']['overall'], 'fail')

    def test_multiple_sessions_are_counted(self) -> None:
        payload = '\n'.join(
            [
                json.dumps(
                    {
                        'event_id': 'evt-1',
                        'timestamp': '2026-07-22T10:00:00Z',
                        'session_id': 'session-1',
                        'agent_id': 'agent-1',
                        'event_type': 'session_started',
                        'status': 'success',
                        'latency_ms': 1,
                        'human_approval_required': False,
                        'human_approval_result': 'not_required',
                        'data_accessed': [],
                    }
                ),
                json.dumps(
                    {
                        'event_id': 'evt-2',
                        'timestamp': '2026-07-22T10:01:00Z',
                        'session_id': 'session-2',
                        'agent_id': 'agent-2',
                        'event_type': 'session_started',
                        'status': 'success',
                        'latency_ms': 2,
                        'human_approval_required': False,
                        'human_approval_result': 'not_required',
                        'data_accessed': [],
                    }
                ),
            ]
        )

        response = self._post_jsonl(payload)
        body = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(body['summary']['total_sessions'], 2)

    def test_tool_call_request_completion_matching(self) -> None:
        payload = '\n'.join(
            [
                json.dumps(
                    {
                        'event_id': 'evt-1',
                        'timestamp': '2026-07-22T10:00:00Z',
                        'session_id': 'session-1',
                        'agent_id': 'agent-1',
                        'event_type': 'tool_call_requested',
                        'action': 'tool-request',
                        'action_order': 1,
                        'tool_name': 'policy_lookup',
                        'tool_input_summary': 'Fetch policy guidance.',
                        'tool_call_id': 'tool-1',
                        'status': 'success',
                        'latency_ms': 12,
                        'human_approval_required': False,
                        'human_approval_result': 'not_required',
                        'data_accessed': ['policy_catalog'],
                    }
                ),
                json.dumps(
                    {
                        'event_id': 'evt-2',
                        'timestamp': '2026-07-22T10:00:04Z',
                        'session_id': 'session-1',
                        'agent_id': 'agent-1',
                        'event_type': 'tool_call_completed',
                        'action': 'tool-complete',
                        'action_order': 2,
                        'tool_name': 'policy_lookup',
                        'tool_output_summary': 'Policy guidance returned.',
                        'tool_call_id': 'tool-2',
                        'status': 'success',
                        'latency_ms': 44,
                        'human_approval_required': False,
                        'human_approval_result': 'not_required',
                        'data_accessed': ['policy_catalog'],
                    }
                ),
            ]
        )

        response = self._post_jsonl(payload)
        body = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertLess(body['scores']['tool_call_visibility'], 80)
        self.assertTrue(
            any('tool_call_id values do not fully connect' in finding['message'] for finding in body['findings'])
        )

    def test_missing_data_accessed_is_reported(self) -> None:
        payload = '\n'.join(
            [
                json.dumps(
                    {
                        'event_id': 'evt-1',
                        'timestamp': '2026-07-22T10:00:00Z',
                        'session_id': 'session-1',
                        'agent_id': 'agent-1',
                        'event_type': 'tool_call_requested',
                        'action': 'tool-request',
                        'action_order': 1,
                        'tool_name': 'policy_lookup',
                        'tool_input_summary': 'Fetch policy guidance.',
                        'tool_call_id': 'tool-1',
                        'status': 'success',
                        'latency_ms': 12,
                        'human_approval_required': False,
                        'human_approval_result': 'not_required',
                    }
                )
            ]
        )

        response = self._post_jsonl(payload)
        body = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertIn('data_accessed', body['missing_fields'])
        self.assertLess(body['scores']['data_lineage'], 80)

    def test_failed_event_without_error_code_is_reported(self) -> None:
        payload = '\n'.join(
            [
                json.dumps(
                    {
                        'event_id': 'evt-1',
                        'timestamp': '2026-07-22T10:00:00Z',
                        'session_id': 'session-1',
                        'agent_id': 'agent-1',
                        'event_type': 'agent_response_generated',
                        'action': 'final-response',
                        'action_order': 1,
                        'status': 'failed',
                        'latency_ms': 15,
                        'human_approval_required': False,
                        'human_approval_result': 'not_required',
                        'data_accessed': [],
                    }
                )
            ]
        )

        response = self._post_jsonl(payload)
        body = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(body['summary']['failed_events'], 1)
        self.assertIn('error_code', body['missing_fields'])
        self.assertLess(body['scores']['operational_logging'], 80)


if __name__ == '__main__':
    unittest.main()
