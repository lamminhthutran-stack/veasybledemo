import { Clock, MapPin, RotateCcw, Star } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { executor, tasks } from "@/lib/mock-data";
import {
  findTask,
  getDeclinedTaskIds,
  getTaskHistory,
  isTaskExpired,
  restoreTask,
  type TaskHistoryEntry,
} from "@/lib/task-state";

import { Fragment, useState } from "react";
import { LogoutButton } from "@/components/LogoutButton";

export const Route = createFileRoute("/executor/profile/")({
  component: ExecutorProfile,
});

const slots = ["Morning", "Afternoon", "Evening"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function ExecutorProfile() {
  const [declinedTaskIds, setDeclinedTaskIds] = useState(() => getDeclinedTaskIds());
  const [history] = useState(() => getTaskHistory());
  const declinedTasks = tasks.filter((task) => declinedTaskIds.includes(task.id));

  const unhideDeclinedTask = (taskId: string) => {
    restoreTask(taskId);
    setDeclinedTaskIds(getDeclinedTaskIds());
  };

  return (
    <div className="px-4 py-5 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-orange text-orange-foreground flex items-center justify-center font-bold text-lg">NK</div>
        <div>
          <div className="font-semibold">{executor.name}</div>
          <span className="badge badge-navy mt-1">{executor.tier}</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[5px] p-4">
        <div className="flex items-end gap-2">
          <div className="text-3xl font-bold">{executor.rating}</div>
          <Star className="w-6 h-6 fill-orange text-orange mb-1" />
        </div>
        <div className="text-xs text-muted-foreground">{executor.tasksCompleted} tasks completed</div>
        <div className="mt-3 flex items-end gap-1 h-12">
          {[4.2, 4.4, 4.5, 4.3, 4.7, 4.6].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-orange/80 rounded-sm" style={{ height: `${(v - 3) * 30}px` }} />
              <div className="text-[9px] text-muted-foreground">M{i + 1}</div>
            </div>
          ))}
        </div>
      </div>

      <section>
        <h2 className="font-semibold mb-1">Availability Settings</h2>
        <p className="text-xs text-muted-foreground mb-3">More availability = higher task priority</p>
        <div className="bg-card border border-border rounded-[5px] p-3">
          <div className="grid grid-cols-8 gap-1 text-[10px]">
            <div></div>
            {days.map((d) => <div key={d} className="text-center font-semibold">{d}</div>)}
            {slots.map((slot) => (
              <Fragment key={slot}>
                <div className="text-muted-foreground py-1">{slot}</div>
                {days.map((d) => {
                  const on = (d.length + slot.length) % 2 === 0;
                  return (
                    <div
                      key={d + slot}
                      className={`h-7 rounded ${on ? "bg-orange" : "bg-surface border border-border"}`}
                    />
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Lịch sử</h2>
        <div className="space-y-3">
          {history.map((entry) => (
            <HistoryCard key={`${entry.taskId}-${entry.completedAt}`} entry={entry} />
          ))}
          {!history.length && (
            <div className="rounded-[5px] border border-dashed border-border bg-surface px-4 py-6 text-center text-sm text-muted-foreground">
              No completed task history yet.
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Đã từ chối</h2>
        <div className="bg-card border border-border rounded-[5px] divide-y divide-border overflow-hidden">
          {declinedTasks.length ? (
            declinedTasks.map((task) => {
              const expired = isTaskExpired(task);
              return (
                <div key={task.id} className="p-4 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold leading-tight">{task.campaign}</div>
                      <div className="mt-1 space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{task.store}</div>
                        <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{task.date} · {task.time}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={expired}
                      onClick={() => unhideDeclinedTask(task.id)}
                      className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground disabled:opacity-40"
                    >
                      <RotateCcw className="w-3 h-3" />
                      {expired ? "Expired" : "Unhide"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-4 py-5 text-center text-sm text-muted-foreground">No declined tasks.</div>
          )}
        </div>
      </section>

      <section className="text-sm">
        <h2 className="font-semibold mb-2">Account</h2>
        <div className="bg-card border border-border rounded-[5px] divide-y divide-border">
          {["Edit profile", "Change password"].map((i) => (
            <button key={i} className="w-full text-left px-4 py-3">{i}</button>
          ))}
          <div className="px-1 py-1">
            <LogoutButton />
          </div>
        </div>
        <Link to="/login" className="block text-center text-xs text-danger mt-4">Request Deactivation</Link>
      </section>
    </div>
  );
}

function HistoryCard({ entry }: { entry: TaskHistoryEntry }) {
  const task = findTask(entry.taskId);
  const status = getStatusDisplay(entry.status);

  if (!task) return null;

  return (
    <div className="bg-card border border-border rounded-[5px] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-sm leading-tight">{task.campaign}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{task.brand}</div>
        </div>
        <span className={status.className}>{status.label}</span>
      </div>
      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{task.store}</div>
        <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" />Completed {formatDate(entry.completedAt)}</div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-[5px] bg-surface px-3 py-2">
          <div className="text-muted-foreground">Pay received</div>
          <div className="font-semibold text-orange">{entry.payReceived}</div>
        </div>
        <div className="rounded-[5px] bg-surface px-3 py-2">
          <div className="text-muted-foreground">Rating</div>
          <div className="font-semibold">{entry.rating > 0 ? "★".repeat(entry.rating) : "No rating"}</div>
        </div>
      </div>
    </div>
  );
}

function getStatusDisplay(status: TaskHistoryEntry["status"]) {
  if (status === "completed") return { label: "Completed ✓", className: "badge badge-success" };
  if (status === "rejected") return { label: "Rejected ✗", className: "badge badge-danger" };
  return { label: "Cancelled", className: "badge badge-gray" };
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
