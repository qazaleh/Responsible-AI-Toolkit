import { Plus, Scale } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { policyRules } from "../data/mockData"
import type { EvidenceStatus } from "../data/mockData"

const coverageStyles: Record<EvidenceStatus, string> = {
  satisfied: "bg-emerald-50 text-emerald-700",
  partial: "bg-amber-50 text-amber-700",
  missing: "bg-rose-50 text-rose-700"
}

export function RulesPoliciesTab() {
  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-[#305669]" />
              Rules &amp; Policies
            </CardTitle>
            <CardDescription>EU AI Act articles and internal playbook rules, mapped against the evidence currently on file.</CardDescription>
          </div>
          <Button className="h-9 w-fit bg-[#305669] text-white hover:bg-[#244455]">
            <Plus className="h-4 w-4" />
            New Rule
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {policyRules.map((rule) => (
          <div key={rule.id} className="rounded-lg border border-[#e6dece] bg-[#faf7f0] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0f2b2c]">{rule.name}</p>
                <p className="mt-0.5 text-xs text-[#305669]/70">
                  {rule.framework} • {rule.reference}
                </p>
                <p className="mt-2 text-xs text-[#305669]/80">{rule.description}</p>
              </div>
              <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize", coverageStyles[rule.coverage])}>
                {rule.coverage}
              </span>
            </div>
            <p className="mt-3 rounded-lg bg-[#fffdf8] px-3 py-2 text-xs text-[#174143]">
              <span className="font-semibold">Evidence status: </span>
              {rule.coverageNote}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
