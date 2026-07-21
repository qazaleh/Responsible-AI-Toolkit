import { cn } from "@workspace/ui/lib/utils"

function bandFor(score: number) {
  if (score >= 70) return { label: "Ready", bar: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700" }
  if (score >= 40) return { label: "Needs Work", bar: "bg-amber-500", chip: "bg-amber-50 text-amber-700" }
  return { label: "Not Ready", bar: "bg-rose-500", chip: "bg-rose-50 text-rose-700" }
}

export function ReadinessScoreGauge({ score, label }: { score: number; label: string }) {
  const band = bandFor(score)

  return (
    <div className="rounded-lg border border-[#e6dece] bg-[#faf7f0] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[#174143]">{label}</p>
        <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", band.chip)}>{band.label}</span>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-3xl font-semibold text-[#0f2b2c]">{score}</span>
        <span className="mb-1 text-sm text-[#305669]/60">/ 100</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-[#e6dece]">
        <div className={cn("h-2 rounded-full transition-all", band.bar)} style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
      </div>
    </div>
  )
}
