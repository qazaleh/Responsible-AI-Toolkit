import { CheckCircle2, FileSearch } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

const DETECTED_STATS = [
  { label: "Detected format", value: "Custom JSON (line-delimited)" },
  { label: "Events parsed", value: "1,248" },
  { label: "Detection confidence", value: "94%" },
  { label: "Distinct field names found", value: "16" }
]

export function SchemaDetectionCard() {
  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSearch className="h-5 w-5 text-[#305669]" />
          Schema Detection
        </CardTitle>
        <CardDescription>Structure inferred from the uploaded log before mapping to the Common Agent Event Schema.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DETECTED_STATS.map((stat) => (
            <div key={stat.label} className="rounded-lg bg-[#faf7f0] px-3 py-2.5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#305669]/60">{stat.label}</p>
              <p className="mt-1 text-sm font-semibold text-[#0f2b2c]">{stat.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          16 of 19 Common Agent Event Schema fields found a candidate match — 3 fields had no plausible match at all.
        </p>
      </CardContent>
    </Card>
  )
}
