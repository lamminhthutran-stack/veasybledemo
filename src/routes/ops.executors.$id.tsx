import { ArrowLeft } from "lucide-react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { executorsList } from "@/lib/mock-data";

export const Route = createFileRoute("/ops/executors/$id")({
  component: ExecutorOpsView,
});

function ExecutorOpsView() {
  const { id } = Route.useParams();
  const router = useRouter();
  const u = executorsList.find((x) => x.id === id) ?? executorsList[0];
  const status =
    u.rating >= 4.5
      ? { label: "Healthy", cls: "badge-success" }
      : u.rating >= 4.0
        ? { label: "Warning", cls: "badge-warning" }
        : u.rating >= 3.0
          ? { label: "At Risk", cls: "badge-orange" }
          : { label: "Suspended", cls: "badge-danger" };

  return (
    <div className="space-y-5 max-w-5xl">
      <button
        onClick={() => router.history.back()}
        className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" /> {"Back to network"}
      </button>

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-navy text-navy-foreground flex items-center justify-center font-bold">
          {u.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{u.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge badge-navy">{u.tier}</span>
            <span className="text-xs text-muted-foreground">{"Joined Jan 2025"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-[5px] p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {"Current Rating"}
          </div>
          <div className="text-4xl font-bold mt-1">{u.rating} ★</div>
          <div className="mt-3 space-y-1.5 text-sm">
            <Row k={"First Job (Veasyble)"} v="4.8" />
            <Row k={"Brand avg"} v="4.4" />
            <Row k={"Retailer avg"} v="4.5" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-[5px] p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{"Status"}</div>
          <div className="mt-2">
            <span className={`badge ${status.cls} text-base px-3 py-1`}>{status.label}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-3">
            {"Threshold: 4.0 minimum across last 10 jobs."}
          </div>
        </div>

        <div className="bg-card border border-border rounded-[5px] p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {"Rating Trend"}
          </div>
          <svg viewBox="0 0 200 60" className="w-full h-20 mt-2">
            <polyline
              fill="none"
              stroke="var(--orange)"
              strokeWidth="2"
              points="0,30 33,25 66,28 99,18 132,22 165,15 200,20"
            />
          </svg>
          <div className="text-[10px] text-muted-foreground flex justify-between">
            <span>{"6m ago"}</span>
            <span>{"now"}</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[5px] p-5">
        <h3 className="font-semibold mb-3">{"Recent Tasks"}</h3>
        <div className="text-sm">
          <div className="grid grid-cols-5 gap-3 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold pb-2 border-b border-border">
            <div>{"Task"}</div>
            <div>{"Campaign"}</div>
            <div>{"Date"}</div>
            <div>{"PoP"}</div>
            <div>{"Rating"}</div>
          </div>
          {[
            ["Endcap setup", "Pepsi Summer", "10/05", "Approved", "5.0"],
            ["POSM swap", "Vinamilk B2S", "08/05", "Approved", "4.0"],
            ["Demo support", "Heineken", "01/05", "Pending", "—"],
          ].map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-3 py-2 border-b border-border last:border-0"
            >
              {r.map((c, j) => (
                <div key={j}>{c}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {u.partnerFeedback && u.partnerFeedback.length > 0 && (
        <div className="bg-card border border-border rounded-[5px] p-5">
          <h3 className="font-semibold mb-4">{"Brand & Retailer Feedback"}</h3>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-muted-foreground">{"Sentiment:"}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex">
              <div className="bg-green-500 h-full" style={{ width: "60%" }} />
              <div className="bg-yellow-400 h-full" style={{ width: "30%" }} />
              <div className="bg-red-500 h-full" style={{ width: "10%" }} />
            </div>
          </div>
          <div className="space-y-3">
            {u.partnerFeedback.map((fb, idx) => (
              <div key={idx} className="bg-surface rounded-[5px] p-3 border border-border">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        fb.sentiment === "positive"
                          ? "bg-green-500"
                          : fb.sentiment === "neutral"
                            ? "bg-yellow-400"
                            : "bg-red-500"
                      }`}
                    />
                    <span className="text-xs font-semibold text-gray-900">{fb.from}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{fb.submittedAt}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mb-2">{fb.campaignName}</p>
                <p className="text-xs text-gray-700">{fb.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button className="bg-orange text-orange-foreground font-semibold rounded-[5px] px-4 py-2 text-sm">
          {"Send Improvement Reminder"}
        </button>
        <button className="bg-warning text-white font-semibold rounded-[5px] px-4 py-2 text-sm">
          {"Issue Warning"}
        </button>
        <button className="bg-danger text-white font-semibold rounded-[5px] px-4 py-2 text-sm">
          {"Suspend Account"}
        </button>
        <button className="border border-border rounded-[5px] px-4 py-2 text-sm">
          {"View Full History"}
        </button>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}
