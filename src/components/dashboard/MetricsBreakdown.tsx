"use client";

import { ExperimentResponse } from "@/types/experiment";
import { METRIC_LABELS, formatScore } from "@/lib/experiment-utils";
import { cn } from "@/lib/utils";

interface MetricsBreakdownProps {
  response: ExperimentResponse;
  compact?: boolean;
}

export function MetricsBreakdown({ response, compact }: MetricsBreakdownProps) {
  const metrics = Object.entries(METRIC_LABELS).map(([key, label]) => ({
    key,
    label,
    value: response.metrics[key as keyof typeof METRIC_LABELS],
  }));

  return (
    <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4")}>
      {metrics.map((metric) => (
        <div
          key={metric.key}
          className="card-surface rounded-md border border-border bg-card px-3 py-2"
        >
          <p className="font-mono-label text-[10px] text-muted-foreground">
            {metric.label}
          </p>
          <div className="mt-1 flex items-end justify-between gap-2">
            <span className="font-display text-lg leading-none text-foreground">
              {formatScore(metric.value)}
            </span>
            <div className="h-1.5 flex-1 max-w-16 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-action-blue transition-[width] duration-300"
                style={{ width: `${Math.min(metric.value * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
      <div className="rounded-md border border-border bg-primary px-3 py-2 text-primary-foreground col-span-full sm:col-span-1">
        <p className="font-mono-label text-[10px] opacity-70">Quality score</p>
        <p className="mt-1 font-display text-2xl leading-none">
          {formatScore(response.score)}
        </p>
      </div>
    </div>
  );
}
