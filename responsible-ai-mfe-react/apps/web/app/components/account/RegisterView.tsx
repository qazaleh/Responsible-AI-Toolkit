import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { apiClient } from "../../lib/apiClient"

interface RegistrationPayload {
  login: string
  email: string
  password: string
  confirmPassword: string
  langKey: string
}

export default function RegisterView() {
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState("")
  const [registration, setRegistration] = React.useState<RegistrationPayload>({
    login: "",
    email: "",
    password: "",
    confirmPassword: "",
    langKey: "en",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegistration({ ...registration, [e.target.name]: e.target.value })
  }

  const handleRegister = async () => {
    setLoading(true)
    setSuccess(false)
    setError("")

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(registration.email)) {
      setError("Please enter a valid email address.")
      setLoading(false)
      return
    }
    if (registration.password.length < 8) {
      setError("Password must be at least 8 characters long.")
      setLoading(false)
      return
    }
    if (registration.password !== registration.confirmPassword) {
      setError("Password and confirm password do not match.")
      setLoading(false)
      return
    }

    try {
      await apiClient("/register", {
        service: "backend",
        method: "POST",
        body: JSON.stringify({
          login: registration.login,
          email: registration.email,
          password: registration.password,
          langKey: registration.langKey,
        }),
      })
      setSuccess(true)
      setRegistration({ login: "", email: "", password: "", confirmPassword: "", langKey: "en" })
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check your details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-slate-800 bg-slate-900/30 text-slate-100 max-w-xl">
      <CardHeader>
        <CardTitle className="text-lg">Register New Account</CardTitle>
        <CardDescription className="text-slate-400">Create an account to access TrustAI tools</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {success && <div className="text-emerald-400 text-sm">Registration successful! Please check your email.</div>}
        {error && <div className="text-red-400 text-sm">{error}</div>}
        
        <div className="space-y-2">
          <Label className="text-xs text-slate-300">Login Username</Label>
          <Input 
            name="login" 
            value={registration.login} 
            onChange={handleChange}
            className="bg-slate-950 border-slate-800 text-slate-200" 
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-slate-300">Email Address</Label>
          <Input 
            name="email" 
            type="email"
            value={registration.email} 
            onChange={handleChange}
            className="bg-slate-950 border-slate-800 text-slate-200" 
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-slate-300">Password</Label>
          <Input 
            name="password" 
            type="password"
            value={registration.password} 
            onChange={handleChange}
            className="bg-slate-950 border-slate-800 text-slate-200" 
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-slate-300">Confirm Password</Label>
          <Input
            name="confirmPassword"
            type="password"
            value={registration.confirmPassword}
            onChange={handleChange}
            className="bg-slate-950 border-slate-800 text-slate-200"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleRegister} disabled={loading} className="bg-indigo-600 text-white hover:bg-indigo-500">
          {loading ? "Registering..." : "Register Account"}
        </Button>
      </CardFooter>
    </Card>
  )
}
