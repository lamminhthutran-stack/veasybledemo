import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { Home, ListChecks, User, Bell } from "lucide-react";

export const Route = createFileRoute("/executor")({
  component: ExecutorLayout,
});

function ExecutorLayout() {
  const loc = useLocation();
  const onTask = loc.pathname.startsWith("/executor/task");
  const onAcademy = loc.pathname.startsWith("/executor/academy");
  const onSetup = loc.pathname.startsWith("/executor/profile/setup");
  const hideChrome = onTask || onAcademy || onSetup;

  return (
    <div className="min-h-screen bg-surface flex justify-center">
      <div className="w-full max-w-[390px] bg-background min-h-screen flex flex-col relative shadow-xl">
        {!hideChrome && (
          <header className="sticky top-0 z-10 bg-navy text-navy-foreground px-4 py-3 flex items-center justify-between">
            <Link to="/executor/home" className="font-bold tracking-tight">Veasyble</Link>
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" />
              <Link to="/executor/profile" className="w-8 h-8 rounded-full bg-orange flex items-center justify-center text-xs font-bold">
                NK
              </Link>
            </div>
          </header>
        )}

        <main className={`flex-1 ${hideChrome ? "" : "pb-20"}`}>
          <Outlet />
        </main>

        {!hideChrome && (
          <nav className="fixed bottom-0 left-0 right-0 mx-auto max-w-[390px] bg-background border-t border-border flex">
            <NavItem to="/executor/home" icon={<Home className="w-5 h-5" />} label="Home" />
            <NavItem to="/executor/browse" icon={<ListChecks className="w-5 h-5" />} label="Tasks" />
            <NavItem to="/executor/profile" icon={<User className="w-5 h-5" />} label="Profile" />
          </nav>
        )}
      </div>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex-1 py-3 flex flex-col items-center gap-0.5 text-[11px] text-muted-foreground"
      activeProps={{ className: "flex-1 py-3 flex flex-col items-center gap-0.5 text-[11px] text-orange font-semibold" }}
    >
      {icon}
      {label}
    </Link>
  );
}
