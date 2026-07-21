import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { evaluationHistory } from "../data/mockData"
import { EvaluationTable } from "../ui/EvaluationTable"

export function ResultsTab() {
  const [statusFilter, setStatusFilter] = React.useState("All Statuses")
  const [modeFilter, setModeFilter] = React.useState("All Modes")

  const filteredRows = evaluationHistory.filter((row) => {
    const statusMatches = statusFilter === "All Statuses" || row.status === statusFilter.toLowerCase()
    const modeMatches = modeFilter === "All Modes" || row.mode === modeFilter
    return statusMatches && modeMatches
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-44 border-[#e6dece] bg-[#fffdf8]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All Statuses", "Completed", "Running", "Failed"].map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={modeFilter} onValueChange={setModeFilter}>
          <SelectTrigger className="h-9 w-44 border-[#e6dece] bg-[#fffdf8]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All Modes", "Offline Log", "Runtime"].map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <EvaluationTable rows={filteredRows} />
    </div>
  )
}
