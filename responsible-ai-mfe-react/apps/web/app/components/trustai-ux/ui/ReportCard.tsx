import { AlertTriangle, CheckCircle2, Download, FileText } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { EvidenceStatus, ReportSummary } from "../data/mockData"
import { RiskBadge } from "./RiskBadge"

const sectionStyles: Record<EvidenceStatus, string> = {
  satisfied: "bg-emerald-50 text-emerald-700",
  partial: "bg-amber-50 text-amber-700",
  missing: "bg-rose-50 text-rose-700"
}

export function ReportCard({ report }: { report: ReportSummary }) {
  const satisfiedCount = report.sections.filter((section) => section.status === "satisfied").length
  const missingCount = report.sections.filter((section) => section.status === "missing").length

  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-[#305669]" />
              {report.title}
            </CardTitle>
            <CardDescription className="mt-1">
              {report.id} • Generated {report.generatedAt}
            </CardDescription>
          </div>
          <RiskBadge risk={report.risk} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-medium text-[#305669]">
          {missingCount > 0 ? (
            <span className="flex items-center gap-1.5 text-rose-700">
              <AlertTriangle className="h-3.5 w-3.5" />
              {satisfiedCount}/{report.sections.length} sections fully supported by evidence — {missingCount} blocked by missing fields
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              All sections supported by available evidence
            </span>
          )}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {report.sections.map((section) => (
            <div
              key={section.title}
              className={cn("flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs font-medium", sectionStyles[section.status])}
            >
              <span>{section.title}</span>
              <span className="shrink-0 rounded-full bg-white/60 px-1.5 py-0.5 text-[10px] capitalize">{section.status}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-3.5 w-3.5" />
            View Report
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5" />
            {missingCount > 0 ? "Download Partial Report" : "Download PDF"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
