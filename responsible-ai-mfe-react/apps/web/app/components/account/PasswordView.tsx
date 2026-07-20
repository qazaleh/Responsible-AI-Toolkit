import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { apiClient } from "../../lib/apiClient"

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function PasswordView() {
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState("")
  const [passwords, setPasswords] = React.useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setLoading(true)
    setSuccess(false)
    setError("")

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New password and confirm password do not match.")
      setLoading(false)
      return
    }

    try {
      await apiClient("/account/change-password", {
        service: "backend",
        method: "POST",
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      })
      setSuccess(true)
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err: any) {
      setError(err.message || "Failed to update password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-slate-800 bg-slate-900/30 text-slate-100 max-w-xl">
      <CardHeader>
        <CardTitle className="text-lg">Change Password</CardTitle>
        <CardDescription className="text-slate-400">Update your account password</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {success && <div className="text-emerald-400 text-sm">Password updated successfully.</div>}
        {error && <div className="text-red-400 text-sm">{error}</div>}
        
        <div className="space-y-2">
          <Label className="text-xs text-slate-300">Current Password</Label>
          <Input 
            name="currentPassword" 
            type="password"
            value={passwords.currentPassword} 
            onChange={handleChange}
            className="bg-slate-950 border-slate-800 text-slate-200" 
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-slate-300">New Password</Label>
          <Input 
            name="newPassword" 
            type="password"
            value={passwords.newPassword} 
            onChange={handleChange}
            className="bg-slate-950 border-slate-800 text-slate-200" 
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-slate-300">Confirm New Password</Label>
          <Input 
            name="confirmPassword" 
            type="password"
            value={passwords.confirmPassword} 
            onChange={handleChange}
            className="bg-slate-950 border-slate-800 text-slate-200" 
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={loading} className="bg-indigo-600 text-white hover:bg-indigo-500">
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </CardFooter>
    </Card>
  )
}
