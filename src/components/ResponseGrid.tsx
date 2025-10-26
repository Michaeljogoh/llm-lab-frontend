import { useState } from "react";
import { GridIcon, ListIcon } from "lucide-react";
import { ResponseCard } from "./ResponseCard";
import { ExperimentResponse } from "../types/experiment";

interface ResponseGridProps {
  responses: ExperimentResponse[];
}

export function ResponseGrid({ responses }: ResponseGridProps) {
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">
            {responses.length} responses generated
          </span>
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded transition-colors ${
              viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            <GridIcon
              className={`w-4 h-4 ${
                viewMode === "grid" ? "text-gray-700" : "text-gray-400"
              }`}
            />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded transition-colors ${
              viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            <ListIcon
              className={`w-4 h-4 ${
                viewMode === "list" ? "text-gray-700" : "text-gray-400"
              }`}
            />
          </button>
        </div>
      </div>
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 gap-4"
            : "space-y-4"
        }
      >
        {responses.map((response, index) => (
          <ResponseCard
            key={index}
            {...response}
            viewMode={viewMode}
            id={index}
          />
        ))}
      </div>
    </div>
  );
}
