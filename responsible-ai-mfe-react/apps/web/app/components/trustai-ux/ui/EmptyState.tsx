import type { LucideIcon } from "lucide-react"
import { Inbox } from "lucide-react"
import type { ReactNode } from "react"

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action
}: {
  icon?: LucideIcon
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="rounded-lg border border-dashed border-[#e6dece] bg-[#fffdf8] p-8 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#faeab1] text-[#305669]/70">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-sm font-semibold text-[#0f2b2c]">{title}</div>
      <div className="mx-auto mt-1 max-w-sm text-sm text-[#305669]/70">{description}</div>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}
