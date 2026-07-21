import { Loader2 } from "lucide-react"

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-[#e6dece] bg-[#fffdf8] p-10 text-center">
      <Loader2 className="h-6 w-6 animate-spin text-[#305669]" />
      <p className="text-sm font-medium text-[#305669]">{label}</p>
    </div>
  )
}

export function LoadingRow({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[#305669]">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      {label}
    </div>
  )
}
