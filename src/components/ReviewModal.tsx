import { useState } from "react";
import { X, CheckCircle, Image as ImageIcon } from "lucide-react";
import { findTask, getConfirmedPickups, type TaskHistoryEntry } from "@/lib/task-state";
import { availableTasks } from "@/lib/mock-data";

export function ReviewModal({
  entry,
  onClose,
  onReject,
}: {
  entry: TaskHistoryEntry;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
}) {
  const task = findTask(entry.taskId);
  const richTask = availableTasks.find((t) => t.id === entry.taskId);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const confirmedPickups = getConfirmedPickups();
  const pickupTime = confirmedPickups[entry.taskId];

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[5px] shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{task.campaign}</h2>
            <p className="text-sm text-gray-500">{task.store}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-[5px] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Requirements */}
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-3 border-b pb-2">
                  Brand Requirements
                </h3>
                <div className="bg-orange/5 border border-orange/20 rounded-[5px] p-4 text-sm text-gray-800 leading-relaxed">
                  <span className="font-semibold block mb-1">Objective:</span>
                  {task.brief}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-3 border-b pb-2">
                  Required Materials
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {richTask?.printStation?.materials ? (
                    richTask.printStation.materials
                      .split(",")
                      .map((m, i) => <li key={i}>{m.trim()}</li>)
                  ) : (
                    <li>No specific materials required.</li>
                  )}
                </ul>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-3 border-b pb-2">
                  SOP Instructions
                </h3>
                <div className="space-y-2">
                  {richTask?.sopItems ? (
                    richTask.sopItems.map((sop, i) => (
                      <div key={i} className="flex gap-2 text-sm text-gray-700">
                        <span className="text-gray-400">{i + 1}.</span>
                        <span>{sop}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Follow standard execution guidelines.
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column: PoP */}
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-3 border-b pb-2">
                  Proof of Performance
                </h3>

                <div className="mb-4 text-xs font-medium bg-gray-50 border rounded-[5px] px-3 py-2 flex items-center justify-between">
                  <span className="text-gray-500">Print Station Pickup:</span>
                  {pickupTime ? (
                    <span className="text-green-600 font-semibold">
                      {new Date(pickupTime).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">Not logged</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-video bg-gray-100 rounded-[5px] border border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-200 cursor-pointer transition-colors group"
                    >
                      <ImageIcon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs">Photo {i}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-[5px] p-4 mb-4">
                  <h4 className="text-xs font-semibold text-gray-900 uppercase mb-2">
                    Checklist Completed
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500" /> Endcap setup verified
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500" /> Planogram compliant
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-[5px] p-4 text-sm text-gray-800">
                  <span className="font-semibold block mb-1">Executor Note:</span>
                  "All materials applied correctly. The store manager confirmed the placement."
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {!rejecting ? (
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRejecting(true)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-[5px] text-sm font-semibold hover:bg-white bg-gray-100 transition-colors"
              >
                Request Revision
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 animate-in slide-in-from-right-4">
              <input
                type="text"
                placeholder="Reason for revision..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm border border-red-300 rounded-[5px] outline-none focus:ring-2 focus:ring-red-100"
                autoFocus
              />
              <button
                onClick={() => setRejecting(false)}
                className="px-4 py-2.5 text-gray-600 text-sm font-semibold rounded-[5px]"
              >
                Cancel
              </button>
              <button
                onClick={() => onReject(reason)}
                disabled={!reason.trim()}
                className="px-6 py-2.5 bg-red-600 text-white rounded-[5px] text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Confirm Revision
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
