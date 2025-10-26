import { BarChart3Icon, SparklesIcon, TargetIcon } from 'lucide-react';
import { ExperimentResponse } from '../types/experiment';

interface ParameterAnalysisProps {
  analysis: ExperimentResponse[];
}



export function ParameterAnalysis({ analysis } :ParameterAnalysisProps) {

  const withIndex = analysis.map((res, index) => ({
    ...res,
    originalIndex: index
  }));
  
  const sorted = withIndex.sort((a, b) => b.score - a.score);

  const topIndexes = sorted.slice(0, 3).map(item => item.originalIndex + 1);

  return <div className="mt-8 space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
        <h2 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">
          Parameter Analysis
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center space-y-3 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto transition-colors duration-300">
            <TargetIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              Best Overall
            </h3>
            <p className="text-sm  dark:text-gray-400 mt-1 transition-colors duration-300">
             {`Response ${topIndexes[0]}`}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center space-y-3 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto transition-colors duration-300">
            <SparklesIcon className="w-8 h-8 text-green-600 dark:text-green-400 transition-colors duration-300" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              Most Creative
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
             {`Response ${topIndexes[1]}`}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center space-y-3 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto transition-colors duration-300">
            <TargetIcon className="w-8 h-8 text-orange-600 dark:text-orange-400 transition-colors duration-300" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              Most Relevant
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
              {`Response ${topIndexes[2]}`}
            </p>
          </div>
        </div>
      </div>
    </div>;
}