import { createFileRoute, Link } from "@tanstack/react-router";
import { executor, tasks } from "@/lib/mock-data";
import { Star, ChevronDown, MapPin, Clock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/executor/home")({
  component: ExecutorHome,
});

function ExecutorHome() {
  const [showMore, setShowMore] = useState(false);
  const available = tasks.filter((t) => t.badge !== "outside");
  const more = tasks.filter((t) => t.badge === "outside");

  return (
    <div className="px-4 py-5 space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Xin chào, {executor.name.split(" ").slice(-1)[0]} 👋</h1>
        <p className="text-sm text-muted-foreground">Ready for today's tasks?</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Stat label="Tasks" value={executor.tasksCompleted.toString()} sub="this month" />
        <Stat label="Rating" value={`${executor.rating}★`} sub={`${executor.tasksCompleted} jobs`} />
        <Stat label="Earnings" value="3.4M" sub="VND" />
      </div>

      <section>
        <h2 className="font-semibold mb-2">Available Tasks</h2>
        <div className="space-y-3">
          {available.map((t) => <TaskCard key={t.id} t={t} />)}
        </div>
      </section>

      <section>
        <button
          onClick={() => setShowMore((s) => !s)}
          className="w-full flex items-center justify-between bg-surface border border-border rounded-xl px-4 py-3 text-sm font-medium"
        >
          <span>Browse More Jobs</span>
          <ChevronDown className={`w-4 h-4 transition ${showMore ? "rotate-180" : ""}`} />
        </button>
        {showMore && (
          <div className="space-y-3 mt-3">
            {more.map((t) => <TaskCard key={t.id} t={t} />)}
            <Link to="/executor/browse" className="block text-center text-sm text-orange font-medium py-2">
              See all available jobs →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3 text-center">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-lg font-bold mt-0.5">{value}</div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </div>
  );
}

export function TaskCard({ t }: { t: { id: string; campaign: string; store: string; district: string; date: string; time: string; pay: string; badge?: string } }) {
  const badgeCls =
    t.badge === "urgent" ? "badge badge-danger" :
    t.badge === "outside" ? "badge badge-orange" :
    "badge badge-success";
  const badgeText =
    t.badge === "urgent" ? "Urgent" :
    t.badge === "outside" ? "Outside Availability" : "Available";

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="font-semibold text-sm leading-tight">{t.campaign}</div>
        <span className={badgeCls}>{badgeText}</span>
      </div>
      <div className="text-xs text-muted-foreground space-y-1 mb-3">
        <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{t.store} · {t.district}</div>
        <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{t.date} · {t.time}</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-orange font-bold">{t.pay}</div>
        <div className="flex items-center gap-2">
          <Link to="/executor/task/$id" params={{ id: t.id }} className="text-xs text-muted-foreground hover:text-foreground">
            View Details
          </Link>
          <Link
            to="/executor/task/$id"
            params={{ id: t.id }}
            className="bg-orange text-orange-foreground text-xs font-semibold px-3 py-1.5 rounded-md"
          >
            Accept
          </Link>
        </div>
      </div>
    </div>
  );
}
