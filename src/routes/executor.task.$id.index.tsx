import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { availableTasks } from "@/lib/mock-data";
import { BackButton } from "@/components/BackButton";
import { cancelTask } from "@/lib/task-state";
import { useState } from "react";
import { ContextGuide } from "@/components/ContextGuide";

export const Route = createFileRoute("/executor/task/$id/")({
  component: TaskDetail,
});

function TaskDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Find task or fallback to first one
  const task = availableTasks.find((x) => x.id === id) ?? availableTasks[0];

  const handleConfirmCancel = () => {
    cancelTask(task.id);
    navigate({ to: "/executor/profile" });
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      <div className="bg-white px-4 pt-12 pb-4">
        <BackButton />
        <h1 className="text-xl font-bold text-gray-900 mt-2">{task.brand}</h1>
        <p className="text-gray-400 text-sm">{task.campaignName}</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        <ContextGuide
          title="How Task Detail works"
          steps={[
            "Review campaign info first so you know the brand, time, pay, and expected work window.",
            "Check location and print station details before going on site so materials and store address are correct.",
            "Read execution requirements carefully; these are the checklist items you must complete during the task.",
            "Tap Start only when you are ready to begin the execution flow: pickup, pre-check, on-site work, and PoP submission.",
            "Use Cancel only if you cannot complete the task; it is recorded and may affect your rating.",
          ]}
        />

        {/* Campaign info */}
        <InfoSection title="Campaign Info">
          <InfoRow label="Brand" value={task.brand} />
          <InfoRow label="Date" value={task.date} />
          <InfoRow label="Start time" value={task.scheduledTime} />
          <InfoRow label="Pay" value={`${task.pay.toLocaleString()} VND`} />
        </InfoSection>

        {/* Location info */}
        <InfoSection title="Location">
          <InfoRow label="Store" value={task.storeName} />
          <InfoRow label="Address" value={task.address ?? "123 Main St, District 5"} />
          <InfoRow label="District" value={task.district} />
        </InfoSection>

        {/* Print Station info */}
        <InfoSection title="Print Station">
          <InfoRow label="Materials pickup date" value={task.printStation?.pickupDate ?? "TBD"} />
          <InfoRow label="Print station address" value={task.printStation?.address ?? "-"} />
          <InfoRow label="Materials to collect" value={task.printStation?.materials ?? "-"} />
          {task.printStation?.note && (
            <div className="bg-orange-50 rounded-[5px] p-3 mt-2 border border-orange-100">
              <p className="text-xs text-orange-700">{task.printStation.note}</p>
            </div>
          )}
        </InfoSection>

        {/* SOP summary */}
        <InfoSection title="Execution Requirements">
          {(task.sopItems ?? []).map((item, i) => (
            <div key={i} className="flex gap-2 py-2 border-b border-gray-50 last:border-0">
              <span className="text-[#F97316] text-sm">→</span>
              <p className="text-sm text-gray-700">{item}</p>
            </div>
          ))}
          {(!task.sopItems || task.sopItems.length === 0) && (
            <p className="text-sm text-gray-400 py-2">No requirements</p>
          )}
        </InfoSection>
      </div>

      {/* CTA */}
      <div
        className="fixed left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 max-w-[390px] mx-auto z-40 flex gap-2"
        style={{ bottom: "calc(65px + env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={() => setShowCancelDialog(true)}
          className="flex-1 bg-white text-gray-600 border border-gray-200 text-sm font-semibold py-3.5 rounded-[5px] text-center"
        >
          Cancel
        </button>
        <Link
          to="/executor/task/$id/pickup"
          params={{ id: task.id }}
          className="flex-1 bg-[#1A3557] text-white text-sm font-semibold py-3.5 rounded-[5px] text-center"
        >
          Start
        </Link>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[5px] p-5 max-w-sm w-full shadow-lg">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Cancel Task</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Are you sure you want to cancel this task? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-[5px] text-sm transition-colors"
              >
                Keep Task
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 bg-danger hover:bg-red-600 text-white font-semibold py-3 rounded-[5px] text-sm transition-colors"
              >
                Yes, Cancel Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[5px] p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-sm mb-3 text-gray-900">{title}</h3>
      <div className="space-y-0">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <span className="text-xs text-gray-900 font-medium text-right max-w-[60%]">{value}</span>
    </div>
  );
}
