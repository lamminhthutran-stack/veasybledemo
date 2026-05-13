import { tasks, type Task } from "@/lib/mock-data";

const DECLINED_TASKS_KEY = "veasyble_declined_task_ids";
const TASK_HISTORY_KEY = "veasyble_task_history";

export type TaskHistoryStatus = "completed" | "rejected" | "cancelled";
export type TaskHistoryEntry = {
  taskId: string;
  status: TaskHistoryStatus;
  completedAt: string;
  payReceived: string;
  rating: number;
};

const seededHistory: TaskHistoryEntry[] = [
  {
    taskId: "t-004",
    status: "completed",
    completedAt: "2026-05-12T10:30:00.000Z",
    payReceived: "190,000 VND",
    rating: 5,
  },
  {
    taskId: "t-005",
    status: "rejected",
    completedAt: "2026-05-10T08:15:00.000Z",
    payReceived: "0 VND",
    rating: 0,
  },
  {
    taskId: "t-003",
    status: "cancelled",
    completedAt: "2026-05-08T09:00:00.000Z",
    payReceived: "0 VND",
    rating: 0,
  },
];

export const getDeclinedTaskIds = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(DECLINED_TASKS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
};

export const isTaskDeclined = (taskId: string) => getDeclinedTaskIds().includes(taskId);

export const declineTask = (taskId: string) => {
  if (typeof window === "undefined") return;
  const next = Array.from(new Set([...getDeclinedTaskIds(), taskId]));
  localStorage.setItem(DECLINED_TASKS_KEY, JSON.stringify(next));
};

export const restoreTask = (taskId: string) => {
  if (typeof window === "undefined") return;
  const next = getDeclinedTaskIds().filter((id) => id !== taskId);
  localStorage.setItem(DECLINED_TASKS_KEY, JSON.stringify(next));
};

export const getTaskHistory = (): TaskHistoryEntry[] => {
  if (typeof window === "undefined") return seededHistory;
  try {
    const parsed = JSON.parse(localStorage.getItem(TASK_HISTORY_KEY) || "[]");
    const saved = Array.isArray(parsed) ? parsed.filter(isTaskHistoryEntry) : [];
    const savedIds = new Set(saved.map((entry) => entry.taskId));
    return [...saved, ...seededHistory.filter((entry) => !savedIds.has(entry.taskId))].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );
  } catch {
    return seededHistory;
  }
};

export const getCompletedTaskIds = () =>
  getTaskHistory()
    .filter((entry) => entry.status === "completed")
    .map((entry) => entry.taskId);

export const completeTask = (task: Task) => {
  if (typeof window === "undefined") return;
  const existing = getTaskHistory().filter((entry) => entry.taskId !== task.id);
  const next: TaskHistoryEntry[] = [
    {
      taskId: task.id,
      status: "completed",
      completedAt: new Date().toISOString(),
      payReceived: task.pay,
      rating: 5,
    },
    ...existing,
  ];
  localStorage.setItem(TASK_HISTORY_KEY, JSON.stringify(next));
};

export const isTaskExpired = (task: Task) => {
  const [day, month, year] = task.date.split("/").map(Number);
  if (!day || !month || !year) return false;
  const taskDate = new Date(year, month - 1, day, 23, 59, 59);
  return taskDate.getTime() < Date.now();
};

const isTaskHistoryEntry = (value: unknown): value is TaskHistoryEntry => {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<TaskHistoryEntry>;
  return (
    typeof entry.taskId === "string" &&
    typeof entry.completedAt === "string" &&
    typeof entry.payReceived === "string" &&
    typeof entry.rating === "number" &&
    (entry.status === "completed" || entry.status === "rejected" || entry.status === "cancelled")
  );
};

export const findTask = (taskId: string) => tasks.find((task) => task.id === taskId);
