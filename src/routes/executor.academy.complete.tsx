import { GraduationCap } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { avgScore, completedCount, modules } from "@/lib/academy-data";

export const Route = createFileRoute("/executor/academy/complete")({
  component: Complete,
});

function Complete() {
      const avg = avgScore();
  const done = completedCount();

  return (
    <div className="p-5 space-y-5 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute w-2 h-2 rounded-sm animate-bounce"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 31) % 60}%`,
              backgroundColor: i % 2 ? "var(--orange)" : "var(--navy)",
              animationDelay: `${(i % 6) * 0.15}s`,
              animationDuration: `${1 + (i % 4) * 0.3}s`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      <div className="relative text-center pt-4">
        <div className="w-20 h-20 rounded-full bg-orange/15 mx-auto flex items-center justify-center">
          <GraduationCap className="w-10 h-10 text-orange" />
        </div>
        <h1 className="text-2xl font-extrabold mt-3">{"Congratulations!"}</h1>
        <p className="text-sm text-muted-foreground">{"You have completed Veasyble Academy"}</p>
      </div>

      <div className="relative bg-card border-4 border-double border-navy rounded-[5px] p-5 text-center shadow-lg">
        <div className="text-xs font-bold tracking-widest text-orange">VEASYBLE</div>
        <div className="text-[10px] text-muted-foreground mb-4">Making Retail Visibility Easy</div>
        <div className="text-[11px] uppercase tracking-widest text-navy font-semibold">{"Certificate of Completion"}</div>
        <div className="text-xl font-bold mt-3 mb-1">John Doe</div>
        <div className="text-xs text-muted-foreground italic" dangerouslySetInnerHTML={{ __html: "has successfully completed the entire<br />Veasyble Academy program" }} />
        <div className="text-[11px] text-muted-foreground mt-4">
          {"Issued on"} {new Date().toLocaleDateString("en-US")}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat label="Modules" value={`${done}/${modules.length}`} />
        <Stat label={"Avg Score"} value={`${avg}%`} />
        <Stat label={"Completed in"} value={"2 days"} />
      </div>

      <Link
        to="/executor/profile/setup"
        className="relative flex items-center justify-center w-full bg-orange text-orange-foreground font-semibold rounded-md py-3 min-h-[44px] text-sm"
      >
        {"Set up Profile & Start accepting Tasks →"}
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-[5px] p-3">
      <div className="text-base font-bold">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  );
}
