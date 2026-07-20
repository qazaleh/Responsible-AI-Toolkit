import * as React from "react"
import { Link, useLocation, useNavigate } from "react-router"
import {
  Bell,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  User,
  Workflow,
  BrainCircuit,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

function titleFromPath(pathname: string) {
  if (pathname.includes("trustai-x")) return "TrustAI-X"
  if (pathname.includes("trustai-ux")) return "TrustAI-UX"
  if (pathname.includes("reports")) return "Reports"
  if (pathname.includes("settings")) return "Settings"
  return "Dashboard"
}

const mobileLinks = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "TrustAI-X", path: "/responsible-ui/trustai-x", icon: BrainCircuit },
  { label: "TrustAI-UX", path: "/responsible-ui/trustai-ux", icon: Workflow },
  { label: "Reports", path: "/responsible-ui/reports", icon: FileText },
  { label: "Settings", path: "/account/settings", icon: Settings },
]

export function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center justify-between border-b border-[#e6dece] bg-[#fffdf8]/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="border-[#e6dece] bg-[#fffdf8] text-[#305669] lg:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {mobileLinks.map((item) => (
              <DropdownMenuItem key={item.path} asChild>
                <Link to={item.path} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div>
          <h1 className="text-base font-semibold text-[#0f2b2c] sm:text-lg">{titleFromPath(location.pathname)}</h1>
          <p className="hidden text-xs text-[#305669] sm:block">Responsible AI evaluation and reporting workspace</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="outline" size="icon" className="border-[#e6dece] bg-[#fffdf8] text-[#305669] hover:bg-[#faeab1]">
          <Bell className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 gap-2 border-[#e6dece] bg-[#fffdf8] px-3 text-[#305669] hover:bg-[#faeab1]">
              <User className="h-4 w-4" />
              <span className="hidden text-sm font-medium sm:inline">Account</span>
              <ChevronDown className="h-4 w-4 text-[#305669]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="space-y-1">
                <p className="text-sm font-medium">TrustAI User</p>
                <p className="text-xs text-[#305669]/70">Managed by backend</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/account/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/")}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
