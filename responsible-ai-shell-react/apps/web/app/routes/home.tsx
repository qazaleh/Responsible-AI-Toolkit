import { useNavigate } from "react-router"
import { ArrowRight, BarChart3, BrainCircuit, CheckCircle2, FileText, Workflow } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

const products = [
  {
    name: "TrustAI-X",
    description: "AI model evaluation platform for LLM and ML model assessments.",
    path: "/responsible-ui/trustai-x",
    icon: BrainCircuit,
    modules: ["LLM Evaluation", "ML Model Evaluation", "Explainability", "Fairness"],
    accent: "teal",
  },
  {
    name: "TrustAI-UX",
    description: "AI agent evaluation platform for log-based and API-based analysis.",
    path: "/responsible-ui/trustai-ux",
    icon: Workflow,
    modules: ["Agent Dashboard", "My Agents", "Log-Based Analysis", "API-Based Analysis"],
    accent: "blue",
  },
]

const metrics = [
  { label: "Total Evaluations", value: "128", icon: BarChart3 },
  { label: "Generated Reports", value: "46", icon: FileText },
  { label: "Active Products", value: "2", icon: CheckCircle2 },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-[#305669]">Main Dashboard</p>
          <h2 className="mt-1 text-2xl font-semibold text-[#0f2b2c]">Choose a TrustAI product</h2>
          <p className="mt-2 max-w-2xl text-sm text-[#305669]">
            Start an AI model evaluation, analyze agent behavior, or review generated reports from one workspace.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/responsible-ui/reports")} className="w-fit border-[#e6dece]">
          <FileText className="h-4 w-4" />
          View Reports
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
            <CardContent className="flex items-center justify-between pt-1">
              <div>
                <p className="text-sm text-[#305669]/70">{metric.label}</p>
                <p className="mt-1 text-2xl font-semibold text-[#0f2b2c]">{metric.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#faeab1] text-[#305669]">
                <metric.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {products.map((product) => (
          <Card key={product.name} className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
            <CardHeader className="gap-4">
              <div className="flex items-start justify-between gap-4">
                <div
                  className={
                    product.accent === "teal"
                      ? "flex h-12 w-12 items-center justify-center rounded-xl bg-[#faeab1] text-[#305669]"
                      : "flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700"
                  }
                >
                  <product.icon className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-[#e6dece] px-2.5 py-1 text-xs font-medium text-[#305669]/70">
                  Enterprise
                </span>
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-[#0f2b2c]">{product.name}</CardTitle>
                <CardDescription className="mt-2 text-[#305669]">{product.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-2 sm:grid-cols-2">
                {product.modules.map((module) => (
                  <div key={module} className="rounded-lg border border-[#e6dece] bg-[#faf7f0] px-3 py-2 text-sm text-[#174143]">
                    {module}
                  </div>
                ))}
              </div>
              <Button onClick={() => navigate(product.path)} className="h-10 bg-[#305669] text-white hover:bg-[#244455]">
                Enter {product.name}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
