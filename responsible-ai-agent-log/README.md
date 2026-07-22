# Responsible AI Agent Log

`responsible-ai-agent-log` is a standalone backend module for TrustAI-UX offline agent log evaluation. It accepts governance-style JSONL execution logs and scores them with deterministic, rule-based checks for audit readiness.

## What It Evaluates

- Traceability
- Tool-call visibility
- Authorization evidence
- Data lineage
- Operational logging

This module does not use LLMs, RAG, or external APIs.

## Folder Layout

```text
responsible-ai-agent-log/
├── Dockerfile
├── requirements/requirements.txt
├── sample_logs/governance_events.jsonl
├── src/
│   ├── main.py
│   ├── agent_log/
│   │   ├── api.py
│   │   ├── schemas.py
│   │   └── service.py
│   └── test/test_api.py
└── README.md
```

## Run With Docker

From the repo root:

```bash
docker compose -f docker-compose.optimized.yml --profile agent-log up -d agent-log
```

The service is exposed at `http://localhost:30027`.

## Build The Container Manually

```bash
docker build -t responsible-ai-agent-log ./responsible-ai-agent-log
docker run --rm -p 30027:8000 responsible-ai-agent-log
```

## Endpoints

### `GET /health`

Returns a basic readiness payload.

Example:

```bash
curl http://localhost:30027/health
```

### `POST /evaluate`

Accepts a multipart file upload named `file`.

Example:

```bash
curl -X POST http://localhost:30027/evaluate \
  -F "file=@responsible-ai-agent-log/sample_logs/governance_events.jsonl;type=application/x-ndjson"
```

## Expected JSONL Format

Each line must be a JSON object. Recommended fields:

- `event_id`
- `timestamp`
- `session_id`
- `agent_id`
- `event_type`
- `action`
- `action_order`
- `user_request_summary`
- `tool_name`
- `tool_input_summary`
- `tool_output_summary`
- `tool_call_id`
- `status`
- `latency_ms`
- `error_code`
- `risk_label`
- `human_approval_required`
- `human_approval_result`
- `data_accessed`
- `agent_response_summary`

## Example Response

```json
{
  "summary": {
    "total_events": 7,
    "total_sessions": 1,
    "total_agents": 1,
    "total_tool_calls": 1,
    "failed_events": 0
  },
  "scores": {
    "overall_audit_readiness": 96,
    "traceability": 100,
    "tool_call_visibility": 100,
    "authorization_evidence": 100,
    "data_lineage": 83,
    "operational_logging": 100
  },
  "status": {
    "overall": "pass",
    "traceability": "pass",
    "tool_call_visibility": "pass",
    "authorization_evidence": "pass",
    "data_lineage": "pass",
    "operational_logging": "pass"
  },
  "missing_fields": [],
  "findings": [],
  "recommendations": []
}
```

## Scoring

- `pass`: score `>= 80`
- `partial`: score `>= 50` and `< 80`
- `fail`: score `< 50`

Overall audit readiness is the average of required-field coverage and the five category scores.

## Local Test Command

From the module directory:

```bash
python3 -m unittest discover -s src/test -p "test_*.py"
```
