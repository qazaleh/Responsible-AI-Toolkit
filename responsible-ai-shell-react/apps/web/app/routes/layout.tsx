import * as React from "react"
import { Outlet, useNavigate } from "react-router"
import { Navbar } from "../components/Navbar"
import { Sidebar } from "../components/Sidebar"

export default function Layout() {
  const navigate = useNavigate()
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    const token = localStorage.getItem("jhi-authenticationToken") || sessionStorage.getItem("jhi-authenticationToken")
    if (!token) {
      navigate("/login")
    } else {
      setIsReady(true)
    }
  }, [navigate])

  if (!isReady) {
    return (
      <div className="flex h-svh w-full items-center justify-center bg-[#faf7f0] text-[#305669]">
        <div className="animate-pulse font-medium">Securing session...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full overflow-x-hidden bg-[#faf7f0] text-[#0f2b2c]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
      <Navbar />
        <main className="flex-1 w-full overflow-y-auto bg-[#faf7f0] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
