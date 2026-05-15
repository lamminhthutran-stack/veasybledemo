import { Download, Search } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { executorsList } from "@/lib/mock-data";
import { useTranslation } from "react-i18next";


export const Route = createFileRoute("/ops/executors/")({
  component: Network,
});

function getRatingStatus(rating: number, t: any) {
  if (rating >= 4.0) return { label: t("healthy"), color: "bg-green-50 text-green-700" };
  if (rating >= 3.5) return { label: t("warning"), color: "bg-yellow-50 text-yellow-700" };
  if (rating >= 3.0) return { label: t("at_risk"), color: "bg-orange-50 text-orange-700" };
  return { label: t("suspended"), color: "bg-red-50 text-red-700" };
}

function Network() {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("executor_network")}</h1>
        <button className="text-sm px-3 py-2 border border-border rounded-[5px] flex items-center gap-2 bg-card">
          <Download className="w-4 h-4" /> {t("export")}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label={t("total_active")} value="248" />
        <Stat label={t("dormant")} value="34" />
        <Stat label={t("suspended")} value="6" />
        <Stat label={t("new_this_month")} value="19" />
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input placeholder={t("search_by_name")} className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-card text-sm" />
        </div>
        {[t("city"), t("tier"), t("rating")].map((f) => (
          <button key={f} className="text-sm px-3 py-2 border border-border rounded-[5px] bg-card">{f}</button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-[5px] overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold border-b border-border">
          <div>{t("name")}</div><div>{t("tier")}</div><div>{t("city")}</div><div>{t("rating")}</div><div>{t("tasks")}</div><div>{t("status")}</div>
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
            <div>
                {u.status === "Dormant" ? (
                  <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-500">{t("dormant")}</span>
                ) : (
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${getRatingStatus(u.rating, t).color}`}>
                    {getRatingStatus(u.rating, t).label}
                  </span>
                )}
              </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-[5px] p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
