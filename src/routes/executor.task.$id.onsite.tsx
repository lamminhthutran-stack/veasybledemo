import { ArrowLeft, MapPin, Camera, Check } from "lucide-react";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { startTask } from "@/lib/task-state";

export const Route = createFileRoute("/executor/task/$id/onsite")({
  component: OnSite,
});

function OnSite() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const router = useRouter();

  useEffect(() => {
    startTask(id);
  }, [id]);

  const [checkedIn, setCheckedIn] = useState(false);
  const [selfie, setSelfie] = useState(false);

  const sopSteps = [
    "Unpack all campaign materials",
    "Set up display per planogram",
    "Check all items are correctly placed",
    "Clean up packaging",
  ];

  const [sop, setSop] = useState(sopSteps.map(() => false));
  const [photos, setPhotos] = useState(0);

  const sopDone = sop.every(Boolean);
  const canSubmit = checkedIn && selfie && sopDone && photos > 0;

  const stages = ["Pre-Execute", "Check In", "Execute", "Submit PoP"];
  const stageIdx = !checkedIn ? 1 : !selfie ? 1 : !sopDone ? 2 : 3;

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="bg-navy text-navy-foreground px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.history.back()} className="min-h-[44px] flex items-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="font-semibold">{"On-Site Execution"}</div>
      </header>

      <div className="bg-background px-4 py-3 border-b border-border">
        <div className="flex items-center gap-1">
          {stages.map((s, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`h-1 w-full rounded-full ${i <= stageIdx ? "bg-orange" : "bg-border"}`}
              />
              <div
                className={`text-[9px] text-center ${i <= stageIdx ? "text-orange font-semibold" : "text-muted-foreground"}`}
              >
                {s}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3 flex-1">
        {/* Step 1 */}
        <Card title={"Step 1 — GPS Check-In"} done={checkedIn}>
          <div className="h-32 rounded-[5px] bg-surface border border-border flex items-center justify-center text-xs text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" /> {"Map: current location vs store"}
          </div>
          {!checkedIn ? (
            <button
              onClick={() => setCheckedIn(true)}
              className="mt-3 min-h-[44px] w-full bg-orange text-orange-foreground rounded-md py-3 text-sm font-semibold"
            >
              {"Check In at This Location"}
            </button>
          ) : (
            <div className="mt-3 badge badge-success">{"Verified"} ✓</div>
          )}
        </Card>

        {/* Step 2 */}
        <Card title={"Step 2 — Identity Verification"} done={selfie}>
          <p className="text-xs text-muted-foreground mb-3">
            {"Take a selfie with the store signage clearly visible."}
          </p>
          {!selfie ? (
            <button
              onClick={() => setSelfie(true)}
              className="w-full border border-border rounded-md py-3 min-h-[44px] text-sm flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" /> {"Open Camera"}
            </button>
          ) : (
            <>
              <div className="h-28 rounded-[5px] bg-surface border border-border flex items-center justify-center text-xs text-muted-foreground mb-2">
                {"Photo preview"}
              </div>
              <div className="badge badge-success">{"Uploaded"} ✓</div>
            </>
          )}
        </Card>

        {/* Step 3 */}
        <Card title={"Step 3 — SOP Checklist"} done={sopDone}>
          <div className="space-y-1.5">
            {sopSteps.map((s, i) => (
              <label
                key={i}
                className="flex items-start gap-3 text-sm py-2 cursor-pointer min-h-[44px]"
              >
                <input
                  type="checkbox"
                  checked={sop[i]}
                  onChange={(e) =>
                    setSop((arr) => arr.map((v, j) => (j === i ? e.target.checked : v)))
                  }
                  className="mt-1 w-5 h-5 accent-orange"
                />
                <span>
                  {i + 1}. {s}
                </span>
              </label>
            ))}
          </div>
        </Card>

        {/* Step 4 */}
        <Card title={"Step 4 — Submit PoP"} done={photos > 0}>
          <button
            onClick={() => setPhotos((p) => Math.min(p + 1, 4))}
            className="w-full border border-border rounded-md py-3 min-h-[44px] text-sm flex items-center justify-center gap-2 mb-3"
          >
            <Camera className="w-4 h-4" /> {"Upload Final Photo"}
          </button>
          {photos > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: photos }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-[5px] bg-surface border border-border flex items-center justify-center text-[10px] text-muted-foreground"
                >
                  {"Photo"} {i + 1}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div
        className="sticky bg-background border-t border-border p-4 z-40"
        style={{ bottom: "calc(65px + env(safe-area-inset-bottom))" }}
      >
        <button
          disabled={!canSubmit}
          onClick={() => nav({ to: "/executor/task/$id/submitted", params: { id } })}
          className="w-full bg-orange text-orange-foreground rounded-md py-3 min-h-[44px] text-sm font-semibold disabled:opacity-40"
        >
          {"Submit Proof of Placement"}
        </button>
      </div>
    </div>
  );
}

function Card({
  title,
  done,
  children,
}: {
  title: string;
  done: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-[5px] p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-sm">{title}</div>
        {done && <Check className="w-4 h-4 text-success" />}
      </div>
      {children}
    </div>
  );
}
