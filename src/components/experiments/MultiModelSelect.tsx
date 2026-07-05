"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const DEFAULT_MODELS = [
  "gemini-2.0-flash-001",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
];

interface MultiModelSelectProps {
  selected: string[];
  onChange: (models: string[]) => void;
  disabled?: boolean;
}

export function MultiModelSelect({
  selected,
  onChange,
  disabled,
}: MultiModelSelectProps) {
  const toggle = (model: string) => {
    if (selected.includes(model)) {
      onChange(selected.filter((m) => m !== model));
    } else {
      onChange([...selected, model]);
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
      <div>
        <p className="font-mono-label text-[10px] text-muted-foreground">Multi-model sweep</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Select one or more Gemini models. Each runs the full parameter grid.
        </p>
      </div>
      {DEFAULT_MODELS.map((model) => (
        <div key={model} className="flex items-center gap-2">
          <Checkbox
            id={model}
            checked={selected.includes(model)}
            onCheckedChange={() => toggle(model)}
            disabled={disabled}
          />
          <Label htmlFor={model} className="font-mono text-xs">
            {model}
          </Label>
        </div>
      ))}
    </div>
  );
}
