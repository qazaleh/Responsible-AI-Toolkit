import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { LogEvaluationTab } from "./tabs/LogEvaluationTab"
import { OverviewTab } from "./tabs/OverviewTab"
import { ReportsTab } from "./tabs/ReportsTab"
import { ResultsTab } from "./tabs/ResultsTab"
import { RulesPoliciesTab } from "./tabs/RulesPoliciesTab"
import { RuntimeConnectorTab } from "./tabs/RuntimeConnectorTab"
import { SchemaMappingTab } from "./tabs/SchemaMappingTab"

export type UxTab = "overview" | "log-evaluation" | "schema-mapping" | "runtime-connector" | "results" | "reports" | "rules"

const TAB_LABELS: Record<UxTab, string> = {
  overview: "Overview",
  "log-evaluation": "Log Evaluation",
  "schema-mapping": "Schema Mapping",
  "runtime-connector": "Runtime Connector",
  results: "Results",
  reports: "Reports",
  rules: "Rules / Policies"
}

const TAB_ORDER: UxTab[] = ["overview", "log-evaluation", "schema-mapping", "runtime-connector", "results", "reports", "rules"]

export default function TrustAiUxApp() {
  const [activeTab, setActiveTab] = React.useState<UxTab>("overview")

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as UxTab)} className="space-y-5">
      <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-lg bg-[#faeab1] p-1">
        {TAB_ORDER.map((tab) => (
          <TabsTrigger key={tab} value={tab} className="h-9 px-3">
            {TAB_LABELS[tab]}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab onNavigate={setActiveTab} />
      </TabsContent>
      <TabsContent value="log-evaluation">
        <LogEvaluationTab onNavigate={setActiveTab} />
      </TabsContent>
      <TabsContent value="schema-mapping">
        <SchemaMappingTab />
      </TabsContent>
      <TabsContent value="runtime-connector">
        <RuntimeConnectorTab />
      </TabsContent>
      <TabsContent value="results">
        <ResultsTab />
      </TabsContent>
      <TabsContent value="reports">
        <ReportsTab />
      </TabsContent>
      <TabsContent value="rules">
        <RulesPoliciesTab />
      </TabsContent>
    </Tabs>
  )
}
