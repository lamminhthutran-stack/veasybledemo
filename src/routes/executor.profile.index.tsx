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
import {
  getWeeklyAvailability,
  setWeeklyAvailability,
  type DayOfWeek,
  type TimeSlot,
  type WeeklyAvailability,
} from "@/lib/mock-data";

export const Route = createFileRoute("/executor/profile/")({
  component: ExecutorProfile,
});

const slots: TimeSlot[] = ["Morning", "Afternoon", "Evening"];
const days: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function ExecutorProfile() {
  const [declinedTaskIds, setDeclinedTaskIds] = useState(() => getDeclinedTaskIds());
  const [historyRaw] = useState(() => getTaskHistory());
  const history = historyRaw.filter(
    (h) => h.status !== "in_review" && h.status !== "revision_required",
  );
  const declinedTasks = tasks.filter((task) => declinedTaskIds.includes(task.id));

  const [availability, setAvailability] = useState<WeeklyAvailability[]>(() =>
    getWeeklyAvailability(),
  );
  const [savedMessage, setSavedMessage] = useState("");

  const unhideDeclinedTask = (taskId: string) => {
    restoreTask(taskId);
    setDeclinedTaskIds(getDeclinedTaskIds());
  };

  const toggleSlot = (day: DayOfWeek, slot: TimeSlot) => {
    setAvailability((prev) => {
      const exists = prev.some((a) => a.day === day && a.slot === slot);
      if (exists) {
        return prev.filter((a) => !(a.day === day && a.slot === slot));
      }
      return [...prev, { day, slot }];
    });
    setSavedMessage("");
  };

  const selectAll = () => {
    const all: WeeklyAvailability[] = [];
    for (const d of days) {
      for (const s of slots) {
        all.push({ day: d, slot: s });
      }
    }
    setAvailability(all);
    setSavedMessage("");
  };

  const clearAll = () => {
    setAvailability([]);
    setSavedMessage("");
  };

  const saveAvailability = () => {
    setWeeklyAvailability(availability);
    setSavedMessage("Saved!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  return (
    <div className="px-4 py-5 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-orange text-orange-foreground flex items-center justify-center font-bold text-lg">
          NK
        </div>
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
        <div className="text-xs text-muted-foreground">
          {executor.tasksCompleted} tasks completed
        </div>
        <div className="mt-3 flex items-end gap-1 h-12">
          {[4.2, 4.4, 4.5, 4.3, 4.7, 4.6].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-orange/80 rounded-sm"
                style={{ height: `${(v - 3) * 30}px` }}
              />
              <div className="text-[9px] text-muted-foreground">M{i + 1}</div>
            </div>
          ))}
        </div>
      </div>

      <section>
        <h2 className="font-semibold mb-1">Availability Settings</h2>
        <p className="text-xs text-muted-foreground mb-3">
          More availability = higher task priority
        </p>
        <div className="bg-card border border-border rounded-[5px] p-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-[10px] font-semibold px-2 py-1 bg-surface border border-border rounded"
              >
                Select All
              </button>
              <button
                onClick={clearAll}
                className="text-[10px] font-semibold px-2 py-1 bg-surface border border-border rounded"
              >
                Clear All
              </button>
            </div>
            {savedMessage && (
              <span className="text-[10px] font-bold text-success">{savedMessage}</span>
            )}
          </div>
          <div className="grid grid-cols-8 gap-1 text-[10px]">
            <div></div>
            {days.map((d) => (
              <div key={d} className="text-center font-semibold">
                {d}
              </div>
            ))}
            {slots.map((slot) => (
              <Fragment key={slot}>
                <div className="text-muted-foreground py-1 text-xs">
                  {slot === "Morning" ? "AM" : slot === "Afternoon" ? "PM" : "EVE"}
                </div>
                {days.map((d) => {
                  const on = availability.some((a) => a.day === d && a.slot === slot);
                  return (
                    <button
                      key={d + slot}
                      onClick={() => toggleSlot(d, slot)}
                      className={`h-7 rounded transition-colors ${on ? "bg-orange shadow-inner" : "bg-surface border border-border"}`}
                    />
                  );
                })}
              </Fragment>
            ))}
          </div>
          <button
            onClick={saveAvailability}
            className="w-full mt-4 bg-[#1A3557] text-white text-xs font-semibold py-2.5 rounded-[5px]"
          >
            Save Availability
          </button>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">History</h2>
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
        <h2 className="font-semibold mb-2">Rejected</h2>
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
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" />
                          {task.store}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {task.date} · {task.time}
                        </div>
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
            <div className="px-4 py-5 text-center text-sm text-muted-foreground">
              No declined tasks.
            </div>
          )}
        </div>
      </section>

      <section className="text-sm">
        <h2 className="font-semibold mb-2">Account</h2>
        <div className="bg-card border border-border rounded-[5px] divide-y divide-border">
          {["Edit profile", "Change password"].map((i) => (
            <button key={i} className="w-full text-left px-4 py-3">
              {i}
            </button>
          ))}
          <div className="px-1 py-1">
            <LogoutButton />
          </div>
        </div>
        <Link to="/login" className="block text-center text-xs text-danger mt-4">
          Request Deactivation
        </Link>
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
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3" />
          {task.store}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          {entry.status === "cancelled" ? "Cancelled" : "Completed"} {formatDate(entry.completedAt)}
        </div>
      </div>
      {entry.status !== "cancelled" && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-[5px] bg-surface px-3 py-2">
            <div className="text-muted-foreground">Pay received</div>
            <div className="font-semibold text-orange">{entry.payReceived}</div>
          </div>
          <div className="rounded-[5px] bg-surface px-3 py-2">
            <div className="text-muted-foreground">Rating</div>
            <div className="font-semibold">
              {entry.rating > 0 ? "★".repeat(entry.rating) : "No rating"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusDisplay(status: TaskHistoryEntry["status"]) {
  if (status === "completed")
    return { label: "Completed — Paid", className: "badge badge-success" };
  if (status === "revision_required")
    return { label: "Revision Required", className: "badge badge-warning" };
  if (status === "rejected") return { label: "Rejected", className: "badge badge-danger" };
  return { label: "Cancelled", className: "badge badge-gray" };
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
