import React, { useState } from "react";
import { GridIcon, ListIcon, FlaskConicalIcon } from "lucide-react";
import { ExperimentCard } from "./ExperimentCard";
import { Experiment } from "../types/experiment";

interface ExperimentGridProps {
  onSelectExperiment: (experiment: Experiment) => void;
  experiments: Experiment[];
}

export function ExperimentGrid({
  onSelectExperiment,
  experiments,
}: ExperimentGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            My Experiments
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
            View and manage your parameter experiments
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 transition-colors duration-300">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <GridIcon
                className={`w-4 h-4 ${
                  viewMode === "grid"
                    ? "text-gray-700 dark:text-gray-300"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <ListIcon
                className={`w-4 h-4 ${
                  viewMode === "list"
                    ? "text-gray-700 dark:text-gray-300"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {experiments.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              : "space-y-4"
          }
        >
          {experiments.map((experiment) => {
            const { maxScore, bestIndex } = experiment.responses.reduce(
              (acc, response, index) => {
                if (response.score > acc.maxScore) {
                  return { maxScore: response.score, bestIndex: index };
                }
                return acc;
              },
              { maxScore: -Infinity, bestIndex: 0 + 1 }
            );

            return (
              <ExperimentCard
                key={experiment._id}
                id={experiment._id}
                name={experiment.title}
                description={experiment.prompt.slice(0, 57)}
                date={experiment.createdAt}
                variations={experiment.responses.length}
                status="completed"
                bestResponse={`Response ${bestIndex}`}
                score={maxScore}
                viewMode={viewMode}
                onClick={() => onSelectExperiment(experiment)}
              />
            );
          })}

          {/*  */}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20 px-4 sm:px-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl transition-colors duration-300">
          {/* Icon Container */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full mb-5 sm:mb-6 animate-pulse">
            <FlaskConicalIcon className="w-7 h-7 sm:w-8 sm:h-8 text-gray-500 dark:text-gray-400" />
          </div>

          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
            No experiments yet
          </h3>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-xs sm:max-w-md transition-colors duration-300">
            You haven’t created any experiments yet. Once you generate your
            first one, it’ll show up here for you to view, compare, and manage.
          </p>
        </div>
      )}
    </div>
  );
}
