import { CheckCircle2, Loader2, XCircle } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import type { EvaluationStatus } from "../data/mockData"

const statusConfig: Record<EvaluationStatus, { label: string; icon: typeof CheckCircle2; className: string }> = {
  completed: { label: "Completed", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700" },
  running: { label: "Running", icon: Loader2, className: "bg-blue-50 text-blue-700" },
  failed: { label: "Failed", icon: XCircle, className: "bg-rose-50 text-rose-700" }
}

export function StatusBadge({ status }: { status: EvaluationStatus }) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", config.className)}>
      <Icon className={cn("h-3 w-3", status === "running" && "animate-spin")} />
      {config.label}
    </span>
  )
}
