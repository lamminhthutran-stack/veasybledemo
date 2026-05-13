import { ArrowLeft, MapPin, Camera, Check } from "lucide-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";


export const Route = createFileRoute("/executor/task/$id/onsite")({
  component: OnSite,
});

const sopSteps = [
  "Unpack all campaign materials",
  "Set up display per planogram",
  "Check all items are correctly placed",
  "Clean up packaging",
];

function OnSite() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const [checkedIn, setCheckedIn] = useState(false);
  const [selfie, setSelfie] = useState(false);
  const [sop, setSop] = useState(sopSteps.map(() => false));
  const [photos, setPhotos] = useState(0);

  const sopDone = sop.every(Boolean);
  const canSubmit = checkedIn && selfie && sopDone && photos > 0;

  const stages = ["Pre-Execute", "Check In", "Execute", "Submit PoP"];
  const stageIdx = !checkedIn ? 1 : !selfie ? 1 : !sopDone ? 2 : 3;

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="bg-navy text-navy-foreground px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link to="/executor/task/$id/pre-execute" params={{ id }}><ArrowLeft className="w-5 h-5" /></Link>
        <div className="font-semibold">On-Site Execution</div>
      </header>

      <div className="bg-background px-4 py-3 border-b border-border">
        <div className="flex items-center gap-1">
          {stages.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div className={`h-1 w-full rounded-full ${i <= stageIdx ? "bg-orange" : "bg-border"}`} />
              <div className={`text-[9px] ${i <= stageIdx ? "text-orange font-semibold" : "text-muted-foreground"}`}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3 flex-1">
        {/* Step 1 */}
        <Card title="Step 1 — GPS Check-In" done={checkedIn}>
          <div className="h-32 rounded-lg bg-surface border border-border flex items-center justify-center text-xs text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" /> Map: current location vs store
          </div>
          {!checkedIn ? (
            <button onClick={() => setCheckedIn(true)} className="mt-3 w-full bg-orange text-orange-foreground rounded-md py-2 text-sm font-semibold">
              Check In at This Location
            </button>
          ) : (
            <div className="mt-3 badge badge-success">Verified ✓</div>
          )}
        </Card>

        {/* Step 2 */}
        <Card title="Step 2 — Identity Verification" done={selfie}>
          <p className="text-xs text-muted-foreground mb-3">Take a selfie with the store signage clearly visible.</p>
          {!selfie ? (
            <button onClick={() => setSelfie(true)} className="w-full border border-border rounded-md py-2 text-sm flex items-center justify-center gap-2">
              <Camera className="w-4 h-4" /> Open Camera
            </button>
          ) : (
            <>
              <div className="h-28 rounded-lg bg-surface border border-border flex items-center justify-center text-xs text-muted-foreground mb-2">Photo preview</div>
              <div className="badge badge-success">Uploaded ✓</div>
            </>
          )}
        </Card>

        {/* Step 3 */}
        <Card title="Step 3 — SOP Checklist" done={sopDone}>
          <div className="space-y-1.5">
            {sopSteps.map((s, i) => (
              <label key={s} className="flex items-start gap-3 text-sm py-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sop[i]}
                  onChange={(e) => setSop((arr) => arr.map((v, j) => (j === i ? e.target.checked : v)))}
                  className="mt-0.5 w-4 h-4 accent-orange"
                />
                <span>{i + 1}. {s}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Step 4 */}
        <Card title="Step 4 — Submit PoP" done={photos > 0}>
          <button
            onClick={() => setPhotos((p) => Math.min(p + 1, 4))}
            className="w-full border border-border rounded-md py-2 text-sm flex items-center justify-center gap-2 mb-3"
          >
            <Camera className="w-4 h-4" /> Upload Final Photo
          </button>
          {photos > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: photos }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-surface border border-border flex items-center justify-center text-[10px] text-muted-foreground">
                  Photo {i + 1}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="sticky bottom-0 bg-background border-t border-border p-4">
        <button
          disabled={!canSubmit}
          onClick={() => nav({ to: "/executor/task/$id/submitted", params: { id } })}
          className="w-full bg-orange text-orange-foreground rounded-md py-3 text-sm font-semibold disabled:opacity-40"
        >
          Submit Proof of Placement
        </button>
      </div>
    </div>
  );
}

function Card({ title, done, children }: { title: string; done: boolean; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-sm">{title}</div>
        {done && <Check className="w-4 h-4 text-success" />}
      </div>
      {children}
    </div>
  );
}
