import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getAcceptedTaskIds, cancelTask } from "@/lib/task-state";
import { availableTasks, executorProfile, type AvailableTask } from "@/lib/mock-data";

import { formatEarnings } from "@/lib/format";
import { useTranslation } from "react-i18next";
import { useLang } from "@/lib/i18n-context";

export const Route = createFileRoute("/executor/home")({
  component: ExecutorHome,
});

function ExecutorHome() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const [showRatingSheet, setShowRatingSheet] = useState(false);
  const [acceptedIds, setAcceptedIds] = useState(() => getAcceptedTaskIds());
  const myTasks = availableTasks.filter((t) => acceptedIds.includes(t.id));
  const profile = executorProfile;

  const handleCancel = (taskId: string) => {
    cancelTask(taskId);
    setAcceptedIds(getAcceptedTaskIds());
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col pb-20">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">{t("greeting")}</p>
            <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#1A3557] flex items-center justify-center text-white font-bold text-sm">
            {profile.initials}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {/* Card Rating */}
          <button
            onClick={() => setShowRatingSheet(true)}
            className="bg-white rounded-[5px] p-3 shadow-sm border border-gray-100 text-left flex flex-col gap-1 w-full h-full active:scale-95 transition-transform"
          >
            <p className="text-[10px] text-gray-400 font-medium">{t("rating_label")}</p>
            <p className="text-2xl font-bold text-gray-900 leading-none">{profile.rating}</p>
            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full w-fit ${
              profile.rating >= 4.0 ? "bg-green-50 text-green-700" :
              profile.rating >= 3.5 ? "bg-yellow-50 text-yellow-700" :
              profile.rating >= 3.0 ? "bg-orange-50 text-orange-700" :
                                      "bg-red-50 text-red-700"
            }`}>
              {profile.rating >= 4.0 ? t("healthy") : profile.rating >= 3.5 ? t("warning") : profile.rating >= 3.0 ? t("at_risk") : t("suspended")}
            </span>
            <p className="text-[9px] text-gray-300 mt-auto pt-1">{t("rating_detail")}</p>
          </button>

          {/* Card Thu nhập */}
          <div className="bg-white rounded-[5px] p-3 shadow-sm border border-gray-100 flex flex-col gap-1">
            <p className="text-[10px] text-gray-400 font-medium">{t("earnings")}</p>
            <p className="text-xl font-bold text-[#F97316] leading-none">
              {formatEarnings(profile.monthlyEarnings, lang)}
            </p>
            {/* spacer để căn đều chiều cao */}
            <div className="mt-auto pt-1" />
          </div>

          {/* Card Campaigns */}
          <div className="bg-white rounded-[5px] p-3 shadow-sm border border-gray-100 flex flex-col gap-1">
            <p className="text-[10px] text-gray-400 font-medium">{t("campaigns")}</p>
            <p className="text-2xl font-bold text-gray-900 leading-none">{profile.campaignsThisMonth}</p>
            <p className="text-[9px] text-gray-400 mt-auto pt-1">{t("this_month")}</p>
          </div>
        </div>

        {/* Current Tasks */}
        <div>
          <p className="text-sm font-bold text-gray-800 mb-3">{t("current_tasks")}</p>
          {myTasks.length === 0 ? (
            <div className="bg-white rounded-[5px] p-6 text-center border border-gray-100">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-gray-500 text-sm font-medium">{t("no_tasks")}</p>
              <p className="text-gray-400 text-xs mt-1">{t("no_tasks_sub")}</p>
              <Link
                to="/executor/tasks"
                className="inline-block mt-3 bg-[#F97316] text-white px-4 py-2 rounded-[5px] text-xs font-semibold"
              >
                {t("find_tasks")}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myTasks.map((task) => (
                <MyTaskCard key={task.id} task={task} onCancel={handleCancel} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rating Bottom Sheet */}
      {showRatingSheet && (
        <RatingBottomSheet profile={profile} onClose={() => setShowRatingSheet(false)} />
      )}
    </div>
  );
}

// ─── My Task Card ─────────────────────────────────────────────────────────────

function MyTaskCard({ task, onCancel }: { task: AvailableTask; onCancel: (id: string) => void }) {
  const { t } = useTranslation();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const displayDate = (() => {
    const [y, m, d] = task.date.split("-");
    return `${d}/${m}/${y}`;
  })();

  return (
    <div className="bg-white rounded-[5px] p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-gray-900 text-sm">{task.brand}</p>
          <p className="text-xs text-gray-400 mt-0.5">{task.storeName} · {task.district}</p>
        </div>
        <StatusBadge status={task.status} />
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
        <span>🕐 {task.scheduledTime}</span>
        <span>📅 {displayDate}</span>
        <span className="ml-auto font-semibold text-[#F97316]">{task.pay.toLocaleString()}đ</span>
      </div>

      {!showCancelConfirm ? (
        <div className="flex gap-2 pt-3 border-t border-gray-50">
          <Link
            to="/executor/task/$id"
            params={{ id: task.id }}
            className="flex-1 bg-[#1A3557] text-white text-xs font-semibold py-2.5 rounded-[5px] text-center"
          >
            {t("start_task")}
          </Link>
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="px-4 text-xs font-semibold text-gray-400 border border-gray-200 rounded-[5px]"
          >
            {t("cancel_task")}
          </button>
        </div>
      ) : (
        <div className="pt-3 border-t border-red-50 bg-red-50 rounded-[5px] p-3 -mx-1 mt-3">
          <p className="text-xs font-semibold text-red-700 mb-0.5">{t("confirm_cancel")}</p>
          <p className="text-[10px] text-red-500 mb-2">
            {t("cancel_penalty_warning")}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onCancel(task.id);
                setShowCancelConfirm(false);
              }}
              className="flex-1 bg-red-600 text-white text-xs font-semibold py-2 rounded-[5px]"
            >
              {t("confirm_cancel_btn")}
            </button>
            <button
              onClick={() => setShowCancelConfirm(false)}
              className="flex-1 bg-white text-gray-600 text-xs font-semibold py-2 rounded-[5px] border border-gray-200"
            >
              {t("keep_task")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Rating Bottom Sheet ──────────────────────────────────────────────────────

function RatingBottomSheet({
  profile,
  onClose,
}: {
  profile: typeof executorProfile;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 px-5 pt-5 pb-10 max-h-[80vh] overflow-y-auto">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">{t("your_rating")}</h2>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-gray-900">{profile.rating}</span>
            <span className="text-gray-400 text-sm">/5</span>
          </div>
        </div>

        <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">{t("by_dimension")}</p>
        <div className="space-y-3 mb-6">
          {profile.ratingBreakdown.map((dim) => (
            <div key={dim.label}>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-700 font-medium">{dim.label}</p>
                <p className="text-sm font-bold text-gray-900">{dim.score}</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    dim.score >= 4.0 ? "bg-green-400" :
                    dim.score >= 3.5 ? "bg-yellow-400" : "bg-red-400"
                  }`}
                  style={{ width: `${(dim.score / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {profile.feedback.length > 0 && (
          <>
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">{t("recent_feedback")}</p>
            <div className="space-y-2">
              {profile.feedback.map((fb, i) => (
                <div key={i} className="bg-gray-50 rounded-[5px] p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-gray-500">{fb.from}</span>
                    <span className="text-[10px] text-gray-300">·</span>
                    <span className="text-[10px] text-gray-400">{fb.date}</span>
                  </div>
                  <p className="text-xs text-gray-700">{fb.comment}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    accepted: { label: "Đã nhận", color: "bg-blue-50 text-blue-600" },
    "in-progress": { label: "Đang làm", color: "bg-orange-50 text-orange-600" },
    submitted: { label: "Đã nộp", color: "bg-green-50 text-green-700" },
  };
  const s = map[status] ?? { label: status, color: "bg-gray-100 text-gray-600" };
  return (
    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${s.color}`}>
      {s.label}
    </span>
  );
}
