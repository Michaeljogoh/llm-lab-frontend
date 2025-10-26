
import {
  HistoryIcon,
  DownloadIcon,
  UserIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Experiment } from "../types/experiment";
import toast from "react-hot-toast";

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  experiment: Experiment[];
}

export function Header({
  isSidebarOpen,
  onToggleSidebar,
  experiment,
}: HeaderProps) {

  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
    filename: "LLM Experiment",
  });

  function flattenExperimentData(experiments: any[]) {
    return experiments.map((exp) => ({
      id: exp._id,
      title: exp.title,
      prompt: exp.prompt,
      Response: exp.responses?.[0]?.response ?? "",
      Score: exp.responses?.[0]?.score ?? null,
      Temperature: exp.responses?.[0]?.parameters?.temperature ?? null,
      TopP: exp.responses?.[0]?.parameters?.topP ?? null,
      TopK: exp.responses?.[0]?.parameters?.topK ?? null,
      MaxToken: exp.responses?.[0]?.parameters?.maxToken ?? null,
      Coherence: exp.responses?.[0]?.metrics?.coherence ?? null,
      Completeness: exp.responses?.[0]?.metrics?.completeness ?? null,
    }));
  }

  function handleExport() {
    const csvData = flattenExperimentData(experiment);
    if(experiment.length === 0) return toast.error("No Experiment to Exported", { duration: 600 });
    const csv = generateCsv(csvConfig)(csvData);
    download(csvConfig)(csv);
    toast.success("Successfully Exported", { duration: 500 });
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? (
              <XIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <MenuIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
          <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-extrabold text-gray-900 dark:text-white transition-colors duration-300">
              LLM LAB
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Optimize your AI responses
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
            <HistoryIcon className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 dark:bg-blue-500 text-white cursor-pointer rounded-lg transition-all duration-200 hover:shadow-lg"
          >
            <DownloadIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer">
            <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
        </div>
      </div>
    </header>
  );
}
