import { ChevronDown } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { campaigns } from "@/lib/mock-data";
import { useState } from "react";
import { DateFilterDropdown, type DateFilterState } from "@/components/DateFilterDropdown";


export const Route = createFileRoute("/ops/campaigns")({
  component: CampaignMonitor,
});

const statusBadge = (s: string) =>
  s === "On Track" ? "badge badge-success" :
  s === "At Risk" ? "badge badge-warning" :
  s === "Urgent" ? "badge badge-danger" : "badge badge-gray";

function CampaignMonitor() {
    const [open, setOpen] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilterState>({ mode: "all" });

  const parseDate = (dString: string) => {
    const [d, m, y] = dString.split("/");
    return new Date(Number(y), Number(m) - 1, Number(d));
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (dateFilter.mode === "all") return true;
    const cd = parseDate(c.date);
    if (dateFilter.mode === "month" && dateFilter.month !== undefined) {
      return cd.getMonth() === dateFilter.month && cd.getFullYear() === dateFilter.year;
    }
    if (dateFilter.mode === "date" && dateFilter.startDate && dateFilter.endDate) {
      const start = new Date(dateFilter.startDate); start.setHours(0,0,0,0);
      const end = new Date(dateFilter.endDate); end.setHours(23,59,59,999);
      return cd >= start && cd <= end;
    }
    return true;
  });

  let filterText = "Showing: All campaigns";
  if (dateFilter.mode === "month" && dateFilter.month !== undefined) {
    const mName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][dateFilter.month];
    filterText = `Showing: ${mName} ${dateFilter.year}`;
  } else if (dateFilter.mode === "date" && dateFilter.startDate && dateFilter.endDate) {
    filterText = `Showing: ${dateFilter.startDate.toLocaleDateString()} – ${dateFilter.endDate.toLocaleDateString()}`;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{"Campaign Monitor"}</h1>
        <p className="text-sm text-gray-500 mt-1">{filterText}</p>
      </div>

      <div className="flex gap-2">
        {["All Cities", "All Statuses"].map((f) => (
          <button key={f} className="text-xs px-3 py-1.5 rounded-[5px] border border-border bg-card">{f}</button>
        ))}
        <DateFilterDropdown value={dateFilter} onChange={setDateFilter} />
      </div>

      <div className="bg-card border border-border rounded-[5px] overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold border-b border-border">
          <div>{"Campaign"}</div><div>{"Brand"}</div><div>{"City"}</div><div>{"Date"}</div><div>{"Filled"}</div><div>{"Status"}</div><div></div>
        </div>
        {filteredCampaigns.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No campaigns match the selected date filter.</div>
        ) : filteredCampaigns.map((c) => {
          const pct = Math.round((c.filled / c.total) * 100);
          return (
            <div key={c.id} className="border-b border-border last:border-0">
              <button
                onClick={() => setOpen(open === c.id ? null : c.id)}
                className="w-full grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 text-sm items-center hover:bg-surface text-left"
              >
                <div className="font-medium">{c.name}</div>
                <div>{c.brand}</div>
                <div>{c.city}</div>
                <div>{c.date}</div>
                <div>
                  <div className="text-xs">{c.filled}/{c.total} ({pct}%)</div>
                  <div className="h-1 bg-surface rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-orange" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div><span className={statusBadge(c.status)}>{c.status}</span></div>
                <ChevronDown className={`w-4 h-4 transition ${open === c.id ? "rotate-180" : ""}`} />
              </button>
              {open === c.id && (
                <div className="bg-surface px-6 py-4 space-y-2">
                  {[
                    { store: "FamilyMart Q.1", exec: "Khoa N.", status: "Assigned" },
                    { store: "Circle K Q.3", exec: "Unassigned", status: "Open" },
                    { store: "GS25 Q.7", exec: "Hương P.", status: "Completed" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between text-sm bg-card border border-border rounded-md px-3 py-2">
                      <div>
                        <div className="font-medium">{row.store}</div>
                        <div className="text-xs text-muted-foreground">{row.exec} · {row.status}</div>
                      </div>
                      <div className="flex gap-2">
                        {c.status === "Urgent" && <button className="text-xs px-3 py-1.5 bg-orange text-orange-foreground rounded-[5px] font-semibold">{"Force Surge"}</button>}
                        <button className="text-xs px-3 py-1.5 border border-border rounded-[5px]">{"Reassign"}</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
