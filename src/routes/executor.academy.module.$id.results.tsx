import { Check, X } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getModule, modules, completedCount } from "@/lib/academy-data";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/executor/academy/module/$id/results")({
  component: Results,
});

function Results() {
  const { id } = Route.useParams();
  const m = getModule(id);
  const { t } = useTranslation();

  let answers: number[] = [];
  let score = 0;
  if (typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem(`quiz_${id}`);
      if (raw) ({ answers, score } = JSON.parse(raw));
    } catch {}
  }

  const passed = score >= 70;
  const correct = answers.filter((a, i) => a === m.questions[i]?.answer).length;
  const nextModule = modules.find((x) => x.num === m.num + 1);
  const allDone = completedCount() === modules.length;

  return (
    <div className="p-5 space-y-5">
      <div className="text-center pt-4">
        <div
          className={`w-28 h-28 rounded-full mx-auto flex items-center justify-center text-3xl font-extrabold border-8 ${
            passed ? "border-orange text-orange" : "border-danger text-danger"
          }`}
        >
          {score}%
        </div>
        <div className="text-sm text-muted-foreground mt-2">{correct}/{m.questions.length} {t("correct_answers")}</div>

        {passed ? (
          <div className="mt-4">
            <div className="text-success text-2xl">✓</div>
            <div className="font-semibold mt-1">{t("excellent")} Module {m.num}</div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="text-danger text-2xl">✗</div>
            <div className="font-semibold mt-1">{t("failed_module")}</div>
            <div className="text-sm text-muted-foreground">{t("need_70")}</div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {passed ? (
          allDone ? (
            <Link to="/executor/academy/complete" className="flex items-center justify-center w-full bg-orange text-orange-foreground font-semibold rounded-md py-3 min-h-[44px] text-sm">
              {t("view_academy_results")}
            </Link>
          ) : nextModule ? (
            <Link to="/executor/academy/module/$id/video" params={{ id: nextModule.id }} className="flex items-center justify-center w-full bg-orange text-orange-foreground font-semibold rounded-md py-3 min-h-[44px] text-sm">
              {t("continue_module")} {nextModule.num} →
            </Link>
          ) : (
            <Link to="/executor/academy" className="flex items-center justify-center w-full bg-orange text-orange-foreground font-semibold rounded-md py-3 min-h-[44px] text-sm">
              {t("back_to_academy")}
            </Link>
          )
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Link to="/executor/academy/module/$id/video" params={{ id }} className="flex items-center justify-center text-center border border-navy text-navy font-semibold rounded-md py-3 min-h-[44px] text-sm">
              {t("review_video")}
            </Link>
            <Link to="/executor/academy/module/$id/quiz" params={{ id }} className="flex items-center justify-center text-center bg-orange text-orange-foreground font-semibold rounded-md py-3 min-h-[44px] text-sm">
              {t("retake_quiz")}
            </Link>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-[5px] p-4">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">{t("detailed_answers")}</div>
        <div className="space-y-3">
          {m.questions.map((q, i) => {
            const userAns = answers[i];
            const ok = userAns === q.answer;
            return (
              <div key={i} className="text-sm">
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${ok ? "bg-success/20 text-success" : "bg-danger/20 text-danger"}`}>
                    {ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium">{i + 1}. {q.q}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {t("correct_ans_label")} <span className="text-success font-semibold">{q.options[q.answer]}</span>
                    </div>
                    {!ok && userAns !== undefined && (
                      <div className="text-xs text-muted-foreground">
                        {t("your_ans_label")} <span className="text-danger">{q.options[userAns]}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
