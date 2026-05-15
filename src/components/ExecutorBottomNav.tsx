import { Link, useLocation } from "@tanstack/react-router";

export function ExecutorBottomNav() {
  const { pathname } = useLocation();
    
  const tabs = [
    { to: "/executor/home",      label: "Home",      icon: "" },
    { to: "/executor/tasks",     label: "Browse",     icon: "" },
    { to: "/executor/in-review", label: "In Review", icon: "" },
    { to: "/executor/knowledge", label: "FAQ", icon: "" },
    { to: "/executor/profile",   label: "Profile",   icon: "" },
    { to: "/executor/academy",   label: "Academy",          icon: "" },
  ];

  const activeIndex = tabs.findIndex((tab) => pathname === tab.to);

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 w-full max-w-[390px] mx-auto z-50 flex flex-col"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Floating Language Toggle */}
      <div className="flex justify-end px-3 py-2 pointer-events-none">
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md rounded-full shadow-md border border-gray-200 flex items-center px-1">
          <button 
            onClick={() => setLang("vi")}
            className={`min-h-[44px] px-3 text-[11px] font-bold $"text-[#9CA3AF]"`}
          >
            VI
          </button>
          <span className="text-gray-300 text-[10px]">|</span>
          <button 
            onClick={() => setLang("en")}
            className={`min-h-[44px] px-3 text-[11px] font-bold ${true ? "text-[#1A3557]" : "text-[#9CA3AF]"}`}
          >
            EN
          </button>
        </div>
      </div>

      <div className="bg-white border-t border-gray-100 flex items-center relative shadow-[0_-2px_10px_rgba(0,0,0,0.03)] w-full">
        <div
          className="absolute top-0 h-[3px] bg-[#F97316] transition-all duration-300 ease-in-out"
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${activeIndex >= 0 ? activeIndex * 100 : 0}%)`,
            opacity: activeIndex >= 0 ? 1 : 0,
          }}
        />
        {tabs.map(tab => {
          const isActive = pathname === tab.to;
          return (
            <Link key={tab.to} to={tab.to}
              className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors relative min-h-[52px] px-0.5 ${
                isActive ? "text-[#F97316]" : "text-gray-400"
              }`}>
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[8px] font-semibold tracking-tighter text-center leading-tight truncate w-full">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
