import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { LayoutDashboard, Inbox, Users, Megaphone, Settings, Bell } from "lucide-react";
import { ops } from "@/lib/mock-data";

export const Route = createFileRoute("/ops")({
  component: OpsLayout,
});

const navItems = [
  { to: "/ops/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/ops/queue", label: "Queue", icon: Inbox },
  { to: "/ops/executors", label: "Executors", icon: Users },
  { to: "/ops/campaigns", label: "Campaigns", icon: Megaphone },
];

function OpsLayout() {
  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="w-60 bg-navy text-navy-foreground flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="font-bold text-lg">Veasyble</div>
          <div className="text-[10px] text-white/60">Ops Console</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/80 hover:bg-white/10"
              activeProps={{ className: "flex items-center gap-3 px-3 py-2 rounded-md text-sm bg-orange text-orange-foreground font-semibold" }}
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <Link to="/login" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/80 hover:bg-white/10">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-background border-b border-border px-6 py-3 flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">Good morning, {ops.name}</div>
            <div className="text-xs text-muted-foreground">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange rounded-full" />
            </div>
            <div className="w-9 h-9 rounded-full bg-navy text-navy-foreground flex items-center justify-center text-xs font-bold">LT</div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
