import * as React from "react"
import { useLocation, useNavigate } from "react-router"
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Download,
  FileText,
  Plus,
  Search,
  ShieldCheck,
  Upload,
  Workflow,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

const FederatedMfe = React.lazy(() =>
  // @ts-ignore
  import("rAIFrontend/RemoteMfeModule").catch((err) => {
    console.warn("Federated MFE remote failed to load. Rendering shell fallback.", err)
    return { default: ShellMfeFallback }
  })
)

export default function MfeLoader() {
  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      <FederatedMfe />
    </React.Suspense>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex min-h-[360px] w-full flex-col items-center justify-center text-[#305669]/70">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      <div className="mt-4 text-sm font-medium">Loading workspace...</div>
    </div>
  )
}

const reports = [
  {
    name: "LLM Finance Benchmark",
    product: "TrustAI-X",
    module: "LLM Evaluation",
    owner: "GPT-4o",
    created: "2026-07-09",
    status: "Ready",
  },
  {
    name: "Credit Model Fairness Review",
    product: "TrustAI-X",
    module: "Fairness",
    owner: "Credit Risk Model",
    created: "2026-07-08",
    status: "Ready",
  },
  {
    name: "Claims Agent Safety Evaluation",
    product: "TrustAI-UX",
    module: "API-Based Analysis",
    owner: "Claims Review Agent",
    created: "2026-07-08",
    status: "Ready",
  },
  {
    name: "HR Agent Log Analysis",
    product: "TrustAI-UX",
    module: "Log-Based Analysis",
    owner: "HR Policy Assistant",
    created: "2026-07-07",
    status: "Processing",
  },
  {
    name: "Robustness Attack Summary",
    product: "TrustAI-X",
    module: "Robustness",
    owner: "Fraud Detection Model",
    created: "2026-07-06",
    status: "Ready",
  },
]

function ShellMfeFallback() {
  const location = useLocation()

  if (location.pathname.includes("/reports")) {
    return <ReportsFallback />
  }

  if (location.pathname.includes("/trustai-ux")) {
    return <TrustAiUxFallback />
  }

  if (location.pathname.includes("/trustai-x")) {
    return <TrustAiXFallback />
  }

  return <ProductEntryFallback />
}

function TrustAiXFallback() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      <ProductHeader
        label="TrustAI-X"
        title="AI Model Evaluation Platform"
        description="Evaluate LLMs and ML models across explainability, fairness, robustness, and counterfactual analysis."
        icon={BrainCircuit}
      />

      <Tabs defaultValue="llm" className="space-y-5">
        <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-lg bg-[#faeab1] p-1">
          <TabsTrigger value="llm" className="h-9 px-3">LLM Evaluation</TabsTrigger>
          <TabsTrigger value="ml" className="h-9 px-3">ML Model Evaluation</TabsTrigger>
        </TabsList>

        <TabsContent value="llm">
          <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
              <CardHeader>
                <CardTitle>LLM Evaluation</CardTitle>
                <CardDescription>Evaluate multiple LLMs using uploaded benchmark prompts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <Field label="Domain">
                  <FilterSelect value="Finance" onChange={() => null} options={["Finance", "Banking", "Insurance", "Healthcare", "HR", "Legal", "Custom"]} />
                </Field>
                <UploadPanel title="Prompt Upload" description="JSON or CSV benchmark prompt file" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-[#174143]">Models</Label>
                    <Button variant="outline" className="border-[#e6dece]">
                      <Plus className="h-4 w-4" />
                      Add Model
                    </Button>
                  </div>
                  <div className="grid gap-3 rounded-lg border border-[#e6dece] bg-[#faf7f0] p-3 md:grid-cols-2">
                    <Input defaultValue="OpenAI" className="h-10 border-[#e6dece] bg-[#fffdf8]" placeholder="Provider" />
                    <Input defaultValue="GPT-4o" className="h-10 border-[#e6dece] bg-[#fffdf8]" placeholder="Model Name" />
                    <Input defaultValue="2026-01" className="h-10 border-[#e6dece] bg-[#fffdf8]" placeholder="Version" />
                    <Input defaultValue="https://api.example.com/v1" className="h-10 border-[#e6dece] bg-[#fffdf8]" placeholder="API URL" />
                    <Input type="password" className="h-10 border-[#e6dece] bg-[#fffdf8] md:col-span-2" placeholder="API Key / Token" />
                  </div>
                </div>
                <Button className="h-10 bg-[#305669] text-white hover:bg-[#244455]">Start Evaluation</Button>
              </CardContent>
            </Card>

            <OutputCard
              title="Evaluation Progress"
              description="Run status and generated outputs."
              items={["Evaluation Progress", "Evaluation Results", "Generate PDF Report", "Download Report"]}
            />
          </div>
        </TabsContent>

        <TabsContent value="ml">
          <div className="space-y-5">
            <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
              <CardHeader>
                <CardTitle>ML Model Evaluation</CardTitle>
                <CardDescription>Upload a model and dataset, then run evaluation modules.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-4">
                <UploadPanel title="Upload Model File" description=".pkl, .joblib, .onnx" />
                <UploadPanel title="Upload Dataset" description="CSV dataset" />
                <Field label="Target Column"><Input placeholder="target" className="h-10 border-[#e6dece] bg-[#fffdf8]" /></Field>
                <Field label="Task Type">
                  <FilterSelect value="Classification" onChange={() => null} options={["Classification", "Regression"]} />
                </Field>
                <Button className="h-10 w-fit bg-[#305669] text-white hover:bg-[#244455] lg:col-span-4">Start Evaluation</Button>
              </CardContent>
            </Card>

            <Tabs defaultValue="explainability" className="space-y-4">
              <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-lg bg-[#faeab1] p-1">
                {["Explainability", "Fairness", "Robustness", "Counterfactuals"].map((tab) => (
                  <TabsTrigger key={tab} value={tab.toLowerCase()} className="h-9 px-3">{tab}</TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="explainability">
                <ModulePanel
                  title="Explainability"
                  fields={["Explanation Type: Global / Local / Both", "Method: SHAP or LIME", "Number of Local Samples"]}
                  outputs={["Charts", "Feature Importance", "Local Explanations", "Global Explanations", "Download PDF"]}
                />
              </TabsContent>
              <TabsContent value="fairness">
                <ModulePanel
                  title="Fairness"
                  fields={["Bias Type", "Protected Attribute", "Privileged Group", "Unprivileged Group", "Metrics"]}
                  outputs={["Fairness Metrics", "Charts", "Recommendations", "Download PDF"]}
                />
              </TabsContent>
              <TabsContent value="robustness">
                <ModulePanel
                  title="Robustness"
                  fields={["Attack Type: Evasion / Inference", "Attack", "Generate Robustness Report"]}
                  outputs={["Attack Success Rates", "Confusion Matrix", "Mitigation Summary", "Charts", "Download PDF"]}
                />
              </TabsContent>
              <TabsContent value="counterfactuals">
                <ModulePanel
                  title="Counterfactuals"
                  fields={["Method: DiCE", "Input Instance", "Desired Class", "Number of Examples", "Features Allowed to Change", "Immutable Features"]}
                  outputs={["Generated Counterfactual Examples", "Changed Features", "Feature Differences", "Recommendations", "Download PDF"]}
                />
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TrustAiUxFallback() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      <ProductHeader
        label="TrustAI-UX"
        title="AI Agent Evaluation Platform"
        description="Analyze agent behavior through historical logs or API-collected execution traces."
        icon={Workflow}
      />

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Total Agents", "14", Bot],
          ["Total Evaluations", "82", BarChart3],
          ["Generated Reports", "31", FileText],
          ["Recent Activity", "9 today", Activity],
        ].map(([label, value, Icon]) => (
          <Card key={label as string} className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
            <CardContent className="flex items-center justify-between pt-1">
              <div>
                <p className="text-sm text-[#305669]/70">{label as string}</p>
                <p className="mt-1 text-xl font-semibold text-[#0f2b2c]">{value as string}</p>
              </div>
              <Icon className="h-5 w-5 text-[#305669]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="agents" className="space-y-5">
        <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-lg bg-[#faeab1] p-1">
          <TabsTrigger value="agents" className="h-9 px-3">My Agents</TabsTrigger>
          <TabsTrigger value="log" className="h-9 px-3">Log-Based Analysis</TabsTrigger>
          <TabsTrigger value="api" className="h-9 px-3">API-Based Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="agents"><AgentsFallbackTable /></TabsContent>
        <TabsContent value="log">
          <AnalysisPanel
            title="Log-Based Analysis"
            description="Upload historical agent execution logs for evaluation."
            inputs={["Select Agent", "Upload CSV Log File", "Optional Description"]}
            outputs={["Analysis Summary", "Detected Sessions", "Risk Summary", "Recommendations", "Generate PDF Report", "Download Report"]}
            button="Start Analysis"
          />
        </TabsContent>
        <TabsContent value="api">
          <AnalysisPanel
            title="API-Based Analysis"
            description="Evaluate agent executions collected through API integration."
            inputs={["Select Agent", "Time Range", "Evaluation Modules", "Report Type"]}
            outputs={["Execution Summary", "Evaluation Results", "Timeline", "Recommendations", "Generate PDF Report", "Download Report"]}
            button="Generate Evaluation"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ReportsFallback() {
  const [product, setProduct] = React.useState("All Products")
  const [module, setModule] = React.useState("All Modules")
  const [status, setStatus] = React.useState("All Statuses")
  const [query, setQuery] = React.useState("")

  const moduleOptions = React.useMemo(() => {
    const scoped = product === "All Products" ? reports : reports.filter((report) => report.product === product)
    return ["All Modules", ...Array.from(new Set(scoped.map((report) => report.module)))]
  }, [product])

  React.useEffect(() => {
    if (module !== "All Modules" && !moduleOptions.includes(module)) {
      setModule("All Modules")
    }
  }, [module, moduleOptions])

  const filteredReports = reports.filter((report) => {
    const matchesProduct = product === "All Products" || report.product === product
    const matchesModule = module === "All Modules" || report.module === module
    const matchesStatus = status === "All Statuses" || report.status === status
    const matchesQuery =
      !query ||
      [report.name, report.product, report.module, report.owner]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())

    return matchesProduct && matchesModule && matchesStatus && matchesQuery
  })

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-[#305669]">Reports</p>
          <h2 className="mt-1 text-2xl font-semibold text-[#0f2b2c]">Report Library</h2>
          <p className="mt-2 text-sm text-[#305669]">
            Shared reports across TrustAI-X and TrustAI-UX, filtered by product, module, status, and date.
          </p>
        </div>
        <Button className="w-fit bg-[#305669] text-white hover:bg-[#244455]">
          <FileText className="h-4 w-4" />
          Generate PDF Report
        </Button>
      </div>

      <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>Use the filters to narrow reports by product and module.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-[#305669]/60" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search report, model, or agent"
                className="h-10 border-[#e6dece] bg-[#fffdf8] pl-9"
              />
            </div>
            <FilterSelect value={product} onChange={setProduct} options={["All Products", "TrustAI-X", "TrustAI-UX"]} />
            <FilterSelect value={module} onChange={setModule} options={moduleOptions} />
            <FilterSelect value={status} onChange={setStatus} options={["All Statuses", "Ready", "Processing", "Failed"]} />
            <Input placeholder="Date Range" className="h-10 border-[#e6dece] bg-[#fffdf8]" />
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#e6dece]">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-[#faf7f0] text-xs uppercase text-[#305669]/70">
                <tr>
                  {["Report Name", "Product", "Module", "Agent / Model", "Created Date", "Status", "Download"].map((header) => (
                    <th key={header} className="px-4 py-3 font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dece] bg-[#fffdf8]">
                {filteredReports.map((report) => (
                  <tr key={report.name} className="hover:bg-[#faf7f0]">
                    <td className="px-4 py-3 font-medium text-[#0f2b2c]">{report.name}</td>
                    <td className="px-4 py-3 text-[#174143]">{report.product}</td>
                    <td className="px-4 py-3 text-[#174143]">{report.module}</td>
                    <td className="px-4 py-3 text-[#174143]">{report.owner}</td>
                    <td className="px-4 py-3 text-[#174143]">{report.created}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="outline" size="sm" className="border-[#e6dece]">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReports.length === 0 && (
            <div className="rounded-lg border border-dashed border-[#e6dece] bg-[#faf7f0] p-8 text-center text-sm text-[#305669]/70">
              No reports match the selected filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ProductHeader({
  label,
  title,
  description,
  icon: Icon,
}: {
  label: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[#e6dece] bg-[#fffdf8] p-5 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-medium text-[#305669]">{label}</p>
        <h2 className="mt-1 text-2xl font-semibold text-[#0f2b2c]">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm text-[#305669]">{description}</p>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#faeab1] text-[#305669]">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-[#174143]">{label}</Label>
      {children}
    </div>
  )
}

function UploadPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-dashed border-[#e6dece] bg-[#faf7f0] px-4 py-5 text-center">
      <Upload className="h-6 w-6 text-[#305669]/60" />
      <div className="mt-2 text-sm font-medium text-[#174143]">{title}</div>
      <div className="mt-1 text-xs text-[#305669]/70">{description}</div>
    </div>
  )
}

function OutputCard({ title, description, items }: { title: string; description: string; items: string[] }) {
  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-2 rounded-full bg-[#faeab1]">
          <div className="h-2 w-2/3 rounded-full bg-[#305669]" />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item} className="rounded-lg border border-[#e6dece] bg-[#faf7f0] px-3 py-2 text-sm text-[#174143]">
              {item}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ModulePanel({ title, fields, outputs }: { title: string; fields: string[]; outputs: string[] }) {
  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#305669]" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-2">
        <div className="grid gap-3 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field} className="rounded-lg border border-[#e6dece] bg-[#faf7f0] px-3 py-2 text-sm text-[#174143]">
              {field}
            </div>
          ))}
          <Button className="h-10 w-fit bg-[#305669] text-white hover:bg-[#244455] sm:col-span-2">
            Generate {title} Report
          </Button>
        </div>
        <div className="rounded-lg border border-[#e6dece] bg-[#faf7f0] p-4">
          <div className="mb-3 text-sm font-semibold text-[#0f2b2c]">Output</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {outputs.map((output) => (
              <div key={output} className="rounded-lg bg-[#fffdf8] px-3 py-2 text-sm text-[#174143] shadow-xs">
                {output}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AgentsFallbackTable() {
  const agents = [
    ["Claims Review Agent", "Insurance document triage", "API-Based", "12 min ago", "Active", "8"],
    ["HR Policy Assistant", "Employee policy support", "Log-Based", "Yesterday", "Review", "3"],
    ["Banking Service Agent", "Customer workflow assistant", "API-Based", "3 days ago", "Active", "12"],
  ]

  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <CardTitle>My Agents</CardTitle>
        <CardDescription>Managed AI agents and their latest evaluation activity.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-[#e6dece] bg-[#faf7f0] text-xs uppercase text-[#305669]/70">
            <tr>
              {["Agent Name", "Description", "Analysis Type", "Last Activity", "Status", "Reports", "Actions"].map((header) => (
                <th key={header} className="px-4 py-3 font-semibold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e6dece]">
            {agents.map((row) => (
              <tr key={row[0]} className="hover:bg-[#faf7f0]">
                {row.map((cell) => (
                  <td key={cell} className="px-4 py-3 text-[#174143]">{cell}</td>
                ))}
                <td className="flex gap-2 px-4 py-3">
                  <Button variant="outline" size="sm">View</Button>
                  <Button variant="outline" size="sm">Generate Report</Button>
                  <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-50">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

function AnalysisPanel({
  title,
  description,
  inputs,
  outputs,
  button,
}: {
  title: string
  description: string
  inputs: string[]
  outputs: string[]
  button: string
}) {
  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-3">
          {inputs.map((input) => (
            input.includes("Upload") ? (
              <UploadPanel key={input} title={input} description="CSV file" />
            ) : (
              <Field key={input} label={input}>
                <Input className="h-10 border-[#e6dece] bg-[#fffdf8]" placeholder={input} />
              </Field>
            )
          ))}
          <Button className="h-10 bg-[#305669] text-white hover:bg-[#244455]">{button}</Button>
        </div>
        <div className="rounded-lg border border-[#e6dece] bg-[#faf7f0] p-4">
          <div className="mb-3 text-sm font-semibold text-[#0f2b2c]">Output</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {outputs.map((output) => (
              <div key={output} className="rounded-lg bg-[#fffdf8] px-3 py-2 text-sm text-[#174143] shadow-xs">
                {output}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FilterSelect({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 w-full border-[#e6dece] bg-[#fffdf8]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function ProductEntryFallback() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-2">
      <EntryCard
        title="TrustAI-X"
        description="AI model evaluation for LLM and ML systems."
        icon={BrainCircuit}
        onClick={() => navigate("/responsible-ui/trustai-x")}
      />
      <EntryCard
        title="TrustAI-UX"
        description="AI agent evaluation with log and API analysis."
        icon={Workflow}
        onClick={() => navigate("/responsible-ui/trustai-ux")}
      />
    </div>
  )
}

function EntryCard({
  title,
  description,
  icon: Icon,
  onClick,
}: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
}) {
  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#faeab1] text-[#305669]">
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onClick} className="bg-[#305669] text-white hover:bg-[#244455]">
          Enter Product
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

function ProductFallback({
  title,
  description,
  icon: Icon,
  modules,
}: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  modules: string[]
}) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
        <CardHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#faeab1] text-[#305669]">
            <Icon className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <div key={module} className="rounded-lg border border-[#e6dece] bg-[#faf7f0] px-4 py-3 text-sm font-medium text-[#174143]">
              {module}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
