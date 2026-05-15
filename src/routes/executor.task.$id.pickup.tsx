import { createFileRoute, Link, useRouter, useNavigate } from "@tanstack/react-router";
import { availableTasks, reportEscalation } from "@/lib/mock-data";
import { confirmPrintPickup } from "@/lib/task-state";
import { MapPin, AlertCircle, ArrowLeft, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/executor/task/$id/pickup")({
  component: PrintPickupScreen,
});

function PrintPickupScreen() {
  const { id } = Route.useParams();
  const router = useRouter();
  const navigate = useNavigate();
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueDesc, setIssueDesc] = useState("");

  const task = availableTasks.find((x) => x.id === id);

  if (!task) {
    return <div className="p-4 text-center mt-20">Task not found</div>;
  }

  const handleConfirm = () => {
    confirmPrintPickup(task.id);
    navigate({ to: "/executor/task/$id/onsite", params: { id: task.id } });
  };

  const handleSubmitIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDesc.trim()) return;

    reportEscalation({
      title: `Print Station Issue - ${task.campaignName}`,
      phase: "Execute",
      severity: "High",
      executorId: "exec-001",
    });

    alert("Your issue has been reported to the Ops team.");
    setShowIssueForm(false);
    setIssueDesc("");
  };

  const ps = task.printStation;
  const mapLink = ps?.address
    ? `https://maps.google.com/?q=${encodeURIComponent(ps.address)}`
    : "#";

  return (
    <div className="min-h-screen bg-surface pb-24 flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.history.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-lg text-foreground">Pick Up Your Materials</h1>
      </header>

      <main className="flex-1 px-4 py-5 space-y-6">
        <div className="bg-card border border-border rounded-[5px] p-5 shadow-sm">
          <h2 className="font-semibold text-base mb-1">Print Station Location</h2>
          {ps ? (
            <>
              <p className="text-sm text-muted-foreground">{ps.address}</p>
              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-orange hover:underline"
              >
                <MapPin className="w-4 h-4" /> Open in Google Maps
              </a>
            </>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">
              No specific print station assigned.
            </p>
          )}
        </div>

        <div className="bg-card border border-border rounded-[5px] p-5 shadow-sm">
          <h2 className="font-semibold text-base mb-3">Required Materials</h2>
          {ps?.materials ? (
            <ul className="space-y-2">
              {ps.materials.split(",").map((mat, i) => (
                <li
                  key={i}
                  className="flex gap-2 py-2 border-b border-border last:border-0 text-sm"
                >
                  <span className="text-orange">✓</span>
                  <span className="text-foreground">{mat.trim()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-orange/10 text-orange-foreground border border-orange/20 p-3 rounded-[5px] text-sm">
              Check with your Ops contact for material details.
            </div>
          )}
        </div>

        {showIssueForm ? (
          <div className="bg-card border border-danger/30 rounded-[5px] p-4 shadow-sm animate-in fade-in slide-in-from-top-2">
            <h3 className="font-semibold text-sm text-danger flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-4 h-4" /> Report a problem
            </h3>
            <form onSubmit={handleSubmitIssue}>
              <textarea
                value={issueDesc}
                onChange={(e) => setIssueDesc(e.target.value)}
                placeholder="Describe the issue at the print station..."
                className="w-full text-sm border border-border rounded-[5px] p-3 mb-3 focus:outline-none focus:ring-1 focus:ring-danger min-h-[80px]"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowIssueForm(false)}
                  className="flex-1 bg-surface text-muted-foreground font-semibold py-2.5 rounded-[5px] text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!issueDesc.trim()}
                  className="flex-1 bg-danger text-white font-semibold py-2.5 rounded-[5px] text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Submit Report
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setShowIssueForm(true)}
            className="w-full py-2 text-sm text-muted-foreground hover:text-foreground font-medium underline underline-offset-4 decoration-border text-center"
          >
            Report a problem at the print station
          </button>
        )}
      </main>

      {/* Fixed bottom CTA */}
      <div
        className="fixed left-0 right-0 bg-white border-t border-border px-4 py-4 max-w-[390px] mx-auto z-40"
        style={{ bottom: "env(safe-area-inset-bottom)" }}
      >
        <button
          onClick={handleConfirm}
          className="w-full bg-[#1A3557] text-white text-sm font-bold py-4 rounded-[5px] text-center shadow-sm"
        >
          I Have Picked Up My Materials
        </button>
      </div>
    </div>
  );
}
