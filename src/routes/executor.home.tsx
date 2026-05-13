import { createFileRoute, Link } from "@tanstack/react-router";
import { executor, tasks, type Task } from "@/lib/mock-data";
import { getCompletedTaskIds, getDeclinedTaskIds } from "@/lib/task-state";
import { MapPin, Clock, CalendarDays, Store, ChevronDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/executor/home")({
  component: ExecutorHome,
});

type HomeTab = "my" | "browse";
type TaskStatus = "Upcoming" | "In Progress";
type AcceptedTask = Task & { status: TaskStatus };

const acceptedTaskIds = ["t-001", "t-002"];
const acceptedTasks: AcceptedTask[] = acceptedTaskIds.map((id, index) => ({
  ...(tasks.find((task) => task.id === id) ?? tasks[index]),
  status: (["Upcoming", "In Progress"] as TaskStatus[])[index],
}));

function ExecutorHome() {
  const [activeTab, setActiveTab] = useState<HomeTab>("my");
  const [declinedTaskIds] = useState(() => getDeclinedTaskIds());
  const [completedTaskIds] = useState(() => getCompletedTaskIds());
  const hiddenTaskIds = new Set([...declinedTaskIds, ...completedTaskIds]);
  const myTasks = acceptedTasks.filter((task) => !hiddenTaskIds.has(task.id));
  const availableTasks = tasks.filter(
    (task) => !acceptedTaskIds.includes(task.id) && !hiddenTaskIds.has(task.id),
  );

  return (
    <div className="px-4 py-5 space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Xin chao, {executor.name.split(" ").slice(-1)[0]}</h1>
        <p className="text-sm text-muted-foreground">Manage committed work or find your next task.</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Stat label="Tasks Completed" value={executor.tasksCompleted.toString()} sub="this month" />
        <Stat label="Rating" value={`${executor.rating}★`} sub={`${executor.tasksCompleted} jobs`} />
        <Stat label="Earnings" value="3.4M" sub="VND" />
      </div>

      <div className="grid grid-cols-2 rounded-lg bg-surface p-1 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("my")}
          className={`rounded-md px-3 py-2 transition ${activeTab === "my" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
        >
          My Tasks
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("browse")}
          className={`rounded-md px-3 py-2 transition ${activeTab === "browse" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
        >
          Browse Tasks
        </button>
      </div>

      {activeTab === "my" ? (
        <section className="space-y-3">
          {myTasks.map((task) => (
            <MyTaskCard key={task.id} task={task} />
          ))}
          {!myTasks.length && <EmptyState text="No committed tasks right now." />}
        </section>
      ) : (
        <section className="space-y-3">
          <FilterBar />
          {availableTasks.map((task) => (
            <TaskCard key={task.id} t={task} />
          ))}
          {!availableTasks.length && <EmptyState text="No available tasks match your list." />}
        </section>
      )}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3 text-center">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground leading-tight">{label}</div>
      <div className="text-lg font-bold mt-0.5">{value}</div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface px-4 py-6 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function FilterBar() {
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="grid grid-cols-3 gap-2">
        <FilterSelect icon={<CalendarDays className="w-3.5 h-3.5" />} label="Time" options={["Today", "This Week", "This Month"]} />
        <FilterSelect icon={<MapPin className="w-3.5 h-3.5" />} label="Location" options={["All", "Quan 1", "Quan 5", "Quan 7", "Go Vap"]} />
        <FilterSelect icon={<Store className="w-3.5 h-3.5" />} label="Brand" options={["All", "Pepsi", "Unilever", "Masan"]} />
      </div>
    </div>
  );
}

function FilterSelect({ icon, label, options }: { icon: React.ReactNode; label: string; options: string[] }) {
  return (
    <label className="min-w-0">
      <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="relative block">
        <select className="w-full appearance-none rounded-md border border-border bg-background px-2 py-2 pr-6 text-xs font-medium outline-none focus:ring-2 focus:ring-orange/30">
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      </span>
    </label>
  );
}

function MyTaskCard({ task }: { task: AcceptedTask }) {
  const statusClass = task.status === "In Progress" ? "badge badge-orange" : "badge";

  return (
    <Link
      to="/executor/task/$id"
      params={{ id: task.id }}
      className="block bg-card border border-border rounded-xl p-4 shadow-sm transition hover:border-orange/50"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="font-semibold text-sm leading-tight">{task.campaign}</div>
        <span className={statusClass}>{task.status}</span>
      </div>
      <div className="text-xs text-muted-foreground space-y-1">
        <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{task.store}</div>
        <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{task.date} · {task.time}</div>
      </div>
    </Link>
  );
}

export function TaskCard({ t }: { t: { id: string; campaign: string; brand?: string; store: string; district: string; date: string; time: string; pay: string; badge?: string } }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="font-semibold text-sm leading-tight">{t.campaign}</div>
          {t.brand && <div className="text-xs text-muted-foreground mt-0.5">{t.brand}</div>}
        </div>
        {t.badge === "outside" && <span className="badge badge-orange">Outside Your Availability</span>}
      </div>
      <div className="text-xs text-muted-foreground space-y-1 mb-3">
        <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{t.store} · {t.district}</div>
        <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{t.date} · {t.time}</div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="text-orange font-bold text-sm">{t.pay}</div>
        <Link
          to="/executor/task/$id"
          params={{ id: t.id }}
          className="bg-orange text-orange-foreground text-xs font-semibold px-3 py-1.5 rounded-md whitespace-nowrap"
        >
          View & Accept
        </Link>
      </div>
    </div>
  );
}
