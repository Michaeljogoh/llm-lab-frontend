"use client";

import { useState } from "react";
import { Check, Copy, Star } from "lucide-react";
import { ExperimentResponse } from "@/types/experiment";
import { formatScore } from "@/lib/experiment-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MetricsBreakdown } from "./MetricsBreakdown";
import { ResponseDiffView } from "@/components/experiments/ResponseDiffView";
import { HumanRatingButtons } from "@/components/experiments/HumanRatingButtons";
import { cn } from "@/lib/utils";

interface ResponseCompareViewProps {
  experimentId: string;
  responses: ExperimentResponse[];
  compareIds: number[];
  onCompareChange: (ids: number[]) => void;
  favoriteKeyPrefix: string;
  isFavorite: (key: string) => boolean;
  onToggleFavorite: (key: string) => void;
}

export function ResponseCompareView({
  experimentId,
  responses,
  compareIds,
  onCompareChange,
  favoriteKeyPrefix,
  isFavorite,
  onToggleFavorite,
}: ResponseCompareViewProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [ratings, setRatings] = useState<Record<number, "up" | "down" | null>>(
    () =>
      Object.fromEntries(
        responses.map((r, i) => [i, r.humanRating ?? null])
      ) as Record<number, "up" | "down" | null>
  );

  const sorted = [...responses]
    .map((response, index) => ({ response, index }))
    .sort((a, b) => b.response.score - a.response.score);

  const compared = compareIds.map((id) => responses[id]).filter(Boolean);

  const toggleCompare = (index: number) => {
    if (compareIds.includes(index)) {
      onCompareChange(compareIds.filter((id) => id !== index));
      return;
    }
    if (compareIds.length >= 2) {
      onCompareChange([compareIds[1], index]);
      return;
    }
    onCompareChange([...compareIds, index]);
  };

  const copyResponse = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="space-y-6">
      {compared.length === 2 && (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            {compareIds.map((index) => {
              const response = responses[index];
              return (
                <div
                  key={index}
                  className="card-surface rounded-lg border border-border bg-card p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <Badge variant="success">Compare R{index + 1}</Badge>
                    <span className="font-display text-lg text-foreground">
                      {formatScore(response.score)}
                    </span>
                  </div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge variant="muted">T {response.parameters.temperature}</Badge>
                    <Badge variant="muted">P {response.parameters.topP}</Badge>
                    {response.latencyMs != null && (
                      <Badge variant="muted">{response.latencyMs}ms</Badge>
                    )}
                    {response.estimatedCostUsd != null && (
                      <Badge variant="muted">${response.estimatedCostUsd.toFixed(5)}</Badge>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">{response.response}</p>
                </div>
              );
            })}
          </div>
          <ResponseDiffView left={compared[0].response} right={compared[1].response} />
        </>
      )}

      <ScrollArea className="h-[420px] pr-3">
        <div className="space-y-3">
          {sorted.map(({ response, index }) => {
            const favKey = `${favoriteKeyPrefix}-${index}`;
            const selected = compareIds.includes(index);

            return (
              <div
                key={index}
                className={cn(
                  "card-surface rounded-lg border p-4",
                  selected
                    ? "border-action-blue bg-action-blue/5 shadow-[0_10px_28px_rgb(24_99_220_/_12%)]"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selected}
                      onCheckedChange={() => toggleCompare(index)}
                      aria-label={`Compare response ${index + 1}`}
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">
                          Response {index + 1}
                        </span>
                        <Badge
                          variant={
                            response.score >= 0.7
                              ? "success"
                              : response.score >= 0.45
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {formatScore(response.score)}
                        </Badge>
                        {response.judgeScore != null && (
                          <Badge variant="outline">
                            Judge {formatScore(response.judgeScore)}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Badge variant="muted" className="font-mono text-[10px]">
                          temp {response.parameters.temperature}
                        </Badge>
                        <Badge variant="muted" className="font-mono text-[10px]">
                          topP {response.parameters.topP}
                        </Badge>
                        {response.model && (
                          <Badge variant="muted" className="text-[10px]">
                            {response.model}
                          </Badge>
                        )}
                        {response.latencyMs != null && (
                          <Badge variant="muted" className="text-[10px]">
                            {response.latencyMs}ms
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <HumanRatingButtons
                      experimentId={experimentId}
                      responseIndex={index}
                      rating={ratings[index]}
                      onRated={(rating) =>
                        setRatings((prev) => ({ ...prev, [index]: rating }))
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(isFavorite(favKey) && "text-coral")}
                      onClick={() => onToggleFavorite(favKey)}
                    >
                      <Star
                        className={cn("size-4", isFavorite(favKey) && "fill-current")}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyResponse(response.response, index)}
                    >
                      {copiedIndex === index ? (
                        <Check className="size-4 text-chart-2" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-foreground">
                  {response.response}
                </p>

                <details className="mt-3">
                  <summary className="cursor-pointer text-xs text-action-blue">
                    View metrics
                  </summary>
                  <div className="mt-3">
                    <MetricsBreakdown response={response} compact />
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
