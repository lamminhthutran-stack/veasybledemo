import { createFileRoute, Link } from "@tanstack/react-router";
import { avgScore, completedCount, modules } from "@/lib/academy-data";
import { GraduationCap } from "lucide-react";

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
        <h1 className="text-2xl font-extrabold mt-3">Chúc mừng! 🎉</h1>
        <p className="text-sm text-muted-foreground">Bạn đã hoàn thành Veasyble Academy</p>
      </div>

      <div className="relative bg-card border-4 border-double border-navy rounded-xl p-5 text-center shadow-lg">
        <div className="text-xs font-bold tracking-widest text-orange">VEASYBLE</div>
        <div className="text-[10px] text-muted-foreground mb-4">Making Retail Visibility Easy</div>
        <div className="text-[11px] uppercase tracking-widest text-navy font-semibold">Chứng nhận hoàn thành</div>
        <div className="text-xl font-bold mt-3 mb-1">Nguyễn Minh Khoa</div>
        <div className="text-xs text-muted-foreground italic">đã hoàn thành toàn bộ chương trình<br />Veasyble Academy</div>
        <div className="text-[11px] text-muted-foreground mt-4">
          Cấp ngày {new Date().toLocaleDateString("vi-VN")}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat label="Modules" value={`${done}/${modules.length}`} />
        <Stat label="Điểm TB" value={`${avg}%`} />
        <Stat label="Hoàn thành" value="2 ngày" />
      </div>

      <Link
        to="/executor/profile/setup"
        className="relative block text-center w-full bg-orange text-orange-foreground font-semibold rounded-md py-3 text-sm"
      >
        Thiết lập Profile & Bắt đầu nhận Task →
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="text-base font-bold">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  );
}
