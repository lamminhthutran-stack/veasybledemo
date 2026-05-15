import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLang, LangToggle } from "@/lib/i18n-context";
import { BackButton } from "@/components/BackButton";
import { escalations } from "@/lib/mock-data";

export const Route = createFileRoute("/executor/knowledge")({
  component: FAQPage,
});

// ── Knowledge base tĩnh ───────────────────────────────────────────────────────
const KB_ARTICLES = [
  {
    id: "kb-checkin-late",
    tags: ["check-in", "trễ", "late", "muộn", "penalty"],
    title: { vi: "Check-in trễ — hậu quả là gì?", en: "Late check-in — what happens?" },
    body: {
      vi: "Trễ dưới 15 phút: bị trừ % lương tương ứng với số phút trễ.\nTrễ trên 15 phút: task tự động bị huỷ, surge pricing được kích hoạt để reassign cho executor khác.",
      en: "Late < 15 min: % pay deducted proportionally.\nLate > 15 min: task auto-cancelled, surge pricing activated for reassignment.",
    },
  },
  {
    id: "kb-store-refuse",
    tags: ["cửa hàng", "từ chối", "store", "refuse", "entry", "vào", "dispute"],
    title: { vi: "Cửa hàng từ chối cho vào — phải làm gì?", en: "Store refuses entry — what to do?" },
    body: {
      vi: "Báo cáo sự cố qua app ngay lập tức → chọn 'Cửa hàng từ chối'.\nThu nhập của bạn KHÔNG bị trừ.\nVeasyble sẽ xử lý trực tiếp với retailer.",
      en: "Report the incident via app immediately → select 'Store Refuses Entry'.\nYour pay is NOT deducted.\nVeasyble handles the situation directly with the retailer.",
    },
  },
  {
    id: "kb-pop",
    tags: ["pop", "proof", "photo", "ảnh", "chụp", "placement", "mờ", "blurry"],
    title: { vi: "Cách chụp PoP đạt chuẩn", en: "How to take a valid PoP photo" },
    body: {
      vi: "PoP gồm: ảnh kệ trước setup, ảnh sau setup (4 góc), selfie tại store, timestamp + GPS.\nNếu ảnh bị mờ hoặc sai góc: chụp lại ngay tại chỗ.\nNếu bị nghi ngờ gian lận GPS: tài khoản bị tạm suspend để điều tra.",
      en: "PoP requires: shelf before setup, after setup (4 angles), selfie at store, timestamp + GPS.\nBlurry or wrong angle: retake immediately on-site.\nSuspected GPS fraud: account suspended pending investigation.",
    },
  },
  {
    id: "kb-rating",
    tags: ["rating", "điểm", "score", "đánh giá", "healthy", "warning", "suspended"],
    title: { vi: "Hệ thống rating hoạt động thế nào?", en: "How does the rating system work?" },
    body: {
      vi: "Job đầu tiên: Veasyble tự rate.\nJob thứ 2 trở đi: trung bình của Brand + Retailer (Veasyble không tham gia nữa).\nNgưỡng: ≥4.0 Healthy | 3.5–3.9 Warning | 3.0–3.4 At Risk | <3.0 Suspended.",
      en: "First job: Veasyble rates manually.\nFrom job 2 onward: average of Brand + Retailer (Veasyble no longer participates).\nThresholds: ≥4.0 Healthy | 3.5–3.9 Warning | 3.0–3.4 At Risk | <3.0 Suspended.",
    },
  },
  {
    id: "kb-print",
    tags: ["print", "in", "tài liệu", "material", "station", "trạm", "nhận", "pickup", "lỗi", "defective"],
    title: { vi: "Nhận tài liệu in & xử lý khi bị lỗi", en: "Print station pickup & defective materials" },
    body: {
      vi: "Nhận tài liệu tại trạm in trước ngày thực hiện ít nhất 1 ngày (xem thông tin trong task detail).\nNếu tài liệu bị lỗi: báo qua app → bạn không bị phạt → platform sắp xếp in lại.",
      en: "Collect materials at the print station at least 1 day before execution (see task detail for address).\nIf materials are defective: report via app → you are not penalized → platform coordinates reprint.",
    },
  },
];

function searchKB(query: string, lang: "vi" | "en") {
  const q = query.toLowerCase();
  return KB_ARTICLES.filter(a =>
    a.tags.some(t => q.includes(t) || t.includes(q)) ||
    a.title[lang].toLowerCase().includes(q)
  );
}

type View = "home" | "results" | "escalate";

const QUICK_TOPICS = {
  vi: ["Check-in trễ", "Cửa hàng từ chối", "Chụp PoP", "Rating", "Tài liệu in"],
  en: ["Late check-in", "Store refuses entry", "PoP photo", "Rating", "Print materials"],
};

function FAQPage() {
  const { lang } = useLang();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("home");
  const [results, setResults] = useState<typeof KB_ARTICLES>([]);

  // Form State
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [escalateSent, setEscalateSent] = useState(false);
  const [formError, setFormError] = useState("");

  function handleSearch(q: string) {
    setQuery(q);
    if (!q.trim()) { setView("home"); return; }
    const found = searchKB(q, lang);
    setResults(found);
    setView("results");
  }

  function handleQuickTopic(topic: string) {
    setQuery(topic);
    handleSearch(topic);
  }

  function submitEscalation() {
    setFormError("");
    if (!subject.trim()) {
      setFormError(lang === "vi" ? "Vui lòng nhập tiêu đề." : "Please enter a subject.");
      return;
    }
    if (!category) {
      setFormError(lang === "vi" ? "Vui lòng chọn danh mục." : "Please select a category.");
      return;
    }
    if (description.trim().length < 20) {
      setFormError(lang === "vi" ? "Mô tả phải có ít nhất 20 ký tự." : "Description must be at least 20 characters long.");
      return;
    }

    // Push to global mock escalations
    escalations.unshift({
      id: "e-" + Math.floor(Math.random() * 100000),
      phase: category,
      severity: "Medium",
      status: "Open",
      title: subject,
      executorId: "exec-001",
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      resolvedNote: null,
    });

    setSubject("");
    setCategory("");
    setDescription("");
    setEscalateSent(true);
  }

  const topics = lang === "vi" ? QUICK_TOPICS.vi : QUICK_TOPICS.en;

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-20 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">FAQ</h1>
            <p className="text-xs text-gray-400">
              {t("faq_subtitle") ?? "Tìm policy & SOP"}
            </p>
          </div>
          <LangToggle />
        </div>
        {/* Search box */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder={t("faq_search_placeholder") ?? "Tìm kiếm policy, SOP..."}
            className="w-full bg-gray-100 rounded-[5px] pl-9 pr-4 py-2.5 text-sm outline-none placeholder-gray-400"
          />
          {query && (
            <button onClick={() => { setQuery(""); setView("home"); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg leading-none">×</button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4">

        {/* HOME: quick topics */}
        {view === "home" && (
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              {t("popular_topics") ?? "Chủ đề phổ biến"}
            </p>
            <div className="space-y-2">
              {topics.map((t, i) => (
                <button key={i} onClick={() => handleQuickTopic(t)}
                  className="w-full flex items-center justify-between bg-white rounded-[5px] px-4 py-3 border border-gray-100 shadow-sm text-left">
                  <span className="text-sm text-gray-800 font-medium">{t}</span>
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              ))}
            </div>
            
            <button onClick={() => setView("escalate")}
              className="w-full mt-6 bg-[#1A3557] text-white text-sm font-semibold py-3.5 rounded-[5px]">
              {lang === "vi" ? "Bạn cần hỗ trợ thêm? Raise to Ops →" : "Need more help? Raise to Ops →"}
            </button>
          </div>
        )}

        {/* RESULTS: KB matches */}
        {view === "results" && (
          <div>
            {results.length > 0 ? (
              <>
                <p className="text-xs text-gray-400 mb-3">
                  {results.length} {t("faq_results") ?? "kết quả"} cho "{query}"
                </p>
                <div className="space-y-3">
                  {results.map(a => (
                    <div key={a.id} className="bg-white rounded-[5px] p-4 border border-gray-100 shadow-sm">
                      <p className="text-sm font-semibold text-gray-900 mb-2">{a.title[lang]}</p>
                      <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{a.body[lang]}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center mt-6">
                  {lang === "vi" ? "Chưa tìm thấy câu trả lời?" : "Didn't find your answer?"}
                </p>
                <button onClick={() => setView("escalate")}
                  className="w-full mt-2 bg-[#1A3557] text-white text-sm font-semibold py-3.5 rounded-[5px]">
                  {lang === "vi" ? "Raise to Ops →" : "Raise to Ops →"}
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3"></div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  {lang === "vi" ? `Không tìm thấy kết quả cho "${query}"` : `No results for "${query}"`}
                </p>
                <p className="text-gray-400 text-xs mb-5">
                  {lang === "vi" ? "Vui lòng liên hệ Ops team để được hỗ trợ" : "Please contact the Ops team for support"}
                </p>
                <button onClick={() => setView("escalate")}
                  className="bg-[#1A3557] text-white text-sm font-semibold px-6 py-3.5 rounded-[5px] w-full">
                  {lang === "vi" ? "Raise to Ops" : "Raise to Ops"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ESCALATE TO OPS */}
        {view === "escalate" && (
          <div>
            <button onClick={() => {
              setEscalateSent(false);
              setView(query ? "results" : "home");
            }} className="flex items-center gap-1.5 text-sm text-gray-600 font-medium py-2 hover:text-gray-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              {t("back") ?? "Back"}
            </button>
            
            {escalateSent ? (
              <div className="text-center py-12 bg-white rounded-[5px] border border-green-100 mt-4 shadow-sm p-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <p className="text-gray-800 font-semibold mb-2 text-base">
                  {lang === "vi" ? "Tin nhắn đã được gửi" : "Message Sent"}
                </p>
                <p className="text-gray-500 text-sm">
                  {lang === "vi" 
                    ? "Tin nhắn của bạn đã được gửi đến Ops team. Chúng tôi sẽ phản hồi lại trong thời gian sớm nhất." 
                    : "Your message has been sent to the Ops team. We will follow up with you shortly."}
                </p>
                <button onClick={() => {
                  setEscalateSent(false);
                  setView("home");
                  setQuery("");
                }} className="mt-6 text-[#1A3557] font-semibold text-sm">
                  {lang === "vi" ? "Quay lại trang chủ" : "Return to Home"}
                </button>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Raise to Ops</h2>
                <p className="text-xs text-gray-500 mb-4">
                  {lang === "vi" ? "Gửi yêu cầu hỗ trợ trực tiếp cho team Ops." : "Send a direct support request to the Ops team."}
                </p>

                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-[5px] text-xs font-medium">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {lang === "vi" ? "Tiêu đề" : "Subject"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder={lang === "vi" ? "Tóm tắt vấn đề..." : "Brief summary..."}
                    className="w-full bg-white border border-gray-200 rounded-[5px] px-3 py-2.5 text-sm outline-none focus:border-[#1A3557]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {lang === "vi" ? "Danh mục" : "Category"} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-[5px] px-3 py-2.5 text-sm outline-none focus:border-[#1A3557]"
                  >
                    <option value="" disabled>{lang === "vi" ? "-- Chọn danh mục --" : "-- Select a category --"}</option>
                    <option value="Task Issue">{lang === "vi" ? "Vấn đề về Task" : "Task Issue"}</option>
                    <option value="Platform Bug">{lang === "vi" ? "Lỗi ứng dụng" : "Platform Bug"}</option>
                    <option value="Brand/Retailer Issue">{lang === "vi" ? "Vấn đề Brand/Cửa hàng" : "Brand/Retailer Issue"}</option>
                    <option value="Payment Issue">{lang === "vi" ? "Vấn đề thanh toán" : "Payment Issue"}</option>
                    <option value="Other">{lang === "vi" ? "Khác" : "Other"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {lang === "vi" ? "Mô tả chi tiết" : "Description"} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                    placeholder={lang === "vi" ? "Mô tả ít nhất 20 ký tự..." : "Describe your issue (min 20 chars)..."}
                    className="w-full bg-white border border-gray-200 rounded-[5px] px-3 py-2.5 text-sm outline-none focus:border-[#1A3557] resize-none"
                  />
                  <div className="text-[10px] text-gray-400 mt-1 text-right">
                    {description.length}/20 {lang === "vi" ? "ký tự (tối thiểu)" : "min chars"}
                  </div>
                </div>

                <button onClick={submitEscalation}
                  className="w-full bg-[#F97316] text-white text-sm font-semibold py-3.5 rounded-[5px] mt-2">
                  {lang === "vi" ? "Gửi cho Ops" : "Send to Ops"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
