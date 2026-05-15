import { Megaphone, MapPin, Camera, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";


export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number; // index
};

export type Module = {
  id: string;
  num: number;
  title: string;
  desc: string;
  icon: LucideIcon;
  duration: string;
  summary: string[];
  questions: QuizQuestion[];
};

export const modules: Module[] = [
  {
    id: "1",
    num: 1,
    title: "Veasyble & Campaign Basics",
    desc: "Learn what Veasyble is and how campaign execution works",
    icon: Megaphone,
    duration: "5:32",
    summary: [
      "Veasyble connects Brands with Executors to execute campaigns at POS",
      "Each task includes: pick up materials, go to store, setup, and submit PoP",
      "Executors are paid per completed task",
      "Veasyble platform automatically assigns tasks based on availability and rating",
    ],
    questions: [
      { q: "What industry does Veasyble operate in?", options: ["Logistics", "Retail visibility", "E-commerce", "Food delivery"], answer: 1 },
      { q: "What is the Executor's task?", options: ["Campaign design", "Delivery", "Setup campaign at store", "Brand management"], answer: 2 },
      { q: "What does PoP stand for?", options: ["Point of Payment", "Proof of Placement", "Part of Process", "Photo of Place"], answer: 1 },
      { q: "Who assigns tasks to Executors?", options: ["Brand", "Retailer", "Veasyble platform", "Executors choose themselves"], answer: 2 },
      { q: "What should an Executor do after completing a task?", options: ["Call to report", "Send email", "Submit PoP via app", "Do nothing"], answer: 2 },
    ],
  },
  {
    id: "2",
    num: 2,
    title: "Check-in & On-site Process",
    desc: "GPS check-in, selfie with store sign, and store workflow",
    icon: MapPin,
    duration: "6:18",
    summary: [
      "GPS check-in confirms you are at the correct location and time",
      "Selfie must clearly show the store sign in the background",
      "SOP checklist guides the step-by-step campaign setup",
      "If you encounter an issue at the store, raise a dispute in the app - do not handle it yourself",
    ],
    questions: [
      { q: "What does GPS check-in confirm?", options: ["Executor has printed materials", "Executor is at the correct location", "Task is completed", "Materials have been received"], answer: 1 },
      { q: "What must be in the selfie?", options: ["Only the face", "Clear store sign", "Planogram", "Receipt"], answer: 1 },
      { q: "If you are more than 15 minutes late to check-in?", options: ["It's fine", "Pay is partially deducted", "Task is cancelled and surged immediately", "Account suspended"], answer: 2 },
      { q: "What is the SOP checklist used for?", options: ["Identity verification", "Step-by-step campaign setup guide", "Calculate pay", "Contact brand"], answer: 1 },
      { q: "When the store refuses entry, the Executor should?", options: ["Leave", "Handle it themselves", "Raise dispute in app - no pay deduction", "Call the brand"], answer: 2 },
    ],
  },
  {
    id: "3",
    num: 3,
    title: "Proof of Placement (PoP)",
    desc: "How to take correct photos and successfully submit PoP",
    icon: Camera,
    duration: "4:45",
    summary: [
      "PoP must include photo + metadata + timestamp",
      "Timestamp confirms the photo was taken during check-in",
      "If PoP photo is rejected due to blur, retake immediately",
      "After submission, the task moves to Under Review status",
    ],
    questions: [
      { q: "What must PoP include?", options: ["Only setup photo", "Photo + metadata + timestamp", "Full video recording", "Retailer signature"], answer: 1 },
      { q: "Why is the timestamp important?", options: ["To calculate pay", "Confirms photo was taken during check-in", "To contact brand", "Not important"], answer: 1 },
      { q: "If PoP photo is rejected due to blur?", options: ["Report to Veasyble Team", "Retake immediately on site", "Send email", "Ignore"], answer: 1 },
      { q: "What is photo metadata used for?", options: ["Decoration", "Detect editing or forgery", "Save executor name", "Calculate money"], answer: 1 },
      { q: "After successful PoP submission?", options: ["Receive money immediately", "Task moves to Under Review", "Executor self-evaluates", "Brand contacts"], answer: 1 },
    ],
  },
  {
    id: "4",
    num: 4,
    title: "Platform Rules & Rating",
    desc: "Lateness policy, task cancellation, and Veasyble rating system",
    icon: Shield,
    duration: "5:10",
    summary: [
      "Rating is calculated from the average of Brand + Retailer ratings",
      "Rating >= 4.0 is considered Healthy",
      "Below 3.5 triggers an auto-reminder and Veasyble review",
      "Cancelling a task after printing materials incurs a heavy rating penalty and account flag",
    ],
    questions: [
      { q: "What happens if you check-in 10 minutes late?", options: ["Nothing happens", "Deduct proportional pay", "Task cancelled immediately", "Account locked"], answer: 1 },
      { q: "If you check-in 20 minutes late?", options: ["Can still work normally", "50% pay deduction", "Task automatically cancelled and given to another executor (surge)", "Only a warning"], answer: 2 },
      { q: "Executor rating is based on?", options: ["Score decided by Veasyble forever", "Only Brand review", "Rating from Brand and Retailer (after first job)", "Executor self-rates"], answer: 2 },
      { q: "What rating is considered Healthy?", options: ["3.0 or above", "3.5 or above", "4.0 or above", "Perfect 5.0"], answer: 2 },
      { q: "When arriving at the store but refused entry for setup, you should?", options: ["Leave and lose the task", "Select 'Store refused entry' in app, keep full pay", "Argue with security", "Call Brand immediately to complain"], answer: 1 },
    ],
  },
];

export const getModule = (id: string) => modules.find((m) => m.id === id) ?? modules[0];

// Simple localStorage-backed progress
const KEY = "veasyble_academy_progress";
type Progress = Record<string, { passed: boolean; score: number }>;

export const getProgress = (): Progress => {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
};
export const setModuleResult = (id: string, score: number) => {
  if (typeof window === "undefined") return;
  const p = getProgress();
  p[id] = { passed: score >= 70, score };
  localStorage.setItem(KEY, JSON.stringify(p));
};
export const isUnlocked = (num: number) => {
  if (num === 1) return true;
  const p = getProgress();
  const prev = modules[num - 2];
  return !!p[prev.id]?.passed;
};
export const completedCount = () => {
  const p = getProgress();
  return modules.filter((m) => p[m.id]?.passed).length;
};
export const isAcademyComplete = () => completedCount() === modules.length;
export const completeAcademyForDemo = () => {
  if (typeof window === "undefined") return;
  const p: Progress = {};
  modules.forEach((m) => {
    p[m.id] = { passed: true, score: 100 };
  });
  localStorage.setItem(KEY, JSON.stringify(p));
};
export const avgScore = () => {
  const p = getProgress();
  const scores = modules.map((m) => p[m.id]?.score).filter((s): s is number => typeof s === "number");
  if (!scores.length) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
};
export const resetProgress = () => {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
};
