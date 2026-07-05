"use client";

import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import { Experiment } from "@/types/experiment";
import { formatScore, getExperimentStats } from "@/lib/experiment-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentActivityProps {
  experiments: Experiment[];
  onOpen: (experiment: Experiment) => void;
}

export function RecentActivity({ experiments, onOpen }: RecentActivityProps) {
  const recent = [...experiments]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4);

  return (
    <Card className="card-surface border-border/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-foreground">Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No runs yet. Start your first sweep.</p>
        ) : (
          recent.map((experiment) => {
            const { maxScore } = getExperimentStats(experiment);
            return (
              <button
                key={experiment._id}
                type="button"
                onClick={() => onOpen(experiment)}
                className="card-surface hover-black flex w-full items-start justify-between gap-3 rounded-lg border border-border bg-card p-3 text-left active:scale-[0.99]"
              >
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-foreground">
                    {experiment.prompt}
                  </p>
                  <p className="mt-1 text-xs text-foreground/55">
                    {formatDistanceToNow(new Date(experiment.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Badge variant="success">{formatScore(maxScore)}</Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {experiment.responses.length} runs
                  </span>
                </div>
              </button>
            );
          })
        )}

        {recent.length > 0 && (
          <Button
            variant="link"
            className="h-auto px-0 text-action-blue"
            onClick={() =>
              document
                .getElementById("experiments-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            View all experiments
            <ArrowUpRight className="size-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
