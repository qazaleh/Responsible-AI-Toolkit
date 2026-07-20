import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

import { apiClient, getApiConfig } from "../../lib/apiClient"

interface LeaderboardRow {
  model: string
  toxicity: string
  pii: string
  adv: string
  overall: string
}

function formatScore(value: unknown): string {
  if (typeof value !== "number") return "N/A"
  const normalized = value <= 1 ? value * 100 : value
  return `${normalized.toFixed(1)}%`
}

export default function BenchmarkingView() {
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardRow[]>([
    { model: "Gemini 1.5 Pro", toxicity: "98.5%", pii: "97.8%", adv: "94.5%", overall: "96.9%" },
    { model: "GPT-4o", toxicity: "97.2%", pii: "96.5%", adv: "93.2%", overall: "95.6%" },
    { model: "Llama-3-70B", toxicity: "95.4%", pii: "93.1%", adv: "89.8%", overall: "92.7%" },
  ])

  React.useEffect(() => {
    const config = getApiConfig()
    const endpoint =
      config.SecurityLLMLeaderboard && config.LeaderboardEndpoint
        ? `${config.SecurityLLMLeaderboard}${config.LeaderboardEndpoint}scores/getScores?category=fairness`
        : "/api/v1/trustllm/scores/getScores?category=fairness"

    apiClient<any[]>(endpoint, { service: "leaderboard" })
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) return

        const mapped: LeaderboardRow[] = data
          .map((item: any) => {
            if (!item || typeof item !== "object") return null
            const modelName = Object.keys(item)[0]
            if (!modelName) return null

            const metrics = item[modelName] || {}
            return {
              model: modelName,
              toxicity: formatScore(metrics.toxicity ?? metrics.toxicity_score ?? metrics.Toxicity),
              pii: formatScore(metrics.privacy ?? metrics.pii ?? metrics.privacy_score ?? metrics.Privacy),
              adv: formatScore(
                metrics.robustness ?? metrics.adversarial_robustness ?? metrics.attack_score ?? metrics.Adversarial
              ),
              overall: formatScore(metrics.overall ?? metrics.score ?? metrics.fairness ?? metrics.Fairness),
            }
          })
          .filter(Boolean) as LeaderboardRow[]

        if (mapped.length > 0) {
          setLeaderboard(mapped)
        }
      })
      .catch(err => {
        console.warn("Failed to fetch leaderboard data", err)
      })
  }, [])

  return (
    <Card className="border-slate-800 bg-slate-900/30 text-slate-100">
      <CardHeader>
        <CardTitle className="text-lg">LLM Safety Leaderboard</CardTitle>
        <CardDescription className="text-slate-400">Benchmark comparison of model robustness against guardrail tests</CardDescription>
      </CardHeader>
      <CardContent>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold">
              <th className="py-3">Model</th>
              <th className="py-3">Toxicity Resistance</th>
              <th className="py-3">PII Leakage Shield</th>
              <th className="py-3">Adversarial Robustness</th>
              <th className="py-3">Overall Safety Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {leaderboard.map((row) => (
              <tr key={row.model} className="hover:bg-slate-800/10">
                <td className="py-4 font-semibold text-slate-200">{row.model}</td>
                <td className="py-4">{row.toxicity}</td>
                <td className="py-4">{row.pii}</td>
                <td className="py-4">{row.adv}</td>
                <td className="py-4 text-emerald-400 font-semibold">{row.overall}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
