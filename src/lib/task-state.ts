const DECLINED_TASKS_KEY = "veasyble_declined_task_ids";

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
