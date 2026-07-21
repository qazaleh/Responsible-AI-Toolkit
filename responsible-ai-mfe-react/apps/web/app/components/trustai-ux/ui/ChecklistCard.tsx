import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { EvidenceItem } from "../data/mockData"

const statusIcon = {
  pass: CheckCircle2,
  warning: AlertTriangle,
  fail: XCircle
} as const

const statusStyles = {
  pass: "text-emerald-600 bg-emerald-50",
  warning: "text-amber-600 bg-amber-50",
  fail: "text-rose-600 bg-rose-50"
} as const

export function ChecklistCard({ title, description, items }: { title: string; description: string; items: EvidenceItem[] }) {
  const passCount = items.filter((item) => item.status === "pass").length

  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          <span className="shrink-0 rounded-full bg-[#faeab1] px-2.5 py-1 text-xs font-semibold text-[#0f2b2c]">
            {passCount}/{items.length} passing
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-[#e6dece]">
          {items.map((item) => {
            const Icon = statusIcon[item.status]
            return (
              <li key={item.label} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <span className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full", statusStyles[item.status])}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#0f2b2c]">{item.label}</p>
                  <p className="text-xs text-[#305669]/70">{item.description}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
