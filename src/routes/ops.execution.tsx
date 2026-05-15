import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  getStartedTasks,
  getTaskHistory,
  getCancelledTaskIds,
  findTask,
  type TaskHistoryEntry,
} from "@/lib/task-state";
import { ReviewModal } from "@/components/ReviewModal";
import { Clock, AlertTriangle, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/ops/execution")({
  component: SubmissionsCheck,
});

function SubmissionsCheck() {
  const [now, setNow] = useState(Date.now());
  const [selectedTask, setSelectedTask] = useState<{ taskId: string } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const started = getStartedTasks();
  const history = getTaskHistory();
  const cancelled = getCancelledTaskIds();

  // Exclude tasks that have already been submitted (in history) or cancelled
  const historyIds = new Set(history.map((h) => h.taskId));
  const cancelledIds = new Set(cancelled);

  const activeTaskEntries = Object.entries(started)
    .filter(([id]) => !historyIds.has(id) && !cancelledIds.has(id))
    .map(([id, startTime]) => {
      const task = findTask(id);
      const start = new Date(startTime).getTime();
      const elapsedMs = now - start;
      const elapsedHours = elapsedMs / (1000 * 60 * 60);

      let status: "on_time" | "overdue" | "critical" = "on_time";
      if (elapsedHours >= 8) status = "critical";
      else if (elapsedHours >= 4) status = "overdue";

      return {
        id,
        task,
        startTime,
        elapsedMs,
        elapsedHours,
        status,
      };
    })
    .filter((entry) => entry.task != null);

  const stats = {
    total: activeTaskEntries.length,
    onTime: activeTaskEntries.filter((e) => e.status === "on_time").length,
    overdue: activeTaskEntries.filter((e) => e.status === "overdue").length,
    critical: activeTaskEntries.filter((e) => e.status === "critical").length,
  };

  const formatElapsed = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Submissions Check</h1>

      {/* Summary Bar */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-[5px] p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-[5px]">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Total Active</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-[5px] p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-[5px]">
            <CheckCircleIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">On Time</p>
            <p className="text-2xl font-bold text-gray-900">{stats.onTime}</p>
          </div>
        </div>
        <div className="bg-white border border-orange-200 rounded-[5px] p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-[5px]">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-orange-600 uppercase">Overdue</p>
            <p className="text-2xl font-bold text-orange-700">{stats.overdue}</p>
          </div>
        </div>
        <div className="bg-white border border-red-200 rounded-[5px] p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-[5px]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-600 uppercase">Critical</p>
            <p className="text-2xl font-bold text-red-700">{stats.critical}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-[5px] shadow-sm overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[1.5fr_2fr_1fr_1.5fr_1fr] gap-4 px-6 py-4 text-xs font-semibold text-gray-500 border-b border-gray-100 uppercase tracking-wider bg-gray-50">
            <div>Executor</div>
            <div>Task</div>
            <div>Brand</div>
            <div>Time Started</div>
            <div className="text-right">Elapsed Time</div>
          </div>

          {activeTaskEntries.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-500">
              No tasks currently in execution.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {activeTaskEntries.map((entry) => {
                const isCritical = entry.status === "critical";
                const isOverdue = entry.status === "overdue";

                let rowBg = "hover:bg-gray-50";
                if (isCritical) rowBg = "bg-red-50 hover:bg-red-100 border-l-4 border-l-red-500";
                else if (isOverdue)
                  rowBg = "bg-orange-50 hover:bg-orange-100 border-l-4 border-l-orange-500";
                else rowBg += " border-l-4 border-l-transparent";

                return (
                  <div
                    key={entry.id}
                    className={`px-6 py-4 cursor-pointer transition-colors ${rowBg}`}
                    onClick={() => setSelectedTask({ taskId: entry.id })}
                  >
                    <div className="grid grid-cols-[1.5fr_2fr_1fr_1.5fr_1fr] gap-4 items-center text-sm">
                      <div className="font-medium text-gray-900 truncate">Nguyen Khoa</div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {entry.task!.campaign}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{entry.task!.store}</p>
                      </div>
                      <div className="text-gray-600 truncate">{entry.task!.brand}</div>
                      <div className="text-gray-500 truncate">
                        {new Date(entry.startTime).toLocaleString()}
                      </div>
                      <div
                        className={`text-right font-bold ${isCritical ? "text-red-700" : isOverdue ? "text-orange-700" : "text-gray-900"}`}
                      >
                        {formatElapsed(entry.elapsedMs)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedTask && (
        <ReviewModal
          entry={{ taskId: selectedTask.taskId } as TaskHistoryEntry}
          onClose={() => setSelectedTask(null)}
          onApprove={() => {
            // Live execution view shouldn't really approve tasks (since they haven't submitted),
            // but the modal requires this handler. For demonstration, we just close.
            setSelectedTask(null);
          }}
          onReject={() => {
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}

function CheckCircleIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  );
}
