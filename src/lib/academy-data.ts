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
    desc: "Tìm hiểu Veasyble là gì và campaign execution hoạt động như thế nào",
    icon: Megaphone,
    duration: "5:32",
    summary: [
      "Veasyble kết nối Brand với Executor để thực thi campaign tại điểm bán",
      "Mỗi task bao gồm: nhận materials, di chuyển đến store, setup, và submit PoP",
      "Executor được trả theo task hoàn thành",
      "Veasyble platform tự động assign task dựa trên availability và rating",
    ],
    questions: [
      { q: "Veasyble hoạt động trong lĩnh vực nào?", options: ["Logistics", "Retail visibility", "E-commerce", "Food delivery"], answer: 1 },
      { q: "Executor có nhiệm vụ gì?", options: ["Thiết kế campaign", "Giao hàng", "Setup campaign tại store", "Quản lý brand"], answer: 2 },
      { q: "PoP là viết tắt của?", options: ["Point of Payment", "Proof of Placement", "Part of Process", "Photo of Place"], answer: 1 },
      { q: "Ai assign task cho Executor?", options: ["Brand", "Retailer", "Veasyble platform", "Executor tự chọn"], answer: 2 },
      { q: "Sau khi hoàn thành task, Executor cần làm gì?", options: ["Gọi điện báo", "Gửi email", "Submit PoP qua app", "Không cần làm gì"], answer: 2 },
    ],
  },
  {
    id: "2",
    num: 2,
    title: "Check-in & On-site Process",
    desc: "GPS check-in, selfie với bảng hiệu, và quy trình làm việc tại store",
    icon: MapPin,
    duration: "6:18",
    summary: [
      "GPS check-in xác nhận bạn có mặt tại đúng địa điểm và đúng thời gian",
      "Selfie cần có bảng hiệu store rõ ràng phía sau",
      "SOP checklist hướng dẫn từng bước setup campaign",
      "Nếu gặp vấn đề tại store, raise dispute trong app - không tự ý xử lý",
    ],
    questions: [
      { q: "GPS check-in xác nhận điều gì?", options: ["Executor đã in materials", "Executor có mặt tại đúng địa điểm", "Task đã hoàn thành", "Materials đã được nhận"], answer: 1 },
      { q: "Selfie cần có gì trong ảnh?", options: ["Chỉ khuôn mặt", "Bảng hiệu store rõ ràng", "Planogram", "Hóa đơn"], answer: 1 },
      { q: "Nếu trễ hơn 15 phút so với giờ check-in?", options: ["Không sao", "Bị trừ một phần pay", "Task bị hủy và surge ngay", "Bị suspend"], answer: 2 },
      { q: "SOP checklist dùng để làm gì?", options: ["Xác nhận danh tính", "Hướng dẫn từng bước setup campaign", "Tính lương", "Liên hệ brand"], answer: 1 },
      { q: "Khi store từ chối cho vào, Executor nên?", options: ["Bỏ về", "Tự xử lý", "Raise dispute trong app - không bị trừ pay", "Gọi cho brand"], answer: 2 },
    ],
  },
  {
    id: "3",
    num: 3,
    title: "Proof of Placement (PoP)",
    desc: "Cách chụp ảnh đúng chuẩn và submit PoP thành công",
    icon: Camera,
    duration: "4:45",
    summary: [
      "PoP cần bao gồm ảnh + metadata + timestamp",
      "Timestamp xác nhận ảnh được chụp đúng lúc check-in",
      "Nếu ảnh PoP bị reject do mờ, chụp lại tại chỗ ngay",
      "Sau khi submit, task chuyển sang trạng thái Under Review",
    ],
    questions: [
      { q: "PoP cần bao gồm gì?", options: ["Chỉ ảnh setup", "Ảnh + metadata + timestamp", "Video quay toàn bộ", "Chữ ký retailer"], answer: 1 },
      { q: "Tại sao timestamp quan trọng?", options: ["Để tính lương", "Xác nhận ảnh chụp đúng lúc check-in", "Để liên hệ brand", "Không quan trọng"], answer: 1 },
      { q: "Nếu ảnh PoP bị reject do mờ?", options: ["Báo Veasyble Team", "Chụp lại tại chỗ ngay", "Gửi email", "Bỏ qua"], answer: 1 },
      { q: "Metadata ảnh dùng để?", options: ["Trang trí", "Detect chỉnh sửa hoặc giả mạo", "Lưu tên executor", "Tính tiền"], answer: 1 },
      { q: "Sau khi submit PoP thành công?", options: ["Nhận tiền ngay", "Task chuyển sang Under Review", "Executor tự đánh giá", "Brand liên hệ"], answer: 1 },
    ],
  },
  {
    id: "4",
    num: 4,
    title: "Platform Rules & Rating",
    desc: "Chính sách trễ giờ, huỷ task, và hệ thống rating của Veasyble",
    icon: Shield,
    duration: "5:10",
    summary: [
      "Rating được tính từ trung bình của Brand + Retailer đã rate bạn",
      "Rating >= 4.0 được coi là Healthy",
      "Dưới 3.5 sẽ nhận auto-reminder và Veasyble review",
      "Huỷ task sau khi đã in materials sẽ bị trừ rating nặng và flag tài khoản",
    ],
    questions: [
      { q: "Rating của Executor được tính từ đâu?", options: ["Chỉ Veasyble", "Chỉ Brand", "Brand + Retailer (trung bình)", "Executor tự chọn"], answer: 2 },
      { q: "Rating nào được coi là Healthy?", options: [">= 3.0", ">= 3.5", ">= 4.0", ">= 4.5"], answer: 2 },
      { q: "Khi rating xuống dưới 3.5?", options: ["Bị xóa tài khoản ngay", "Nhận auto-reminder và Veasyble review", "Không có gì xảy ra", "Tự động tăng lương"], answer: 1 },
      { q: "Nếu 3 tháng không nhận task?", options: ["Bị xóa tài khoản", "Bị phạt", "Nhận email nhắc nhở - tài khoản vẫn còn", "Phải onboard lại"], answer: 2 },
      { q: "Huỷ task sau khi đã in materials sẽ dẫn đến?", options: ["Không sao", "Trừ rating nặng + flag tài khoản", "Bị suspend ngay", "Mất tài khoản vĩnh viễn"], answer: 1 },
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
