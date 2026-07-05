"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <p className="text-xs sm:text-sm">
          Sweep temperature, topP, topK, and max tokens in one run. Compare scored
          variants side by side.
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0 text-primary-foreground hover:bg-white/10"
          onClick={() => setVisible(false)}
        >
          <X className="size-3.5" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </div>
  );
}
