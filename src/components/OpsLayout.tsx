import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth";
import { LangToggle } from "@/lib/i18n-context";

export function OpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <OpsSidebar />
      <main className="flex-1 ml-56 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-end sticky top-0 z-20">
          <LangToggle />
        </header>
        <div className="p-8 max-w-6xl w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

function OpsSidebar() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: "/ops/dashboard",   label: t("nav_dashboard"),         icon: "" },
    { to: "/ops/escalations", label: t("nav_escalations"),  icon: "" },
    { to: "/ops/submissions", label: t("nav_submissions"),  icon: "" },
    { to: "/ops/campaigns",   label: t("nav_campaigns"),  icon: "" },
    { to: "/ops/execution",   label: t("nav_execution"),    icon: "" },
    { to: "/ops/executors",   label: t("nav_executors"),  icon: "" },
  ];

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-[#1A3557] flex flex-col py-8 px-4 z-30">
      {/* Logo */}
      <div className="mb-8 px-2">
        <p className="text-lg font-bold text-white">Veasyble</p>
        <p className="text-[10px] text-white/50">{t("ops_portal")}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(item => {
          const isActive = pathname.startsWith(item.to);
          return (
            <Link key={item.to} to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[5px] text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-[5px] transition-colors font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          {t("logout")}
        </button>
      </div>
    </aside>
  );
}
