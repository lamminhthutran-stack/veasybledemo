import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getModule, setModuleResult } from "@/lib/academy-data";
import { useState } from "react";

export const Route = createFileRoute("/executor/academy/module/$id/quiz")({
  component: Quiz,
});

function Quiz() {
  const { id } = Route.useParams();
  const m = getModule(id);
  const nav = useNavigate();

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const q = m.questions[idx];
  const isLast = idx === m.questions.length - 1;

  const next = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (isLast) {
      const correct = newAnswers.filter((a, i) => a === m.questions[i].answer).length;
      const score = Math.round((correct / m.questions.length) * 100);
      setModuleResult(id, score);
      sessionStorage.setItem(`quiz_${id}`, JSON.stringify({ answers: newAnswers, score }));
      nav({ to: "/executor/academy/module/$id/results", params: { id } });
    } else {
      setIdx(idx + 1);
    }
  };

  return (
    <div className="p-5 space-y-5">
      <div>
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Module {m.num} · Quiz</div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-semibold">Câu {idx + 1} / {m.questions.length}</span>
          <div className="flex gap-1 ml-1">
            {m.questions.map((_, i) => (
              <span key={i} className={`w-2 h-2 rounded-full ${i <= idx ? "bg-orange" : "bg-border"}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="font-semibold text-base leading-snug mb-4">{q.q}</div>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition ${
                selected === i
                  ? "border-orange bg-orange/10 font-semibold"
                  : "border-border hover:border-muted-foreground/40"
              }`}
            >
              <span className="inline-block w-5 text-muted-foreground font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={next}
        disabled={selected === null}
        className="w-full bg-orange text-orange-foreground font-semibold rounded-md py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isLast ? "Nộp bài" : "Tiếp theo →"}
      </button>
    </div>
  );
}
