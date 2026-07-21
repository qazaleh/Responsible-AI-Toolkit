import { ExternalLink } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import type { EvaluationRow } from "../data/mockData"
import { RiskBadge } from "./RiskBadge"
import { StatusBadge } from "./StatusBadge"

const HEADERS = ["Evaluation", "Agent", "Mode", "Started", "Status", "Evidence Completeness", "Risk", ""]

export function EvaluationTable({ rows, onViewReport }: { rows: EvaluationRow[]; onViewReport?: (row: EvaluationRow) => void }) {
  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <CardTitle>Evaluation Results</CardTitle>
        <CardDescription>Review previous offline log and runtime evaluations and their evidence completeness.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-[#e6dece] text-xs uppercase text-[#305669]/70">
            <tr>
              {HEADERS.map((header) => (
                <th key={header} className="py-3 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e6dece]">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="py-3 font-medium text-[#0f2b2c]">{row.id}</td>
                <td className="py-3 text-[#174143]">{row.agentName}</td>
                <td className="py-3 text-[#174143]">{row.mode}</td>
                <td className="py-3 text-[#305669]/70">{row.startedAt}</td>
                <td className="py-3">
                  <StatusBadge status={row.status} />
                </td>
                <td className="py-3 text-[#174143]">{row.evidenceCompleteness}</td>
                <td className="py-3">
                  <RiskBadge risk={row.risk} />
                </td>
                <td className="py-3">
                  <Button variant="outline" size="sm" onClick={() => onViewReport?.(row)}>
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Reports
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
