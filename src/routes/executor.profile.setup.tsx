import { Camera, Check, ArrowLeft } from "lucide-react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

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
  const router = useRouter();
  const { t } = useTranslation();
  const [city, setCity] = useState("Hồ Chí Minh");
  const [picked, setPicked] = useState<string[]>(["Quận 1", "Quận 5"]);
  const [grid, setGrid] = useState<Record<string, boolean>>({});

  const toggleDistrict = (d: string) =>
    setPicked((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]));
  const toggleSlot = (k: string) => setGrid((g) => ({ ...g, [k]: !g[k] }));

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-navy text-navy-foreground px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.history.back()} className="opacity-80 hover:opacity-100 min-h-[44px] flex items-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="font-bold tracking-tight">Veasyble</div>
          <div className="text-[10px] text-white/70">{t("profile_setup")}</div>
        </div>
      </header>

      <main className="flex-1 p-5 space-y-5">
          <div className="flex items-center gap-2 text-[11px]">
            <Step done label={t("step_academy")} />
            <Bar />
            <Step active label={t("step_profile")} />
            <Bar />
            <Step label={t("step_done")} />
          </div>

          <div>
            <h1 className="text-xl font-extrabold leading-tight">{t("setup_profile_title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("setup_profile_subtitle")}</p>
          </div>

          <Section title={t("personal_info")}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center text-muted-foreground">
                <Camera className="w-5 h-5" />
              </div>
              <button className="text-xs px-3 py-1.5 border border-border rounded-md min-h-[44px]">{t("upload_photo")}</button>
            </div>
            <Input label={t("full_name")} defaultValue="Nguyễn Minh Khoa" />
            <Input label={t("phone_label")} defaultValue="0912 345 678" />
          </Section>

          <Section title={t("operation_area")}>
            <label className="block text-xs font-medium mb-1">{t("city")}</label>
            <select
              value={city}
              onChange={(e) => { setCity(e.target.value); setPicked([]); }}
              className="w-full min-h-[44px] border border-border rounded-md px-3 py-2 mb-3 text-sm bg-background"
            >
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
            <label className="block text-xs font-medium mb-1">{t("district_label")}</label>
            <div className="flex flex-wrap gap-1.5">
              {(districts[city] || []).map((d) => {
                const on = picked.includes(d);
                return (
                  <button
                    key={d}
                    onClick={() => toggleDistrict(d)}
                    className={`text-xs px-2.5 py-1 rounded-full border min-h-[44px] flex items-center justify-center ${on ? "bg-orange text-orange-foreground border-orange" : "border-border"}`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title={t("work_schedule")}>
            <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1 text-[10px] text-center">
              <div />
              {days.map((d) => <div key={d} className="font-semibold py-1">{d}</div>)}
              {slots.map((s) => (
                <Fragment key={s}>
                  <div className="font-semibold flex items-center justify-end pr-1">{s}</div>
                  {days.map((d) => {
                    const k = `${d}-${s}`;
                    const on = grid[k];
                    return (
                      <button
                        key={k}
                        onClick={() => toggleSlot(k)}
                        className={`aspect-square min-h-[32px] rounded text-[10px] border flex items-center justify-center ${on ? "bg-orange text-orange-foreground border-orange" : "bg-surface border-border text-muted-foreground"}`}
                      >
                        {on ? "✓" : ""}
                      </button>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </Section>

          <div className="bg-orange/10 border border-orange/30 rounded-[5px] p-3 text-xs">
             {t("schedule_hint")}
          </div>

          <button
            onClick={() => nav({ to: "/executor/home" })}
            className="w-full min-h-[44px] bg-orange text-orange-foreground font-semibold rounded-md py-3 text-sm"
          >
            {t("finish_and_pool")}
          </button>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-[5px] p-4">
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
