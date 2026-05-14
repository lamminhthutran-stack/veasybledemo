import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  function handleLoginSubmit() {
    if (!phone.trim()) return;
    // Mock verification
    setLoggedIn(true);
  }

  function handlePortalSelect(portal: "executor" | "ops") {
    login("Nguyễn Minh Tuấn"); // demo: hardcode name
    navigate({ to: portal === "executor" ? "/executor/home" : "/ops/dashboard" });
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-3xl font-bold text-[#1A3557]">Veasyble</p>
          <p className="text-gray-400 text-sm mt-1">Executor Portal</p>
        </div>

        {loggedIn ? (
          <PortalSelect onSelect={handlePortalSelect} />
        ) : (
          <div className="bg-white rounded-[5px] p-6 shadow-sm border border-gray-100 space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1.5">
                {t("phone_label") ?? "Số điện thoại"}
              </p>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="0901 234 567"
                className="w-full bg-gray-50 border border-gray-200 rounded-[5px] px-3 py-2.5 text-sm outline-none"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1.5">
                {t("password_label") ?? "Mật khẩu"}
              </p>
              <input
                type="password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                placeholder="••••••••"
                onKeyDown={e => e.key === "Enter" && handleLoginSubmit()}
                className="w-full bg-gray-50 border border-gray-200 rounded-[5px] px-3 py-2.5 text-sm outline-none"
              />
            </div>
            <button
              onClick={handleLoginSubmit}
              className="w-full bg-[#1A3557] text-white text-sm font-semibold py-3 rounded-[5px]"
            >
              {t("login_btn") ?? "Đăng nhập"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PortalSelect({ onSelect }: { onSelect: (portal: "executor" | "ops") => void }) {
  return (
    <div className="space-y-3 mt-4">
      <p className="text-xs text-center text-gray-400 font-medium">Chọn portal</p>
      <button onClick={() => onSelect("executor")}
        className="w-full flex items-center gap-3 bg-white border border-gray-200 rounded-[5px] px-4 py-3 hover:border-[#1A3557] transition-colors">
        <span className="text-xl">📱</span>
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-900">Executor Portal</p>
          <p className="text-[10px] text-gray-400">App & Web</p>
        </div>
      </button>
      <button onClick={() => onSelect("ops")}
        className="w-full flex items-center gap-3 bg-[#1A3557] rounded-[5px] px-4 py-3 hover:bg-[#162d47] transition-colors">
        <span className="text-xl">💻</span>
        <div className="text-left">
          <p className="text-sm font-semibold text-white">Veasyble Ops</p>
          <p className="text-[10px] text-white/50">Web only</p>
        </div>
      </button>
    </div>
  );
}
