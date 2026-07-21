import { FileText } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import {
  authorizationEvidence,
  caesSchema,
  dataLineageEvidence,
  fieldMappings,
  missingFields,
  policyRules,
  sessionTimeline,
  toolCallChain
} from "../data/mockData"
import { ChecklistCard } from "../ui/ChecklistCard"
import { MissingFieldsPanel } from "../ui/MissingFieldsPanel"
import { SchemaDetectionCard } from "../ui/SchemaDetectionCard"
import { SchemaMappingTable } from "../ui/SchemaMappingTable"
import { SessionTimeline } from "../ui/SessionTimeline"
import { ToolCallChain } from "../ui/ToolCallChain"
import { UploadCard } from "../ui/UploadCard"
import type { UxTab } from "../TrustAiUxApp"

function StepLabel({ step, title }: { step: number; title: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#305669]/60">
      Step {step} · {title}
    </p>
  )
}

export function LogEvaluationTab({ onNavigate }: { onNavigate: (tab: UxTab) => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <StepLabel step={1} title="Upload" />
        <UploadCard />
      </div>

      <div className="space-y-3">
        <StepLabel step={2} title="Schema Detection" />
        <SchemaDetectionCard />
      </div>

      <div className="space-y-3">
        <StepLabel step={3} title="Map Fields to Common Agent Event Schema · Validate Required Fields" />
        <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
          <CardHeader>
            <CardTitle>Field Mapping</CardTitle>
            <CardDescription>Every detected log field mapped to its Common Agent Event Schema counterpart.</CardDescription>
          </CardHeader>
          <CardContent>
            <SchemaMappingTable schema={caesSchema} mappings={fieldMappings} dense />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <StepLabel step={4} title="Missing Fields" />
        <MissingFieldsPanel fields={missingFields} />
      </div>

      <div className="space-y-3">
        <StepLabel step={5} title="Reconstruct Session Timeline" />
        <SessionTimeline events={sessionTimeline} />
      </div>

      <div className="space-y-3">
        <StepLabel step={6} title="Tool-Call Chain" />
        <ToolCallChain chain={toolCallChain} />
      </div>

      <div className="space-y-3">
        <StepLabel step={7} title="Audit-Readiness Checklist" />
        <div className="grid gap-5 lg:grid-cols-2">
          <ChecklistCard
            title="Authorization Boundary Evidence"
            description="Does the log prove the agent acted within its authorized scope?"
            items={authorizationEvidence}
          />
          <ChecklistCard
            title="Data Lineage Evidence"
            description="Does the log prove where data came from and where it went?"
            items={dataLineageEvidence}
          />
        </div>
      </div>

      <div className="space-y-3">
        <StepLabel step={8} title="EU AI Act / Playbook Coverage" />
        <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
          <CardContent className="space-y-2 pt-5">
            {policyRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between gap-3 rounded-lg bg-[#faf7f0] px-3 py-2.5 text-sm">
                <span className="min-w-0 truncate text-[#0f2b2c]">{rule.name}</span>
                <span className="shrink-0 text-xs font-medium capitalize text-[#305669]">{rule.coverage}</span>
              </div>
            ))}
            <Button variant="outline" className="mt-1 w-full border-[#e6dece]" onClick={() => onNavigate("rules")}>
              View full rule mapping
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <StepLabel step={9} title="Generate Report" />
        <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
          <CardContent className="flex flex-col items-start gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#305669]">
              The report will be generated from the evidence above — sections tied to missing fields will be marked incomplete rather than omitted.
            </p>
            <Button className="h-10 shrink-0 bg-[#305669] text-white hover:bg-[#244455]" onClick={() => onNavigate("reports")}>
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
