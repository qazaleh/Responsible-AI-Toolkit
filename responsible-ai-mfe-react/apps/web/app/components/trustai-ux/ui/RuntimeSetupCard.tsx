import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { RuntimeSetupItem } from "../data/mockData"

const READY_STATES = new Set(["connected", "configured", "available"])

export function RuntimeSetupCard({ items }: { items: RuntimeSetupItem[] }) {
  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <CardTitle>Runtime Setup State</CardTitle>
        <CardDescription>Current connection and tracing readiness for controlled test runs.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-[#e6dece]">
          {items.map((item) => {
            const isReady = READY_STATES.has(item.state)
            const Icon = isReady ? CheckCircle2 : AlertCircle
            return (
              <li key={item.label} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", isReady ? "text-emerald-600" : "text-amber-600")} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#0f2b2c]">{item.label}</p>
                  <p className="text-xs text-[#305669]/70">{item.description}</p>
                </div>
                <span
                  className={cn(
                    "ml-auto shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize",
                    isReady ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  )}
                >
                  {item.state.replace("-", " ")}
                </span>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
