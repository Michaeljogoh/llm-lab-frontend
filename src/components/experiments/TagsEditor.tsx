"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface TagsEditorProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagsEditor({ tags, onChange }: TagsEditorProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const tag = input.trim().toLowerCase();
    if (!tag || tags.includes(tag)) return;
    onChange([...tags, tag]);
    setInput("");
  };

  return (
    <div className="space-y-2">
      <p className="font-mono-label text-[10px] text-muted-foreground">Tags</p>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add tag..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
        />
      </div>
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Badge key={tag} variant="muted" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              className="rounded-full p-0.5 hover:bg-foreground/10"
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
