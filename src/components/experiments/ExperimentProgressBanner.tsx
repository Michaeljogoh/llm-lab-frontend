"use client";

import { ExperimentProgress, ExperimentStatus } from "@/types/experiment";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface ExperimentProgressBannerProps {
  status: ExperimentStatus;
  progress: ExperimentProgress;
  percent: number;
}

export function ExperimentProgressBanner({
  status,
  progress,
  percent,
}: ExperimentProgressBannerProps) {
  if (status === "completed" || !progress.total) return null;

  return (
    <div className="rounded-lg border border-border bg-deep-green/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(status === "running" || status === "queued") && (
            <Loader2 className="size-4 animate-spin text-deep-green" />
          )}
          <span className="text-sm font-medium text-foreground capitalize">{status}</span>
          <Badge variant="muted">
            {progress.completed}/{progress.total} variants
          </Badge>
          {progress.failed > 0 && (
            <Badge variant="coral">{progress.failed} failed</Badge>
          )}
        </div>
        <span className="font-mono text-sm text-muted-foreground">{percent}%</span>
      </div>
      <Progress value={percent} className="mt-3 h-1.5 [&>div]:bg-deep-green" />
    </div>
  );
}
