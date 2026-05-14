import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLang, LangToggle } from "@/lib/i18n-context";
import { BackButton } from "@/components/BackButton";

export const Route = createFileRoute("/executor/knowledge")({
  component: SMLPage,
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

// ── AI system prompt ──────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the Veasyble SML assistant. Answer executor questions about policies and SOPs concisely (max 3–4 sentences). If you are not confident, end with "Vui lòng nhấn 'Hỏi Ops team' để được hỗ trợ thêm." (VI) or "Please tap 'Ask Ops team' for further support." (EN).

KEY POLICIES:
- Late < 15 min: % pay deducted. Late > 15 min: task auto-cancelled + surge reassign.
- Store refuses entry: report via app → pay NOT deducted → Veasyble handles with retailer.
- Defective print materials: report via app → not penalized → platform reprints.
- First job: Veasyble rates. Job 2+: Brand + Retailer average only.
- Rating: ≥4.0 Healthy | 3.5–3.9 Warning | 3.0–3.4 At Risk | <3.0 Suspended.
- PoP: blurry/wrong angle → retake on-site. GPS spoof suspected → account suspended.
Reply in the same language as the question.`;

type View = "home" | "results" | "ai" | "escalate";
type Message = { role: "user" | "assistant"; content: string };

const QUICK_TOPICS = {
  vi: ["Check-in trễ", "Cửa hàng từ chối", "Chụp PoP", "Rating", "Tài liệu in"],
  en: ["Late check-in", "Store refuses entry", "PoP photo", "Rating", "Print materials"],
};

function SMLPage() {
  const { lang } = useLang();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("home");
  const [results, setResults] = useState<typeof KB_ARTICLES>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [escalateNote, setEscalateNote] = useState("");
  const [escalateSent, setEscalateSent] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiLoading]);

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

  async function askAI(q: string) {
    setView("ai");
    const userMsg: Message = { role: "user", content: q };
    const history = [...messages, userMsg];
    setMessages(history);
    setAiLoading(true);
    try {
      // In a real app we'd need an API key. For demo, we rely on the env or mock.
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": process.env.VITE_ANTHROPIC_API_KEY || "mock-key",
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) {
         // Fallback to a mock answer if API fails (e.g. no key)
         setTimeout(() => {
           setMessages([...history, { role: "assistant", content: lang === "vi" ? "Tính năng AI đang được bảo trì. Vui lòng nhấn 'Hỏi Ops team' để được hỗ trợ thêm." : "AI feature is under maintenance. Please tap 'Ask Ops team' for further support." }]);
           setAiLoading(false);
         }, 1500);
         return;
      }
      const data = await res.json();
      const reply = data.content?.[0]?.text ?? (lang === "vi" ? "Xin lỗi, có lỗi xảy ra." : "Sorry, something went wrong.");
      setMessages([...history, { role: "assistant", content: reply }]);
      setAiLoading(false);
    } catch {
      setTimeout(() => {
        setMessages([...history, { role: "assistant", content: lang === "vi" ? "Không thể kết nối. Thử lại sau." : "Connection error. Please try again." }]);
        setAiLoading(false);
      }, 1000);
    }
  }

  function submitEscalation() {
    setEscalateSent(true);
  }

  const topics = lang === "vi" ? QUICK_TOPICS.vi : QUICK_TOPICS.en;

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-20 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">SML</h1>
            <p className="text-xs text-gray-400">
              {t("sml_subtitle")}
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
            placeholder={t("sml_search_placeholder")}
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
              {t("popular_topics")}
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
          </div>
        )}

        {/* RESULTS: KB matches */}
        {view === "results" && (
          <div>
            {results.length > 0 ? (
              <>
                <p className="text-xs text-gray-400 mb-3">
                  {results.length} {t("sml_results")} cho "{query}"
                </p>
                <div className="space-y-3">
                  {results.map(a => (
                    <div key={a.id} className="bg-white rounded-[5px] p-4 border border-gray-100 shadow-sm">
                      <p className="text-sm font-semibold text-gray-900 mb-2">{a.title[lang]}</p>
                      <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{a.body[lang]}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center mt-4">
                  {lang === "vi" ? "Chưa tìm thấy câu trả lời?" : "Didn't find your answer?"}
                </p>
                <button onClick={() => askAI(query)}
                  className="w-full mt-2 bg-[#1A3557] text-white text-sm font-semibold py-3 rounded-[5px]">
                  {t("ask_ai")}
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  {lang === "vi" ? `Không tìm thấy kết quả cho "${query}"` : `No results for "${query}"`}
                </p>
                <p className="text-gray-400 text-xs mb-5">
                  {lang === "vi" ? "Thử hỏi AI hoặc liên hệ Ops team" : "Try asking AI or contact Ops team"}
                </p>
                <button onClick={() => askAI(query)}
                  className="bg-[#1A3557] text-white text-sm font-semibold px-6 py-3 rounded-[5px]">
                  {t("ask_ai")}
                </button>
              </div>
            )}
          </div>
        )}

        {/* AI CHAT */}
        {view === "ai" && (
          <div>
            <button onClick={() => setView("results")}
              className="flex items-center gap-1 text-xs text-gray-400 mb-3">
              ← {t("back_to_results")}
            </button>
            <div className="space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-[#1A3557] flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-0.5">V</div>
                  )}
                  <div className={`max-w-[85%] rounded-[5px] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-[#1A3557] text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex">
                  <div className="w-7 h-7 rounded-full bg-[#1A3557] flex items-center justify-center text-white text-xs font-bold mr-2">V</div>
                  <div className="bg-white rounded-[5px] px-4 py-3 border border-gray-100 shadow-sm flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}/>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}/>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}/>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            {!aiLoading && messages.length > 0 && (
              <button onClick={() => setView("escalate")}
                className="w-full mt-4 border-2 border-[#F97316] text-[#F97316] text-sm font-semibold py-3 rounded-[5px]">
                {lang === "vi" ? "Vẫn chưa rõ? Hỏi Ops team →" : "Still unclear? Ask Ops team →"}
              </button>
            )}
          </div>
        )}

        {/* ESCALATE TO OPS */}
        {view === "escalate" && (
          <div>
            <BackButton label={t("back")} />
            {escalateSent ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <p className="text-gray-800 font-semibold mb-1">
                  {t("ops_sent")}
                </p>
                <p className="text-gray-400 text-xs">
                  {t("ops_sent_sub")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-[5px] p-3 border border-orange-100">
                  <p className="text-xs text-orange-700 font-medium">
                    {lang === "vi"
                      ? "Câu hỏi của bạn sẽ được gửi đến Ops team kèm lịch sử tìm kiếm."
                      : "Your question and search history will be sent to the Ops team."}
                  </p>
                </div>
                <div className="bg-white rounded-[5px] border border-gray-100 p-3">
                  <p className="text-xs text-gray-400 mb-1">
                    {lang === "vi" ? "Câu hỏi của bạn" : "Your question"}
                  </p>
                  <p className="text-sm text-gray-700 font-medium">"{query}"</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1.5">
                    {lang === "vi" ? "Thêm thông tự (không bắt buộc)" : "Additional context (optional)"}
                  </p>
                  <textarea
                    value={escalateNote}
                    onChange={e => setEscalateNote(e.target.value)}
                    rows={3}
                    placeholder={t("describe_situation")}
                    className="w-full bg-gray-50 border border-gray-200 rounded-[5px] px-3 py-2.5 text-sm outline-none placeholder-gray-400 resize-none"
                  />
                </div>
                <button onClick={submitEscalation}
                  className="w-full bg-[#1A3557] text-white text-sm font-semibold py-3.5 rounded-[5px]">
                  {t("send_to_ops")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
