import { ArrowLeft, MapPin, Navigation } from "lucide-react";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { tasks } from "@/lib/mock-data";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/executor/task/$id/pre-execute")({
  component: PreExecute,
});

function PreExecute() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const router = useRouter();
  const { t } = useTranslation();
  
  const tsk = tasks.find((x) => x.id === id) ?? tasks[0];
  const [checks, setChecks] = useState([false, false, false]);
  const allChecked = checks.every(Boolean);

  const items = [
    t("check_materials"),
    t("check_address"),
    t("check_sop")
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-navy text-navy-foreground px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.history.back()} className="min-h-[44px] flex items-center"><ArrowLeft className="w-5 h-5" /></button>
        <div className="font-semibold">{t("todays_task")}</div>
      </header>

      <div className="p-4 space-y-4 flex-1">
        <div className="bg-card border border-border rounded-[5px] p-4">
          <div className="font-semibold text-sm">{tsk.campaign}</div>
          <div className="text-xs text-muted-foreground mt-1">{tsk.store} · {tsk.time}</div>
        </div>

        <div className="bg-card border border-border rounded-[5px] p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{t("print_station")}</div>
          <div className="font-semibold">{tsk.printStation}</div>
          <div className="text-sm text-muted-foreground">{tsk.printAddress}</div>
          <div className="mt-3 h-36 rounded-[5px] bg-surface border border-border flex items-center justify-center text-xs text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" /> {t("map_preview")}
          </div>
          <button className="mt-3 w-full border border-border rounded-md py-3 min-h-[44px] text-sm font-medium flex items-center justify-center gap-1">
            <Navigation className="w-4 h-4" /> {t("get_directions")}
          </button>
        </div>

        <div className="bg-card border border-border rounded-[5px] p-4 space-y-2">
          <div className="font-semibold text-sm mb-1">{t("before_you_leave")}</div>
          {items.map((it, i) => (
            <label key={i} className="flex items-start gap-3 text-sm py-2 cursor-pointer min-h-[44px]">
              <input
                type="checkbox"
                checked={checks[i]}
                onChange={(e) => setChecks((c) => c.map((v, j) => (j === i ? e.target.checked : v)))}
                className="mt-1 w-5 h-5 accent-orange"
              />
              <span>{it}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="sticky bg-background border-t border-border p-4 z-40" style={{ bottom: "calc(65px + env(safe-area-inset-bottom))" }}>
        <button
          disabled={!allChecked}
          onClick={() => nav({ to: "/executor/task/$id/onsite", params: { id } })}
          className="w-full bg-orange text-orange-foreground rounded-md py-3 min-h-[44px] text-sm font-semibold disabled:opacity-40"
        >
          {t("ready_head_to_store")}
        </button>
      </div>
    </div>
  );
}
