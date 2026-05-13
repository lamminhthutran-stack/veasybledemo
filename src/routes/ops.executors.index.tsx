import { createFileRoute, Link } from "@tanstack/react-router";
import { executorsList } from "@/lib/mock-data";
import { Download, Search } from "lucide-react";

export const Route = createFileRoute("/ops/executors/")({
  component: Network,
});

const statusBadge = (s: string) =>
  s === "Active" ? "badge badge-success" :
  s === "Warning" ? "badge badge-warning" :
  s === "Suspended" ? "badge badge-danger" : "badge badge-gray";

function Network() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Executor Network</h1>
        <button className="text-sm px-3 py-2 border border-border rounded-md flex items-center gap-2 bg-card">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total Active" value="248" />
        <Stat label="Dormant" value="34" />
        <Stat label="Suspended" value="6" />
        <Stat label="New This Month" value="19" />
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="Search by name…" className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-card text-sm" />
        </div>
        {["City", "Tier", "Rating"].map((f) => (
          <button key={f} className="text-sm px-3 py-2 border border-border rounded-md bg-card">{f}</button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold border-b border-border">
          <div>Name</div><div>Tier</div><div>City</div><div>Rating</div><div>Tasks</div><div>Status</div>
        </div>
        {executorsList.map((u) => (
          <Link
            key={u.id}
            to="/ops/executors/$id"
            params={{ id: u.id }}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 text-sm items-center border-b border-border last:border-0 hover:bg-surface"
          >
            <div className="font-medium">{u.name}</div>
            <div>{u.tier}</div>
            <div>{u.city}</div>
            <div>{u.rating} ★</div>
            <div>{u.tasks}</div>
            <div><span className={statusBadge(u.status)}>{u.status}</span></div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
