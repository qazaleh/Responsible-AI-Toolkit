import { ArrowRight, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { ToolCallChainEntry } from "../data/mockData"

export function ToolCallChain({ chain }: { chain: ToolCallChainEntry[] }) {
  const resolvedCount = chain.filter((entry) => entry.resolved).length

  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Tool-Call Chain</CardTitle>
            <CardDescription className="mt-1">Order of tool invocations reconstructed from the log, with correlation status.</CardDescription>
          </div>
          <span className="shrink-0 rounded-full bg-[#faeab1] px-2.5 py-1 text-xs font-semibold text-[#0f2b2c]">
            {resolvedCount}/{chain.length} resolved
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {chain.map((entry, index) => (
            <div key={entry.toolName} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                    entry.resolved ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"
                  )}
                >
                  {entry.resolved ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                </span>
                {index < chain.length - 1 && <ArrowRight className="my-1 h-3 w-3 rotate-90 text-[#305669]/40" />}
              </div>
              <div className="min-w-0 flex-1 rounded-lg bg-[#faf7f0] px-3 py-2">
                <p className="font-mono text-xs font-semibold text-[#0f2b2c]">
                  {entry.order}. {entry.toolName}
                </p>
                <p className="mt-0.5 text-xs text-[#305669]/70">{entry.note}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
