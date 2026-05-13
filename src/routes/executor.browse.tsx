import { createFileRoute } from "@tanstack/react-router";
import { tasks } from "@/lib/mock-data";
import { getDeclinedTaskIds } from "@/lib/task-state";
import { TaskCard } from "./executor.home";
import { useState } from "react";

export const Route = createFileRoute("/executor/browse")({
  component: BrowsePool,
});

function BrowsePool() {
  const [declinedTaskIds] = useState(() => getDeclinedTaskIds());
  const visibleTasks = tasks.filter((task) => !declinedTaskIds.includes(task.id));

  return (
    <div className="px-4 py-5 space-y-4">
      <div>
        <h1 className="text-xl font-bold">More Jobs Available</h1>
        <p className="text-sm text-muted-foreground">These jobs fall outside your availability. You can still accept them.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {["All Cities", "All Dates", "Any Pay"].map((f) => (
          <button key={f} className="text-xs px-3 py-1.5 rounded-full border border-border bg-card whitespace-nowrap">
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visibleTasks.map((t) => <TaskCard key={t.id} t={{ ...t, badge: t.badge === "outside" ? "outside" : "available" }} />)}
        {!visibleTasks.length && (
          <div className="rounded-xl border border-dashed border-border bg-surface px-4 py-6 text-center text-sm text-muted-foreground">
            No available tasks right now.
          </div>
        )}
      </div>
    </div>
  );
}
