import * as React from "react"
import { KeyRound, Mail, Palette, Settings as SettingsIcon, User } from "lucide-react"
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

export default function Settings() {
  const [email, setEmail] = React.useState("trustai.user@example.com")
  const [name, setName] = React.useState("TrustAI User")

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      <div>
        <p className="text-sm font-medium text-[#305669]">Settings</p>
        <h2 className="mt-1 text-2xl font-semibold text-[#0f2b2c]">Workspace Settings</h2>
        <p className="mt-2 text-sm text-[#305669]">Manage profile, password, API keys, and theme preferences.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#305669]" />
              User Profile
            </CardTitle>
            <CardDescription>Basic user details managed by the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="h-10 border-[#e6dece] bg-[#fffdf8]" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#305669]/60" />
                <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 border-[#e6dece] bg-[#fffdf8] pl-9" />
              </div>
            </div>
            <Button className="bg-[#305669] text-white hover:bg-[#244455]">Save Profile</Button>
          </CardContent>
        </Card>

        <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-[#305669]" />
              API Keys
            </CardTitle>
            <CardDescription>Optional keys for model and agent integrations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Evaluation API Key</Label>
              <Input type="password" defaultValue="trustai-key-placeholder" className="h-10 border-[#e6dece] bg-[#fffdf8]" />
            </div>
            <Button variant="outline" className="border-[#e6dece]">Rotate Key</Button>
          </CardContent>
        </Card>

        <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-[#305669]" />
              Theme
            </CardTitle>
            <CardDescription>Light mode is the default enterprise workspace theme.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select defaultValue="Light">
              <SelectTrigger className="h-10 w-full border-[#e6dece] bg-[#fffdf8]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Light">Light</SelectItem>
                <SelectItem value="Dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="border-[#e6dece] bg-[#fffdf8] shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-[#305669]" />
              Preferences
            </CardTitle>
            <CardDescription>Notification and report preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[#305669]">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#305669]" />
              Email me when reports are ready
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#305669]" />
              Show success and error notifications
            </label>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
