import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { availableTasks } from "@/lib/mock-data";
import { useTranslation } from "react-i18next";
import { useLang } from "@/lib/i18n-context";
import { BackButton } from "@/components/BackButton";

export const Route = createFileRoute("/executor/task/$id/")({
  component: TaskDetail,
});

function TaskDetail() {
  const { id } = Route.useParams();
  const { lang } = useLang();
  const { t } = useTranslation();
  
  // Find task or fallback to first one
  const task = availableTasks.find((x) => x.id === id) ?? availableTasks[0];

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      <div className="bg-white px-4 pt-12 pb-4">
        <BackButton />
        <h1 className="text-xl font-bold text-gray-900 mt-2">{task.brand}</h1>
        <p className="text-gray-400 text-sm">{task.campaignName}</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Campaign info */}
        <InfoSection title={t("campaign_info")}>
          <InfoRow label={t("brand")} value={task.brand} />
          <InfoRow label={t("date")} value={task.date} />
          <InfoRow label={t("start_time")} value={task.scheduledTime} />
          <InfoRow label={t("pay")} value={`${task.pay.toLocaleString()}đ`} />
        </InfoSection>

        {/* Location info */}
        <InfoSection title={t("location")}>
          <InfoRow label={t("store")} value={task.storeName} />
          <InfoRow label={t("address")} value={task.address ?? "245 Nguyễn Trãi, Quận 5"} />
          <InfoRow label={t("district")} value={task.district} />
        </InfoSection>

        {/* Print Station info */}
        <InfoSection title={t("print_station")}>
          <InfoRow
            label={t("pickup_date")}
            value={task.printStation?.pickupDate ?? (lang === "vi" ? "Chưa xác định" : "TBD")}
          />
          <InfoRow
            label={t("print_address")}
            value={task.printStation?.address ?? "—"}
          />
          <InfoRow
            label={t("materials")}
            value={task.printStation?.materials ?? "—"}
          />
          {task.printStation?.note && (
            <div className="bg-orange-50 rounded-[5px] p-3 mt-2 border border-orange-100">
              <p className="text-xs text-orange-700">{task.printStation.note}</p>
            </div>
          )}
        </InfoSection>

        {/* SOP summary */}
        <InfoSection title={t("execution_req")}>
          {(task.sopItems ?? []).map((item, i) => (
            <div key={i} className="flex gap-2 py-2 border-b border-gray-50 last:border-0">
              <span className="text-[#F97316] text-sm">→</span>
              <p className="text-sm text-gray-700">{item}</p>
            </div>
          ))}
          {(!task.sopItems || task.sopItems.length === 0) && (
             <p className="text-sm text-gray-400 py-2">
               {lang === "vi" ? "Không có yêu cầu cụ thể." : "No specific requirements."}
             </p>
          )}
        </InfoSection>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 max-w-[390px] mx-auto z-50">
        <Link
          to="/executor/task/$id/onsite"
          params={{ id: task.id }}
          className="block w-full bg-[#1A3557] text-white text-sm font-semibold py-3.5 rounded-[5px] text-center"
        >
          {t("start_day_of")}
        </Link>
      </div>
    </div>
  );
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[5px] p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-sm mb-3 text-gray-900">{title}</h3>
      <div className="space-y-0">
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <span className="text-xs text-gray-900 font-medium text-right max-w-[60%]">{value}</span>
    </div>
  );
}
