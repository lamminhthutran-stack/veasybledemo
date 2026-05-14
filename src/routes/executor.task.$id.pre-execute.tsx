import { ArrowLeft, MapPin, Navigation } from "lucide-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { tasks } from "@/lib/mock-data";
import { useState } from "react";


export const Route = createFileRoute("/executor/task/$id/pre-execute")({
  component: PreExecute,
});

function PreExecute() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const t = tasks.find((x) => x.id === id) ?? tasks[0];
  const [checks, setChecks] = useState([false, false, false]);
  const allChecked = checks.every(Boolean);

  const items = ["I have collected my printed materials", "I know the store address", "I have the SOP open"];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-navy text-navy-foreground px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link to="/executor/task/$id" params={{ id }}><ArrowLeft className="w-5 h-5" /></Link>
        <div className="font-semibold">Today's Task</div>
      </header>

      <div className="p-4 space-y-4 flex-1">
        <div className="bg-card border border-border rounded-[5px] p-4">
          <div className="font-semibold text-sm">{t.campaign}</div>
          <div className="text-xs text-muted-foreground mt-1">{t.store} · {t.time}</div>
        </div>

        <div className="bg-card border border-border rounded-[5px] p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Print Station</div>
          <div className="font-semibold">{t.printStation}</div>
          <div className="text-sm text-muted-foreground">{t.printAddress}</div>
          <div className="mt-3 h-36 rounded-[5px] bg-surface border border-border flex items-center justify-center text-xs text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" /> Map preview
          </div>
          <button className="mt-3 w-full border border-border rounded-md py-2 text-sm font-medium flex items-center justify-center gap-1">
            <Navigation className="w-4 h-4" /> Get Directions
          </button>
        </div>

        <div className="bg-card border border-border rounded-[5px] p-4 space-y-2">
          <div className="font-semibold text-sm mb-1">Before you leave</div>
          {items.map((it, i) => (
            <label key={it} className="flex items-start gap-3 text-sm py-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={checks[i]}
                onChange={(e) => setChecks((c) => c.map((v, j) => (j === i ? e.target.checked : v)))}
                className="mt-1 w-4 h-4 accent-orange"
              />
              <span>{it}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 bg-background border-t border-border p-4">
        <button
          disabled={!allChecked}
          onClick={() => nav({ to: "/executor/task/$id/onsite", params: { id } })}
          className="w-full bg-orange text-orange-foreground rounded-md py-3 text-sm font-semibold disabled:opacity-40"
        >
          I'm Ready — Head to Store
        </button>
      </div>
    </div>
  );
}
