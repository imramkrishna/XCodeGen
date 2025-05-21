import React from 'react';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';
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
};

type StepsListProps = {
  steps: Step[];
  currentStep: number;
  isGenerating: boolean;
};

const StepsList = ({ steps, currentStep, isGenerating }: StepsListProps) => {
  return (
    <div className="py-2">
      <ul className="space-y-1">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <li
              key={step.id}
              className={`px-4 py-3 border-l-4 transition-all ${
                isActive
                  ? 'border-l-blue-500 bg-slate-700'
                  : isCompleted
                  ? 'border-l-green-500 bg-slate-800'
                  : 'border-l-transparent bg-slate-800'
              }`}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : isActive && isGenerating ? (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  ) : (
                    <Clock className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-medium ${
                    isActive ? 'text-blue-400' : isCompleted ? 'text-slate-200' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs mt-1 ${
                    isActive ? 'text-blue-300' : isCompleted ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      
      {!isGenerating && currentStep === steps.length - 1 && (
        <div className="px-4 mt-6">
          <div className="p-4 border rounded-lg bg-slate-700 border-slate-600">
            <h4 className="text-sm font-medium text-green-400">Website Generated!</h4>
            <p className="mt-1 text-xs text-slate-300">
              Your website has been successfully created. You can now explore the files and customize them further.
            </p>
            <div className="mt-3">
              <button className="w-full px-3 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-md hover:bg-green-700">
                Preview Website
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepsList;