import * as React from "react"
import { Outlet } from "react-router"

export default function AdminLayout() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-white">Administration</h1>
      <div className="p-6 border border-slate-800 rounded-lg bg-slate-900/50">
        <p className="text-[#305669]/60">Admin module content goes here (User Management, Health, Metrics, etc.)</p>
      </div>
      <Outlet />
    </div>
  )
}
