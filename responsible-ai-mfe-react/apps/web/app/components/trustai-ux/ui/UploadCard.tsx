import * as React from "react"
import { CheckCircle2, FileUp, Upload } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

const SUPPORTED_FORMATS = ["JSON", "CSV", "Excel", "Log files"]

export function UploadCard() {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = React.useState<string | null>(null)

  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUp className="h-5 w-5 text-[#305669]" />
          Start Offline Log Evaluation
        </CardTitle>
        <CardDescription>Upload agent execution logs to check traceability and audit readiness.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#e6dece] bg-[#faf7f0] px-4 py-8 text-center transition hover:border-[#305669]/40 hover:bg-[#faeab1]/30"
        >
          {fileName ? <CheckCircle2 className="h-6 w-6 text-emerald-600" /> : <Upload className="h-6 w-6 text-[#305669]/70" />}
          <span className="text-sm font-medium text-[#174143]">{fileName ?? "Drop logs here or click to browse"}</span>
          <span className="text-xs text-[#305669]/70">Supported formats: {SUPPORTED_FORMATS.join(", ")}</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".json,.csv,.xlsx,.xls,.log,.txt"
          className="hidden"
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
        />
        <Button className="h-10 w-full bg-[#305669] text-white hover:bg-[#244455]" onClick={() => inputRef.current?.click()}>
          <Upload className="h-4 w-4" />
          Upload Agent Logs
        </Button>
      </CardContent>
    </Card>
  )
}
