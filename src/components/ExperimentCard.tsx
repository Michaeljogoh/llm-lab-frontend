import {
  CalendarIcon,
  LayersIcon,
  TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
} from "lucide-react";

interface ExperimentCardProps {
  id: string;
  name: string;
  description: string;
  date: string;
  variations: number;
  status: "completed" | "in-progress";
  bestResponse: string | null;
  score: number | null;
  viewMode: "grid" | "list";
  onClick: () => void;
}

export function ExperimentCard({
  name,
  description,
  date,
  variations,
  status,
  bestResponse,
  score,
  viewMode,
  onClick,
}: ExperimentCardProps) {
  const statusConfig = {
    completed: {
      icon: CheckCircleIcon,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/30",
      label: "Completed",
    },
    "in-progress": {
      icon: ClockIcon,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-900/30",
      label: "In Progress",
    },
  };
  const StatusIcon = statusConfig[status].icon;

  if (viewMode === "list") {
    return (
      <div
        onClick={onClick}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 cursor-pointer group"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                {name}
              </h3>
              <span
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status].bg} ${statusConfig[status].color} transition-colors duration-300`}
              >
                <StatusIcon className="w-3 h-3" />
                {statusConfig[status].label}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 transition-colors duration-300">
              {description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                {new Date(date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
                {/* {date} */}
              </div>
              <div className="flex items-center gap-1">
                <LayersIcon className="w-4 h-4" />
                {variations} variations
              </div>
              {bestResponse && (
                <div className="flex items-center gap-1">
                  <TrendingUpIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                  Best Score
                </div>
              )}
              {score && (
                <div className="flex items-center">
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {score}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 cursor-pointer group hover:scale-105"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {name}
        </h3>
        <span
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status].bg} ${statusConfig[status].color} transition-colors duration-300`}
        >
          <StatusIcon className="w-3 h-3" />
          {statusConfig[status].label}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 transition-colors duration-300">
        {description}
      </p>
      <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            {new Date(date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
          <div className="flex items-center gap-1">
            <LayersIcon className="w-4 h-4" />
            {variations} variations
          </div>
        </div>
        {bestResponse && score && (
          <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center gap-1">
              <TrendingUpIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs">Best Score</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                {score}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
