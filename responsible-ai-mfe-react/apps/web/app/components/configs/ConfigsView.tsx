import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"

import { apiClient } from "../../lib/apiClient"

interface ModerationConfig {
  piiLevel: string
  sanitizationMode: string
}

export default function ConfigsView() {
  const [config, setConfig] = React.useState<ModerationConfig>({
    piiLevel: "strict",
    sanitizationMode: "redact",
  })

  React.useEffect(() => {
    apiClient<any>("/api/v1/rai/admin/ConfigApi", { service: "admin" })
      .then(data => {
        if (data && typeof data === "object") {
          const source = data.result && typeof data.result === "object" ? data.result : data
          setConfig({
            piiLevel: source.piiLevel || "strict",
            sanitizationMode: source.sanitizationMode || "redact",
          })
        }
      })
      .catch(err => console.warn("Failed to load configs", err))
  }, [])

  const handleConfigChange = async (key: string, value: string) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    try {
      await apiClient("/api/v1/rai/admin/ConfigApi", {
        service: "admin",
        method: "POST",
        body: JSON.stringify(newConfig),
      })
    } catch (err) {
      console.warn("Failed to update config on server", err)
    }
  }

  return (
    <Card className="border-slate-800 bg-slate-900/30 text-slate-100">
      <CardHeader>
        <CardTitle className="text-lg">Moderation Profiles</CardTitle>
        <CardDescription className="text-slate-400">Configure global safety boundaries for the trust framework</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-slate-300">Default PII Recognition Level</Label>
            <Select value={config.piiLevel} onValueChange={(v) => handleConfigChange("piiLevel", v)}>
              <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-200">
                <SelectValue placeholder="Strict" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                <SelectItem value="strict">Strict (High Guardrails)</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="loose">Loose (Relaxed Rules)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-slate-300">Data Sanitization Mode</Label>
            <Select value={config.sanitizationMode} onValueChange={(v) => handleConfigChange("sanitizationMode", v)}>
              <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-200">
                <SelectValue placeholder="Redact" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                <SelectItem value="redact">Redact (Mask with [REDACTED])</SelectItem>
                <SelectItem value="hash">Hash (SHA-256 Mask)</SelectItem>
                <SelectItem value="remove">Remove Completely</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
