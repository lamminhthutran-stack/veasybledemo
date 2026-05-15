import { Link, useLocation } from "@tanstack/react-router";
import { DeviceToggle } from "@/lib/device";
import { LogoutButton } from "./LogoutButton";

export function ExecutorSidebar() {
  const { pathname } = useLocation();

  const navItems = [
    { to: "/executor/home", label: "Home", icon: "" },
    { to: "/executor/tasks", label: "Browse", icon: "" },
    { to: "/executor/knowledge", label: "FAQ", icon: "" },
    { to: "/executor/profile", label: "Profile", icon: "" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-white border-r border-gray-100 flex flex-col py-8 px-4 z-30">
      {/* Logo */}
      <div className="mb-8 px-2">
        <p className="text-lg font-bold text-[#1A3557]">Veasyble</p>
        <p className="text-[10px] text-gray-400">"Executor Portal"</p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[5px] text-sm font-medium transition-colors ${
                isActive ? "bg-[#1A3557] text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: toggles + logout */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between px-2">
          <DeviceToggle />
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
