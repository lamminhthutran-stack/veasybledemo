import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { escalations as initialEscalations } from "@/lib/mock-data";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/ops/escalations")({
  component: OpsEscalations,
});

type Tab = "queue" | "log";

function OpsEscalations() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("queue");
  const [filters, setFilters] = useState({ phase: "all", severity: "all" });
  const [escalationsList, setEscalationsList] = useState(initialEscalations);

  const handleResolve = (id: string, note: string) => {
    setEscalationsList((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: "Resolved", resolvedAt: new Date().toISOString(), resolvedNote: note || "Resolved by Ops." }
          : e
      )
    );
  };

  const isQueue = tab === "queue";

  const filtered = escalationsList.filter((e) => {
    if (isQueue && e.status === "Resolved") return false;
    if (!isQueue && e.status !== "Resolved") return false;
    if (filters.phase !== "all" && e.phase !== filters.phase) return false;
    if (filters.severity !== "all" && e.severity !== filters.severity) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("escalation_queue")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage and resolve network incidents.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[5px] overflow-hidden shadow-sm">
        {/* Tabs */}
        <div className="flex border-b border-border bg-surface/50 px-4 pt-4 gap-6 text-sm font-semibold">
          <button
            onClick={() => setTab("queue")}
            className={`pb-3 border-b-2 transition-colors ${
              tab === "queue" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            {t("open_cases")} ({escalationsList.filter((e) => e.status !== "Resolved").length})
          </button>
          <button
            onClick={() => setTab("log")}
            className={`pb-3 border-b-2 transition-colors ${
              tab === "log" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            {t("resolved_cases")}
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-border bg-background space-y-3">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Phase</label>
              <select
                value={filters.phase}
                onChange={(e) => setFilters((f) => ({ ...f, phase: e.target.value }))}
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm outline-none"
              >
                <option value="all">All Phases</option>
                <option value="Onboard">Onboard</option>
                <option value="Dispatch">Dispatch</option>
                <option value="Execute">Execute</option>
                <option value="Verification">Verification</option>
                <option value="Quality">Quality</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters((f) => ({ ...f, severity: e.target.value }))}
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm outline-none"
              >
                <option value="all">All Severities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="bg-background">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-4xl mb-3">📭</div>
              <p className="font-semibold text-gray-900">No escalations found</p>
              <p className="text-sm mt-1">Try adjusting the filters or check another tab.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((e) => (
                <EscalationRow key={e.id} escalation={e} isQueue={isQueue} onResolve={handleResolve} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EscalationRow({
  escalation: e,
  isQueue,
  onResolve,
}: {
  escalation: any;
  isQueue: boolean;
  onResolve: (id: string, note: string) => void;
}) {
  const { t } = useTranslation();
  const [resolveNote, setResolveNote] = useState("");
  const [resolving, setResolving] = useState(false);

  return (
    <div className="p-4 hover:bg-surface/30 transition-colors">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              e.severity === "High" ? "bg-red-50 text-red-700" :
              e.severity === "Medium" ? "bg-yellow-50 text-yellow-700" :
              "bg-green-50 text-green-700"
            }`}>
              {e.severity === "High" ? t("severity_high") :
               e.severity === "Medium" ? t("severity_med") :
               t("severity_low")}
            </span>
            <span className="text-[10px] bg-surface text-muted-foreground px-2 py-0.5 rounded font-medium">
              {e.phase}
            </span>
            <span className="text-[10px] text-muted-foreground ml-2">
              {new Date(e.createdAt).toLocaleString()}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mt-1">{e.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">Executor ID: <span className="font-medium text-gray-700">{e.executorId}</span></p>

          {!isQueue && e.resolvedNote && (
            <div className="mt-3 bg-gray-50 border border-gray-100 rounded-[5px] p-3 text-xs">
              <span className="font-semibold text-gray-700">Resolution Note:</span>
              <p className="text-gray-600 mt-0.5">{e.resolvedNote}</p>
              <p className="text-[10px] text-gray-400 mt-1">Resolved at: {new Date(e.resolvedAt).toLocaleString()}</p>
            </div>
          )}
        </div>

        {isQueue && (
          <div className="w-64 flex-shrink-0 flex flex-col items-end">
            {!resolving ? (
              <button
                onClick={() => setResolving(true)}
                className="bg-white border border-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-[5px] text-xs shadow-sm hover:bg-gray-50"
              >
                Resolve...
              </button>
            ) : (
              <div className="w-full bg-surface border border-border rounded-[5px] p-3 mt-1 shadow-sm">
                <input
                  type="text"
                  placeholder="Resolution note..."
                  value={resolveNote}
                  onChange={(ev) => setResolveNote(ev.target.value)}
                  className="w-full bg-white border border-border rounded-md px-2 py-1.5 text-xs mb-2 outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setResolving(false)}
                    className="flex-1 border border-border bg-white text-gray-600 rounded-md py-1.5 text-[10px] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onResolve(e.id, resolveNote);
                      setResolving(false);
                    }}
                    className="flex-1 bg-green-600 text-white rounded-md py-1.5 text-[10px] font-semibold"
                  >
                    Confirm Resolve
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
