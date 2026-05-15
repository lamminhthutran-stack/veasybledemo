import { createFileRoute, Link } from "@tanstack/react-router";
import { escalations } from "@/lib/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/ops/queue/")({
  component: Queue,
});

const tabs = [
  { id: "All", key: "All" },
  { id: "Onboard", key: "tab_onboard" },
  { id: "Execute", key: "tab_execute" },
  { id: "Verification", key: "tab_verification" },
  { id: "Quality", key: "tab_quality" },
  { id: "Network", key: "tab_network" },
];

function Queue() {
  const [tab, setTab] = useState("All");

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">{"Escalation Queue"}</h1>

      <div className="flex gap-1 border-b border-border">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`px-4 py-2 text-sm border-b-2 -mb-px ${tab === tb.id ? "border-orange text-orange font-semibold" : "border-transparent text-muted-foreground"}`}
          >
            {tb.key}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {escalations.map((e) => (
          <div
            key={e.id}
            className={`bg-card border border-border rounded-[5px] p-4 flex items-center gap-4 ${e.status === "Resolved" ? "opacity-60" : ""}`}
          >
            <div className="w-10 h-10 rounded-[5px] bg-surface flex items-center justify-center text-xs font-bold text-navy shrink-0">
              {e.phase[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{e.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {e.phase} · {new Date(e.createdAt).toLocaleTimeString()}
              </div>
            </div>
            <span
              className={`badge badge-${e.severity === "High" ? "danger" : e.severity === "Medium" ? "warning" : "gray"}`}
            >
              {e.severity}
            </span>
            <div className="flex items-center gap-2">
              {e.status === "Resolved" ? (
                <span className="badge badge-gray">{"Resolved ✓"}</span>
              ) : e.status === "In Progress" ? (
                <span className="badge badge-orange">{"In Progress"}</span>
              ) : (
                <button className="text-xs px-3 py-1.5 border border-border rounded-[5px]">
                  {"Assign to Me"}
                </button>
              )}
              {e.phase === "Onboard" ? (
                <Link
                  to="/ops/queue/application/$id"
                  params={{ id: e.id }}
                  className="text-xs px-3 py-1.5 bg-orange text-orange-foreground rounded-[5px] font-semibold"
                >
                  {"View"}
                </Link>
              ) : (
                <button className="text-xs px-3 py-1.5 bg-orange text-orange-foreground rounded-[5px] font-semibold">
                  {"View"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
