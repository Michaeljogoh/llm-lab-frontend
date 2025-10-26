import React, { useState } from "react";
import { PromptInput } from "./PromptInput";
import { Parameters } from "./Parameters";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useRouter } from "next/navigation";


export function Sidebar({ isOpen, onClose }: SidebarProps) {

  const [input, setInput] = useState("");
  const [temperature, setTemperature] = useState<number[]>([0.1]);
  const [topP, setTopP] = useState<number[]>([0.1]);
  const [topK, setTopK] = useState<number[]>([0.1]);
  const [maxToken, setMaxToken] = useState<number[]>([100]);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();

  const mutation = useMutation<any, Error, void>({
    mutationFn: async () => {
      const payload = {
        prompt: input,
        temperature,
        topP,
        topK,
        maxToken,
      };
      const response = await axios.post(`${BASE_URL}/experiment`, payload);
      return response.data;
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong.");
    },
    onSuccess: () =>{
    toast.success('Successfully created!', { duration: 500 });
    router.refresh()
    setInput('')
    setTemperature([0.1])
    setTopK([0.1])
    setTopP([0.1])
    setMaxToken([0.1])

    }
  });


  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
     e.preventDefault()

    if (!input.trim()) {
      toast.error('Prompt cannot be empty!', {duration: 700 });
      return;
    }

    if (temperature.length < 2 ) {
      toast.error("Add at least two values for temperatue .", { duration: 1000 });
      return;
    }

    mutation.mutate();
    
  };



  const isPending = mutation.isPending


  return (
    <div
      className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-0
        w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-all duration-300 ease-in-out
        lg:translate-x-0
        ${
          isOpen
            ? "translate-x-0 shadow-2xl lg:shadow-none"
            : "-translate-x-full"
        }
        overflow-y-auto h-screen
      `}
    >
      <div className="p-6 space-y-6 pt-20 lg:pt-6 h-full">
        <PromptInput input={input} setInput={setInput} />
        <Parameters
          temperature={temperature}
          setTemperature={setTemperature}
          topP={topP}
          setTopP={setTopP}
          topK={topK}
          setTopK={setTopK}
          maxToken={maxToken}
          setMaxToken={setMaxToken}
          isPending={isPending}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
