"use client";

import { DEFAULT_SCORING_WEIGHTS, ScoringWeights } from "@/types/experiment";
import { METRIC_LABELS } from "@/lib/experiment-utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface ScoringWeightsPanelProps {
  value: ScoringWeights;
  onChange: (value: ScoringWeights) => void;
}

const keys = Object.keys(DEFAULT_SCORING_WEIGHTS) as (keyof ScoringWeights)[];

export function ScoringWeightsPanel({ value, onChange }: ScoringWeightsPanelProps) {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
      <div>
        <p className="font-mono-label text-[10px] text-muted-foreground">Custom scoring weights</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Adjust how each metric contributes to the overall score.
        </p>
      </div>
      {keys.map((key) => (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">{METRIC_LABELS[key]}</Label>
            <span className="font-mono text-xs text-muted-foreground">{value[key].toFixed(1)}</span>
          </div>
          <Slider
            value={[value[key]]}
            min={0}
            max={3}
            step={0.1}
            onValueChange={([v]) => onChange({ ...value, [key]: v })}
          />
        </div>
      ))}
    </div>
  );
}
