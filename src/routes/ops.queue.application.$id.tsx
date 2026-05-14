import { ArrowLeft } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { applications } from "@/lib/mock-data";
import { useState } from "react";


export const Route = createFileRoute("/ops/queue/application/$id")({
  component: AppReview,
});

function AppReview() {
  const { id } = Route.useParams();
  const a = (applications as any)[id] ?? applications["e-1"];
  const [notes, setNotes] = useState("");

  return (
    <div className="space-y-5 max-w-4xl">
      <Link to="/ops/queue" className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to queue
      </Link>
      <h1 className="text-2xl font-bold">Application Review</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-[5px] p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-navy text-navy-foreground flex items-center justify-center font-bold">
                {a.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <div className="font-semibold text-lg">{a.name}</div>
                <div className="text-xs text-muted-foreground">{a.age} years · {a.background}</div>
              </div>
            </div>

            <Field label="Availability" value={a.availability} />
            <Field label="Work Experience" value={a.experience} />

            <div className="mt-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Documents</div>
              <div className="grid grid-cols-2 gap-3">
                <Doc label="ID Card" />
                <Doc label="Student / Work Card" />
              </div>
            </div>
          </div>

          <div className="border border-orange/40 bg-orange/5 rounded-[5px] p-4">
            <div className="text-xs font-semibold text-orange uppercase tracking-wide mb-1">Flag Reason</div>
            <div className="text-sm">{a.flag}</div>
          </div>

          <div className="bg-card border border-border rounded-[5px] p-5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Internal Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add notes before deciding…"
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
            />
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full bg-success text-white font-semibold rounded-md py-3 text-sm">Approve</button>
          <button className="w-full bg-orange text-orange-foreground font-semibold rounded-md py-3 text-sm">Schedule Phone Screen</button>
          <button className="w-full bg-danger text-white font-semibold rounded-md py-3 text-sm">Reject</button>
          <div className="text-[11px] text-muted-foreground text-center pt-2">Rejection reasons available in dropdown.</div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm mt-1">{value}</div>
    </div>
  );
}

function Doc({ label }: { label: string }) {
  return (
    <div className="border border-border rounded-[5px] overflow-hidden">
      <div className="h-28 bg-surface flex items-center justify-center text-xs text-muted-foreground">Preview</div>
      <div className="px-3 py-2 text-xs">{label}</div>
    </div>
  );
}
