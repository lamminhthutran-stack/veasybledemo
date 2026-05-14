import { Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { modules, getProgress, isUnlocked, completedCount } from "@/lib/academy-data";


export const Route = createFileRoute("/executor/academy")({
  component: AcademyLayout,
});

function AcademyLayout() {
  const loc = useLocation();
  const isRoot = loc.pathname === "/executor/academy" || loc.pathname === "/executor/academy/";

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-navy text-navy-foreground px-4 py-3 flex items-center gap-3">
        {!isRoot && (
          <Link to="/executor/academy" className="opacity-80 hover:opacity-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        )}
        <div>
          <div className="font-bold tracking-tight leading-none">Veasyble</div>
          <div className="text-[10px] text-white/70">Academy</div>
        </div>
      </header>
      <main className="flex-1 pb-8">
        {isRoot ? <AcademyHome /> : <Outlet />}
      </main>
    </div>
  );
}

function AcademyHome() {
  const progress = getProgress();
  const done = completedCount();

  return (
    <div className="p-5 space-y-5">
      <div>
        <h1 className="text-xl font-extrabold leading-tight">Chào mừng đến Veasyble Academy 🎓</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Hoàn thành 4 modules để bắt đầu nhận task và kiếm tiền.
        </p>
      </div>

      <div className="bg-card border border-border rounded-[5px] p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-semibold">Tiến độ</span>
          <span className="text-muted-foreground">{done} / 4 Modules</span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div className="h-full bg-orange transition-all" style={{ width: `${(done / 4) * 100}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        {modules.map((m) => {
          const status = progress[m.id];
          const unlocked = isUnlocked(m.num);
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              className={`bg-card border rounded-[5px] p-4 ${unlocked ? "border-border" : "border-border/60 opacity-70"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-[5px] flex items-center justify-center shrink-0 ${unlocked ? "bg-navy text-navy-foreground" : "bg-surface text-muted-foreground"}`}>
                  {unlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Module {m.num}</span>
                    {status?.passed && (
                      <span className="badge badge-success"><CheckCircle2 className="w-3 h-3" /> {status.score}%</span>
                    )}
                    {!unlocked && <span className="badge badge-gray">Locked</span>}
                    {unlocked && !status && <span className="badge badge-success">Available</span>}
                  </div>
                  <div className="font-semibold text-sm mt-0.5">{m.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{m.desc}</div>
                  {unlocked && (
                    <Link
                      to="/executor/academy/module/$id/video"
                      params={{ id: m.id }}
                      className="inline-block mt-3 text-xs font-semibold bg-orange text-orange-foreground rounded-md px-3 py-1.5"
                    >
                      {status?.passed ? "Xem lại" : "Start"}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-center text-muted-foreground pt-2">
        Bạn cần đạt tối thiểu 70% để hoàn thành mỗi module.
      </p>

      {done === 4 && (
        <Link
          to="/executor/academy/complete"
          className="block text-center w-full bg-orange text-orange-foreground font-semibold rounded-md py-3 text-sm"
        >
          Xem chứng nhận →
        </Link>
      )}
    </div>
  );
}
