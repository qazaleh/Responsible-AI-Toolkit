import { Workflow } from "lucide-react"

export function UxPageHeader() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[#e6dece] bg-[#fffdf8] p-5 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-sm font-medium text-[#305669]">TrustAI-UX</div>
        <h2 className="mt-1 text-2xl font-semibold text-[#0f2b2c]">AI Agent Governance &amp; Evaluation</h2>
        <p className="mt-2 max-w-2xl text-sm text-[#305669]">
          Evaluate agent logs, runtime behavior, traceability, audit readiness, and governance risks.
        </p>
      </div>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
        <Workflow className="h-6 w-6" />
      </div>
    </div>
  )
}
