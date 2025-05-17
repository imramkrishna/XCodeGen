import React, { createContext, useState, useContext, ReactNode } from 'react';

type PromptContextType = {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
};

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const usePrompt = () => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error('usePrompt must be used within a PromptProvider');
  }
  return context;
};

type PromptProviderProps = {
  children: ReactNode;
};

export const PromptProvider = ({ children }: PromptProviderProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <PromptContext.Provider
      value={{
        prompt,
        setPrompt,
        isGenerating,
        setIsGenerating,
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </PromptContext.Provider>
  );
};