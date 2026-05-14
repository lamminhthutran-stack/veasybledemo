import { createFileRoute, Link } from "@tanstack/react-router";
import { escalations } from "@/lib/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/ops/queue/")({
  component: Queue,
});

const tabs = ["All", "Onboard", "Execute", "Verification", "Quality", "Network"];

function Queue() {
  const [tab, setTab] = useState("All");

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Escalation Queue</h1>

      <div className="flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm border-b-2 -mb-px ${tab === t ? "border-orange text-orange font-semibold" : "border-transparent text-muted-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {escalations.map((e) => (
          <div key={e.id} className={`bg-card border border-border rounded-[5px] p-4 flex items-center gap-4 ${e.status === "Resolved" ? "opacity-60" : ""}`}>
            <div className="w-10 h-10 rounded-[5px] bg-surface flex items-center justify-center text-xs font-bold text-navy shrink-0">
              {e.type[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{e.desc}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{e.type} · {e.time}</div>
            </div>
            <span className={`badge badge-${e.priority === "High" ? "danger" : e.priority === "Medium" ? "warning" : "gray"}`}>{e.priority}</span>
            <div className="flex items-center gap-2">
              {e.status === "Resolved" ? (
                <span className="badge badge-gray">Resolved ✓</span>
              ) : e.status === "In Progress" ? (
                <span className="badge badge-orange">In Progress</span>
              ) : (
                <button className="text-xs px-3 py-1.5 border border-border rounded-md">Assign to Me</button>
              )}
              {e.type === "Application" ? (
                <Link to="/ops/queue/application/$id" params={{ id: e.id }} className="text-xs px-3 py-1.5 bg-orange text-orange-foreground rounded-md font-semibold">
                  View
                </Link>
              ) : (
                <button className="text-xs px-3 py-1.5 bg-orange text-orange-foreground rounded-md font-semibold">View</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
