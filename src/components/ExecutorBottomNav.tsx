import { Link, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function ExecutorBottomNav() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const tabs = [
    { to: "/executor/home",      label: t("nav_home"),    icon: "🏠" },
    { to: "/executor/tasks",     label: t("nav_tasks"),   icon: "📋" },
    { to: "/executor/knowledge", label: t("nav_sml"),     icon: "💬" },
    { to: "/executor/profile",   label: t("nav_profile"), icon: "👤" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto bg-white border-t border-gray-100 flex z-30 pb-safe">
      {tabs.map(tab => {
        const isActive = pathname === tab.to;
        return (
          <Link key={tab.to} to={tab.to}
            className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors ${
              isActive ? "text-[#F97316]" : "text-gray-400"
            }`}>
            <span className="text-lg">{tab.icon}</span>
            <span className="text-[9px] font-semibold">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
