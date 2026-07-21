import { connectorCapabilities, connectorReadinessScore, runtimeSetupState } from "../data/mockData"
import { ApiConnectionCard } from "../ui/ApiConnectionCard"
import { ConnectorCapabilityChecklist } from "../ui/ConnectorCapabilityChecklist"
import { ReadinessScoreGauge } from "../ui/ReadinessScoreGauge"
import { RuntimeSetupCard } from "../ui/RuntimeSetupCard"

export function RuntimeConnectorTab() {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <ApiConnectionCard />
        <div className="space-y-5">
          <ReadinessScoreGauge score={connectorReadinessScore} label="Connector Readiness Score" />
          <RuntimeSetupCard items={runtimeSetupState} />
        </div>
      </div>

      <ConnectorCapabilityChecklist capabilities={connectorCapabilities} />

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-medium">Runtime evaluation is not yet possible from this connector.</p>
        <p className="mt-1 text-xs text-amber-700">
          A final-response-only payload cannot support tool-call reconstruction, authorization boundary checks, or data lineage evidence.
          Update the endpoint to return trace events, tool calls, and approval markers before running a controlled test scenario.
        </p>
      </div>
    </div>
  )
}
