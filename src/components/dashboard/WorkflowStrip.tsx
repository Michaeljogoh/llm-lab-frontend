"use client";

import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Configure sweep",
    body: "Set your prompt and parameter ranges with live combination preview.",
  },
  {
    number: "02",
    title: "Run and score",
    body: "Gemini generates every variant and the backend scores each response.",
  },
  {
    number: "03",
    title: "Compare and export",
    body: "Rank results, compare side by side, star favorites, and export CSV.",
  },
];

export function WorkflowStrip() {
  return (
    <section className="overflow-hidden rounded-[22px] bg-deep-green px-5 py-6 text-white sm:px-8 sm:py-8">
      <div className="mb-6 max-w-xl">
        <p className="font-mono-label text-white/60">Workflow</p>
        <h3 className="mt-2 font-display text-2xl">From prompt to best variant in three moves</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="hover-black relative rounded-lg border border-white/10 bg-white/5 p-4 text-white"
          >
            <p className="font-mono text-xs text-coral">{step.number}</p>
            <h4 className="mt-3 font-display text-lg text-white">{step.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-white/75">{step.body}</p>
            {index < steps.length - 1 && (
              <ArrowRight className="absolute -right-3 top-1/2 hidden size-4 -translate-y-1/2 text-white/30 md:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
