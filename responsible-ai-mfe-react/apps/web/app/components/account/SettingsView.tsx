import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { apiClient } from "../../lib/apiClient"

interface AccountSettings {
  firstName: string
  lastName: string
  email: string
}

export default function SettingsView() {
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState("")
  const [account, setAccount] = React.useState<AccountSettings>({
    firstName: "",
    lastName: "",
    email: "",
  })

  React.useEffect(() => {
    apiClient<any>("/account", { service: "backend" })
      .then(data => {
        if (data) {
          setAccount({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
          })
        }
      })
      .catch(err => console.warn("Failed to load account", err))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccount({ ...account, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setLoading(true)
    setSuccess(false)
    setError("")
    try {
      await apiClient("/account", {
        service: "backend",
        method: "POST",
        body: JSON.stringify(account),
      })
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to update settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-slate-800 bg-slate-900/30 text-slate-100 max-w-2xl">
      <CardHeader>
        <CardTitle className="text-lg">Account Settings</CardTitle>
        <CardDescription className="text-slate-400">Update your profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {success && <div className="text-emerald-400 text-sm">Settings saved successfully.</div>}
        {error && <div className="text-red-400 text-sm">{error}</div>}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-slate-300">First Name</Label>
            <Input 
              name="firstName" 
              value={account.firstName} 
              onChange={handleChange}
              className="bg-slate-950 border-slate-800 text-slate-200" 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-slate-300">Last Name</Label>
            <Input 
              name="lastName" 
              value={account.lastName} 
              onChange={handleChange}
              className="bg-slate-950 border-slate-800 text-slate-200" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-slate-300">Email Address</Label>
          <Input 
            name="email" 
            type="email" 
            value={account.email} 
            onChange={handleChange}
            className="bg-slate-950 border-slate-800 text-slate-200" 
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={loading} className="bg-indigo-600 text-white hover:bg-indigo-500">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  )
}
