import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { getTaskHistory, approveTask, rejectTask, type TaskHistoryEntry } from "@/lib/task-state";
import { findTask } from "@/lib/task-state";
import { ReviewModal } from "@/components/ReviewModal";

export const Route = createFileRoute("/ops/submissions")({
  component: SubmissionsMonitor,
});

function SubmissionsMonitor() {
  const { t } = useTranslation();
  const [history, setHistory] = useState(() => getTaskHistory());
  const [selectedEntry, setSelectedEntry] = useState<TaskHistoryEntry | null>(null);

  const reviews = history.filter((h) => h.status === "in_review");

  const handleApprove = (taskId: string) => {
    approveTask(taskId);
    setHistory(getTaskHistory());
    setSelectedEntry(null);
  };

  const handleReject = (taskId: string, reason: string) => {
    rejectTask(taskId, reason);
    setHistory(getTaskHistory());
    setSelectedEntry(null);
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">{t("nav_submissions")}</h1>
      
      <div className="bg-white border border-gray-200 rounded-[5px] shadow-sm overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[1.5fr_2fr_1.5fr_1.5fr_250px] gap-4 px-6 py-4 text-xs font-semibold text-gray-500 border-b border-gray-100 uppercase tracking-wider">
            <div>Executor</div>
            <div>Task</div>
            <div>Brand</div>
            <div>{t("submission_date")}</div>
            <div className="text-right">Actions</div>
          </div>

          {reviews.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-500">
              Không có kết quả nào cần duyệt.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {reviews.map((entry) => (
                <SubmissionRow 
                  key={entry.taskId} 
                  entry={entry} 
                  onApprove={() => handleApprove(entry.taskId)} 
                  onReject={(r) => handleReject(entry.taskId, r)} 
                  onClick={() => setSelectedEntry(entry)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedEntry && (
        <ReviewModal 
          entry={selectedEntry} 
          onClose={() => setSelectedEntry(null)} 
          onApprove={() => handleApprove(selectedEntry.taskId)} 
          onReject={(r) => handleReject(selectedEntry.taskId, r)} 
        />
      )}
    </div>
  );
}

function SubmissionRow({ entry, onApprove, onReject, onClick }: { entry: TaskHistoryEntry; onApprove: () => void; onReject: (reason: string) => void; onClick: () => void }) {
  const { t } = useTranslation();
  const task = findTask(entry.taskId);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  if (!task) return null;

  return (
    <div 
      className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <div className="grid grid-cols-[1.5fr_2fr_1.5fr_1.5fr_250px] gap-4 items-center text-sm">
        <div className="font-medium text-gray-900 truncate">Nguyen Khoa</div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{task.campaign}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{task.store}</p>
        </div>
        <div className="text-gray-600 truncate">{task.brand}</div>
        <div className="text-gray-500 truncate">{new Date(entry.completedAt).toLocaleDateString()}</div>
        <div className="flex justify-end gap-2 shrink-0">
          <button 
            onClick={(e) => { e.stopPropagation(); setRejecting(true); }}
            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-[5px] text-xs font-semibold hover:bg-gray-100"
          >
            {t("request_revision")}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onApprove(); }}
            className="px-4 py-2 bg-green-600 text-white rounded-[5px] text-xs font-semibold hover:bg-green-700"
          >
            {t("approve")}
          </button>
        </div>
      </div>

      {rejecting && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-[5px] flex items-center gap-3">
          <input 
            type="text" 
            placeholder={t("rejection_reason_placeholder")} 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:border-[#1A3557]"
          />
          <button 
            onClick={(e) => { e.stopPropagation(); setRejecting(false); }}
            className="px-4 py-2 text-gray-600 text-xs font-semibold rounded-[5px]"
          >
            Huỷ
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onReject(reason); }}
            disabled={!reason.trim()}
            className="px-4 py-2 bg-red-600 text-white rounded-[5px] text-xs font-semibold hover:bg-red-700 disabled:opacity-50"
          >
            Xác nhận yêu cầu
          </button>
        </div>
      )}
    </div>
  );
}
