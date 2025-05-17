import React from 'react';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';

type Step = {
  id: number;
  title: string;
  description: string;
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
        <div className="mt-6 px-4">
          <div className="p-4 bg-slate-700 border border-slate-600 rounded-lg">
            <h4 className="text-green-400 font-medium text-sm">Website Generated!</h4>
            <p className="text-slate-300 text-xs mt-1">
              Your website has been successfully created. You can now explore the files and customize them further.
            </p>
            <div className="mt-3">
              <button className="w-full py-2 px-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors">
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