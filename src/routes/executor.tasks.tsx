import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { availableTasks, executorProfile, getWeeklyAvailability, type AvailableTask } from "@/lib/mock-data";
import { acceptTask, declineTask, getDeclinedTaskIds, getCancelledTaskIds } from "@/lib/task-state";
import { isTaskMatchingAvailability } from "@/lib/availability-utils";

export const Route = createFileRoute("/executor/tasks")({
  component: ExecutorTasks,
});

function ExecutorTasks() {
    const navigate = useNavigate();
  const [filterByAvailability, setFilterByAvailability] = useState(true);
  const [filters, setFilters] = useState({ district: "all", minPay: 0 });
  const [showFilter, setShowFilter] = useState(false);
  const [declinedIds, setDeclinedIds] = useState(() => getDeclinedTaskIds());
  const [cancelledIds] = useState(() => getCancelledTaskIds());

  const profile = executorProfile;
  const availability = getWeeklyAvailability();
  const hasNoAvailability = availability.length === 0;

  const handleAccept = (taskId: string) => {
    acceptTask(taskId);
    navigate({ to: "/executor/home" });
  };

  const handleDecline = (taskId: string) => {
    declineTask(taskId);
    setDeclinedIds(getDeclinedTaskIds());
  };

  const visibleTasks = availableTasks.filter((t) => !declinedIds.includes(t.id) && !cancelledIds.includes(t.id) && t.status !== "accepted");

  const displayedTasks = visibleTasks.filter((task) => {
    // Basic filters
    if (filters.district !== "all" && task.district !== filters.district) return false;
    if (task.pay < filters.minPay) return false;
    
    // Availability filter
    if (filterByAvailability) {
      if (hasNoAvailability) return false; // if ON but no availability set -> 0 match
      return isTaskMatchingAvailability(task, availability);
    }
    
    return true;
  });

  const districts = ["all", ...Array.from(new Set(availableTasks.map((t) => t.district)))];
  const hasActiveFilter = filters.district !== "all" || filters.minPay !== 0;

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col pb-20">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 mb-3">
          {"Browse Tasks"}
        </h1>

        <label className="flex items-center justify-between bg-gray-50 p-3 rounded-[5px] border border-gray-100 cursor-pointer">
          <span className="text-sm font-medium text-gray-700">Show only tasks matching my availability</span>
          <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${filterByAvailability ? 'bg-[#F97316]' : 'bg-gray-200'}`}>
            <input type="checkbox" className="sr-only" checked={filterByAvailability} onChange={(e) => setFilterByAvailability(e.target.checked)} />
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${filterByAvailability ? 'translate-x-6' : 'translate-x-1'}`} />
          </div>
        </label>
      </div>

      {/* Filter bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-2">
        <p className="text-xs text-gray-500 flex-1">
          {displayedTasks.length} task(s)
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
          {"Filter"} {hasActiveFilter && "•"}
        </button>
      </div>

      {/* Filter panel */}
      {showFilter && (
        <div className="mx-4 mt-3 bg-white rounded-[5px] p-4 border border-gray-100 shadow-sm space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">
              {"Area"}
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
                  {d === "all" ? "All" : d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">
              {"Minimum pay"}: 
              <span className="text-[#F97316]">
                {filters.minPay === 0 ? "All" : `${filters.minPay.toLocaleString()} VND`}
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
              <span>300,000 VND</span>
            </div>
          </div>
          <button
            onClick={() => setFilters({ district: "all", minPay: 0 })}
            className="text-xs text-gray-400 underline"
          >
            {"Clear filters"}
          </button>
        </div>
      )}

      {/* Empty states */}
      {filterByAvailability && hasNoAvailability ? (
        <div className="mx-4 mt-4 bg-orange-50 rounded-[5px] p-4 border border-orange-100 text-center">
          <p className="text-sm font-semibold text-orange-800 mb-2">
            Set your availability to see matching tasks
          </p>
          <Link to="/executor/profile" className="inline-block bg-[#F97316] text-white text-xs font-semibold px-4 py-2 rounded-[5px]">
            Go to Settings
          </Link>
        </div>
      ) : displayedTasks.length === 0 ? (
        <div className="mx-4 mt-4 bg-blue-50 rounded-[5px] p-4 border border-blue-100">
          <p className="text-xs font-semibold text-blue-700 mb-1">
            {"No matching tasks"}
          </p>
          <p className="text-xs text-blue-600">
            {"Matching tasks must fit both your available dates AND districts set in Profile."}
          </p>
        </div>
      ) : (
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
      )}

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
    return (
    <div className={`bg-white rounded-[5px] p-4 shadow-sm border border-gray-100 ${declined ? "opacity-60" : ""}`}>
      <Link to="/executor/task/$id" params={{ id: task.id }} className="block active:scale-[0.98] transition-transform">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[5px] bg-orange-50 flex items-center justify-center text-sm">
              {task.brandLogo ?? "️"}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{task.brand}</p>
              <p className="text-[11px] text-gray-400">{task.campaignName}</p>
            </div>
          </div>
          <p className="font-bold text-[#F97316] text-sm">{task.pay.toLocaleString()} VND</p>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-4 text-xs text-gray-400">
          <span> {task.storeName} · {task.district}</span>
          <span> {task.scheduledTime}</span>
        </div>
      </Link>
      
      {!declined && onAccept && onDecline && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={onAccept}
            className="flex-1 bg-[#1A3557] text-white text-xs font-semibold py-2.5 rounded-[5px] text-center"
          >
            {"Accept"}
          </button>
          <button
            onClick={onDecline}
            className="px-4 text-xs font-semibold text-gray-400 border border-gray-200 rounded-[5px]"
          >
            {"Decline"}
          </button>
        </div>
      )}
    </div>
  );
}

function DeclinedSection({ declinedIds }: { declinedIds: string[] }) {
    const [open, setOpen] = useState(false);
  const declinedTasks = availableTasks.filter((t) => declinedIds.includes(t.id));

  if (declinedTasks.length === 0) return null;

  return (
    <div className="mx-4 mt-6 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-gray-400 underline font-medium"
      >
        {"Declined"} ({declinedTasks.length})
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
