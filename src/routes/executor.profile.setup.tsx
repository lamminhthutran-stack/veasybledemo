import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Check } from "lucide-react";

export const Route = createFileRoute("/executor/profile/setup")({
  component: ProfileSetup,
});

const cities = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ"];
const districts: Record<string, string[]> = {
  "Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 5", "Quận 7", "Quận 10", "Bình Thạnh", "Phú Nhuận", "Tân Bình"],
  "Hà Nội": ["Hoàn Kiếm", "Ba Đình", "Đống Đa", "Hai Bà Trưng", "Cầu Giấy"],
  "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Sơn Trà"],
  "Cần Thơ": ["Ninh Kiều", "Bình Thủy"],
};
const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const slots = ["Sáng", "Chiều", "Tối"];

function ProfileSetup() {
  const nav = useNavigate();
  const [city, setCity] = useState("Hồ Chí Minh");
  const [picked, setPicked] = useState<string[]>(["Quận 1", "Quận 5"]);
  const [grid, setGrid] = useState<Record<string, boolean>>({});

  const toggleDistrict = (d: string) =>
    setPicked((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]));
  const toggleSlot = (k: string) => setGrid((g) => ({ ...g, [k]: !g[k] }));

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-navy text-navy-foreground px-4 py-3">
        <div className="font-bold tracking-tight">Veasyble</div>
        <div className="text-[10px] text-white/70">Profile Setup</div>
      </header>

      <main className="flex-1 p-5 space-y-5">
          <div className="flex items-center gap-2 text-[11px]">
            <Step done label="Academy" />
            <Bar />
            <Step active label="Profile" />
            <Bar />
            <Step label="Done" />
          </div>

          <div>
            <h1 className="text-xl font-extrabold leading-tight">Thiết lập Profile của bạn</h1>
            <p className="text-sm text-muted-foreground mt-1">Chỉ còn một bước nữa để bắt đầu nhận task!</p>
          </div>

          <Section title="Thông tin cá nhân">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center text-muted-foreground">
                <Camera className="w-5 h-5" />
              </div>
              <button className="text-xs px-3 py-1.5 border border-border rounded-md">Tải ảnh lên</button>
            </div>
            <Input label="Họ và tên" defaultValue="Nguyễn Minh Khoa" />
            <Input label="Số điện thoại" defaultValue="0912 345 678" />
          </Section>

          <Section title="Khu vực hoạt động">
            <label className="block text-xs font-medium mb-1">Thành phố</label>
            <select
              value={city}
              onChange={(e) => { setCity(e.target.value); setPicked([]); }}
              className="w-full border border-border rounded-md px-3 py-2 mb-3 text-sm bg-background"
            >
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
            <label className="block text-xs font-medium mb-1">Quận / Huyện</label>
            <div className="flex flex-wrap gap-1.5">
              {(districts[city] || []).map((d) => {
                const on = picked.includes(d);
                return (
                  <button
                    key={d}
                    onClick={() => toggleDistrict(d)}
                    className={`text-xs px-2.5 py-1 rounded-full border ${on ? "bg-orange text-orange-foreground border-orange" : "border-border"}`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Lịch làm việc">
            <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1 text-[10px] text-center">
              <div />
              {days.map((d) => <div key={d} className="font-semibold py-1">{d}</div>)}
              {slots.map((s) => (
                <>
                  <div key={`l-${s}`} className="font-semibold flex items-center justify-end pr-1">{s}</div>
                  {days.map((d) => {
                    const k = `${d}-${s}`;
                    const on = grid[k];
                    return (
                      <button
                        key={k}
                        onClick={() => toggleSlot(k)}
                        className={`aspect-square rounded text-[10px] border ${on ? "bg-orange text-orange-foreground border-orange" : "bg-surface border-border text-muted-foreground"}`}
                      >
                        {on ? "✓" : ""}
                      </button>
                    );
                  })}
                </>
              ))}
            </div>
          </Section>

          <div className="bg-orange/10 border border-orange/30 rounded-lg p-3 text-xs">
            💡 Chọn càng nhiều khung giờ, bạn càng được ưu tiên nhận task tốt hơn!
          </div>

          <button
            onClick={() => nav({ to: "/executor/home" })}
            className="w-full bg-orange text-orange-foreground font-semibold rounded-md py-3 text-sm"
          >
            Hoàn tất & Vào Pool →
          </button>
        </main>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">{title}</div>
      {children}
    </div>
  );
}

function Input({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div className="mb-2">
      <label className="block text-xs font-medium mb-1">{label}</label>
      <input defaultValue={defaultValue} className="w-full border border-border rounded-md px-3 py-2 text-sm" />
    </div>
  );
}

function Step({ label, done, active }: { label: string; done?: boolean; active?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${done ? "bg-success text-white" : active ? "bg-orange text-orange-foreground" : "bg-surface text-muted-foreground border border-border"}`}>
        {done ? <Check className="w-3 h-3" /> : ""}
      </span>
      <span className={active ? "font-semibold" : "text-muted-foreground"}>{label}</span>
    </div>
  );
}

function Bar() {
  return <div className="flex-1 h-px bg-border" />;
}
