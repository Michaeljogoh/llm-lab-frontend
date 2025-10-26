import { useState } from "react";
import { CopyIcon, HeartIcon, CheckIcon } from "lucide-react";

interface ResponseCardProps {
  parameters: {
    temperature: number;
    topP: number;
    topK: number;
    maxToken: number;
  };
  response: string;
  metrics: {
    completeness: number;
    coherence: number;
    lengthAppropriateness: number;
    structuralPatterns: number;
    hallucination: number;
    correctness: number;
    wordcount: number;
    readability: number;
    qualityScore: number;
  };
  score: number;
  id?: number;
  viewMode?: "grid" | "list";
}
export function ResponseCard({
  parameters,
  response,
  score,
  id,
  viewMode = "grid",
}: ResponseCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold border shrink-0 transition-all duration-300 bg-green-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800`}
          >
            {(id ?? 0) + 1}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                Response
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all duration-200"
                >
                  {isCopied ? (
                    <CheckIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <CopyIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  )}
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all duration-200"
                >
                  <HeartIcon
                    className={`w-4 h-4 transition-all duration-300 ${
                      isFavorite
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm mb-3">
              <div>
                <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Temp:{" "}
                </span>
                <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                  {parameters.temperature}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Tokens:{" "}
                </span>
                <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                  {parameters.maxToken}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Top P:{" "}
                </span>
                <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                  {parameters.topP}
                </span>
              </div>

              <div>
                <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Top K:{" "}
                </span>
                <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                  {parameters.topK}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
              {response}
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 space-y-4 hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold border transition-all duration-300 bg-green-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800`}
          >
            {(id ?? 0) + 1}
          </div>
          <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
            Response
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all duration-200"
          >
            {isCopied ? (
              <CheckIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
            ) : (
              <CopyIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
            )}
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all duration-200"
          >
            <HeartIcon
              className={`w-4 h-4 transition-all duration-300 ${
                isFavorite
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-gray-400 dark:text-gray-500 hover:text-red-500"
              }`}
            />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <div>
          <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
            Temp:{" "}
          </span>
          <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
            {parameters.temperature}
          </span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
            Tokens:{" "}
          </span>
          <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
            {parameters.maxToken}
          </span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
            Top P:{" "}
          </span>
          <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
            {parameters.topP}
          </span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
            Top K:{" "}
          </span>
          <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
            {parameters.topK}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
        {response.slice(0, 150)}
      </p>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="text-xs font-medium text-blue-600 dark:text-blue-400 transition-colors duration-300">
          Score
        </div>
        <div className="text-xs font-bold   mb-1 transition-colors duration-300">
          {score}
        </div>
      </div>
    </div>
  );
}
