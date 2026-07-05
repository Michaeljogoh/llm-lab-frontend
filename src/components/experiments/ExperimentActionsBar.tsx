"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  Gavel,
  GitBranch,
  Loader2,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { getApiClient } from "@/lib/api-client";
import { Experiment } from "@/types/experiment";
import { Button } from "@/components/ui/button";

interface ExperimentActionsBarProps {
  experiment: Experiment;
  onUpdated?: (experiment: Experiment) => void;
}

export function ExperimentActionsBar({
  experiment,
  onUpdated,
}: ExperimentActionsBarProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const run = async (
    key: string,
    fn: () => Promise<{ data: Experiment }>,
    message: string
  ) => {
    setLoading(key);
    try {
      const { data } = await fn();
      onUpdated?.(data);
      toast.success(message);
      router.refresh();
    } catch {
      toast.error(`Action failed: ${key}`);
    } finally {
      setLoading(null);
    }
  };

  const isRunning =
    experiment.status === "running" || experiment.status === "queued";

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={!!loading || isRunning}
        onClick={() =>
          run(
            "duplicate",
            () => getApiClient().post(`/experiment/${experiment._id}/duplicate`),
            "Duplicate sweep queued"
          )
        }
      >
        {loading === "duplicate" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Copy className="size-4" />
        )}
        Duplicate
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={!!loading || isRunning}
        onClick={() =>
          run(
            "narrow",
            () => getApiClient().post(`/experiment/${experiment._id}/narrow-sweep`),
            "Narrow sweep queued"
          )
        }
      >
        {loading === "narrow" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Target className="size-4" />
        )}
        Narrow sweep
      </Button>

      {(experiment.status === "paused" ||
        (experiment.progress &&
          experiment.progress.completed < experiment.progress.total &&
          experiment.status !== "running")) && (
        <Button
          variant="outline"
          size="sm"
          disabled={!!loading}
          onClick={() =>
            run(
              "resume",
              () => getApiClient().post(`/experiment/${experiment._id}/resume`),
              "Run resumed"
            )
          }
        >
          <RefreshCw className="size-4" />
          Resume
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={!!loading || !experiment.responses.length}
        onClick={() =>
          run(
            "judge",
            () => getApiClient().post(`/experiment/${experiment._id}/judge`),
            "LLM judge scores added"
          )
        }
      >
        {loading === "judge" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Gavel className="size-4" />
        )}
        Run judge
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={!!loading || isRunning}
        onClick={() =>
          run(
            "regression",
            () => getApiClient().post(`/experiment/${experiment._id}/regression`),
            "Regression check complete"
          )
        }
      >
        {loading === "regression" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <GitBranch className="size-4" />
        )}
        Regression check
      </Button>

      {experiment.suggestedNextSweep && (
        <p className="w-full text-xs text-muted-foreground">
          <Sparkles className="mr-1 inline size-3.5 text-coral" />
          {experiment.suggestedNextSweep.message}
        </p>
      )}

      {experiment.regressionResult && (
        <p className="w-full text-xs text-muted-foreground">
          Regression: {experiment.regressionResult.baselineScore.toFixed(3)} →{" "}
          {experiment.regressionResult.newScore.toFixed(3)} (
          {experiment.regressionResult.passed ? "passed" : "failed"})
        </p>
      )}
    </div>
  );
}
