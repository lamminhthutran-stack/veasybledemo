import {
  type Task,
  type DayOfWeek,
  type TimeSlot,
  type WeeklyAvailability,
  type AvailableTask,
} from "./mock-data";

/**
 * Parses "YYYY-MM-DD" and returns the DayOfWeek
 */
export function getTaskDayOfWeek(dateString: string): DayOfWeek {
  const date = new Date(dateString);
  const days: DayOfWeek[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

/**
 * Parses time strings like "9:00-11:00 AM", "1:00-3:00 PM" into TimeSlot
 * Morning: 08:00 – 13:00 (Basically anything with AM, except 12:00 AM)
 * Afternoon: 13:00 – 18:00 (1 PM - 5 PM)
 * Evening: 18:00 – 22:00 (6 PM - 10 PM)
 */
export function getTaskTimeSlot(timeString: string): TimeSlot {
  const normalized = timeString.toUpperCase();

  // Quick AM/PM check
  if (normalized.includes("AM")) {
    return "Morning";
  }

  // It's PM (or 24h, but our mock data uses AM/PM)
  // Extract the first hour number
  const hourMatch = normalized.match(/(\d+):/);
  if (hourMatch) {
    const hour12 = parseInt(hourMatch[1], 10);
    // If it's 12 PM, it's Afternoon
    if (hour12 === 12) return "Afternoon";
    // If it's 1-5 PM, it's Afternoon
    if (hour12 >= 1 && hour12 <= 5) return "Afternoon";
    // Otherwise Evening
    return "Evening";
  }

  // Fallback
  return "Morning";
}

/**
 * Checks if a task matches the provided weekly availability
 */
export function isTaskMatchingAvailability(
  task: AvailableTask | Task,
  availability: WeeklyAvailability[],
): boolean {
  if (availability.length === 0) return false;

  // Use task.date (AvailableTask) or task.date (Task but formatted as DD/MM/YYYY vs YYYY-MM-DD)
  // AvailableTask date is "YYYY-MM-DD"
  // Task date is "DD/MM/YYYY"
  let parsedDate = task.date;
  if (parsedDate.includes("/")) {
    const [d, m, y] = parsedDate.split("/");
    parsedDate = `${y}-${m}-${d}`;
  }

  const day = getTaskDayOfWeek(parsedDate);
  const timeStr = "scheduledTime" in task ? task.scheduledTime : task.time;
  const slot = getTaskTimeSlot(timeStr);

  return availability.some((a) => a.day === day && a.slot === slot);
}
