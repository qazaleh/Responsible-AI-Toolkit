import { AlertOctagon, FileWarning, Gauge, Link2, PlayCircle, ShieldAlert } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { connectorReadinessScore, dashboardMetrics, policyRules } from "../data/mockData"
import { MetricCard } from "../ui/MetricCard"
import { ReadinessScoreGauge } from "../ui/ReadinessScoreGauge"
import { UxPageHeader } from "../ui/UxPageHeader"
import type { EvidenceStatus } from "../data/mockData"
import type { UxTab } from "../TrustAiUxApp"

const METRIC_ICONS = [Gauge, Link2, PlayCircle, ShieldAlert, FileWarning, AlertOctagon]

const coverageChip: Record<EvidenceStatus, string> = {
  satisfied: "bg-emerald-50 text-emerald-700",
  partial: "bg-amber-50 text-amber-700",
  missing: "bg-rose-50 text-rose-700"
}

export function OverviewTab({ onNavigate }: { onNavigate: (tab: UxTab) => void }) {
  return (
    <div className="space-y-6">
      <UxPageHeader />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dashboardMetrics.map((metric, index) => (
          <MetricCard key={metric.label} metric={metric} icon={METRIC_ICONS[index]} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
          <CardHeader>
            <CardTitle>Most Recent Log Evaluation</CardTitle>
            <CardDescription>Claims Review Agent — evidence gathered from the last offline log upload.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ReadinessScoreGauge score={58} label="Log Completeness Score" />
            <p className="text-xs text-[#305669]/70">
              9 of 19 Common Agent Event Schema fields fully mapped. Approval evidence and data classification are the largest gaps.
            </p>
            <Button variant="outline" className="w-full border-[#e6dece]" onClick={() => onNavigate("log-evaluation")}>
              Open Log Evaluation
            </Button>
          </CardContent>
        </Card>

        <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
          <CardHeader>
            <CardTitle>Runtime Connector Status</CardTitle>
            <CardDescription>No agent API connected — score reflects the sample payload on file.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ReadinessScoreGauge score={connectorReadinessScore} label="Connector Readiness Score" />
            <p className="text-xs text-[#305669]/70">
              The connected endpoint currently returns final responses only — no traces, tool calls, or approval evidence.
            </p>
            <Button variant="outline" className="w-full border-[#e6dece]" onClick={() => onNavigate("runtime-connector")}>
              Open Runtime Connector
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
        <CardHeader>
          <CardTitle>EU AI Act &amp; Playbook Coverage</CardTitle>
          <CardDescription>Governance rules mapped against the evidence currently available.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {policyRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between gap-3 rounded-lg bg-[#faf7f0] px-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#0f2b2c]">{rule.name}</p>
                <p className="text-xs text-[#305669]/70">
                  {rule.framework} • {rule.reference}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${coverageChip[rule.coverage]}`}>
                {rule.coverage}
              </span>
            </div>
          ))}
          <Button variant="outline" className="w-full border-[#e6dece]" onClick={() => onNavigate("rules")}>
            Open Rules &amp; Policies
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
