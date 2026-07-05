"use client";

import { METRIC_LABELS } from "@/lib/experiment-utils";
import { Badge } from "@/components/ui/badge";

export function MetricsShowcase() {
  const metrics = Object.values(METRIC_LABELS);

  return (
    <section className="surface-black rounded-[22px] px-5 py-7 sm:px-8 sm:py-9">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono-label text-white/60">Scoring engine</p>
          <h3 className="mt-2 font-display text-2xl text-white sm:text-3xl">
            Eight signals per response
          </h3>
          <p className="text-muted mt-3 max-w-2xl text-sm leading-relaxed">
            Every variant is graded automatically so you can compare outputs on
            more than gut feel alone.
          </p>
        </div>
        <Badge
          variant="outline"
          className="w-fit border-white/25 bg-white/10 text-white hover:bg-white/10"
        >
          Heuristic scoring
        </Badge>
      </div>

      <div className="mt-7 flex flex-wrap gap-2.5">
        {metrics.map((metric) => (
          <span key={metric} className="chip-dark rounded-full px-3.5 py-2 text-xs font-medium">
            {metric}
          </span>
        ))}
      </div>
    </section>
  );
}
