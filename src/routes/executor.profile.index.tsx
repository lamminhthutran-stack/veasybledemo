import { createFileRoute, Link } from "@tanstack/react-router";
import { executor, tasks } from "@/lib/mock-data";
import { getDeclinedTaskIds, restoreTask } from "@/lib/task-state";
import { Clock, MapPin, RotateCcw, Star } from "lucide-react";
import { Fragment, useState } from "react";

export const Route = createFileRoute("/executor/profile/")({
  component: ExecutorProfile,
});

const slots = ["Morning", "Afternoon", "Evening"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function ExecutorProfile() {
  const [declinedTaskIds, setDeclinedTaskIds] = useState(() => getDeclinedTaskIds());
  const declinedTasks = tasks.filter((task) => declinedTaskIds.includes(task.id));

  const restoreDeclinedTask = (taskId: string) => {
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

      <div className="bg-card border border-border rounded-xl p-4">
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
        <div className="bg-card border border-border rounded-xl p-3">
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
        <h2 className="font-semibold mb-2">Đã từ chối</h2>
        <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
          {declinedTasks.length ? (
            declinedTasks.map((task) => (
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
                    onClick={() => restoreDeclinedTask(task.id)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restore
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-5 text-center text-sm text-muted-foreground">No declined tasks.</div>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Task History</h2>
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {[
            { name: "Pepsi Tết Push", status: "Completed", color: "badge-success" },
            { name: "Vinamilk Demo", status: "Completed", color: "badge-success" },
            { name: "TH True Milk POSM", status: "Cancelled", color: "badge-gray" },
          ].map((h) => (
            <div key={h.name} className="flex items-center justify-between px-4 py-3 text-sm">
              <span>{h.name}</span>
              <span className={`badge ${h.color}`}>{h.status}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="text-sm">
        <h2 className="font-semibold mb-2">Account</h2>
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {["Edit profile", "Change password", "Logout"].map((i) => (
            <button key={i} className="w-full text-left px-4 py-3">{i}</button>
          ))}
        </div>
        <Link to="/login" className="block text-center text-xs text-danger mt-4">Request Deactivation</Link>
      </section>
    </div>
  );
}
