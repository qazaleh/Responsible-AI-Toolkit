import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { FieldImpact, MissingFieldEntry } from "../data/mockData"

const impactStyles: Record<FieldImpact, string> = {
  high: "bg-rose-50 text-rose-700 border-rose-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-[#faf7f0] text-[#305669] border-[#e6dece]"
}

export function MissingFieldsPanel({ fields }: { fields: MissingFieldEntry[] }) {
  const highCount = fields.filter((field) => field.impact === "high").length

  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Missing Fields
            </CardTitle>
            <CardDescription className="mt-1">Schema gaps and the governance consequence of each one.</CardDescription>
          </div>
          {highCount > 0 && (
            <span className="shrink-0 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
              {highCount} high impact
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {fields.map((field) => (
          <div key={field.field} className="rounded-lg border border-[#e6dece] bg-[#faf7f0] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold text-[#0f2b2c]">{field.field}</span>
              <div className="flex items-center gap-2">
                <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize", impactStyles[field.impact])}>
                  {field.impact} impact
                </span>
                <span className="rounded-full border border-[#e6dece] bg-[#fffdf8] px-2 py-0.5 text-[11px] font-medium text-[#305669]">
                  {field.relatedRuleId}
                </span>
              </div>
            </div>
            <p className="mt-1.5 text-xs text-[#305669]/80">{field.consequence}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
