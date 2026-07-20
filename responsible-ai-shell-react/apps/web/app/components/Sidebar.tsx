import { NavLink, useNavigate } from "react-router"
import {
  BrainCircuit,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Workflow,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard, end: true },
  { label: "TrustAI-X", path: "/responsible-ui/trustai-x", icon: BrainCircuit },
  { label: "TrustAI-UX", path: "/responsible-ui/trustai-ux", icon: Workflow },
  { label: "Reports", path: "/responsible-ui/reports", icon: FileText },
  { label: "Settings", path: "/account/settings", icon: Settings },
]

export function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    navigate("/login")
  }

  return (
    <aside className="hidden min-h-svh w-64 shrink-0 border-r border-[#e6dece] bg-[#fffdf8] lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-[#e6dece] px-5">
        <img src="/logo.png" alt="TrustAI" className="h-11 w-auto rounded-sm object-contain" />
        <div className="min-w-0">
          <div className="text-xs font-medium text-[#305669]">Evaluation Platform</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#faeab1] text-[#0f2b2c]"
                  : "text-[#305669] hover:bg-[#faf7f0] hover:text-[#0f2b2c]"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[#e6dece] p-3">
        <button
          onClick={handleLogout}
          className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-[#305669] transition-colors hover:bg-[#faeab1] hover:text-[#0f2b2c]"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
