import React from "react";
import { Link } from "react-router-dom";

const items = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/blogs", label: "Blogs" },
  { to: "/admin/disposals", label: "Disposal Requests" },
  { to: "/admin/analytics", label: "Analytics" },
  { to: "/admin/stats", label: "Stats" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r shadow-sm">
      <div className="p-4 border-b flex items-center gap-2">
        <Link to="/admin" className="text-lg font-bold text-emerald-600">
          EcoWise
        </Link>
        <span className="text-xs text-slate-400">Admin</span>
      </div>

      <nav className="p-4 space-y-1">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className="block px-3 py-2 rounded hover:bg-slate-100 text-slate-700"
          >
            {it.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
