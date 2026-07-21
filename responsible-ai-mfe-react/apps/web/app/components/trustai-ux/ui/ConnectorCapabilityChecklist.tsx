import { CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { ConnectorCapability } from "../data/mockData"

export function ConnectorCapabilityChecklist({ capabilities }: { capabilities: ConnectorCapability[] }) {
  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <CardTitle>Connector Capability Assessment</CardTitle>
        <CardDescription>What the sample request/response actually proves the API exposes — not what evaluation could theoretically use.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-[#e6dece]">
          {capabilities.map((capability) => {
            const Icon = capability.good ? CheckCircle2 : XCircle
            return (
              <li key={capability.label} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", capability.good ? "text-emerald-600" : "text-rose-600")} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#0f2b2c]">{capability.label}</p>
                  <p className="text-xs text-[#305669]/70">{capability.description}</p>
                </div>
                <span
                  className={cn(
                    "ml-auto shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium",
                    capability.exposed ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                  )}
                >
                  {capability.exposed ? "Yes" : "No"}
                </span>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
