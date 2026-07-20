import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { apiClient, getApiConfig } from "../../lib/apiClient"

interface ModelDetail {
  ModelName?: string
  Type?: string
  Precision?: string
  Size?: string
}

interface ModelCard {
  name: string
  type: string
  precision: string
  size: string
}

export default function ModelsView() {
  const [models, setModels] = React.useState<ModelCard[]>([])

  React.useEffect(() => {
    const formData = new FormData()
    formData.append("userId", "admin") // Typically from auth context

    const config = getApiConfig()
    const endpoint =
      config.Workbench && config.Workbench_Model ? `${config.Workbench}${config.Workbench_Model}` : "/v1/workbench/model"

    apiClient<any>(endpoint, {
      method: "POST",
      service: "modelDetail",
      body: formData,
      skipAuth: false,
    })
      .then(data => {
        const source: ModelDetail[] = Array.isArray(data?.ModelDetails)
          ? data.ModelDetails
          : Array.isArray(data)
            ? data
            : []

        const mapped = source.map((m) => ({
          name: m.ModelName || "Unnamed Model",
          type: m.Type || "Model",
          precision: m.Precision || "Unknown",
          size: m.Size || "Unknown",
        }))
        setModels(mapped)
      })
      .catch(err => {
        console.warn("Failed to load models from API", err)
        setModels([
          { name: "pii-scrubber-bert-v2", type: "Privacy Masker", precision: "FP16", size: "340M params" },
          { name: "toxicity-guardrail-classifier", type: "Safety Moderator", precision: "INT8", size: "110M params" },
          { name: "legal-contract-compliance-auditor", type: "Compliance Engine", precision: "FP32", size: "7B params" },
        ])
      })
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {models.map((m) => (
        <Card key={m.name} className="border-slate-800 bg-slate-900/30 text-slate-100 hover:border-slate-700/80 transition-all">
          <CardHeader>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">{m.type}</span>
            <CardTitle className="text-base font-bold truncate mt-1">{m.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Precision:</span>
              <span className="text-slate-300 font-semibold">{m.precision}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Footprint:</span>
              <span className="text-slate-300 font-semibold">{m.size}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
