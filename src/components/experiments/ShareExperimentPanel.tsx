"use client";

import { useState } from "react";
import { Copy, Link2, Loader2 } from "lucide-react";
import { getApiClient } from "@/lib/api-client";
import { Experiment } from "@/types/experiment";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareExperimentPanelProps {
  experiment: Experiment;
  onUpdated: (experiment: Experiment) => void;
}

export function ShareExperimentPanel({
  experiment,
  onUpdated,
}: ShareExperimentPanelProps) {
  const [loading, setLoading] = useState(false);

  const toggleShare = async () => {
    setLoading(true);
    try {
      const { data } = await getApiClient().patch<Experiment>(
        `/experiment/${experiment._id}/share`,
        { isPublic: !experiment.isPublic }
      );
      onUpdated(data);
      toast.success(data.isPublic ? "Share link enabled" : "Share link disabled");
    } catch {
      toast.error("Failed to update sharing");
    } finally {
      setLoading(false);
    }
  };

  const shareUrl =
    typeof window !== "undefined" && experiment.shareToken
      ? `${window.location.origin}/experiments/share/${experiment.shareToken}`
      : "";

  const copyLink = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied");
  };

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">Shareable link</p>
          <p className="text-xs text-muted-foreground">
            Anyone with the link can view this experiment read-only.
          </p>
        </div>
        <Button
          variant={experiment.isPublic ? "default" : "outline"}
          size="sm"
          onClick={toggleShare}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Link2 className="size-4" />
          )}
          {experiment.isPublic ? "Public" : "Make public"}
        </Button>
      </div>
      {experiment.isPublic && shareUrl && (
        <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
          <code className="flex-1 truncate text-xs text-muted-foreground">{shareUrl}</code>
          <Button variant="ghost" size="icon" onClick={copyLink}>
            <Copy className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
