export type RiskLevel = "low" | "medium" | "high"
export type EvaluationStatus = "completed" | "running" | "failed"
export type EvidenceStatus = "satisfied" | "partial" | "missing"
export type FieldImpact = "high" | "medium" | "low"

// ---------------------------------------------------------------------------
// Common Agent Event Schema (CAES) — the canonical field catalog every
// uploaded log or runtime trace gets mapped against.
// ---------------------------------------------------------------------------

export type CaesCategory = "Identity & Session" | "Timing" | "Tool Invocation" | "Human Oversight" | "Data Access" | "Error & Recovery"

export interface CaesField {
  field: string
  category: CaesCategory
  required: boolean
  description: string
}

export const caesSchema: CaesField[] = [
  { field: "session_id", category: "Identity & Session", required: true, description: "Unique identifier grouping every event that belongs to one agent run." },
  { field: "actor_id", category: "Identity & Session", required: true, description: "Identity of the agent, service account, or model version performing the action." },
  { field: "conversation_id", category: "Identity & Session", required: false, description: "Parent identifier linking multi-turn or multi-session interactions." },
  { field: "event_timestamp", category: "Timing", required: true, description: "ISO-8601 timestamp marking when the event occurred." },
  { field: "sequence_number", category: "Timing", required: true, description: "Monotonic ordering of events within a session, used to reconstruct order." },
  { field: "duration_ms", category: "Timing", required: false, description: "Time spent executing the event, used for latency and anomaly checks." },
  { field: "tool_name", category: "Tool Invocation", required: true, description: "Name of the tool or function the agent invoked." },
  { field: "tool_input", category: "Tool Invocation", required: true, description: "Parameters passed into the tool call." },
  { field: "tool_output", category: "Tool Invocation", required: true, description: "Result returned from the tool call." },
  { field: "tool_call_id", category: "Tool Invocation", required: false, description: "Correlates a tool call to its corresponding result event." },
  { field: "approval_required", category: "Human Oversight", required: true, description: "Whether the action required human sign-off before executing." },
  { field: "approval_actor", category: "Human Oversight", required: false, description: "Identity of the human who approved or rejected the action." },
  { field: "approval_timestamp", category: "Human Oversight", required: false, description: "When approval was granted or denied." },
  { field: "data_resource", category: "Data Access", required: true, description: "Identifier of the data record or system the agent accessed." },
  { field: "access_type", category: "Data Access", required: true, description: "Nature of the access: read, write, or delete." },
  { field: "data_classification", category: "Data Access", required: false, description: "Sensitivity tier of the data touched (e.g. PII, confidential)." },
  { field: "error_code", category: "Error & Recovery", required: false, description: "Standardized identifier for a failure encountered during the event." },
  { field: "retry_count", category: "Error & Recovery", required: false, description: "Number of retry attempts made for the event." },
  { field: "recovery_action", category: "Error & Recovery", required: false, description: "What the agent did after a failure (fallback, escalate, abort)." }
]

export interface FieldMapping {
  schemaField: string
  detectedField: string | null
  status: EvidenceStatus
  confidence: number | null
  note: string
}

export const fieldMappings: FieldMapping[] = [
  { schemaField: "session_id", detectedField: "session_id", status: "satisfied", confidence: 98, note: "Consistent across all events." },
  { schemaField: "actor_id", detectedField: "agent_id", status: "satisfied", confidence: 91, note: "Mapped from vendor-specific field name." },
  { schemaField: "conversation_id", detectedField: null, status: "missing", confidence: null, note: "No parent session identifier found in log." },
  { schemaField: "event_timestamp", detectedField: "ts", status: "satisfied", confidence: 95, note: "ISO-8601, millisecond precision." },
  { schemaField: "sequence_number", detectedField: "seq", status: "satisfied", confidence: 88, note: "Present but resets between tool calls." },
  { schemaField: "duration_ms", detectedField: null, status: "missing", confidence: null, note: "No execution timing captured." },
  { schemaField: "tool_name", detectedField: "tool", status: "satisfied", confidence: 93, note: "" },
  { schemaField: "tool_input", detectedField: "input_payload", status: "satisfied", confidence: 85, note: "Nested structure, parses cleanly." },
  { schemaField: "tool_output", detectedField: "output_payload", status: "satisfied", confidence: 85, note: "Nested structure, parses cleanly." },
  { schemaField: "tool_call_id", detectedField: null, status: "missing", confidence: null, note: "Calls and results cannot be correlated with certainty." },
  { schemaField: "approval_required", detectedField: null, status: "missing", confidence: null, note: "No approval flag present on any event." },
  { schemaField: "approval_actor", detectedField: null, status: "missing", confidence: null, note: "Depends on approval_required being logged first." },
  { schemaField: "approval_timestamp", detectedField: null, status: "missing", confidence: null, note: "Depends on approval_required being logged first." },
  { schemaField: "data_resource", detectedField: "resource_id", status: "partial", confidence: 62, note: "Present on read events, absent on writes." },
  { schemaField: "access_type", detectedField: "operation", status: "satisfied", confidence: 79, note: "Free-text field, normalized on ingest." },
  { schemaField: "data_classification", detectedField: null, status: "missing", confidence: null, note: "No sensitivity tagging found." },
  { schemaField: "error_code", detectedField: "err", status: "partial", confidence: 54, note: "Only populated for a subset of failure types." },
  { schemaField: "retry_count", detectedField: null, status: "missing", confidence: null, note: "Retries indistinguishable from new actions." },
  { schemaField: "recovery_action", detectedField: null, status: "missing", confidence: null, note: "No post-failure behavior captured." }
]

export interface MissingFieldEntry {
  field: string
  impact: FieldImpact
  consequence: string
  relatedRuleId: string
}

export const missingFields: MissingFieldEntry[] = [
  { field: "approval_required", impact: "high", consequence: "Cannot verify human-in-the-loop oversight occurred for high-risk actions.", relatedRuleId: "RULE-01" },
  { field: "approval_actor", impact: "high", consequence: "Cannot attribute an approval decision to a specific human reviewer.", relatedRuleId: "RULE-01" },
  { field: "tool_call_id", impact: "medium", consequence: "Tool calls cannot be reliably paired with their results in the reconstructed chain.", relatedRuleId: "RULE-02" },
  { field: "data_classification", impact: "medium", consequence: "Cannot confirm sensitive data was handled according to classification policy.", relatedRuleId: "RULE-03" },
  { field: "recovery_action", impact: "medium", consequence: "Error recovery behavior is not auditable after a failure.", relatedRuleId: "RULE-04" },
  { field: "duration_ms", impact: "low", consequence: "Latency-based anomaly detection is unavailable for this session.", relatedRuleId: "RULE-04" },
  { field: "retry_count", impact: "low", consequence: "Retries cannot be distinguished from independent repeated actions.", relatedRuleId: "RULE-04" },
  { field: "conversation_id", impact: "low", consequence: "Multi-turn sessions cannot be linked into a single audit trail.", relatedRuleId: "RULE-02" }
]

// ---------------------------------------------------------------------------
// Session reconstruction — timeline + tool-call chain
// ---------------------------------------------------------------------------

export interface TimelineEvent {
  label: string
  detail: string
  time: string
  kind: "session" | "tool" | "data" | "gap" | "action"
}

export const sessionTimeline: TimelineEvent[] = [
  { label: "Session started", detail: "actor_id: claims-review-agent-v4", time: "T+0.0s", kind: "session" },
  { label: "Tool call: lookupCustomerRecord", detail: "Resolved via tool_call_id inference", time: "T+0.4s", kind: "tool" },
  { label: "Data access: customer_profile (read)", detail: "data_classification not present on this event", time: "T+0.9s", kind: "data" },
  { label: "Tool call: draftDecisionRecommendation", detail: "Resolved via tool_call_id inference", time: "T+1.6s", kind: "tool" },
  { label: "Approval step expected, not found in log", detail: "No approval_required / approval_actor event before the write below", time: "T+1.6–2.4s", kind: "gap" },
  { label: "Action executed: updateLoanStatus (write)", detail: "Elevated action — approval evidence missing", time: "T+2.4s", kind: "action" },
  { label: "Session ended", detail: "8 events reconstructed, 1 unresolved correlation", time: "T+2.9s", kind: "session" }
]

export interface ToolCallChainEntry {
  order: number
  toolName: string
  resolved: boolean
  note: string
}

export const toolCallChain: ToolCallChainEntry[] = [
  { order: 1, toolName: "lookupCustomerRecord", resolved: true, note: "Input/output paired via timestamp adjacency." },
  { order: 2, toolName: "draftDecisionRecommendation", resolved: true, note: "Input/output paired via timestamp adjacency." },
  { order: 3, toolName: "updateLoanStatus", resolved: false, note: "No tool_call_id — result cannot be confirmed as belonging to this call." }
]

// ---------------------------------------------------------------------------
// Authorization boundary + data lineage evidence
// ---------------------------------------------------------------------------

export interface EvidenceItem {
  label: string
  description: string
  status: "pass" | "warning" | "fail"
}

export const authorizationEvidence: EvidenceItem[] = [
  { label: "Action scope matches registered tool allowlist", description: "Every tool_name observed is a member of the agent's declared capability set.", status: "pass" },
  { label: "Elevated / write actions have approval evidence", description: "updateLoanStatus executed without a preceding approval event.", status: "fail" },
  { label: "Agent identity consistent across session", description: "Single actor_id used for the full session, no impersonation signal.", status: "pass" },
  { label: "No privilege escalation detected in tool arguments", description: "Insufficient argument-level logging to fully verify this boundary.", status: "warning" }
]

export const dataLineageEvidence: EvidenceItem[] = [
  { label: "Data source identifiers present for all reads", description: "resource_id populated on every read event observed.", status: "pass" },
  { label: "Data classification tags present", description: "No sensitivity tier recorded for any accessed resource.", status: "fail" },
  { label: "Downstream write targets logged", description: "updateLoanStatus target system and record ID both captured.", status: "pass" },
  { label: "Cross-session data reuse traceable", description: "conversation_id absent — cannot confirm data isn't reused across sessions.", status: "warning" }
]

// ---------------------------------------------------------------------------
// Runtime connector capability assessment
// ---------------------------------------------------------------------------

export interface ConnectorCapability {
  label: string
  exposed: boolean
  /** Whether the current `exposed` value is a desirable signal for governance — "final response only" being true is bad, for example. */
  good: boolean
  description: string
}

export const connectorCapabilities: ConnectorCapability[] = [
  { label: "Exposes final response only", exposed: true, good: false, description: "The sample response returns only the agent's final output." },
  { label: "Exposes traces / intermediate events", exposed: false, good: false, description: "No step-by-step execution trace is included in the response payload." },
  { label: "Exposes tool calls", exposed: false, good: false, description: "Tool invocations made during the request are not surfaced." },
  { label: "Exposes approvals, errors, and latency", exposed: false, good: false, description: "No approval markers, error detail, or timing metadata returned." }
]

export const connectorReadinessScore = 22

export interface RuntimeSetupItem {
  label: string
  state: "connected" | "not-connected" | "configured" | "missing" | "available" | "unavailable" | "partial"
  description: string
}

export const runtimeSetupState: RuntimeSetupItem[] = [
  { label: "API connected", state: "not-connected", description: "No agent endpoint has been linked yet." },
  { label: "Auth configured", state: "missing", description: "Provide an auth method to enable authenticated test calls." },
  { label: "Runtime events available", state: "unavailable", description: "Live event streaming turns on once the API is connected." },
  { label: "Trace depth", state: "partial", description: "Final response only, until full tracing is enabled." }
]

// ---------------------------------------------------------------------------
// Governance metrics (Overview tab)
// ---------------------------------------------------------------------------

export interface DashboardMetric {
  label: string
  value: string
  trend?: string
  trendDirection?: "up" | "down"
}

export const dashboardMetrics: DashboardMetric[] = [
  { label: "Log Completeness Score", value: "58%", trend: "9 of 19 CAES fields mapped", trendDirection: "down" },
  { label: "Schema Mapping Coverage", value: "11 / 19", trend: "8 fields unmapped or partial", trendDirection: "down" },
  { label: "Tool-Call Chains Resolved", value: "2 / 3", trend: "1 unresolved correlation", trendDirection: "down" },
  { label: "Authorization Evidence Gaps", value: "1 fail, 1 warning", trend: "Approval evidence missing", trendDirection: "down" },
  { label: "Data Lineage Gaps", value: "1 fail, 1 warning", trend: "Classification tags missing", trendDirection: "down" },
  { label: "EU AI Act Rule Coverage", value: "1 / 4 satisfied", trend: "2 partial, 1 missing", trendDirection: "down" }
]

// ---------------------------------------------------------------------------
// Evaluation history (Results tab)
// ---------------------------------------------------------------------------

export interface EvaluationRow {
  id: string
  agentName: string
  mode: "Offline Log" | "Runtime"
  startedAt: string
  status: EvaluationStatus
  evidenceCompleteness: string
  risk: RiskLevel
}

export const evaluationHistory: EvaluationRow[] = [
  { id: "EVL-1042", agentName: "Claims Review Agent", mode: "Offline Log", startedAt: "12 min ago", status: "completed", evidenceCompleteness: "58%", risk: "high" },
  { id: "EVL-1041", agentName: "HR Policy Assistant", mode: "Runtime", startedAt: "1 hr ago", status: "running", evidenceCompleteness: "—", risk: "medium" },
  { id: "EVL-1039", agentName: "Banking Service Agent", mode: "Offline Log", startedAt: "Yesterday", status: "completed", evidenceCompleteness: "91%", risk: "low" },
  { id: "EVL-1035", agentName: "Underwriting Copilot", mode: "Runtime", startedAt: "2 days ago", status: "failed", evidenceCompleteness: "—", risk: "high" },
  { id: "EVL-1031", agentName: "Fraud Triage Agent", mode: "Offline Log", startedAt: "3 days ago", status: "completed", evidenceCompleteness: "74%", risk: "medium" }
]

// ---------------------------------------------------------------------------
// Reports (evidence-driven)
// ---------------------------------------------------------------------------

export interface ReportSection {
  title: string
  status: EvidenceStatus
}

export interface ReportSummary {
  id: string
  title: string
  agentName: string
  generatedAt: string
  risk: RiskLevel
  sections: ReportSection[]
}

export const reportSummaries: ReportSummary[] = [
  {
    id: "RPT-2210",
    title: "Claims Review Agent — Offline Log Audit",
    agentName: "Claims Review Agent",
    generatedAt: "2026-07-18",
    risk: "high",
    sections: [
      { title: "Traceability summary", status: "satisfied" },
      { title: "Audit readiness findings", status: "partial" },
      { title: "Missing data fields", status: "satisfied" },
      { title: "Authorization boundary gaps", status: "missing" },
      { title: "Data lineage gaps", status: "partial" },
      { title: "Tool-call behavior summary", status: "partial" },
      { title: "Risk indicators", status: "satisfied" },
      { title: "Improvement roadmap", status: "satisfied" }
    ]
  },
  {
    id: "RPT-2206",
    title: "Underwriting Copilot — Runtime Evaluation",
    agentName: "Underwriting Copilot",
    generatedAt: "2026-07-16",
    risk: "high",
    sections: [
      { title: "Traceability summary", status: "missing" },
      { title: "Audit readiness findings", status: "missing" },
      { title: "Authorization boundary gaps", status: "missing" },
      { title: "Risk indicators", status: "partial" },
      { title: "Improvement roadmap", status: "satisfied" }
    ]
  }
]

// ---------------------------------------------------------------------------
// Rules / policies with evidence coverage
// ---------------------------------------------------------------------------

export interface PolicyRule {
  id: string
  name: string
  framework: "EU AI Act" | "Internal Playbook"
  reference: string
  description: string
  coverage: EvidenceStatus
  coverageNote: string
}

export const policyRules: PolicyRule[] = [
  {
    id: "RULE-01",
    name: "High-risk decisions require human approval",
    framework: "EU AI Act",
    reference: "Article 14 — Human Oversight",
    description: "Every high-risk decision must have an attributable human approval event before execution.",
    coverage: "missing",
    coverageNote: "approval_required and approval_actor are absent from the uploaded log."
  },
  {
    id: "RULE-02",
    name: "Full tool-call traceability required",
    framework: "Internal Playbook",
    reference: "Playbook §4.2 — Action Attribution",
    description: "Every autonomous tool call must be attributable to a session and correlated to its result.",
    coverage: "partial",
    coverageNote: "2 of 3 tool calls resolved; tool_call_id is not logged."
  },
  {
    id: "RULE-03",
    name: "Sensitive data access must be logged",
    framework: "EU AI Act",
    reference: "Article 12 — Record-Keeping",
    description: "Data reads and writes involving classified data must be logged with a sensitivity tag.",
    coverage: "partial",
    coverageNote: "Access is logged, but data_classification is never populated."
  },
  {
    id: "RULE-04",
    name: "Runtime error budget under 2%",
    framework: "Internal Playbook",
    reference: "Playbook §6.1 — Reliability",
    description: "Caps the acceptable failure rate for agent actions during controlled runtime test runs.",
    coverage: "missing",
    coverageNote: "No runtime connector data available yet — connect an API to evaluate."
  }
]
