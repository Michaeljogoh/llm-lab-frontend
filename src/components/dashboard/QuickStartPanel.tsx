"use client";

import { Download, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickStartPanelProps {
  favoriteCount: number;
  onNewExperiment: () => void;
  onExportAll: () => void;
}

export function QuickStartPanel({
  favoriteCount,
  onNewExperiment,
  onExportAll,
}: QuickStartPanelProps) {
  return (
    <Card className="card-surface border-border/80 bg-muted/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-foreground">Quick start</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="w-full justify-start" onClick={onNewExperiment}>
          <Sparkles className="size-4" />
          New parameter sweep
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={onExportAll}>
          <Download className="size-4" />
          Export all results
        </Button>

        <div className="hover-black mt-4 rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Star className="size-4 text-coral" />
            <span>{favoriteCount} starred experiments</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Use the star icon in the experiment table to bookmark your best runs.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
