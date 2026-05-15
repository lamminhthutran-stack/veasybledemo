import { Play } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getModule } from "@/lib/academy-data";

export const Route = createFileRoute("/executor/academy/module/$id/video")({
  component: VideoLesson,
});

function VideoLesson() {
  const { id } = Route.useParams();
  const m = getModule(id);
  
  return (
    <div className="p-5 space-y-5">
      <div>
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Module {m.num}</div>
        <h1 className="text-lg font-bold leading-tight">{m.title}</h1>
      </div>

      <div className="aspect-video bg-navy rounded-[5px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-orange/40" />
        <button className="relative z-10 w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
          <Play className="w-7 h-7 text-orange ml-1" fill="currentColor" />
        </button>
        <div className="absolute bottom-2 right-3 text-xs text-white/90 bg-black/40 rounded px-2 py-0.5">{m.duration}</div>
      </div>

      <div className="bg-card border border-border rounded-[5px] p-4">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">{"Summary"}</div>
        <ul className="space-y-2">
          {m.summary.map((s, i) => (
            <li key={i} className="text-sm flex gap-2">
              <span className="text-success font-bold">✓</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        to="/executor/academy/module/$id/quiz"
        params={{ id }}
        className="flex items-center justify-center w-full bg-orange text-orange-foreground font-semibold rounded-md min-h-[44px] py-3 text-sm"
      >
        {"Continue to Quiz →"}
      </Link>
    </div>
  );
}
