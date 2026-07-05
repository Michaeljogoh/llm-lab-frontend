"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SystemPromptFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function SystemPromptField({
  value,
  onChange,
  disabled,
}: SystemPromptFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="system-prompt">System prompt (optional)</Label>
      <Textarea
        id="system-prompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Set persona, format rules, or constraints for every variant..."
        disabled={disabled}
        className="min-h-[80px]"
      />
    </div>
  );
}
