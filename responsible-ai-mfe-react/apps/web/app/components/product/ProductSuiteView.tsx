import * as React from "react"
import { useLocation, useNavigate } from "react-router"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Download,
  FileText,
  Gauge,
  LineChart,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Upload,
  Workflow,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { cn } from "@workspace/ui/lib/utils"

type ModelConfig = {
  id: number
  provider: string
  modelName: string
  version: string
  apiUrl: string
  token: string
}

const domains = ["Finance", "Banking", "Insurance", "Healthcare", "HR", "Legal", "Custom"]
const taskTypes = ["Classification", "Regression"]
const explanationTypes = ["Global", "Local", "Both"]
const explanationMethods = ["SHAP", "LIME"]
const biasTypes = ["Pre-train", "In-process", "Post-train"]
const fairnessMetrics = [
  "Statistical Parity Difference",
  "Disparate Impact",
  "Equal Opportunity Difference",
  "Average Odds Difference",
  "Consistency",
]
const attacks = [
  "HopSkipJump",
  "Projected Gradient Descent",
  "Query Efficient",
  "Zeroth Order Optimization",
  "Membership Inference Black Box",
  "Membership Inference Rule",
  "Label Only Gap",
]
const evaluationModules = ["Behavior Analysis", "Explainability", "Safety", "Policy Compliance", "Performance", "Tool Usage"]

function routeMode(pathname: string) {
  if (pathname.includes("trustai-ux")) return "ux"
  if (pathname.includes("reports")) return "reports"
  if (pathname.includes("configs")) return "settings"
  if (pathname.includes("trustai-x") || pathname.includes("benchmarking") || pathname.includes("models") || pathname.includes("workbench")) {
    return "x"
  }
  return "home"
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-[#174143]">{label}</Label>
      {children}
    </div>
  )
}

function TextInput(props: React.ComponentProps<typeof Input>) {
  return <Input {...props} className={cn("h-10 border-[#e6dece] bg-[#fffdf8]", props.className)} />
}

function SimpleSelect({ value, onValueChange, options }: { value: string; onValueChange: (value: string) => void; options: string[] }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
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

function UploadBox({ label, support }: { label: string; support: string }) {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-dashed border-[#e6dece] bg-[#faf7f0] px-4 py-5 text-center">
      <Upload className="h-6 w-6 text-[#305669]/70" />
      <div className="mt-2 text-sm font-medium text-[#174143]">{label}</div>
      <div className="mt-1 text-xs text-[#305669]/70">{support}</div>
    </div>
  )
}

function ProgressPanel({ running, complete }: { running: boolean; complete: boolean }) {
  if (!running && !complete) {
    return (
      <div className="rounded-lg border border-[#e6dece] bg-[#faf7f0] p-5 text-sm text-[#305669]/70">
        Evaluation output will appear here after the run starts.
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-lg border border-[#e6dece] bg-[#fffdf8] p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-[#0f2b2c]">{complete ? "Evaluation Results" : "Evaluation Progress"}</div>
          <div className="text-xs text-[#305669]/70">{complete ? "Report generation is available." : "Running selected modules..."}</div>
        </div>
        <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", complete ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700")}>
          {complete ? "Complete" : "In progress"}
        </span>
      </div>
      <div className="h-2 rounded-full bg-[#faeab1]">
        <div className={cn("h-2 rounded-full bg-[#305669] transition-all", complete ? "w-full" : "w-2/3")} />
      </div>
      {complete && (
        <div className="grid gap-3 sm:grid-cols-3">
          {["Safety score 94%", "Bias risk Low", "Report Ready"].map((item) => (
            <div key={item} className="rounded-lg border border-[#e6dece] bg-[#faf7f0] px-3 py-2 text-sm text-[#174143]">
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Toast({ message }: { message: string }) {
  if (!message) return null
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-emerald-200 bg-[#fffdf8] px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg">
      <CheckCircle2 className="h-4 w-4" />
      {message}
    </div>
  )
}

function LlmEvaluation({ notify }: { notify: (message: string) => void }) {
  const [domain, setDomain] = React.useState("Finance")
  const [models, setModels] = React.useState<ModelConfig[]>([
    { id: 1, provider: "OpenAI", modelName: "GPT-4o", version: "2026-01", apiUrl: "https://api.example.com/v1", token: "" },
  ])
  const [running, setRunning] = React.useState(false)
  const [complete, setComplete] = React.useState(false)

  const start = () => {
    setRunning(true)
    setComplete(false)
    window.setTimeout(() => {
      setRunning(false)
      setComplete(true)
      notify("LLM evaluation completed.")
    }, 900)
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
        <CardHeader>
          <CardTitle>LLM Evaluation</CardTitle>
          <CardDescription>Evaluate multiple LLMs using uploaded benchmark prompts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Field label="Domain">
            <SimpleSelect value={domain} onValueChange={setDomain} options={domains} />
          </Field>
          <UploadBox label="Prompt Upload" support="JSON or CSV benchmark prompt file" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-[#174143]">Models</Label>
              <Button
                variant="outline"
                onClick={() =>
                  setModels((current) => [
                    ...current,
                    { id: Date.now(), provider: "", modelName: "", version: "", apiUrl: "", token: "" },
                  ])
                }
              >
                <Plus className="h-4 w-4" />
                Add Model
              </Button>
            </div>
            <div className="space-y-3">
              {models.map((model, index) => (
                <div key={model.id} className="grid gap-3 rounded-lg border border-[#e6dece] bg-[#faf7f0] p-3 md:grid-cols-2">
                  <TextInput placeholder="Provider" defaultValue={model.provider} />
                  <TextInput placeholder="Model Name" defaultValue={model.modelName} />
                  <TextInput placeholder="Version" defaultValue={model.version} />
                  <TextInput placeholder="API URL" defaultValue={model.apiUrl} />
                  <TextInput placeholder="API Key / Token" type="password" className="md:col-span-2" />
                  <Button
                    variant="outline"
                    onClick={() => setModels((current) => current.filter((item) => item.id !== model.id))}
                    disabled={models.length === 1}
                    className="w-fit border-red-200 text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove Model {index + 1}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={start} className="h-10 bg-[#305669] text-white hover:bg-[#244455]">
            Start Evaluation
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <ProgressPanel running={running} complete={complete} />
        {complete && <ReportActions />}
      </div>
    </div>
  )
}

function MlEvaluation({ notify }: { notify: (message: string) => void }) {
  const [taskType, setTaskType] = React.useState("Classification")
  const [hasRun, setHasRun] = React.useState(false)

  return (
    <div className="space-y-5">
      <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
        <CardHeader>
          <CardTitle>ML Model Evaluation</CardTitle>
          <CardDescription>Upload a model and dataset, then run explainability, fairness, robustness, and counterfactual checks.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-4">
          <UploadBox label="Upload Model File" support=".pkl, .joblib, .onnx" />
          <UploadBox label="Upload Dataset" support="CSV dataset" />
          <Field label="Target Column">
            <TextInput placeholder="target" />
          </Field>
          <Field label="Task Type">
            <SimpleSelect value={taskType} onValueChange={setTaskType} options={taskTypes} />
          </Field>
          <Button
            onClick={() => {
              setHasRun(true)
              notify("ML evaluation started.")
            }}
            className="h-10 w-fit bg-[#305669] text-white hover:bg-[#244455] lg:col-span-4"
          >
            Start Evaluation
          </Button>
        </CardContent>
      </Card>

      {hasRun ? <MlResultTabs notify={notify} /> : <EmptyState title="No ML evaluation results yet" description="Start an evaluation to unlock explainability, fairness, robustness, and counterfactual reports." />}
    </div>
  )
}

function MlResultTabs({ notify }: { notify: (message: string) => void }) {
  return (
    <Tabs defaultValue="explainability" className="space-y-4">
      <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-lg bg-[#faeab1] p-1">
        {["explainability", "fairness", "robustness", "counterfactuals"].map((tab) => (
          <TabsTrigger key={tab} value={tab} className="h-9 min-w-fit px-3 capitalize">
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="explainability">
        <EvaluationCard
          title="Explainability"
          icon={LineChart}
          fields={[
            ["Explanation Type", <SimpleSelect key="type" value="Both" onValueChange={() => null} options={explanationTypes} />],
            ["Method", <SimpleSelect key="method" value="SHAP" onValueChange={() => null} options={explanationMethods} />],
            ["Number of Local Samples", <TextInput key="samples" type="number" defaultValue="25" />],
          ]}
          outputs={["Charts", "Feature Importance", "Local Explanations", "Global Explanations"]}
          action="Generate Explainability Report"
          onAction={() => notify("Explainability report generated.")}
        />
      </TabsContent>
      <TabsContent value="fairness">
        <EvaluationCard
          title="Fairness"
          icon={ShieldCheck}
          fields={[
            ["Bias Type", <SimpleSelect key="bias" value="Pre-train" onValueChange={() => null} options={biasTypes} />],
            ["Protected Attribute", <TextInput key="attribute" placeholder="gender" />],
            ["Privileged Group", <TextInput key="privileged" placeholder="1" />],
            ["Unprivileged Group", <TextInput key="unprivileged" placeholder="0" />],
          ]}
          outputs={[...fairnessMetrics, "Charts", "Recommendations"]}
          action="Generate Fairness Report"
          onAction={() => notify("Fairness report generated.")}
        />
      </TabsContent>
      <TabsContent value="robustness">
        <EvaluationCard
          title="Robustness"
          icon={ShieldAlert}
          fields={[
            ["Attack Type", <SimpleSelect key="attackType" value="Evasion" onValueChange={() => null} options={["Evasion", "Inference"]} />],
            ["Attack", <SimpleSelect key="attack" value="HopSkipJump" onValueChange={() => null} options={attacks} />],
          ]}
          outputs={["Attack Success Rates", "Confusion Matrix", "Mitigation Summary", "Charts"]}
          action="Generate Robustness Report"
          onAction={() => notify("Robustness report generated.")}
        />
      </TabsContent>
      <TabsContent value="counterfactuals">
        <EvaluationCard
          title="Counterfactuals"
          icon={Activity}
          fields={[
            ["Method", <TextInput key="method" defaultValue="DiCE" />],
            ["Input Instance", <TextInput key="instance" placeholder='{"age": 42, "income": 85000}' />],
            ["Desired Class", <TextInput key="class" placeholder="approved" />],
            ["Number of Counterfactual Examples", <TextInput key="count" type="number" defaultValue="5" />],
            ["Features Allowed to Change", <TextInput key="allowed" placeholder="income, tenure" />],
            ["Immutable Features", <TextInput key="immutable" placeholder="age, region" />],
          ]}
          outputs={["Generated Counterfactual Examples", "Changed Features", "Feature Differences", "Recommendations"]}
          action="Generate Counterfactual Report"
          onAction={() => notify("Counterfactual report generated.")}
        />
      </TabsContent>
    </Tabs>
  )
}

function EvaluationCard({
  title,
  icon: Icon,
  fields,
  outputs,
  action,
  onAction,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  fields: [string, React.ReactNode][]
  outputs: string[]
  action: string
  onAction: () => void
}) {
  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-[#305669]" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([label, field]) => (
            <Field key={label} label={label}>
              {field}
            </Field>
          ))}
          <Button onClick={onAction} className="h-10 w-fit bg-[#305669] text-white hover:bg-[#244455] sm:col-span-2">
            {action}
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
          <Button variant="outline" className="mt-4 border-[#e6dece]">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ReportActions() {
  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <CardTitle>Evaluation Results</CardTitle>
        <CardDescription>Generate and download an executive-ready PDF report.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button className="bg-[#305669] text-white hover:bg-[#244455]">
          <FileText className="h-4 w-4" />
          Generate PDF Report
        </Button>
        <Button variant="outline" className="border-[#e6dece]">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </CardContent>
    </Card>
  )
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#e6dece] bg-[#fffdf8] p-8 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#faeab1] text-[#305669]/70">
        <FileText className="h-5 w-5" />
      </div>
      <div className="mt-3 text-sm font-semibold text-[#0f2b2c]">{title}</div>
      <div className="mt-1 text-sm text-[#305669]/70">{description}</div>
    </div>
  )
}

function TrustAiX({ notify }: { notify: (message: string) => void }) {
  return (
    <div className="space-y-5">
      <PageHeader
        label="TrustAI-X"
        title="AI Model Evaluation Platform"
        description="Run LLM and ML model evaluation workflows across explainability, fairness, robustness, and counterfactuals."
        icon={BrainCircuit}
      />
      <Tabs defaultValue="llm" className="space-y-5">
        <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-lg bg-[#faeab1] p-1">
          <TabsTrigger value="llm" className="h-9 px-3">LLM Evaluation</TabsTrigger>
          <TabsTrigger value="ml" className="h-9 px-3">ML Model Evaluation</TabsTrigger>
        </TabsList>
        <TabsContent value="llm">
          <LlmEvaluation notify={notify} />
        </TabsContent>
        <TabsContent value="ml">
          <MlEvaluation notify={notify} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TrustAiUx({ notify }: { notify: (message: string) => void }) {
  return (
    <div className="space-y-5">
      <PageHeader
        label="TrustAI-UX"
        title="AI Agent Evaluation Platform"
        description="Evaluate agent executions through uploaded logs or API-integrated activity windows."
        icon={Workflow}
      />
      <AgentDashboard />
      <Tabs defaultValue="agents" className="space-y-5">
        <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-lg bg-[#faeab1] p-1">
          <TabsTrigger value="agents" className="h-9 px-3">My Agents</TabsTrigger>
          <TabsTrigger value="log" className="h-9 px-3">Log-Based Analysis</TabsTrigger>
          <TabsTrigger value="api" className="h-9 px-3">API-Based Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="agents"><AgentsTable notify={notify} /></TabsContent>
        <TabsContent value="log"><LogAnalysis notify={notify} /></TabsContent>
        <TabsContent value="api"><ApiAnalysis notify={notify} /></TabsContent>
      </Tabs>
    </div>
  )
}

function PageHeader({
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
        <div className="text-sm font-medium text-[#305669]">{label}</div>
        <h2 className="mt-1 text-2xl font-semibold text-[#0f2b2c]">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm text-[#305669]">{description}</p>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#faeab1] text-[#305669]">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  )
}

function AgentDashboard() {
  const stats = [
    ["Total Agents", "14", Bot],
    ["Total Evaluations", "82", BarChart3],
    ["Generated Reports", "31", FileText],
    ["Recent Activity", "9 today", Activity],
  ] as const

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map(([label, value, Icon]) => (
        <Card key={label} className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
          <CardContent className="flex items-center justify-between pt-1">
            <div>
              <p className="text-sm text-[#305669]/70">{label}</p>
              <p className="mt-1 text-xl font-semibold text-[#0f2b2c]">{value}</p>
            </div>
            <Icon className="h-5 w-5 text-[#305669]" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function AgentsTable({ notify }: { notify: (message: string) => void }) {
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
          <thead className="border-b border-[#e6dece] text-xs uppercase text-[#305669]/70">
            <tr>{["Agent Name", "Description", "Analysis Type", "Last Activity", "Status", "Reports", "Actions"].map((h) => <th key={h} className="py-3 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[#e6dece]">
            {agents.map((row) => (
              <tr key={row[0]}>
                {row.map((cell) => <td key={cell} className="py-3 text-[#174143]">{cell}</td>)}
                <td className="flex gap-2 py-3">
                  <Button variant="outline" size="sm">View</Button>
                  <Button variant="outline" size="sm" onClick={() => notify("Agent report generated.")}>Generate Report</Button>
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

function LogAnalysis({ notify }: { notify: (message: string) => void }) {
  return (
    <AnalysisCard
      title="Log-Based Analysis"
      description="Upload historical agent execution logs for evaluation."
      fields={[
        ["Select Agent", <TextInput key="agent" placeholder="Claims Review Agent" />],
        ["Upload CSV Log File", <UploadBox key="upload" label="CSV Log File" support="Historical execution logs" />],
        ["Optional Description", <TextInput key="description" placeholder="Q2 production review" />],
      ]}
      outputs={["Analysis Summary", "Detected Sessions", "Risk Summary", "Recommendations"]}
      action="Start Analysis"
      onAction={() => notify("Log-based analysis completed.")}
    />
  )
}

function ApiAnalysis({ notify }: { notify: (message: string) => void }) {
  return (
    <AnalysisCard
      title="API-Based Analysis"
      description="Evaluate agent executions collected through API integration."
      fields={[
        ["Select Agent", <TextInput key="agent" placeholder="Banking Service Agent" />],
        ["Time Range", <SimpleSelect key="time" value="Last 24 Hours" onValueChange={() => null} options={["Last Hour", "Last 24 Hours", "Last 7 Days", "Custom Range"]} />],
        ["Evaluation Modules", <TextInput key="modules" defaultValue={evaluationModules.join(", ")} />],
        ["Report Type", <SimpleSelect key="report" value="Full Report" onValueChange={() => null} options={["Executive Summary", "Technical Report", "Full Report"]} />],
      ]}
      outputs={["Execution Summary", "Evaluation Results", "Timeline", "Recommendations"]}
      action="Generate Evaluation"
      onAction={() => notify("API-based evaluation generated.")}
    />
  )
}

function AnalysisCard({
  title,
  description,
  fields,
  outputs,
  action,
  onAction,
}: {
  title: string
  description: string
  fields: [string, React.ReactNode][]
  outputs: string[]
  action: string
  onAction: () => void
}) {
  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          {fields.map(([label, field]) => (
            <Field key={label} label={label}>{field}</Field>
          ))}
          <Button onClick={onAction} className="h-10 bg-[#305669] text-white hover:bg-[#244455]">{action}</Button>
        </div>
        <div className="rounded-lg border border-[#e6dece] bg-[#faf7f0] p-4">
          <div className="mb-3 text-sm font-semibold text-[#0f2b2c]">Output</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {outputs.map((output) => (
              <div key={output} className="rounded-lg bg-[#fffdf8] px-3 py-2 text-sm text-[#174143] shadow-xs">{output}</div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline"><FileText className="h-4 w-4" />Generate PDF Report</Button>
            <Button variant="outline"><Download className="h-4 w-4" />Download Report</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ReportsPage() {
  const reports = [
    ["LLM Finance Benchmark", "TrustAI-X", "LLM Evaluation", "GPT-4o", "2026-07-09", "Ready"],
    ["Claims Agent Safety", "TrustAI-UX", "API-Based Analysis", "Claims Review Agent", "2026-07-08", "Ready"],
    ["Credit Model Fairness", "TrustAI-X", "Fairness", "Credit Risk Model", "2026-07-07", "Processing"],
  ]

  return (
    <div className="space-y-5">
      <PageHeader label="Reports" title="Shared Reports" description="Reports generated across TrustAI-X and TrustAI-UX." icon={FileText} />
      <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
        <CardHeader>
          <CardTitle>Report Library</CardTitle>
          <CardDescription>Filter by product, module, status, or date range.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <SimpleSelect value="All Products" onValueChange={() => null} options={["All Products", "TrustAI-X", "TrustAI-UX"]} />
            <TextInput placeholder="Module" />
            <SimpleSelect value="All Statuses" onValueChange={() => null} options={["All Statuses", "Ready", "Processing", "Failed"]} />
            <TextInput placeholder="Date Range" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-[#e6dece] text-xs uppercase text-[#305669]/70">
                <tr>{["Report Name", "Product", "Module", "Agent / Model", "Created Date", "Status", "Download"].map((h) => <th key={h} className="py-3 font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-[#e6dece]">
                {reports.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => <td key={cell} className="py-3 text-[#174143]">{cell}</td>)}
                    <td className="py-3"><Button variant="outline" size="sm"><Download className="h-4 w-4" />Download</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader label="Settings" title="Workspace Settings" description="Manage profile, password, API keys, and theme preferences." icon={Gauge} />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
          <CardHeader><CardTitle>User Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Field label="Display Name"><TextInput defaultValue="TrustAI User" /></Field>
            <Field label="Email"><TextInput defaultValue="trustai.user@example.com" /></Field>
            <Button className="bg-[#305669] text-white hover:bg-[#244455]">Save Profile</Button>
          </CardContent>
        </Card>
        <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
          <CardHeader><CardTitle>Password Change</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Field label="Current Password"><TextInput type="password" /></Field>
            <Field label="New Password"><TextInput type="password" /></Field>
            <Button variant="outline">Update Password</Button>
          </CardContent>
        </Card>
        <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
          <CardHeader><CardTitle>API Keys</CardTitle><CardDescription>Optional integration keys.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <Field label="Evaluation API Key"><TextInput type="password" defaultValue="trustai-key-placeholder" /></Field>
            <Button variant="outline">Rotate Key</Button>
          </CardContent>
        </Card>
        <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
          <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
          <CardContent>
            <SimpleSelect value="Light" onValueChange={() => null} options={["Light", "Dark"]} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ProductHome() {
  const navigate = useNavigate()
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ProductCard title="TrustAI-X" description="AI model evaluation for LLM and ML systems." icon={BrainCircuit} onClick={() => navigate("/responsible-ui/trustai-x")} />
      <ProductCard title="TrustAI-UX" description="AI agent evaluation with log and API analysis." icon={Workflow} onClick={() => navigate("/responsible-ui/trustai-ux")} />
    </div>
  )
}

function ProductCard({
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
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#faeab1] text-[#305669]"><Icon className="h-6 w-6" /></div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onClick} className="bg-[#305669] text-white hover:bg-[#244455]">Enter Product<ArrowRight className="h-4 w-4" /></Button>
      </CardContent>
    </Card>
  )
}

export default function ProductSuiteView() {
  const location = useLocation()
  const [message, setMessage] = React.useState("")
  const mode = routeMode(location.pathname)

  const notify = (nextMessage: string) => {
    setMessage(nextMessage)
    window.setTimeout(() => setMessage(""), 2400)
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {mode === "x" && <TrustAiX notify={notify} />}
      {mode === "ux" && <TrustAiUx notify={notify} />}
      {mode === "reports" && <ReportsPage />}
      {mode === "settings" && <SettingsPage />}
      {mode === "home" && <ProductHome />}
      <Toast message={message} />
    </div>
  )
}
