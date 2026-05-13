import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ClipboardCheck, LayoutDashboard, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Veasyble" }] }),
  component: LoginPage,
});

type Role = "executor" | "ops" | null;

function LoginPage() {
  const [role, setRole] = useState<Role>(null);
  const [lang, setLang] = useState<"VI" | "EN">("EN");
  const nav = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "executor") nav({ to: "/executor/home" });
    else if (role === "ops") nav({ to: "/ops/dashboard" });
  };

  return (
    <div className="min-h-screen bg-navy text-navy-foreground flex flex-col">
      <div className="flex justify-end p-4 gap-1 text-xs">
        {(["VI", "EN"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-2 py-1 rounded ${lang === l ? "bg-white/20" : "opacity-70 hover:opacity-100"}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight">Veasyble</h1>
            <p className="text-sm text-white/70 mt-1">Making Retail Visibility Easy</p>
          </div>

          {!role ? (
            <div className="space-y-3">
              <p className="text-center text-white/80 text-sm mb-2">Choose your role to continue</p>
              <RoleCard
                icon={<ClipboardCheck className="w-7 h-7" />}
                title="Execution Team"
                desc="Gig workers running campaigns on the ground"
                onClick={() => setRole("executor")}
              />
              <RoleCard
                icon={<LayoutDashboard className="w-7 h-7" />}
                title="Veasyble Ops"
                desc="Internal team monitoring the network"
                onClick={() => setRole("ops")}
              />
            </div>
          ) : (
            <form onSubmit={submit} className="bg-white text-foreground rounded-2xl p-6 shadow-xl">
              <button
                type="button"
                onClick={() => setRole(null)}
                className="text-xs text-muted-foreground flex items-center gap-1 mb-4 hover:text-foreground"
              >
                <ArrowLeft className="w-3 h-3" /> Change role
              </button>
              <h2 className="font-semibold text-lg mb-4">
                Sign in as {role === "executor" ? "Executor" : "Ops"}
              </h2>
              <label className="block text-xs font-medium mb-1">Email</label>
              <input
                type="email"
                required
                defaultValue={role === "executor" ? "khoa@veasyble.vn" : "linh@veasyble.vn"}
                className="w-full border border-border rounded-md px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
              />
              <label className="block text-xs font-medium mb-1">Password</label>
              <input
                type="password"
                required
                defaultValue="demo1234"
                className="w-full border border-border rounded-md px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
              />
              <button
                type="submit"
                className="w-full bg-orange text-orange-foreground font-semibold rounded-md py-2.5 hover:opacity-90 transition"
              >
                Login
              </button>
              <Link to="/login" className="block text-center text-xs text-muted-foreground mt-3 hover:text-foreground">
                Forgot password?
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function RoleCard({ icon, title, desc, onClick }: { icon: React.ReactNode; title: string; desc: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl p-4 flex items-center gap-4 text-left transition"
    >
      <div className="w-12 h-12 rounded-lg bg-orange text-orange-foreground flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-white/70">{desc}</div>
      </div>
    </button>
  );
}
