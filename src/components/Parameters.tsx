import React, { useState } from "react";
import { SlidersIcon } from "lucide-react";

type ParameterProps = {
  temperature: number[];
  topP: number[];
  topK: number[];
  maxToken: number[];
  setMaxToken: React.Dispatch<React.SetStateAction<number[]>>;
  setTemperature: React.Dispatch<React.SetStateAction<number[]>>;
  setTopP: React.Dispatch<React.SetStateAction<number[]>>;
  setTopK: React.Dispatch<React.SetStateAction<number[]>>;
  isPending: boolean
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
};

export function Parameters({
  temperature,
  topP,
  topK,
  maxToken,
  setMaxToken,
  setTemperature,
  setTopK,
  setTopP,
  isPending,
  handleSubmit,
}: ParameterProps) {


  const handleMaxTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);

    const values: number[] = [];
    for (let i = 100; i <= newValue; i += 100) {
      values.push(i);
    }

    setMaxToken(values);
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number[]>>,
    step: number = 0.1
  ) => {
    const newValue = parseFloat(e.target.value);

    const values: number[] = [];
    for (let i = step; i <= newValue + step / 2; i += step) {
      values.push(parseFloat(i.toFixed(2)));
    }

    setter(values);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <SlidersIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
        <h2 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">
          Parameters
        </h2>
      </div>
      {/* Temperature */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Temperature: {temperature.join(", ")}
          </span>
        </div>
        <div className="space-y-1">
          <input
            type="range"
            min="0.1"
            max="0.5"
            step="0.1"
            value={temperature[temperature.length - 1]}
            onChange={(e) => handleChange(e, setTemperature, 0.1)}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400 transition-all duration-300"
          />
        </div>
      </div>

   
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
            TopP: {topP.join(",")}
          </span>
        </div>
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max="0.7"
            step="0.1"
            value={topP[topP.length - 1]}
            onChange={(e) => handleChange(e, setTopP, 0.1)}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400 transition-all duration-300"
          />
        </div>
      </div>

   
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Top K: {topK.join(",")}
          </span>
        </div>
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max="0.9"
            step="0.1"
            value={topK[topK.length - 1]}
            onChange={(e) => handleChange(e, setTopK, 0.1)}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400 transition-all duration-300"
          />
        </div>
      </div>

      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Max Token: {maxToken.join(",")}
          </span>
        </div>
        <div className="space-y-1">
          <input
            type="range"
            min="100"
            max="500"
            step="100"
            value={maxToken[maxToken.length - 1]}
            onChange={handleMaxTokensChange}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400 transition-all duration-300"
          />
        </div>
      </div>

      <button onClick={handleSubmit} disabled={isPending} className="w-full bg-linear-to-r cursor-pointer from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-600 dark:hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105">
        {isPending ? "Generating..." : "Generate Responses"}
      </button>
    </div>
  );
}
