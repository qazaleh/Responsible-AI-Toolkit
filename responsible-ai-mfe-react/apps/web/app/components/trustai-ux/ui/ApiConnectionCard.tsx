import * as React from "react"
import { Plug, Radio } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"

const AUTH_METHODS = ["API Key", "Bearer Token", "OAuth 2.0", "None"]

export function ApiConnectionCard() {
  const [authMethod, setAuthMethod] = React.useState("API Key")
  const [connected, setConnected] = React.useState(false)

  return (
    <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="h-5 w-5 text-[#305669]" />
          Start Runtime Evaluation
        </CardTitle>
        <CardDescription>Connect an agent API to run controlled test scenarios and observe live behavior.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#174143]">API Endpoint</Label>
          <Input placeholder="https://api.example.com/agent/invoke" className="h-10 border-[#e6dece] bg-[#fffdf8]" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#174143]">Auth Method</Label>
            <Select value={authMethod} onValueChange={setAuthMethod}>
              <SelectTrigger className="h-10 w-full border-[#e6dece] bg-[#fffdf8]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AUTH_METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#174143]">Credential / Token</Label>
            <Input type="password" placeholder="••••••••" className="h-10 border-[#e6dece] bg-[#fffdf8]" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#174143]">Sample Request / Response</Label>
          <textarea
            rows={4}
            placeholder={'{"input": "..."} → {"output": "...", "toolCalls": [...]}'}
            className="w-full rounded-lg border border-[#e6dece] bg-[#fffdf8] px-3 py-2 text-sm text-[#0f2b2c] outline-none placeholder:text-[#305669]/50 focus-visible:border-[#305669] focus-visible:ring-2 focus-visible:ring-[#305669]/20"
          />
        </div>

        <Button
          className="h-10 w-full bg-[#305669] text-white hover:bg-[#244455]"
          onClick={() => setConnected(true)}
        >
          <Plug className="h-4 w-4" />
          {connected ? "Agent API Configured" : "Configure Agent API"}
        </Button>
      </CardContent>
    </Card>
  )
}
