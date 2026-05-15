import { ArrowLeft } from "lucide-react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { applications } from "@/lib/mock-data";
import { useState } from "react";
import { useTranslation } from "react-i18next";


export const Route = createFileRoute("/ops/queue/application/$id")({
  component: AppReview,
});

function AppReview() {
  const { id } = Route.useParams();
  const a = (applications as any)[id] ?? applications["e-1"];
  const [notes, setNotes] = useState("");
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="space-y-5 max-w-4xl">
      <button onClick={() => router.history.back()} className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> {t("back_to_queue")}
      </button>
      <h1 className="text-2xl font-bold">{t("application_review")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-[5px] p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-navy text-navy-foreground flex items-center justify-center font-bold">
                {a.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <div className="font-semibold text-lg">{a.name}</div>
                <div className="text-xs text-muted-foreground">{a.age} {t("years")} · {a.background}</div>
              </div>
            </div>

            <Field label={t("availability")} value={a.availability} />
            <Field label={t("work_experience")} value={a.experience} />

            <div className="mt-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{t("documents")}</div>
              <div className="grid grid-cols-2 gap-3">
                <Doc label={t("id_card")} t={t} />
                <Doc label={t("student_work_card")} t={t} />
              </div>
            </div>
          </div>

          <div className="border border-orange/40 bg-orange/5 rounded-[5px] p-4">
            <div className="text-xs font-semibold text-orange uppercase tracking-wide mb-1">{t("flag_reason")}</div>
            <div className="text-sm">{a.flag}</div>
          </div>

          <div className="bg-card border border-border rounded-[5px] p-5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">{t("internal_notes")}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder={t("add_notes_placeholder")}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
            />
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full bg-success text-white font-semibold rounded-[5px] py-3 text-sm">{t("approve")}</button>
          <button className="w-full bg-orange text-orange-foreground font-semibold rounded-[5px] py-3 text-sm">{t("schedule_phone_screen")}</button>
          <button className="w-full bg-danger text-white font-semibold rounded-[5px] py-3 text-sm">{t("reject")}</button>
          <div className="text-[11px] text-muted-foreground text-center pt-2">{t("rejection_reasons_hint")}</div>
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

function Doc({ label, t }: { label: string, t: any }) {
  return (
    <div className="border border-border rounded-[5px] overflow-hidden">
      <div className="h-28 bg-surface flex items-center justify-center text-xs text-muted-foreground">{t("preview")}</div>
      <div className="px-3 py-2 text-xs">{label}</div>
    </div>
  );
}
