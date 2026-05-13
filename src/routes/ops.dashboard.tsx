import { Gear, X } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { escalations, ops } from "@/lib/mock-data";
import { useState } from "react";


export const Route = createFileRoute("/ops/dashboard")({
  component: OpsDashboard,
});

type ThresholdKey =
  | "pendingApplications"
  | "campaignFillRate"
  | "lateCheckIns"
  | "popPassRate"
  | "executorWarning"
  | "executorAtRisk"
  | "executorSuspended";

type Thresholds = Record<ThresholdKey, number>;
type MetricTone = "neutral" | "orange" | "warning" | "danger" | "success";

const defaults: Thresholds = {
  pendingApplications: 5,
  campaignFillRate: 80,
  lateCheckIns: 3,
  popPassRate: 85,
  executorWarning: 3.9,
  executorAtRisk: 3.5,
  executorSuspended: 3.0,
};

const metrics = {
  pendingApplications: 7,
  approvedThisWeek: 12,
  academyCompletionRate: 74,
  applicationToFirstJob: "3.2 days",
  campaignFillRate: 87,
  campaignsUnfilledTomorrow: 2,
  surgeTasks: 9,
  avgTimeToFillTask: "11h 20m",
  onSiteNow: 14,
  lateCheckInsToday: 4,
  cancelledMidExecution: 1,
  popPassRate: 82,
  avgNetworkRating: 4.3,
  warningExecutors: 5,
  atRiskExecutors: 2,
  activeDisputes: 3,
};

function OpsDashboard() {
  const [thresholds, setThresholds] = useState(defaults);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const canEditThresholds = ops?.role === "Ops Lead";

  const setThreshold = (key: ThresholdKey, value: number) => {
    setThresholds((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Network Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">Operational health across onboarding, dispatch, execution, and quality.</p>
        </div>
        {canEditThresholds && (
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold shadow-sm hover:border-orange/50"
          >
            <Gear className="h-4 w-4" />
            Threshold Settings
          </button>
        )}
      </div>

      <PhaseSection title="Onboard Phase">
        <MetricCard
          label="Pending Applications"
          value={metrics.pendingApplications.toString()}
          tone={metrics.pendingApplications > thresholds.pendingApplications ? "orange" : "neutral"}
          badge={metrics.pendingApplications > thresholds.pendingApplications ? `>${thresholds.pendingApplications}` : undefined}
        />
        <MetricCard label="Approved This Week" value={metrics.approvedThisWeek.toString()} />
        <MetricCard label="Academy Completion Rate" value={`${metrics.academyCompletionRate}%`} />
        <MetricCard label="Avg. Time: Application → First Job" value={metrics.applicationToFirstJob} />
      </PhaseSection>

      <PhaseSection title="Dispatch Phase">
        <MetricCard
          label="Campaign Fill Rate"
          value={`${metrics.campaignFillRate}%`}
          tone={metrics.campaignFillRate < thresholds.campaignFillRate ? "warning" : "success"}
          circularProgress={metrics.campaignFillRate}
        />
        <MetricCard
          label="Campaigns Unfilled with <1 Day to Execution"
          value={metrics.campaignsUnfilledTomorrow.toString()}
          tone={metrics.campaignsUnfilledTomorrow > 0 ? "danger" : "success"}
          badge={metrics.campaignsUnfilledTomorrow > 0 ? "Action" : undefined}
        />
        <MetricCard label="Tasks Currently in Surge" value={metrics.surgeTasks.toString()} tone="orange" />
        <MetricCard label="Avg. Time to Fill a Task" value={metrics.avgTimeToFillTask} />
      </PhaseSection>

      <PhaseSection title="Execution Phase">
        <MetricCard label="Executors On-Site Right Now" value={metrics.onSiteNow.toString()} tone="success" live />
        <MetricCard
          label="Late Check-ins Today"
          value={metrics.lateCheckInsToday.toString()}
          tone={metrics.lateCheckInsToday > thresholds.lateCheckIns ? "danger" : "neutral"}
        />
        <MetricCard label="Tasks Cancelled Mid-Execution Today" value={metrics.cancelledMidExecution.toString()} tone="warning" />
        <MetricCard
          label="PoP Auto-Review Pass Rate"
          value={`${metrics.popPassRate}%`}
          tone={metrics.popPassRate < thresholds.popPassRate ? "warning" : "success"}
        />
      </PhaseSection>

      <PhaseSection title="Quality Phase">
        <MetricCard label="Avg. Network Rating" value={`${metrics.avgNetworkRating} ★`} tone="success" large />
        <MetricCard
          label={`Executors in Warning Zone (${thresholds.executorAtRisk.toFixed(1)}–${thresholds.executorWarning.toFixed(1)})`}
          value={metrics.warningExecutors.toString()}
          tone={metrics.warningExecutors > 0 ? "warning" : "success"}
        />
        <MetricCard
          label={`Executors At Risk (<${thresholds.executorAtRisk.toFixed(1)})`}
          value={metrics.atRiskExecutors.toString()}
          tone={metrics.atRiskExecutors > 0 ? "danger" : "success"}
        />
        <MetricCard label="Active Disputes" value={metrics.activeDisputes.toString()} tone={metrics.activeDisputes > 0 ? "danger" : "neutral"} />
      </PhaseSection>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-3">Geographic Coverage</h3>
          <div className="h-64 bg-surface rounded-lg border border-border relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
              Vietnam coverage map
            </div>
            <Dot top="20%" left="55%" color="success" label="Hà Nội" />
            <Dot top="48%" left="48%" color="warning" label="Đà Nẵng" />
            <Dot top="78%" left="40%" color="success" label="HCMC" />
            <Dot top="65%" left="58%" color="danger" label="Nha Trang" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-3">Recent Escalations</h3>
          <div className="space-y-3">
            {escalations && escalations.slice(0, 5).map((e) => (
              <div key={e.id} className="text-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium truncate">{e.type}</div>
                  <span className={`badge badge-${e.priority === "High" ? "danger" : e.priority === "Medium" ? "warning" : "gray"}`}>{e.priority}</span>
                </div>
                <div className="text-xs text-muted-foreground truncate">{e.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {settingsOpen && (
        <ThresholdPanel
          thresholds={thresholds}
          onChange={setThreshold}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}

function PhaseSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{title}</h2>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">{children}</div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  tone = "neutral",
  badge,
  circularProgress,
  live,
  large,
}: {
  label: string;
  value: string;
  tone?: MetricTone;
  badge?: string;
  circularProgress?: number;
  live?: boolean;
  large?: boolean;
}) {
  const toneClasses = {
    neutral: "border-border bg-card",
    orange: "border-orange/40 bg-orange/5",
    warning: "border-warning/50 bg-warning/5",
    danger: "border-danger/50 bg-danger/5",
    success: "border-success/40 bg-success/5",
  }[tone];
  const valueClass = {
    neutral: "text-foreground",
    orange: "text-orange",
    warning: "text-warning",
    danger: "text-danger",
    success: "text-success",
  }[tone];

  return (
    <div className={`min-h-[132px] rounded-xl border p-5 shadow-sm ${toneClasses}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-medium leading-snug text-muted-foreground">{label}</div>
        <div className="flex items-center gap-2">
          {live && <span className="h-2 w-2 rounded-full bg-success animate-pulse" />}
          {badge && <span className={`badge badge-${tone === "danger" ? "danger" : "orange"}`}>{badge}</span>}
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className={`${large ? "text-4xl" : "text-3xl"} font-bold ${valueClass}`}>{value}</div>
        {circularProgress !== undefined && <CircularProgress value={circularProgress} tone={tone} />}
      </div>
    </div>
  );
}

function CircularProgress({ value, tone }: { value: number; tone: MetricTone }) {
  const color = tone === "warning" || tone === "danger" ? "#E8471C" : "#22C55E";
  return (
    <div
      className="grid h-14 w-14 place-items-center rounded-full text-[11px] font-bold"
      style={{ background: `conic-gradient(${color} ${value * 3.6}deg, var(--surface) 0deg)` }}
    >
      <div className="grid h-10 w-10 place-items-center rounded-full bg-card">{value}%</div>
    </div>
  );
}

function ThresholdPanel({
  thresholds,
  onChange,
  onClose,
}: {
  thresholds: Thresholds;
  onChange: (key: ThresholdKey, value: number) => void;
  onClose: () => void;
}) {
  const rows: Array<{ key: ThresholdKey; label: string; suffix?: string; step?: string }> = [
    { key: "pendingApplications", label: "Pending Applications alert: trigger when >" },
    { key: "campaignFillRate", label: "Campaign fill rate warning: trigger when <", suffix: "%" },
    { key: "lateCheckIns", label: "Late check-in alert: trigger when >", suffix: "today" },
    { key: "popPassRate", label: "PoP pass rate warning: trigger when <", suffix: "%" },
    { key: "executorWarning", label: "Executor warning zone: rating <", step: "0.1" },
    { key: "executorAtRisk", label: "Executor at risk zone: rating <", step: "0.1" },
    { key: "executorSuspended", label: "Executor suspended: rating <", step: "0.1" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <aside className="flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 text-white" style={{ backgroundColor: "#1A1F5E" }}>
          <div>
            <h2 className="text-lg font-bold">Threshold Settings</h2>
            <p className="text-xs text-white/70">Ops Lead controls</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 hover:bg-white/10" aria-label="Close threshold settings">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-auto p-5">
          {rows.map((row) => (
            <div key={row.key} className="rounded-xl border border-border bg-card p-4">
              <label className="block text-sm font-medium text-foreground" htmlFor={row.key}>{row.label}</label>
              <div className="mt-3 flex items-center gap-2">
                <input
                  id={row.key}
                  type="number"
                  step={row.step ?? "1"}
                  value={thresholds[row.key]}
                  onChange={(event) => onChange(row.key, Number(event.target.value))}
                  className="h-10 w-24 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-orange/30"
                />
                {row.suffix && <span className="text-sm text-muted-foreground">{row.suffix}</span>}
                <button
                  type="button"
                  className="ml-auto rounded-md px-3 py-2 text-sm font-semibold text-white"
                  style={{ backgroundColor: "#E8471C" }}
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function Dot({ top, left, color, label }: { top: string; left: string; color: "success" | "warning" | "danger"; label: string }) {
  const cls = color === "success" ? "bg-success" : color === "warning" ? "bg-warning" : "bg-danger";
  return (
    <div style={{ top, left }} className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
      <span className={`w-3 h-3 rounded-full ${cls} ring-4 ring-white/40`} />
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  );
}
