"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { buildSteppedValues, buildTokenValues } from "@/lib/experiment-utils";

interface ParameterSlidersProps {
  temperature: number[];
  topP: number[];
  topK: number[];
  maxToken: number[];
  onTemperatureChange: (values: number[]) => void;
  onTopPChange: (values: number[]) => void;
  onTopKChange: (values: number[]) => void;
  onMaxTokenChange: (values: number[]) => void;
}

function ParamRow({
  label,
  hint,
  max,
  step,
  values,
  onChange,
  format,
}: {
  label: string;
  hint: string;
  max: number;
  step: number;
  values: number[];
  onChange: (values: number[]) => void;
  format?: (v: number) => string;
}) {
  const currentMax = values[values.length - 1] ?? step;

  return (
    <div className="space-y-3 rounded-lg border border-border bg-secondary/30 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Label>{label}</Label>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <Badge variant="outline">{values.length} values</Badge>
      </div>
      <Slider
        min={step}
        max={max}
        step={step}
        value={[currentMax]}
        onValueChange={([v]) => {
          onChange(buildSteppedValues(v, step, step));
        }}
      />
      <div className="flex flex-wrap gap-1.5">
        {values.map((value) => (
          <Badge key={value} variant="muted" className="font-mono text-[11px]">
            {format ? format(value) : value}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function ParameterSliders({
  temperature,
  topP,
  topK,
  maxToken,
  onTemperatureChange,
  onTopPChange,
  onTopKChange,
  onMaxTokenChange,
}: ParameterSlidersProps) {
  const currentMaxToken = maxToken[maxToken.length - 1] ?? 100;

  return (
    <div className="space-y-4">
      <ParamRow
        label="Temperature"
        hint="Higher values increase randomness"
        max={0.5}
        step={0.1}
        values={temperature}
        onChange={onTemperatureChange}
      />
      <ParamRow
        label="Top P"
        hint="Nucleus sampling threshold"
        max={0.7}
        step={0.1}
        values={topP}
        onChange={onTopPChange}
      />
      <ParamRow
        label="Top K"
        hint="Limits candidate token pool"
        max={0.9}
        step={0.1}
        values={topK}
        onChange={onTopKChange}
      />
      <div className="space-y-3 rounded-lg border border-border bg-secondary/30 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Label>Max tokens</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Output length cap in 100-token steps
            </p>
          </div>
          <Badge variant="outline">{maxToken.length} values</Badge>
        </div>
        <Slider
          min={100}
          max={500}
          step={100}
          value={[currentMaxToken]}
          onValueChange={([v]) => onMaxTokenChange(buildTokenValues(v))}
        />
        <div className="flex flex-wrap gap-1.5">
          {maxToken.map((value) => (
            <Badge key={value} variant="muted" className="font-mono text-[11px]">
              {value}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
