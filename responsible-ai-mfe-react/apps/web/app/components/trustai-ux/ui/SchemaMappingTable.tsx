import { cn } from "@workspace/ui/lib/utils"
import type { CaesField, EvidenceStatus, FieldMapping } from "../data/mockData"

const statusStyles: Record<EvidenceStatus, string> = {
  satisfied: "bg-emerald-50 text-emerald-700",
  partial: "bg-amber-50 text-amber-700",
  missing: "bg-rose-50 text-rose-700"
}

const statusLabels: Record<EvidenceStatus, string> = {
  satisfied: "Mapped",
  partial: "Partial",
  missing: "Unmapped"
}

function findMapping(mappings: FieldMapping[], field: string) {
  return mappings.find((mapping) => mapping.schemaField === field) ?? null
}

export function SchemaMappingTable({ schema, mappings, dense = false }: { schema: CaesField[]; mappings: FieldMapping[]; dense?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-[#e6dece] text-xs uppercase text-[#305669]/70">
          <tr>
            <th className="py-2.5 font-semibold">CAES Field</th>
            {!dense && <th className="py-2.5 font-semibold">Category</th>}
            <th className="py-2.5 font-semibold">Required</th>
            <th className="py-2.5 font-semibold">Detected Field</th>
            <th className="py-2.5 font-semibold">Status</th>
            <th className="py-2.5 font-semibold">Confidence</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e6dece]">
          {schema.map((field) => {
            const mapping = findMapping(mappings, field.field)
            const status = mapping?.status ?? "missing"
            return (
              <tr key={field.field}>
                <td className="py-2.5 font-mono text-xs font-medium text-[#0f2b2c]">{field.field}</td>
                {!dense && <td className="py-2.5 text-[#305669]/70">{field.category}</td>}
                <td className="py-2.5">
                  {field.required ? (
                    <span className="rounded-full bg-[#faeab1] px-2 py-0.5 text-[11px] font-medium text-[#0f2b2c]">Required</span>
                  ) : (
                    <span className="text-xs text-[#305669]/50">Optional</span>
                  )}
                </td>
                <td className="py-2.5 font-mono text-xs text-[#174143]">{mapping?.detectedField ?? "—"}</td>
                <td className="py-2.5">
                  <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium", statusStyles[status])}>
                    {statusLabels[status]}
                  </span>
                </td>
                <td className="py-2.5 text-[#305669]/70">{mapping?.confidence != null ? `${mapping.confidence}%` : "—"}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
