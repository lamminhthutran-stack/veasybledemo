import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";
import { LangToggle } from "@/lib/i18n-context";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

type PortalType = "executor" | "ops" | null;

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [portal, setPortal] = useState<PortalType>(null);
  const [email, setEmail] = useState("demo@veasyble.com");
  const [password, setPassword] = useState("");

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    if (email !== "demo@veasyble.com" && !password.trim()) return;
    
    // Mock login logic
    if (portal === "executor") {
      import("@/lib/academy-data").then(({ completeAcademyForDemo }) => {
        if (email === "demo@veasyble.com") {
          completeAcademyForDemo();
        }
        login("Nguyễn Minh Khoa");
        navigate({ to: "/executor/home" });
      });
    } else {
      login("Linh Trần");
      navigate({ to: "/ops/dashboard" });
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center px-6 relative">
      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 z-10">
        <LangToggle />
      </div>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-3xl font-bold text-[#1A3557]">Veasyble</p>
        </div>

        {!portal ? (
          <div className="space-y-3">
            <p className="text-xs text-center text-gray-400 font-medium mb-4 uppercase tracking-wide">
              {t("select_portal") ?? "Select Portal"}
            </p>
            <button
              onClick={() => setPortal("executor")}
              className="w-full flex items-center gap-3 bg-white border border-gray-200 rounded-[5px] px-4 py-4 hover:border-[#F97316] transition-colors"
            >
              <span className="text-2xl"></span>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Execution Team</p>
                <p className="text-[10px] text-gray-400">Mobile App (Web Demo)</p>
              </div>
            </button>
            <button
              onClick={() => setPortal("ops")}
              className="w-full flex items-center gap-3 bg-[#1A3557] rounded-[5px] px-4 py-4 hover:bg-[#162d47] transition-colors shadow-sm"
            >
              <span className="text-2xl"></span>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">Veasyble Ops</p>
                <p className="text-[10px] text-white/50">Desktop Dashboard</p>
              </div>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-[5px] p-6 shadow-sm border border-gray-100 space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  {t("email_label") ?? "Email"}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-[5px] px-3 py-2.5 text-sm outline-none focus:border-[#F97316]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  {t("password_label") ?? "Password"}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-[5px] px-3 py-2.5 text-sm outline-none focus:border-[#F97316]"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPortal(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-[5px] hover:bg-gray-200 transition-colors"
                >
                  {t("back") ?? "Back"}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#F97316] text-white text-sm font-semibold py-2.5 rounded-[5px] hover:bg-[#ea580c] transition-colors shadow-sm"
                >
                  {t("login_btn") ?? "Login"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
