import { cn } from "@workspace/ui/lib/utils"
import type { RiskLevel } from "../data/mockData"

const riskConfig: Record<RiskLevel, { label: string; className: string }> = {
  low: { label: "Low Risk", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  medium: { label: "Medium Risk", className: "bg-amber-50 text-amber-700 border-amber-200" },
  high: { label: "High Risk", className: "bg-rose-50 text-rose-700 border-rose-200" }
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const config = riskConfig[risk]

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", config.className)}>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          risk === "low" && "bg-emerald-500",
          risk === "medium" && "bg-amber-500",
          risk === "high" && "bg-rose-500"
        )}
      />
      {config.label}
    </span>
  )
}
