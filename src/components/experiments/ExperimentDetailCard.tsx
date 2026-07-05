"use client";

import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowUpRight,
  Calendar,
  Download,
  Layers,
  Star,
  Trash2,
  Trophy,
} from "lucide-react";
import { Experiment } from "@/types/experiment";
import {
  exportExperimentCsv,
  formatScore,
  getExperimentStats,
  scoreTone,
} from "@/lib/experiment-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MetricsBreakdown } from "@/components/dashboard/MetricsBreakdown";
import { cn } from "@/lib/utils";

interface ExperimentDetailCardProps {
  experiment: Experiment;
  onOpen: (experiment: Experiment) => void;
  onDelete: (id: string) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  isDeleting?: boolean;
  readOnly?: boolean;
}

export function ExperimentDetailCard({
  experiment,
  onOpen,
  onDelete,
  isFavorite,
  onToggleFavorite,
  isDeleting,
  readOnly,
}: ExperimentDetailCardProps) {
  const stats = getExperimentStats(experiment);
  const best = experiment.responses[stats.bestIndex];
  const tone = scoreTone(stats.maxScore);
  const created = new Date(experiment.createdAt);

  const paramSummary = summarizeParameters(experiment);

  return (
    <article
      className="card-surface group overflow-hidden rounded-[18px] border border-border bg-card"
      onClick={readOnly ? undefined : () => onOpen(experiment)}
      role={readOnly ? undefined : "button"}
    >
      <div className="border-b border-border bg-deep-green px-5 py-4 text-white sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="chip-dark border-0 text-[10px]">
                {experiment.responses.length} variants
              </Badge>
              {isFavorite(experiment._id) && (
                <Badge className="chip-dark border-0 text-[10px]">
                  Starred
                </Badge>
              )}
            </div>
            <h3 className="font-display text-xl leading-snug text-white line-clamp-2">
              {experiment.prompt}
            </h3>
          </div>
          <div className="text-right">
            <p className="font-mono-label text-[10px] text-white/60">Best score</p>
            <p className="font-display text-3xl tabular-nums text-white">
              {formatScore(stats.maxScore)}
            </p>
            <p className="mt-1 text-xs text-white/60">Response {stats.bestIndex + 1}</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {format(created, "MMM d, yyyy")}
            <span className="text-muted-foreground/70">·</span>
            {formatDistanceToNow(created, { addSuffix: true })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Layers className="size-3.5" />
            Avg {formatScore(stats.avgScore)}
          </span>
          <Badge
            variant={
              tone === "high" ? "success" : tone === "mid" ? "secondary" : "outline"
            }
          >
            {tone === "high" ? "Strong" : tone === "mid" ? "Moderate" : "Needs tuning"}
          </Badge>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {paramSummary.map((item) => (
            <div
              key={item.label}
              className="rounded-md border border-border bg-muted/40 px-3 py-2"
            >
              <p className="font-mono-label text-[10px] text-muted-foreground">{item.label}</p>
              <p className="mt-1 font-mono text-sm text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Trophy className="size-4 text-coral" />
              <span className="text-sm font-medium text-foreground">Top response</span>
            </div>
            <span className="font-mono text-sm text-foreground">{formatScore(best.score)}</span>
          </div>
          <Progress
            value={Math.min(best.score * 100, 100)}
            className="mb-3 h-1 bg-foreground/10 [&>div]:bg-deep-green"
          />
          <p className="line-clamp-3 text-sm leading-relaxed text-foreground/80">
            {best.response}
          </p>
        </div>

        <MetricsBreakdown response={best} compact />

        {!readOnly && (
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-wrap gap-1">
            <Badge variant="muted" className="text-[10px]">
              T {best.parameters.temperature}
            </Badge>
            <Badge variant="muted" className="text-[10px]">
              P {best.parameters.topP}
            </Badge>
            <Badge variant="muted" className="text-[10px]">
              K {best.parameters.topK}
            </Badge>
            <Badge variant="muted" className="text-[10px]">
              max {best.parameters.maxToken}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(isFavorite(experiment._id) && "text-coral")}
              onClick={() => onToggleFavorite(experiment._id)}
            >
              <Star
                className={cn(
                  "size-4",
                  isFavorite(experiment._id) && "fill-current"
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => exportExperimentCsv(experiment)}
            >
              <Download className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={isDeleting}
              onClick={() => onDelete(experiment._id)}
            >
              <Trash2 className="size-4" />
            </Button>
            <Button variant="default" size="sm" onClick={() => onOpen(experiment)}>
              Open details
              <ArrowUpRight className="size-4" />
            </Button>
          </div>
        </div>
        )}
      </div>
    </article>
  );
}

function summarizeParameters(experiment: Experiment) {
  const temps = experiment.responses.map((r) => r.parameters.temperature);
  const topPs = experiment.responses.map((r) => r.parameters.topP);
  const topKs = experiment.responses.map((r) => r.parameters.topK);
  const tokens = experiment.responses.map((r) => r.parameters.maxToken);

  return [
    { label: "Temperature", value: formatRange(temps) },
    { label: "Top P", value: formatRange(topPs) },
    { label: "Top K", value: formatRange(topKs) },
    { label: "Max tokens", value: formatRange(tokens) },
  ];
}

function formatRange(values: number[]) {
  if (values.length === 0) return "-";
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return String(min);
  return `${min} – ${max}`;
}
