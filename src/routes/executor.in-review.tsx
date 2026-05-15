import { createFileRoute } from "@tanstack/react-router";
import { getTaskHistory, resubmitTask, type TaskHistoryEntry } from "@/lib/task-state";
import { findTask } from "@/lib/task-state";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/executor/in-review")({
  component: InReviewScreen,
});

function InReviewScreen() {
  const { t } = useTranslation();
  const [history, setHistory] = useState(() => getTaskHistory());

  const reviews = history.filter((h) => h.status === "in_review" || h.status === "revision_required");

  const handleResubmit = (taskId: string) => {
    resubmitTask(taskId);
    setHistory(getTaskHistory());
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col pb-20">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">{t("nav_in_review")}</h1>
        <p className="text-sm text-gray-500 mt-1">{reviews.length} {t("nav_tasks").toLowerCase()}</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-[5px] p-6 text-center border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">Không có công việc nào đang duyệt.</p>
          </div>
        ) : (
          reviews.map((entry) => (
            <ReviewCard key={entry.taskId} entry={entry} onResubmit={() => handleResubmit(entry.taskId)} />
          ))
        )}
      </div>
    </div>
  );
}

function ReviewCard({ entry, onResubmit }: { entry: TaskHistoryEntry; onResubmit: () => void }) {
  const { t } = useTranslation();
  const task = findTask(entry.taskId);
  if (!task) return null;

  const isRevision = entry.status === "revision_required";

  return (
    <div className={`bg-white rounded-[5px] p-4 shadow-sm border ${isRevision ? "border-red-200" : "border-gray-100"}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-gray-900 text-sm">{task.brand}</p>
          <p className="text-xs text-gray-400 mt-0.5">{task.campaignName}</p>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${isRevision ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}>
          {isRevision ? t("revision_required") : t("awaiting_payment_review")}
        </span>
      </div>
      
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3 pb-3 border-b border-gray-50">
        <Clock className="w-3 h-3" />
        <span>{t("submission_date")}: {new Date(entry.completedAt).toLocaleDateString()}</span>
      </div>

      {isRevision && (
        <div className="bg-red-50 rounded-[5px] p-3 mb-3">
          <p className="text-xs font-semibold text-red-800 mb-1">Lý do từ chối:</p>
          <p className="text-xs text-red-600">{entry.rejectionReason ?? "Cần cập nhật lại hình ảnh PoP rõ nét hơn."}</p>
        </div>
      )}

      {isRevision && (
        <button
          onClick={onResubmit}
          className="w-full bg-[#1A3557] text-white text-xs font-semibold py-2.5 rounded-[5px]"
        >
          {t("resubmit")}
        </button>
      )}
    </div>
  );
}
