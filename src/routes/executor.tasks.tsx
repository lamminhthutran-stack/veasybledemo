import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { availableTasks, executorProfile, type AvailableTask } from "@/lib/mock-data";

export const Route = createFileRoute("/executor/tasks")({
  component: ExecutorTasks,
});

type TaskTab = "available" | "all";

function ExecutorTasks() {
  const [activeTab, setActiveTab] = useState<TaskTab>("available");
  const [filters, setFilters] = useState({ district: "all", minPay: 0 });
  const [showFilter, setShowFilter] = useState(false);

  const profile = executorProfile;

  const withinAvailability = availableTasks.filter((task) => {
    const dayMatch = profile.availableDates.includes(task.date);
    const districtMatch = profile.availableDistricts.includes(task.district);
    return dayMatch && districtMatch;
  });

  const allFiltered = availableTasks.filter((task) => {
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
        <h1 className="text-xl font-bold text-gray-900 mb-4">Tìm Task</h1>

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
            Phù hợp với tôi
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
            Tất cả
            <span className="ml-1.5 text-[10px] font-medium text-gray-400">
              ({availableTasks.length})
            </span>
          </button>
        </div>
      </div>

      {/* Filter bar — only on "Tất cả" tab */}
      {activeTab === "all" && (
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-2">
          <p className="text-xs text-gray-500 flex-1">{allFiltered.length} task</p>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              showFilter || hasActiveFilter
                ? "bg-[#1A3557] text-white border-[#1A3557]"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 12h10M11 20h2" />
            </svg>
            Lọc {hasActiveFilter && "•"}
          </button>
        </div>
      )}

      {/* Filter panel */}
      {activeTab === "all" && showFilter && (
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Khu vực</p>
            <div className="flex flex-wrap gap-2">
              {districts.map((d) => (
                <button
                  key={d}
                  onClick={() => setFilters((f) => ({ ...f, district: d }))}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                    filters.district === d
                      ? "bg-[#1A3557] text-white border-[#1A3557]"
                      : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  {d === "all" ? "Tất cả" : d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">
              Thu nhập tối thiểu:{" "}
              <span className="text-[#F97316]">
                {filters.minPay === 0 ? "Tất cả" : `${filters.minPay.toLocaleString()}đ`}
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
            Xóa filter
          </button>
        </div>
      )}

      {/* Empty state for "Phù hợp" tab */}
      {activeTab === "available" && withinAvailability.length === 0 && (
        <div className="mx-4 mt-4 bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <p className="text-xs font-semibold text-blue-700 mb-1">Không có task phù hợp</p>
          <p className="text-xs text-blue-600">
            Task phù hợp là task trùng ngày rảnh VÀ khu vực bạn đã cài trong Profile.
            Thử cập nhật availability hoặc xem tab "Tất cả".
          </p>
        </div>
      )}

      {/* Task list */}
      <div className="px-4 pt-4 space-y-3">
        {displayedTasks.map((task) => (
          <BrowseTaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

function BrowseTaskCard({ task }: { task: AvailableTask }) {
  return (
    <Link
      to="/executor/task/$id"
      params={{ id: task.id }}
      className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
    >
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-sm">
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
  );
}
