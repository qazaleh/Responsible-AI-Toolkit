import json
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from agent_log.api import router


def _parse_list_env(raw_value: str | None, default_value: list[str]) -> list[str]:
    if not raw_value:
        return default_value

    try:
        parsed = json.loads(raw_value)
        if isinstance(parsed, list):
            return [str(item) for item in parsed]
    except json.JSONDecodeError:
        pass

    return [item.strip() for item in raw_value.split(',') if item.strip()]


app = FastAPI(
    title='Responsible AI Agent Log Evaluation Service',
    version='1.0.0',
    description='Deterministic audit-readiness evaluation for offline AI agent execution logs.',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_parse_list_env(os.getenv('ALLOWED_ORIGINS'), ['*']),
    allow_credentials=False,
    allow_methods=_parse_list_env(
        os.getenv('ALLOWED_METHODS'),
        ['GET', 'POST', 'OPTIONS', 'HEAD'],
    ),
    allow_headers=['*'],
)

app.include_router(router)
