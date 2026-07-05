"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { getApiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface HumanRatingButtonsProps {
  experimentId: string;
  responseIndex: number;
  rating?: "up" | "down" | null;
  onRated: (rating: "up" | "down" | null) => void;
}

export function HumanRatingButtons({
  experimentId,
  responseIndex,
  rating,
  onRated,
}: HumanRatingButtonsProps) {
  const rate = async (value: "up" | "down" | null) => {
    const next = rating === value ? null : value;
    try {
      await getApiClient().patch(
        `/experiment/${experimentId}/responses/${responseIndex}/rate`,
        { rating: next }
      );
      onRated(next);
    } catch {
      toast.error("Failed to save rating");
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className={cn(rating === "up" && "text-deep-green")}
        onClick={() => rate("up")}
      >
        <ThumbsUp className={cn("size-4", rating === "up" && "fill-current")} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(rating === "down" && "text-coral")}
        onClick={() => rate("down")}
      >
        <ThumbsDown className={cn("size-4", rating === "down" && "fill-current")} />
      </Button>
    </div>
  );
}
