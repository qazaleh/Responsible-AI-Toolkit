import { reportSummaries } from "../data/mockData"
import { EmptyState } from "../ui/EmptyState"
import { ReportCard } from "../ui/ReportCard"

export function ReportsTab() {
  if (reportSummaries.length === 0) {
    return (
      <EmptyState
        title="No reports generated yet"
        description="Run an offline log or runtime evaluation to generate your first governance report."
      />
    )
  }

  return (
    <div className="space-y-5">
      {reportSummaries.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  )
}
