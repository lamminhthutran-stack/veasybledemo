import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { availableTasks, executorProfile, type AvailableTask } from "@/lib/mock-data";
import { useTranslation } from "react-i18next";
import { acceptTask, declineTask, getDeclinedTaskIds } from "@/lib/task-state";

export const Route = createFileRoute("/executor/tasks")({
  component: ExecutorTasks,
});

type TaskTab = "available" | "all";

function ExecutorTasks() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TaskTab>("available");
  const [filters, setFilters] = useState({ district: "all", minPay: 0 });
  const [showFilter, setShowFilter] = useState(false);
  const [declinedIds, setDeclinedIds] = useState(() => getDeclinedTaskIds());

  const profile = executorProfile;

  const handleAccept = (taskId: string) => {
    acceptTask(taskId);
    navigate({ to: "/executor/home" });
  };

  const handleDecline = (taskId: string) => {
    declineTask(taskId);
    setDeclinedIds(getDeclinedTaskIds());
  };

  const visibleTasks = availableTasks.filter((t) => !declinedIds.includes(t.id) && t.status !== "accepted");

  const withinAvailability = visibleTasks.filter((task) => {
    const dayMatch = profile.availableDates.includes(task.date);
    const districtMatch = profile.availableDistricts.includes(task.district);
    return dayMatch && districtMatch;
  });

  const allFiltered = visibleTasks.filter((task) => {
    if (filters.district !== "all" && task.district !== filters.district) return false;
    if (task.pay < filters.minPay) return false;
    return true;
  });

  const displayedTasks = activeTab === "available" ? withinAvailability : allFiltered;
  const districts = ["all", ...Array.from(new Set(availableTasks.map((t) => t.district)))];
  const hasActiveFilter = filters.district !== "all" || filters.minPay !== 0;

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col pb-20">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-0 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-4">
          {t("browse_tasks")}
        </h1>

        {/* Tab bar */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("available")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === "available"
                ? "text-[#F97316] border-b-2 border-[#F97316]"
                : "text-gray-400"
            }`}
          >
            {t("for_you")}
            <span className="ml-1.5 text-[10px] font-medium text-gray-400">
              ({withinAvailability.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === "all"
                ? "text-[#F97316] border-b-2 border-[#F97316]"
                : "text-gray-400"
            }`}
          >
            {t("all_tasks")}
            <span className="ml-1.5 text-[10px] font-medium text-gray-400">
              ({visibleTasks.length})
            </span>
          </button>
        </div>
      </div>

      {/* Filter bar — only on "All Tasks" tab */}
      {activeTab === "all" && (
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-2">
          <p className="text-xs text-gray-500 flex-1">
            {allFiltered.length} task(s)
          </p>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-[5px] border font-medium transition-colors ${
              showFilter || hasActiveFilter
                ? "bg-[#1A3557] text-white border-[#1A3557]"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 12h10M11 20h2" />
            </svg>
            {t("filter")} {hasActiveFilter && "•"}
          </button>
        </div>
      )}

      {/* Filter panel */}
      {activeTab === "all" && showFilter && (
        <div className="mx-4 mt-3 bg-white rounded-[5px] p-4 border border-gray-100 shadow-sm space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">
              {t("area")}
            </p>
            <div className="flex flex-wrap gap-2">
              {districts.map((d) => (
                <button
                  key={d}
                  onClick={() => setFilters((f) => ({ ...f, district: d }))}
                  className={`text-xs px-3 py-1.5 rounded-[5px] border font-medium transition-colors ${
                    filters.district === d
                      ? "bg-[#1A3557] text-white border-[#1A3557]"
                      : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  {d === "all" ? t("all") : d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">
              {t("min_pay")}: 
              <span className="text-[#F97316]">
                {filters.minPay === 0 ? t("all") : `${filters.minPay.toLocaleString()}đ`}
              </span>
            </p>
            <input
              type="range"
              min={0}
              max={300000}
              step={50000}
              value={filters.minPay}
              onChange={(e) => setFilters((f) => ({ ...f, minPay: Number(e.target.value) }))}
              className="w-full accent-[#F97316]"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>0</span>
              <span>300,000đ</span>
            </div>
          </div>
          <button
            onClick={() => setFilters({ district: "all", minPay: 0 })}
            className="text-xs text-gray-400 underline"
          >
            {t("clear_filter")}
          </button>
        </div>
      )}

      {/* Empty state for "Phù hợp" tab */}
      {activeTab === "available" && withinAvailability.length === 0 && (
        <div className="mx-4 mt-4 bg-blue-50 rounded-[5px] p-4 border border-blue-100">
          <p className="text-xs font-semibold text-blue-700 mb-1">
            {t("no_match")}
          </p>
          <p className="text-xs text-blue-600">
            {t("no_match_sub")}
          </p>
        </div>
      )}

      {/* Task list */}
      <div className="px-4 pt-4 space-y-3">
        {displayedTasks.map((task) => (
          <BrowseTaskCard
            key={task.id}
            task={task}
            onAccept={() => handleAccept(task.id)}
            onDecline={() => handleDecline(task.id)}
          />
        ))}
      </div>

      <DeclinedSection declinedIds={declinedIds} />
    </div>
  );
}

function BrowseTaskCard({
  task,
  onAccept,
  onDecline,
  declined,
}: {
  task: AvailableTask;
  onAccept?: () => void;
  onDecline?: () => void;
  declined?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className={`bg-white rounded-[5px] p-4 shadow-sm border border-gray-100 ${declined ? "opacity-60" : ""}`}>
      <Link to="/executor/task/$id" params={{ id: task.id }} className="block active:scale-[0.98] transition-transform">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[5px] bg-orange-50 flex items-center justify-center text-sm">
              {task.brandLogo ?? "🏷️"}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{task.brand}</p>
              <p className="text-[11px] text-gray-400">{task.campaignName}</p>
            </div>
          </div>
          <p className="font-bold text-[#F97316] text-sm">{task.pay.toLocaleString()}đ</p>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-4 text-xs text-gray-400">
          <span>📍 {task.storeName} · {task.district}</span>
          <span>🕐 {task.scheduledTime}</span>
        </div>
      </Link>
      
      {!declined && onAccept && onDecline && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={onAccept}
            className="flex-1 bg-[#1A3557] text-white text-xs font-semibold py-2.5 rounded-[5px] text-center"
          >
            {t("accept")}
          </button>
          <button
            onClick={onDecline}
            className="px-4 text-xs font-semibold text-gray-400 border border-gray-200 rounded-[5px]"
          >
            {t("decline")}
          </button>
        </div>
      )}
    </div>
  );
}

function DeclinedSection({ declinedIds }: { declinedIds: string[] }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const declinedTasks = availableTasks.filter((t) => declinedIds.includes(t.id));

  if (declinedTasks.length === 0) return null;

  return (
    <div className="mx-4 mt-6 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-gray-400 underline font-medium"
      >
        {t("declined")} ({declinedTasks.length})
      </button>
      {open && (
        <div className="mt-3 space-y-3">
          {declinedTasks.map((t) => (
            <BrowseTaskCard key={t.id} task={t} declined />
          ))}
        </div>
      )}
    </div>
  );
}
