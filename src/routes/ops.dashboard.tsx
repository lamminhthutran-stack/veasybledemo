import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronRight, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/ops/dashboard")({
  component: OpsDashboard,
});

type ThresholdDef = {
  warn: number;
  critical: number;
  dir: "below" | "above";
  type: "%" | "h" | "count" | "score";
  label: string;
};

type Thresholds = Record<string, ThresholdDef>;

const initialThresholds: Thresholds = {
  onboardingCompletionRate: { label: "Onboarding Completion Rate", warn: 80, critical: 60, dir: "below", type: "%" },
  activeExecutorRate: { label: "Active Executor Rate", warn: 70, critical: 50, dir: "below", type: "%" },
  executorDropoutRate: { label: "Executor Dropout Rate", warn: 20, critical: 35, dir: "above", type: "%" },
  taskFillRate: { label: "Task Fill Rate", warn: 80, critical: 60, dir: "below", type: "%" },
  avgTimeTaskAcceptance: { label: "Avg Time to Task Acceptance", warn: 12, critical: 24, dir: "above", type: "h" },
  declineRatePerTask: { label: "Decline Rate per Task", warn: 25, critical: 40, dir: "above", type: "%" },
  browseToAcceptConversion: { label: "Browse-to-Accept Conversion", warn: 30, critical: 15, dir: "below", type: "%" },
  onTimeStartRate: { label: "On-Time Start Rate", warn: 85, critical: 70, dir: "below", type: "%" },
  taskCompletionRate: { label: "Task Completion Rate", warn: 90, critical: 75, dir: "below", type: "%" },
  avgCompletionTime: { label: "Avg Completion Time", warn: 36, critical: 48, dir: "above", type: "h" },
  checklistPassRate: { label: "Checklist Pass Rate", warn: 85, critical: 70, dir: "below", type: "%" },
  escalationRate: { label: "Escalation Rate", warn: 10, critical: 20, dir: "above", type: "%" },
  openEscalationCount: { label: "Open Escalation Count", warn: 5, critical: 10, dir: "above", type: "count" },
  avgEscalationResolutionTime: { label: "Avg Escalation Resolution Time", warn: 24, critical: 48, dir: "above", type: "h" },
  brandSatisfactionScore: { label: "Brand Satisfaction Score", warn: 3.5, critical: 3.0, dir: "below", type: "score" },
  retailerSatisfactionScore: { label: "Retailer Satisfaction Score", warn: 3.5, critical: 3.0, dir: "below", type: "score" },
};

const mockMetrics = {
  totalRegisteredExecutors: 1245,
  onboardingCompletionRate: 82,
  activeExecutorRate: 68,
  executorDropoutRate: 15,
  taskFillRate: 92,
  avgTimeTaskAcceptance: 14,
  declineRatePerTask: 22,
  browseToAcceptConversion: 12,
  onTimeStartRate: 88,
  taskCompletionRate: 94,
  avgCompletionTime: 28,
  checklistPassRate: 82,
  escalationRate: 8,
  openEscalationCount: 12,
  avgEscalationResolutionTime: 22,
  brandSatisfactionScore: 4.2,
  retailerSatisfactionScore: 4.1,
};

type ExecutorData = {
  id: string;
  name: string;
  completionRate: number;
  qualityScore: number;
  preferred: boolean;
  escalationsRaised: number;
  escalationsAgainst: number;
};

const mockExecutors: ExecutorData[] = [
  { id: "e1", name: "Nguyễn Minh Khoa", completionRate: 95, qualityScore: 92, preferred: true, escalationsRaised: 2, escalationsAgainst: 0 },
  { id: "e2", name: "Trần Thị Lan", completionRate: 88, qualityScore: 85, preferred: false, escalationsRaised: 0, escalationsAgainst: 1 },
  { id: "e3", name: "Lê Văn An", completionRate: 65, qualityScore: 70, preferred: false, escalationsRaised: 1, escalationsAgainst: 3 },
  { id: "e4", name: "Phạm Thu Hương", completionRate: 92, qualityScore: 88, preferred: true, escalationsRaised: 0, escalationsAgainst: 0 },
  { id: "e5", name: "Hoàng Thanh Sơn", completionRate: 75, qualityScore: 80, preferred: false, escalationsRaised: 5, escalationsAgainst: 0 },
];

function OpsDashboard() {
  const [thresholds, setThresholds] = useState<Thresholds>(initialThresholds);
  const [dateRange, setDateRange] = useState("This Week");
  const { t } = useTranslation();

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3557]">{t("ops_dashboard")}</h1>
          <p className="mt-1 text-sm text-gray-500">{t("ops_dashboard_desc")}</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-2 text-sm font-medium bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
        >
          <option value="Today">{t("today")}</option>
          <option value="This Week">{t("this_week")}</option>
          <option value="This Month">{t("this_month")}</option>
          <option value="This Quarter">{t("this_quarter")}</option>
        </select>
      </div>

      <div className="space-y-4">
        <Stage1 thresholds={thresholds} />
        <Stage2 thresholds={thresholds} />
        <Stage3 thresholds={thresholds} />
        <Stage4 thresholds={thresholds} />
        <Stage5 />
      </div>

      <ThresholdSettingsPanel thresholds={thresholds} setThresholds={setThresholds} />
    </div>
  );
}

// ── Helpers ──

function evaluateHealth(val: number, def: ThresholdDef): "green" | "amber" | "red" {
  if (def.dir === "below") {
    if (val < def.critical) return "red";
    if (val < def.warn) return "amber";
    return "green";
  } else {
    if (val > def.critical) return "red";
    if (val > def.warn) return "amber";
    return "green";
  }
}

function aggregateStageHealth(healths: ("green" | "amber" | "red")[]): "green" | "amber" | "red" {
  if (healths.includes("red")) return "red";
  if (healths.includes("amber")) return "amber";
  return "green";
}

// ── Components ──

function StagePanel({ num, title, health, children }: { num: number; title: string; health: "green" | "amber" | "red"; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  const { t } = useTranslation();

  const dotColor = health === "green" ? "bg-[#16A34A]" : health === "amber" ? "bg-[#D97706]" : "bg-[#DC2626]";
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 bg-[#1A3557] text-white hover:bg-[#1A3557]/90 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-white/20 text-xs font-bold flex items-center justify-center">{num}</span>
          <span className="font-semibold">{title}</span>
          <div className="flex items-center gap-2 ml-4 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${dotColor} shadow-sm`} />
            <span className="text-white/80 font-medium capitalize">{health === "green" ? t("healthy_status") : health === "amber" ? t("warning_status") : t("critical_status")}</span>
          </div>
        </div>
        {expanded ? <ChevronDown className="w-5 h-5 opacity-70" /> : <ChevronRight className="w-5 h-5 opacity-70" />}
      </button>
      {expanded && <div className="p-5">{children}</div>}
    </div>
  );
}

function KPICard({ label, value, health, def }: { label: string; value: string | number; health?: "green" | "amber" | "red"; def?: ThresholdDef }) {
  const { t } = useTranslation();
  const borderColor = health === "green" ? "border-l-[#16A34A]" : health === "amber" ? "border-l-[#D97706]" : health === "red" ? "border-l-[#DC2626]" : "border-l-gray-300";
  const textColor = health === "red" ? "text-[#DC2626]" : health === "amber" ? "text-[#D97706]" : "text-gray-900";
  const bgBadge = health === "green" ? "bg-[#16A34A]/10 text-[#16A34A]" : health === "amber" ? "bg-[#D97706]/10 text-[#D97706]" : health === "red" ? "bg-[#DC2626]/10 text-[#DC2626]" : "";

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-r-lg border-l-4 ${borderColor} p-4 flex flex-col justify-between`}>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 line-clamp-1" title={label}>{label}</div>
      <div className="flex items-end gap-2 mb-2">
        <div className={`text-3xl font-bold ${textColor}`}>{value}</div>
        {health && <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase mb-1 ${bgBadge}`}>{health === "green" ? t("healthy_status") : health === "amber" ? t("warning_status") : t("critical_status")}</div>}
      </div>
      {def && (
        <div className="text-[10px] text-gray-400 mt-auto pt-2 border-t border-gray-200">
          <span className="font-medium text-[#D97706]">{def.dir === "below" ? t("warn_below") : t("warn_above")} {def.warn}{def.type}</span>
          <span className="mx-1">•</span>
          <span className="font-medium text-[#DC2626]">{def.dir === "below" ? t("crit_below") : t("crit_above")} {def.critical}{def.type}</span>
        </div>
      )}
      {!def && <div className="text-[10px] text-gray-400 mt-auto pt-2 border-t border-gray-200">{t("no_threshold")}</div>}
    </div>
  );
}

// ── Stages ──

function Stage1({ thresholds }: { thresholds: Thresholds }) {
  const m = mockMetrics;
  const h1 = evaluateHealth(m.onboardingCompletionRate, thresholds.onboardingCompletionRate);
  const h2 = evaluateHealth(m.activeExecutorRate, thresholds.activeExecutorRate);
  const h3 = evaluateHealth(m.executorDropoutRate, thresholds.executorDropoutRate);
  
  const overall = aggregateStageHealth([h1, h2, h3]);

  const { t } = useTranslation();
  return (
    <StagePanel num={1} title={t("stage_1_pool")} health={overall}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label={t("total_reg_executors")} value={m.totalRegisteredExecutors} />
        <KPICard label={t("onboarding_completion_rate")} value={`${m.onboardingCompletionRate}%`} health={h1} def={thresholds.onboardingCompletionRate} />
        <KPICard label={t("active_executor_rate")} value={`${m.activeExecutorRate}%`} health={h2} def={thresholds.activeExecutorRate} />
        <KPICard label={t("executor_dropout_rate")} value={`${m.executorDropoutRate}%`} health={h3} def={thresholds.executorDropoutRate} />
      </div>
    </StagePanel>
  );
}

function Stage2({ thresholds }: { thresholds: Thresholds }) {
  const m = mockMetrics;
  const h1 = evaluateHealth(m.taskFillRate, thresholds.taskFillRate);
  const h2 = evaluateHealth(m.avgTimeTaskAcceptance, thresholds.avgTimeTaskAcceptance);
  const h3 = evaluateHealth(m.declineRatePerTask, thresholds.declineRatePerTask);
  const h4 = evaluateHealth(m.browseToAcceptConversion, thresholds.browseToAcceptConversion);
  
  const overall = aggregateStageHealth([h1, h2, h3, h4]);

  const { t } = useTranslation();
  return (
    <StagePanel num={2} title={t("stage_2_acceptance")} health={overall}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label={t("task_fill_rate")} value={`${m.taskFillRate}%`} health={h1} def={thresholds.taskFillRate} />
        <KPICard label={t("avg_time_task_acceptance")} value={`${m.avgTimeTaskAcceptance}h`} health={h2} def={thresholds.avgTimeTaskAcceptance} />
        <KPICard label={t("decline_rate_per_task")} value={`${m.declineRatePerTask}%`} health={h3} def={thresholds.declineRatePerTask} />
        <KPICard label={t("browse_to_accept_conversion")} value={`${m.browseToAcceptConversion}%`} health={h4} def={thresholds.browseToAcceptConversion} />
      </div>
    </StagePanel>
  );
}

function Stage3({ thresholds }: { thresholds: Thresholds }) {
  const m = mockMetrics;
  const h1 = evaluateHealth(m.onTimeStartRate, thresholds.onTimeStartRate);
  const h2 = evaluateHealth(m.taskCompletionRate, thresholds.taskCompletionRate);
  const h3 = evaluateHealth(m.avgCompletionTime, thresholds.avgCompletionTime);
  const h4 = evaluateHealth(m.checklistPassRate, thresholds.checklistPassRate);
  
  const overall = aggregateStageHealth([h1, h2, h3, h4]);

  const { t } = useTranslation();
  return (
    <StagePanel num={3} title={t("stage_3_execution")} health={overall}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label={t("on_time_start_rate")} value={`${m.onTimeStartRate}%`} health={h1} def={thresholds.onTimeStartRate} />
        <KPICard label={t("task_completion_rate")} value={`${m.taskCompletionRate}%`} health={h2} def={thresholds.taskCompletionRate} />
        <KPICard label={t("avg_completion_time")} value={`${m.avgCompletionTime}h`} health={h3} def={thresholds.avgCompletionTime} />
        <KPICard label={t("checklist_pass_rate")} value={`${m.checklistPassRate}%`} health={h4} def={thresholds.checklistPassRate} />
      </div>
    </StagePanel>
  );
}

function Stage4({ thresholds }: { thresholds: Thresholds }) {
  const m = mockMetrics;
  const h1 = evaluateHealth(m.escalationRate, thresholds.escalationRate);
  const h2 = evaluateHealth(m.openEscalationCount, thresholds.openEscalationCount);
  const h3 = evaluateHealth(m.avgEscalationResolutionTime, thresholds.avgEscalationResolutionTime);
  const h4 = evaluateHealth(m.brandSatisfactionScore, thresholds.brandSatisfactionScore);
  const h5 = evaluateHealth(m.retailerSatisfactionScore, thresholds.retailerSatisfactionScore);
  
  const overall = aggregateStageHealth([h1, h2, h3, h4, h5]);

  const { t } = useTranslation();
  return (
    <StagePanel num={4} title={t("stage_4_quality")} health={overall}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard label={t("escalation_rate")} value={`${m.escalationRate}%`} health={h1} def={thresholds.escalationRate} />
        <KPICard label={t("open_escalation_count")} value={m.openEscalationCount} health={h2} def={thresholds.openEscalationCount} />
        <KPICard label={t("avg_escalation_res_time")} value={`${m.avgEscalationResolutionTime}h`} health={h3} def={thresholds.avgEscalationResolutionTime} />
        <KPICard label={t("brand_sat_score")} value={m.brandSatisfactionScore} health={h4} def={thresholds.brandSatisfactionScore} />
        <KPICard label={t("retailer_sat_score")} value={m.retailerSatisfactionScore} health={h5} def={thresholds.retailerSatisfactionScore} />
      </div>
    </StagePanel>
  );
}

// ── Stage 5 Table ──

type SortField = keyof ExecutorData | "overall";

function Stage5() {
  const [sortField, setSortField] = useState<SortField>("escalationsAgainst");
  const [sortDesc, setSortDesc] = useState(true);

  const getStatus = (e: ExecutorData) => {
    if (e.completionRate < 70 || e.escalationsAgainst > 2) return "Flagged";
    if ((e.completionRate >= 70 && e.completionRate <= 90) || (e.escalationsAgainst >= 1 && e.escalationsAgainst <= 2)) return "At Risk";
    return "Good";
  };

  const statusWeight = { "Flagged": 0, "At Risk": 1, "Good": 2 };

  const sorted = [...mockExecutors].sort((a, b) => {
    let cmp = 0;
    if (sortField === "overall") {
      cmp = statusWeight[getStatus(a)] - statusWeight[getStatus(b)];
    } else {
      const va = a[sortField];
      const vb = b[sortField];
      if (typeof va === "string" && typeof vb === "string") cmp = va.localeCompare(vb);
      else if (typeof va === "number" && typeof vb === "number") cmp = va - vb;
      else if (typeof va === "boolean" && typeof vb === "boolean") cmp = (va ? 1 : 0) - (vb ? 1 : 0);
    }
    return sortDesc ? -cmp : cmp;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDesc(!sortDesc);
    else {
      setSortField(field);
      setSortDesc(true);
    }
  };

  const Th = ({ field, label }: { field: SortField; label: string }) => (
    <th 
      className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortField === field && <span className="text-gray-900">{sortDesc ? "↓" : "↑"}</span>}
      </div>
    </th>
  );

  const { t } = useTranslation();

  return (
    <StagePanel num={5} title={t("stage_5_perf")} health="green">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <Th field="name" label={t("executor_name")} />
              <Th field="completionRate" label={t("completion_rate")} />
              <Th field="qualityScore" label={t("quality_score")} />
              <Th field="preferred" label={t("preferred")} />
              <Th field="escalationsRaised" label={t("escalations_raised")} />
              <Th field="escalationsAgainst" label={t("escalations_against")} />
              <Th field="overall" label={t("overall_status")} />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {sorted.map(e => {
              const status = getStatus(e);
              const badgeCls = status === "Good" ? "bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20" : 
                               status === "At Risk" ? "bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20" : 
                               "bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20";
              return (
                <tr key={e.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-semibold text-gray-900">{e.name}</td>
                  <td className="py-3 px-4">{e.completionRate}%</td>
                  <td className="py-3 px-4">{e.qualityScore}%</td>
                  <td className="py-3 px-4">
                    {e.preferred ? <span className="text-[#1A3557] font-semibold bg-[#1A3557]/10 px-2 py-0.5 rounded text-[10px]">{t("yes")}</span> : <span className="text-gray-400">{t("no")}</span>}
                  </td>
                  <td className="py-3 px-4">{e.escalationsRaised}</td>
                  <td className="py-3 px-4 font-medium">{e.escalationsAgainst}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${badgeCls}`}>{status === "Flagged" ? t("flagged") : status === "At Risk" ? t("at_risk_status") : t("good_status")}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </StagePanel>
  );
}

// ── Threshold Settings ──

function ThresholdSettingsPanel({ thresholds, setThresholds }: { thresholds: Thresholds, setThresholds: (t: Thresholds) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [local, setLocal] = useState<Thresholds>(thresholds);

  const handleChange = (key: string, field: "warn" | "critical", value: string) => {
    const num = parseFloat(value);
    setLocal(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: isNaN(num) ? 0 : num }
    }));
  };

  const handleSave = () => {
    setThresholds(local);
    setExpanded(false);
  };

  const { t } = useTranslation();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mt-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 text-[#1A3557] font-bold">
          <Settings className="w-5 h-5" />
          {t("threshold_settings")}
        </div>
        {expanded ? <ChevronDown className="w-5 h-5 opacity-70" /> : <ChevronRight className="w-5 h-5 opacity-70" />}
      </button>
      
      {expanded && (
        <div className="p-5 border-t border-gray-200">
          <div className="text-sm text-gray-500 mb-4">{t("threshold_desc")}</div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left font-semibold text-gray-500 pb-2 w-1/2">{t("metric")}</th>
                  <th className="text-left font-semibold text-[#D97706] pb-2 w-1/4">{t("warning_threshold")}</th>
                  <th className="text-left font-semibold text-[#DC2626] pb-2 w-1/4">{t("critical_threshold")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Object.entries(local).map(([key, def]) => (
                  <tr key={key}>
                    <td className="py-3 font-medium text-gray-700">
                      {def.label} <span className="text-xs text-gray-400 ml-1">({def.dir} X{def.type})</span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">{def.dir === "below" ? "<" : ">"}</span>
                        <input 
                          type="number" 
                          value={def.warn} 
                          onChange={(e) => handleChange(key, "warn", e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 w-20 text-sm focus:outline-none focus:border-[#D97706]"
                        />
                        <span className="text-gray-400 text-xs">{def.type}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">{def.dir === "below" ? "<" : ">"}</span>
                        <input 
                          type="number" 
                          value={def.critical} 
                          onChange={(e) => handleChange(key, "critical", e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 w-20 text-sm focus:outline-none focus:border-[#DC2626]"
                        />
                        <span className="text-gray-400 text-xs">{def.type}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex justify-end gap-3 pt-5 border-t border-gray-200">
            <button 
              onClick={() => { setLocal(thresholds); setExpanded(false); }}
              className="px-4 py-2 border border-gray-300 rounded-[5px] text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              {t("cancel")}
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-[#F97316] text-white rounded-[5px] text-sm font-bold hover:bg-[#F97316]/90 shadow-sm"
            >
              {t("save_thresholds")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
