import { Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { createFileRoute, Link, Outlet, useLocation, useRouter } from "@tanstack/react-router";
import { modules, getProgress, isUnlocked, completedCount, isAcademyComplete, avgScore } from "@/lib/academy-data";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/executor/academy")({
  component: AcademyLayout,
});

function AcademyLayout() {
  const loc = useLocation();
  const router = useRouter();
  const isRoot = loc.pathname === "/executor/academy" || loc.pathname === "/executor/academy/";

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-navy text-navy-foreground px-4 py-3 flex items-center gap-3">
        {!isRoot && (
          <button onClick={() => router.history.back()} className="opacity-80 hover:opacity-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
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
  const { t } = useTranslation();
  const progress = getProgress();
  const done = completedCount();

  const isComplete = isAcademyComplete();

  return (
    <div className="p-5 space-y-5">
      {isComplete ? (
        <div className="bg-success/10 border border-success/20 rounded-[5px] p-4 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-success text-white rounded-full flex items-center justify-center mb-2">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-success-foreground mb-1">Academy Completed</h1>
          <p className="text-sm text-success-foreground/80 mb-3">You have unlocked all tasks.</p>
          <div className="inline-flex items-center gap-1.5 bg-white border border-success/20 px-3 py-1.5 rounded-full text-sm font-semibold text-success">
            Average Score: {avgScore()}%
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-xl font-extrabold leading-tight">{t("academy_welcome")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("academy_subtitle")}
          </p>
        </div>
      )}

      <div className="bg-card border border-border rounded-[5px] p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-semibold">{t("progress")}</span>
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
                    {!unlocked && <span className="badge badge-gray">{t("locked")}</span>}
                    {unlocked && !status && <span className="badge badge-success">{t("available")}</span>}
                  </div>
                  <div className="font-semibold text-sm mt-0.5">{m.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{m.desc}</div>
                  {unlocked && (
                    <Link
                      to="/executor/academy/module/$id/video"
                      params={{ id: m.id }}
                      className="inline-flex min-h-[44px] items-center mt-3 text-xs font-semibold bg-orange text-orange-foreground rounded-md px-4 py-2"
                    >
                      {status?.passed ? t("review") : t("start")}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-center text-muted-foreground pt-2">
        {t("academy_passing_req")}
      </p>

      {done === 4 && (
        <Link
          to="/executor/academy/complete"
          className="flex items-center justify-center w-full bg-orange text-orange-foreground font-semibold rounded-md min-h-[44px] py-3 text-sm"
        >
          {t("view_certificate")}
        </Link>
      )}
    </div>
  );
}
