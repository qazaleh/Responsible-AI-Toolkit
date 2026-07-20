import * as React from "react"
import { useNavigate } from "react-router"
import { LucideUserPlus, LucideMail, LucideLock, LucideUserCheck } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

export default function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [isSuccess, setIsSuccess] = React.useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }
    // Simulate successful registration
    setIsSuccess(true)
    setTimeout(() => {
      navigate("/login")
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center bg-[#faf7f0] p-6">
        <Card className="w-full max-w-md border-emerald-500/20 bg-[#fffdf8] text-[#0f2b2c] shadow-2xl backdrop-blur-xl text-center p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-4">
            <LucideUserCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold text-[#0f2b2c]">Registration Complete</CardTitle>
          <CardDescription className="text-[#305669]/60 text-xs mt-2">
            Your TrustAI account has been successfully created. Redirecting to sign in...
          </CardDescription>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center bg-[#faf7f0] p-6">
      <Card className="w-full max-w-md border-[#e6dece] bg-[#fffdf8] text-[#0f2b2c] shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <LucideUserPlus className="h-5 w-5 text-[#305669]" />
            <span>Create Account</span>
          </CardTitle>
          <CardDescription className="text-[#305669]/60 text-xs">
            Join the TrustAI Responsible AI governance toolkit
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-[#174143]">Username</Label>
              <Input
                placeholder="E.g., expert_user"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-9 bg-[#faf7f0] border-[#e6dece] text-[#0f2b2c]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-[#174143]">Email Address</Label>
              <Input
                type="email"
                placeholder="E.g., user@trustai.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 bg-[#faf7f0] border-[#e6dece] text-[#0f2b2c]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-[#174143]">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 bg-[#faf7f0] border-[#e6dece] text-[#0f2b2c]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-[#174143]">Confirm Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-9 bg-[#faf7f0] border-[#e6dece] text-[#0f2b2c]"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full h-9.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium">
              Create TrustAI Account
            </Button>
            <div className="text-center text-xs text-[#305669]/70">
              Already have an account?{" "}
              <button type="button" onClick={() => navigate("/login")} className="text-[#305669] hover:underline">
                Sign In
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
