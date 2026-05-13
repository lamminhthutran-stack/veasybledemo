import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { tasks } from "@/lib/mock-data";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/executor/task/$id/submitted")({
  component: Submitted,
});

function Submitted() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const t = tasks.find((x) => x.id === id) ?? tasks[0];
  const ts = new Date().toLocaleString("en-GB", { hour12: false });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="relative">
        <CheckCircle2 className="w-24 h-24 text-success animate-in zoom-in duration-500" />
      </div>
      <h1 className="text-2xl font-bold mt-6">PoP Submitted Successfully!</h1>
      <p className="text-sm text-muted-foreground mt-2 max-w-xs">
        Your submission is under review. Payment will be processed once approved.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mt-6 w-full text-left">
        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Task Summary</div>
        <div className="font-semibold text-sm">{t.campaign}</div>
        <div className="text-xs text-muted-foreground">{t.store}</div>
        <div className="text-xs text-muted-foreground mt-1">Submitted at {ts}</div>
      </div>

      <button
        onClick={() => nav({ to: "/executor/home" })}
        className="mt-8 w-full bg-orange text-orange-foreground rounded-md py-3 font-semibold"
      >
        Back to Home
      </button>
    </div>
  );
}
