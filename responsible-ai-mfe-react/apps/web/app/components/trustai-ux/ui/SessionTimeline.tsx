import { AlertTriangle, Bot, Database, Wrench } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { TimelineEvent } from "../data/mockData"

const kindStyles: Record<TimelineEvent["kind"], { icon: typeof Bot; className: string }> = {
  session: { icon: Bot, className: "bg-[#faeab1] text-[#305669]" },
  tool: { icon: Wrench, className: "bg-[#faeab1] text-[#305669]" },
  data: { icon: Database, className: "bg-[#faeab1] text-[#305669]" },
  action: { icon: Wrench, className: "bg-amber-100 text-amber-700" },
  gap: { icon: AlertTriangle, className: "bg-rose-100 text-rose-700" }
}

export function SessionTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <CardTitle>Session Timeline</CardTitle>
        <CardDescription>Reconstructed sequence of events for the evaluated session, including any gaps found.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-5 border-l border-dashed border-[#e6dece] pl-6">
          {events.map((event) => {
            const style = kindStyles[event.kind]
            return (
              <div key={event.label} className="relative">
                <span className={cn("absolute -left-[29px] flex h-6 w-6 items-center justify-center rounded-full border border-[#e6dece]", style.className)}>
                  <style.icon className="h-3 w-3" />
                </span>
                <p className={cn("text-sm font-medium", event.kind === "gap" ? "text-rose-700" : "text-[#0f2b2c]")}>{event.label}</p>
                <p className="text-xs text-[#305669]/70">{event.detail}</p>
                <p className="text-[11px] text-[#305669]/50">{event.time}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
