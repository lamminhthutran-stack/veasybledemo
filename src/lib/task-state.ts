import { tasks, type Task } from "@/lib/mock-data";

const DECLINED_TASKS_KEY = "veasyble_declined_task_ids";
const ACCEPTED_TASKS_KEY = "veasyble_accepted_task_ids";
const TASK_HISTORY_KEY = "veasyble_task_history";

const SEEDED_ACCEPTED_IDS = ["t-001", "t-002"];

const CANCELLED_TASKS_KEY = "veasyble_cancelled_task_ids";
const PRINT_PICKUPS_KEY = "veasyble_print_pickup_confirmed";
const STARTED_TASKS_KEY = "veasyble_started_tasks";

export const getStartedTasks = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(STARTED_TASKS_KEY) || "null");
    if (parsed && typeof parsed === "object") return parsed;
    
    // Seed with demo data
    const now = Date.now();
    const seeds = {
      "t-001": new Date(now - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      "t-002": new Date(now - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago (overdue)
      "t-003": new Date(now - 9 * 60 * 60 * 1000).toISOString(), // 9 hours ago (critically overdue)
    };
    localStorage.setItem(STARTED_TASKS_KEY, JSON.stringify(seeds));
    return seeds;
  } catch {
    return {};
  }
};

export const startTask = (taskId: string) => {
  if (typeof window === "undefined") return;
  const started = getStartedTasks();
  if (!started[taskId]) {
    started[taskId] = new Date().toISOString();
    localStorage.setItem(STARTED_TASKS_KEY, JSON.stringify(started));
  }
};

export const getConfirmedPickups = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(PRINT_PICKUPS_KEY) || "{}");
    return typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const confirmPrintPickup = (taskId: string) => {
  if (typeof window === "undefined") return;
  const pickups = getConfirmedPickups();
  pickups[taskId] = new Date().toISOString();
  localStorage.setItem(PRINT_PICKUPS_KEY, JSON.stringify(pickups));
};

export const getCancelledTaskIds = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(CANCELLED_TASKS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
};

export const cancelTask = (taskId: string) => {
  if (typeof window === "undefined") return;
  const cancelled = Array.from(new Set([...getCancelledTaskIds(), taskId]));
  localStorage.setItem(CANCELLED_TASKS_KEY, JSON.stringify(cancelled));
  const remaining = getAcceptedTaskIds().filter((id) => id !== taskId);
  localStorage.setItem(ACCEPTED_TASKS_KEY, JSON.stringify(remaining));

  const existing = getTaskHistory().filter((entry) => entry.taskId !== taskId);
  const next: TaskHistoryEntry[] = [
    {
      taskId,
      status: "cancelled",
      completedAt: new Date().toISOString(),
      payReceived: "0",
      rating: 0,
    },
    ...existing,
  ];
  localStorage.setItem(TASK_HISTORY_KEY, JSON.stringify(next));
};

export const getAcceptedTaskIds = (): string[] => {
  if (typeof window === "undefined") return SEEDED_ACCEPTED_IDS;
  try {
    const parsed = JSON.parse(localStorage.getItem(ACCEPTED_TASKS_KEY) || "null");
    if (Array.isArray(parsed)) return parsed.filter((id): id is string => typeof id === "string");
    localStorage.setItem(ACCEPTED_TASKS_KEY, JSON.stringify(SEEDED_ACCEPTED_IDS));
    return SEEDED_ACCEPTED_IDS;
  } catch {
    return SEEDED_ACCEPTED_IDS;
  }
};

export const acceptTask = (taskId: string) => {
  if (typeof window === "undefined") return;
  const next = Array.from(new Set([...getAcceptedTaskIds(), taskId]));
  localStorage.setItem(ACCEPTED_TASKS_KEY, JSON.stringify(next));
};

export type TaskHistoryStatus = "completed" | "rejected" | "cancelled" | "in_review" | "revision_required";
export type TaskHistoryEntry = {
  taskId: string;
  status: TaskHistoryStatus;
  completedAt: string;
  payReceived: string;
  rating: number;
  rejectionReason?: string;
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

export const submitTask = (task: Task) => {
  if (typeof window === "undefined") return;
  // Remove from accepted tasks
  const remainingAccepted = getAcceptedTaskIds().filter((id) => id !== task.id);
  localStorage.setItem(ACCEPTED_TASKS_KEY, JSON.stringify(remainingAccepted));
  
  const existing = getTaskHistory().filter((entry) => entry.taskId !== task.id);
  const next: TaskHistoryEntry[] = [
    {
      taskId: task.id,
      status: "in_review",
      completedAt: new Date().toISOString(),
      payReceived: task.pay,
      rating: 0,
    },
    ...existing,
  ];
  localStorage.setItem(TASK_HISTORY_KEY, JSON.stringify(next));
};

export const approveTask = (taskId: string) => {
  if (typeof window === "undefined") return;
  const existing = getTaskHistory();
  const next = existing.map((entry) => {
    if (entry.taskId === taskId) {
      return { ...entry, status: "completed" as TaskHistoryStatus, rating: 5 };
    }
    return entry;
  });
  localStorage.setItem(TASK_HISTORY_KEY, JSON.stringify(next));
};

export const rejectTask = (taskId: string, reason: string) => {
  if (typeof window === "undefined") return;
  const existing = getTaskHistory();
  const next = existing.map((entry) => {
    if (entry.taskId === taskId) {
      return { ...entry, status: "revision_required" as TaskHistoryStatus, rejectionReason: reason };
    }
    return entry;
  });
  localStorage.setItem(TASK_HISTORY_KEY, JSON.stringify(next));
};

export const resubmitTask = (taskId: string) => {
  if (typeof window === "undefined") return;
  const existing = getTaskHistory();
  const next = existing.map((entry) => {
    if (entry.taskId === taskId) {
      return { ...entry, status: "in_review" as TaskHistoryStatus, rejectionReason: undefined, completedAt: new Date().toISOString() };
    }
    return entry;
  });
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
    (entry.status === "completed" || entry.status === "rejected" || entry.status === "cancelled" || entry.status === "in_review" || entry.status === "revision_required")
  );
};

export const findTask = (taskId: string) => tasks.find((task) => task.id === taskId);
