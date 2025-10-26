"use client";

import { useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { ExperimentGrid } from "../components/ExperimentGrid";
import { ResponseGrid } from "../components/ResponseGrid";
import { ParameterAnalysis } from "../components/ParameterAnalysis";
import { Experiment } from "../types/experiment";
import { ArrowLeft } from "lucide-react";

interface HomeProp {
  experiments: Experiment[];
}

export default function Home({ experiments }: HomeProp) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedExperiment, setSelectedExperiment] =
    useState<Experiment | null>(null);

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header
        experiment={experiments}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex flex-col lg:flex-row relative">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="flex-1 p-4 sm:p-6">
          {!selectedExperiment ? (
            <ExperimentGrid
              experiments={experiments}
              onSelectExperiment={setSelectedExperiment}
            />
          ) : (
            <>
              <button
                onClick={() => setSelectedExperiment(null)}
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-600 dark:hover:to-blue-600 transition-all cursor-pointer duration-300 hover:shadow-lg hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Experiments</span>
              </button>

              <ResponseGrid responses={selectedExperiment.responses ?? []} />

              <ParameterAnalysis
                analysis={selectedExperiment.responses ?? []}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
