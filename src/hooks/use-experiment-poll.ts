"use client";

import { useEffect, useState } from "react";
import { getApiClient } from "@/lib/api-client";
import { ExperimentProgress, ExperimentStatus } from "@/types/experiment";

export function useExperimentPoll(
  experimentId: string | null,
  enabled: boolean,
  onComplete?: () => void
) {
  const [status, setStatus] = useState<ExperimentStatus>("completed");
  const [progress, setProgress] = useState<ExperimentProgress>({
    completed: 0,
    total: 0,
    failed: 0,
  });

  useEffect(() => {
    if (!experimentId || !enabled) return;

    let active = true;
    const poll = async () => {
      try {
        const { data } = await getApiClient().get<{
          status: ExperimentStatus;
          progress: ExperimentProgress;
        }>(`/experiment/${experimentId}/status`);

        if (!active) return;
        setStatus(data.status);
        setProgress(data.progress);

        if (data.status === "completed" || data.status === "failed") {
          onComplete?.();
          return;
        }
        setTimeout(poll, 2000);
      } catch {
        if (active) setTimeout(poll, 3000);
      }
    };

    void poll();
    return () => {
      active = false;
    };
  }, [experimentId, enabled, onComplete]);

  const percent =
    progress.total > 0
      ? Math.round((progress.completed / progress.total) * 100)
      : 0;

  return { status, progress, percent };
}
