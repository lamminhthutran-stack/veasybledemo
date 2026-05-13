import { createFileRoute } from "@tanstack/react-router";
import { escalations } from "@/lib/mock-data";

export const Route = createFileRoute("/ops/dashboard")({
  component: OpsDashboard,
});

function OpsDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Network Overview</h1>

      <Section title="Onboard">
        <Metric label="Pending Applications" value="7" badge="orange" />
        <Metric label="Approved This Week" value="12" />
        <Metric label="Avg. Time to First Job" value="3.2 days" />
      </Section>

      <Section title="Execute">
        <Metric label="Campaign Fill Rate" value="87%" progress={87} />
        <Metric label="Executors On-Site Now" value="14" />
        <Metric label="Late Check-ins Today" value="2" badge="warning" />
      </Section>

      <Section title="Quality">
        <Metric label="Avg. Network Rating" value="4.3 ★" />
        <Metric label="Executors in Warning Zone" value="5" badge="warning" />
        <Metric label="Active Disputes" value="2" badge="danger" />
      </Section>

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
            {escalations.slice(0, 5).map((e) => (
              <div key={e.id} className="text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-medium truncate">{e.type}</div>
                  <span className={`badge badge-${e.priority === "High" ? "danger" : e.priority === "Medium" ? "warning" : "gray"}`}>{e.priority}</span>
                </div>
                <div className="text-xs text-muted-foreground truncate">{e.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-semibold">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
    </div>
  );
}

function Metric({ label, value, badge, progress }: { label: string; value: string; badge?: "orange" | "warning" | "danger"; progress?: number }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{label}</div>
        {badge && <span className={`badge badge-${badge}`}>•</span>}
      </div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {progress !== undefined && (
        <div className="mt-2 h-1.5 bg-surface rounded-full overflow-hidden">
          <div className="h-full bg-orange rounded-full" style={{ width: `${progress}%` }} />
        </div>
      )}
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
