import { createFileRoute, Link } from "@tanstack/react-router";
import { escalations, coverageZones, metrics } from "@/lib/mock-data";

// Reuse metrics from existing mock data logic or define inline:
const dashMetrics = {
  pendingApplications: 7,
  avgNetworkRating: 4.3,
  warningExecutors: 5,
  activeDisputes: 3,
};

export const Route = createFileRoute("/ops/dashboard")({
  component: OpsDashboard,
});

function OpsDashboard() {
  const topEscalations = escalations.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Ops Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Network overview and immediate actions.</p>
        </div>
      </div>

      {/* Summary Metrics */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Summary Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            label="Pending Applications"
            value={dashMetrics.pendingApplications.toString()}
            tone="orange"
            badge="Action"
          />
          <MetricCard label="Avg. Network Rating" value={`${dashMetrics.avgNetworkRating} ★`} tone="success" large />
          <MetricCard
            label="Executors in Warning Zone"
            value={dashMetrics.warningExecutors.toString()}
            tone="warning"
          />
          <MetricCard
            label="Active Disputes"
            value={dashMetrics.activeDisputes.toString()}
            tone="danger"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Geographic Coverage */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Geographic Coverage
          </h2>
          <div className="bg-card border border-border rounded-[5px] p-5">
            <div className="h-64 bg-surface rounded-[5px] border border-border relative overflow-hidden mb-4">
              <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                Vietnam coverage map
              </div>
              <Dot top="20%" left="55%" color="success" label="Hà Nội" />
              <Dot top="48%" left="48%" color="warning" label="Đà Nẵng" />
              <Dot top="78%" left="40%" color="success" label="HCMC" />
              <Dot top="65%" left="58%" color="danger" label="Nha Trang" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {coverageZones.map((z) => (
                <div key={z.district} className="bg-surface rounded-[5px] p-3 text-center border border-border">
                  <p className="text-xs font-semibold">{z.district}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Match Rate</p>
                  <p className={`text-lg font-bold ${
                    z.matchRate >= 100 ? "text-success" :
                    z.matchRate >= 50 ? "text-warning" : "text-danger"
                  }`}>
                    {z.matchRate}%
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {z.executorCount} Exec / {z.demandForecast} Demand
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Escalations */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Recent Escalations
            </h2>
            <Link to="/ops/escalations" className="text-xs text-blue-600 font-semibold hover:underline">
              View All →
            </Link>
          </div>
          <div className="bg-card border border-border rounded-[5px] p-5 space-y-3">
            {topEscalations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent escalations</p>
            ) : (
              topEscalations.map((e) => (
                <div key={e.id} className="text-sm border-b border-border last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="font-semibold text-gray-900 truncate">{e.title}</div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                      e.severity === "High" ? "bg-red-50 text-red-700" :
                      e.severity === "Medium" ? "bg-yellow-50 text-yellow-700" :
                      "bg-green-50 text-green-700"
                    }`}>
                      {e.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="bg-surface px-1.5 py-0.5 rounded">{e.phase}</span>
                    <span>•</span>
                    <span>{new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared UI ──
function MetricCard({
  label,
  value,
  tone = "neutral",
  badge,
  large,
}: {
  label: string;
  value: string;
  tone?: "neutral" | "orange" | "warning" | "danger" | "success";
  badge?: string;
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
    <div className={`min-h-[132px] rounded-[5px] border p-5 shadow-sm flex flex-col justify-between ${toneClasses}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-medium leading-snug text-muted-foreground">{label}</div>
        {badge && <span className="bg-orange-50 text-orange-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">{badge}</span>}
      </div>
      <div className={`${large ? "text-4xl" : "text-3xl"} font-bold ${valueClass}`}>{value}</div>
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
