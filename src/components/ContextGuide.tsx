import { useState } from "react";

type ContextGuideProps = {
  title: string;
  steps: string[];
};

export function ContextGuide({ title, steps }: ContextGuideProps) {
  const [open, setOpen] = useState(true);

  return (
    <section className="rounded-[5px] border border-orange-100 bg-orange-50 p-3 text-orange-900">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="text-xs font-bold uppercase tracking-wide">{title}</span>
        <span className="text-[11px] font-semibold">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <ol className="mt-2 space-y-1.5 text-xs leading-relaxed">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-2">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white text-[9px] font-bold text-[#F97316]">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
