import * as React from "react"
import { useNavigate } from "react-router"
import { ArrowRight, Lock, ShieldCheck, User } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState("")
  const [serverUrl, setServerUrl] = React.useState("http://localhost:30019/v1/rai/backend")

  React.useEffect(() => {
    setServerUrl((window as any)._env_?.SERVER_API_URL || "http://localhost:30019/v1/rai/backend")
    const token = localStorage.getItem("jhi-authenticationToken") || sessionStorage.getItem("jhi-authenticationToken")
    if (token) navigate("/")
  }, [navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setErrorMsg("Enter a username and password.")
      return
    }

    setIsLoading(true)
    setErrorMsg("")

    try {
      const response = await fetch(`${serverUrl}/authenticate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, cred: password, rememberMe: true }),
      })

      if (!response.ok) throw new Error("Invalid credentials")

      const resData = await response.json()
      const token = resData.id_token || resData.token || "trustai-session"
      localStorage.setItem("jhi-authenticationToken", token)
      localStorage.setItem("userid", JSON.stringify(username))

      const userDetails = await fetch(`${serverUrl}/account`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .catch(() => ({ authorities: ["ROLE_ADMIN"] }))

      localStorage.setItem("role", JSON.stringify(userDetails.authorities?.[0] || "ROLE_ADMIN"))
      navigate("/")
    } catch {
      setErrorMsg("Authentication failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-[#faeab1] px-4 py-10">
      <Card className="w-full max-w-[420px] border-[#e6dece] bg-[#fffdf8] shadow-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#305669] text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold text-[#0f2b2c]">TrustAI</CardTitle>
            <CardDescription className="mt-1 text-[#305669]/70">
              Sign in to the evaluation platform
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-[#305669]/60" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-10 border-[#e6dece] bg-[#fffdf8] pl-9"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#305669]/60" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 border-[#e6dece] bg-[#fffdf8] pl-9"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="h-10 w-full bg-[#305669] text-white hover:bg-[#244455]">
              {isLoading ? "Signing in..." : "Login"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
