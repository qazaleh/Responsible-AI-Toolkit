import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { DashboardMetric } from "../data/mockData"

export function MetricCard({ metric, icon: Icon }: { metric: DashboardMetric; icon: LucideIcon }) {
  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardContent className="flex items-start justify-between gap-3 pt-1">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#305669]/70">{metric.label}</p>
          <p className="mt-1.5 text-2xl font-semibold text-[#0f2b2c]">{metric.value}</p>
          {metric.trend && (
            <p
              className={cn(
                "mt-1.5 flex items-center gap-1 text-xs font-medium",
                metric.trendDirection === "up" && "text-emerald-600",
                metric.trendDirection === "down" && "text-[#305669]/60",
                !metric.trendDirection && "text-[#305669]/60"
              )}
            >
              {metric.trendDirection === "up" && <ArrowUpRight className="h-3.5 w-3.5" />}
              {metric.trendDirection === "down" && <ArrowDownRight className="h-3.5 w-3.5" />}
              {metric.trend}
            </p>
          )}
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#faeab1] text-[#305669]">
          <Icon className="h-4 w-4" />
        </span>
      </CardContent>
    </Card>
  )
}
