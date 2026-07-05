"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getApiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

export function BenchmarkPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const runBenchmark = async () => {
    setLoading(true);
    try {
      const { data } = await getApiClient().post<{ suiteId: string }>(
        "/experiment/benchmark"
      );
      toast.success(`Benchmark suite started (${data.suiteId.slice(0, 8)}…)`);
      router.refresh();
    } catch {
      toast.error("Failed to start benchmark");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[18px] border border-border bg-muted/40 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono-label text-[10px] text-muted-foreground">Golden benchmark</p>
          <h4 className="font-display text-lg text-foreground">Run standard prompt suite</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Five curated prompts across summarization, reasoning, instruction, creative,
            and factual tasks — each with a default parameter grid.
          </p>
        </div>
        <Button onClick={runBenchmark} disabled={loading}>
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <FlaskConical className="size-4" />
          )}
          Run benchmark
        </Button>
      </div>
    </div>
  );
}
