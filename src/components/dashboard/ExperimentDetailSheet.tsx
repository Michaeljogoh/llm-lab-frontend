"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Download, FileJson, Notebook, Trophy } from "lucide-react";
import { Experiment } from "@/types/experiment";
import {
  exportExperimentCsv,
  exportExperimentJson,
  exportJupyterNotebook,
  formatScore,
  getExperimentStats,
} from "@/lib/experiment-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricsBreakdown } from "./MetricsBreakdown";
import { ResponseCompareView } from "./ResponseCompareView";
import { ParameterHeatmap } from "@/components/experiments/ParameterHeatmap";
import { ShareExperimentPanel } from "@/components/experiments/ShareExperimentPanel";
import { ExperimentActionsBar } from "@/components/experiments/ExperimentActionsBar";
import { ExperimentProgressBanner } from "@/components/experiments/ExperimentProgressBanner";
import { useExperimentPoll } from "@/hooks/use-experiment-poll";
import { useRouter } from "next/navigation";

interface ExperimentDetailSheetProps {
  experiment: Experiment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFavorite: (key: string) => boolean;
  onToggleFavorite: (key: string) => void;
}

export function ExperimentDetailSheet({
  experiment: initialExperiment,
  open,
  onOpenChange,
  isFavorite,
  onToggleFavorite,
}: ExperimentDetailSheetProps) {
  const router = useRouter();
  const [experiment, setExperiment] = useState(initialExperiment);
  const [compareIds, setCompareIds] = useState<number[]>([]);

  useEffect(() => {
    setExperiment(initialExperiment);
  }, [initialExperiment]);

  const { status, progress, percent } = useExperimentPoll(
    experiment?._id ?? null,
    open && (experiment?.status === "running" || experiment?.status === "queued"),
    () => router.refresh()
  );

  const stats = useMemo(
    () => (experiment ? getExperimentStats(experiment) : null),
    [experiment]
  );

  const topThree = useMemo(() => {
    if (!experiment) return [];
    return [...experiment.responses]
      .map((response, index) => ({ response, index }))
      .sort((a, b) => b.response.score - a.response.score)
      .slice(0, 3);
  }, [experiment]);

  if (!experiment || !stats) return null;

  const best = experiment.responses[stats.bestIndex];
  const totalCost = experiment.responses.reduce(
    (sum, r) => sum + (r.estimatedCostUsd ?? 0),
    0
  );
  const avgLatency =
    experiment.responses.length > 0
      ? Math.round(
          experiment.responses.reduce((s, r) => s + (r.latencyMs ?? 0), 0) /
            experiment.responses.length
        )
      : 0;

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) setCompareIds([]);
        onOpenChange(next);
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="line-clamp-2 pr-8">{experiment.prompt}</SheetTitle>
          <SheetDescription>
            {experiment.responses.length} variants ·{" "}
            {formatDistanceToNow(new Date(experiment.createdAt), { addSuffix: true })}
            {experiment.models?.length ? ` · ${experiment.models.join(", ")}` : ""}
          </SheetDescription>
        </SheetHeader>

        {(experiment.status === "running" || experiment.status === "queued") && (
          <div className="mt-4">
            <ExperimentProgressBanner
              status={status}
              progress={progress.total ? progress : experiment.progress ?? progress}
              percent={percent}
            />
          </div>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant="success">Best {formatScore(stats.maxScore)}</Badge>
          <Badge variant="muted">Avg {formatScore(stats.avgScore)}</Badge>
          {totalCost > 0 && (
            <Badge variant="muted">${totalCost.toFixed(4)} est.</Badge>
          )}
          {avgLatency > 0 && <Badge variant="muted">{avgLatency}ms avg</Badge>}
          {(experiment.tags ?? []).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
          <div className="ml-auto flex flex-wrap gap-1">
            <Button variant="outline" size="sm" onClick={() => exportExperimentCsv(experiment)}>
              <Download className="size-4" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportExperimentJson(experiment)}>
              <FileJson className="size-4" />
              JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportJupyterNotebook(experiment)}
            >
              <Notebook className="size-4" />
              Notebook
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <ExperimentActionsBar experiment={experiment} onUpdated={setExperiment} />
          <ShareExperimentPanel experiment={experiment} onUpdated={setExperiment} />
        </div>

        <Tabs defaultValue="responses" className="mt-6 flex min-h-0 flex-1 flex-col">
          <TabsList className="flex-wrap">
            <TabsTrigger value="responses">Responses</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="best">Best run</TabsTrigger>
          </TabsList>

          <TabsContent value="responses" className="min-h-0 flex-1">
            <ResponseCompareView
              experimentId={experiment._id}
              responses={experiment.responses}
              compareIds={compareIds}
              onCompareChange={setCompareIds}
              favoriteKeyPrefix={experiment._id}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />
          </TabsContent>

          <TabsContent value="heatmap">
            <ParameterHeatmap responses={experiment.responses} />
          </TabsContent>

          <TabsContent value="analysis">
            <div className="grid gap-3 sm:grid-cols-3">
              {topThree.map(({ response, index }, rank) => (
                <div
                  key={index}
                  className="card-surface rounded-lg border border-border bg-card p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Trophy className={cnRankIcon(rank)} />
                    <span className="font-medium text-foreground">
                      #{rank + 1} · R{index + 1}
                    </span>
                  </div>
                  <p className="font-display text-2xl text-foreground">
                    {formatScore(response.score)}
                  </p>
                  {response.judgeScore != null && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Judge {formatScore(response.judgeScore)}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge variant="muted" className="text-[10px]">
                      T {response.parameters.temperature}
                    </Badge>
                    <Badge variant="muted" className="text-[10px]">
                      P {response.parameters.topP}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="best">
            <div className="card-surface space-y-4 rounded-lg border border-border bg-card p-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">Response {stats.bestIndex + 1}</Badge>
                {best.model && <Badge variant="muted">{best.model}</Badge>}
                <Badge variant="muted">temp {best.parameters.temperature}</Badge>
                <Badge variant="muted">topP {best.parameters.topP}</Badge>
                <Badge variant="muted">topK {best.parameters.topK}</Badge>
                <Badge variant="muted">max {best.parameters.maxToken}</Badge>
              </div>
              {best.judgeRationale && (
                <p className="text-xs text-muted-foreground">Judge: {best.judgeRationale}</p>
              )}
              <p className="text-sm leading-relaxed text-foreground">{best.response}</p>
              <MetricsBreakdown response={best} />
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function cnRankIcon(rank: number) {
  if (rank === 0) return "size-4 text-chart-3";
  if (rank === 1) return "size-4 text-muted-foreground";
  return "size-4 text-chart-5";
}
