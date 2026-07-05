"use client";

import { useEffect, useState } from "react";
import { getApiClient } from "@/lib/api-client";
import { PromptPreset } from "@/types/experiment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PromptPresetsPickerProps {
  onSelect: (preset: PromptPreset) => void;
}

export function PromptPresetsPicker({ onSelect }: PromptPresetsPickerProps) {
  const [presets, setPresets] = useState<PromptPreset[]>([]);

  useEffect(() => {
    getApiClient()
      .get<PromptPreset[]>("/experiment/presets")
      .then(({ data }) => setPresets(data))
      .catch(() => setPresets([]));
  }, []);

  if (presets.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="font-mono-label text-[10px] text-muted-foreground">Prompt presets</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset)}
            className={cn(
              "hover-black rounded-lg border border-border bg-card p-3 text-left transition-colors"
            )}
          >
            <p className="font-display text-sm text-foreground">{preset.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{preset.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {preset.tags.map((tag) => (
                <Badge key={tag} variant="muted" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          </button>
        ))}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-xs"
        onClick={() =>
          onSelect({
            id: "blank",
            name: "Blank",
            description: "",
            systemPrompt: "",
            prompt: "",
            tags: [],
            temperature: [0.1, 0.2],
            topP: [0.1, 0.2],
            topK: [0.1, 0.2],
            maxToken: [100, 200],
          })
        }
      >
        Clear preset
      </Button>
    </div>
  );
}
