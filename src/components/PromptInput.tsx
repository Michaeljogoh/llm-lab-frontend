

interface PromptInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

export function PromptInput({ input, setInput }: PromptInputProps) {
  return (
    <div className="space-y-2">
      <textarea
        placeholder="Enter your prompt here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
      />
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
        <span>0 / 1000 characters</span>
        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"></button>
      </div>
    </div>
  );
}
