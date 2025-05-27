import React from 'react';
import { CheckCircle, Clock, Loader2,Circle } from 'lucide-react';
export enum StepType{
  CreateFile,
  CreateFolder,
  EditFile,
  DeleteFile,
  RunScript
}
export type Step = {
  id: number;
  title: string;
  type:StepType;
  description: string;
  status:'pending' | 'in-progress' | 'completed';
  code?:string
  path?:string
};

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function StepsList({ steps, currentStep, onStepClick }: StepsListProps) {
  return (
    <div className="h-full p-4 overflow-auto bg-gray-900 rounded-lg shadow-lg">
      <h2 className="mb-4 text-lg font-semibold text-gray-100">Build Steps</h2>
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`p-1 rounded-lg cursor-pointer transition-colors ${
              currentStep === step.id
                ? 'bg-gray-800 border border-gray-700'
                : 'hover:bg-gray-800'
            }`}
            onClick={() => onStepClick(step.id)}
          >
            <div className="flex items-center gap-2">
              {step.status === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : step.status === 'in-progress' ? (
                <Clock className="w-5 h-5 text-blue-400" />
              ) : (
                <Circle className="w-5 h-5 text-gray-600" />
              )}
              <h3 className="font-medium text-gray-100">{step.title}</h3>
            </div>
            <p className="mt-2 text-sm text-gray-400">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}