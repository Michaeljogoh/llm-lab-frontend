"use client";

import { diffWords } from "@/lib/experiment-utils";

interface ResponseDiffViewProps {
  left: string;
  right: string;
}

export function ResponseDiffView({ left, right }: ResponseDiffViewProps) {
  const { added, removed } = diffWords(left, right);

  if (added.length === 0 && removed.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">Responses use nearly identical wording.</p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-md border border-border bg-red-500/5 p-3">
        <p className="font-mono-label text-[10px] text-muted-foreground">Unique to A</p>
        <p className="mt-2 text-xs leading-relaxed text-foreground/80">
          {removed.length ? removed.join(", ") : "—"}
        </p>
      </div>
      <div className="rounded-md border border-border bg-deep-green/5 p-3">
        <p className="font-mono-label text-[10px] text-muted-foreground">Unique to B</p>
        <p className="mt-2 text-xs leading-relaxed text-foreground/80">
          {added.length ? added.join(", ") : "—"}
        </p>
      </div>
    </div>
  );
}
