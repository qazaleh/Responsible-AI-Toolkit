from typing import Literal

from pydantic import BaseModel, Field


StatusLabel = Literal['pass', 'partial', 'fail']
SeverityLabel = Literal['low', 'medium', 'high']


class Summary(BaseModel):
    total_events: int = Field(ge=0)
    total_sessions: int = Field(ge=0)
    total_agents: int = Field(ge=0)
    total_tool_calls: int = Field(ge=0)
    failed_events: int = Field(ge=0)


class Scores(BaseModel):
    overall_audit_readiness: int = Field(ge=0, le=100)
    traceability: int = Field(ge=0, le=100)
    tool_call_visibility: int = Field(ge=0, le=100)
    authorization_evidence: int = Field(ge=0, le=100)
    data_lineage: int = Field(ge=0, le=100)
    operational_logging: int = Field(ge=0, le=100)


class Status(BaseModel):
    overall: StatusLabel
    traceability: StatusLabel
    tool_call_visibility: StatusLabel
    authorization_evidence: StatusLabel
    data_lineage: StatusLabel
    operational_logging: StatusLabel


class Finding(BaseModel):
    category: str
    severity: SeverityLabel
    message: str
    evidence: str


class EvaluationResponse(BaseModel):
    summary: Summary
    scores: Scores
    status: Status
    missing_fields: list[str]
    findings: list[Finding]
    recommendations: list[str]
