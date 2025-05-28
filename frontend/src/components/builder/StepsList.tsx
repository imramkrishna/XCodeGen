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

export const StepsList = ({ steps, currentStep, onStepClick }: StepsListProps) => {
  return (
    <div className="space-y-3">
      {steps.map((step) => {
        // Determine status colors and icons
        const statusClasses = {
          'pending': 'bg-slate-700 border-slate-600 text-slate-300',
          'in-progress': 'bg-blue-900/30 border-blue-800/50 text-blue-300',
          'completed': 'bg-emerald-900/20 border-emerald-800/40 text-emerald-300'
        }[step.status];
        
        const statusIcons = {
          'pending': (
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
            </svg>
          ),
          'in-progress': (
            <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ),
          'completed': (
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
            </svg>
          )
        }[step.status];
        
        // Determine file type icon based on path extension
        let fileIcon = (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        );
        
        if (step.path) {
          if (step.path.endsWith('.js')) fileIcon = <span className="text-yellow-400">JS</span>;
          else if (step.path.endsWith('.ts') || step.path.endsWith('.tsx')) fileIcon = <span className="text-blue-400">TS</span>;
          else if (step.path.endsWith('.css')) fileIcon = <span className="text-blue-500">CSS</span>;
          else if (step.path.endsWith('.html')) fileIcon = <span className="text-orange-400">HTML</span>;
          else if (step.path.endsWith('.json')) fileIcon = <span className="text-yellow-300">JSON</span>;
        }
        
        return (
          <div 
            key={step.id}
            onClick={() => onStepClick(step.id)}
            className={`group relative rounded-lg border p-4 transition-all duration-200 hover:border-slate-600 cursor-pointer ${
              currentStep === step.id 
                ? 'border-blue-700/50 bg-blue-900/20 shadow-lg shadow-blue-900/10' 
                : 'border-slate-700/50 bg-slate-800/50'
            }`}
          >
            {/* Status indicator */}
            <div className="absolute -right-1 -top-1">
              <span className={`flex items-center justify-center h-5 w-5 rounded-full border ${statusClasses}`}>
                {statusIcons}
              </span>
            </div>
            
            <div className="flex items-start">
              {/* Step type icon */}
              <div className={`p-1.5 rounded-md mr-3 ${
                step.type === StepType.CreateFile ? 'bg-blue-900/30 text-blue-300' :
                step.type === StepType.CreateFolder ? 'bg-amber-900/30 text-amber-300' :
                step.type === StepType.RunScript ? 'bg-purple-900/30 text-purple-300' :
                'bg-slate-700 text-slate-300'
              }`}>
                {step.type === StepType.CreateFile && fileIcon}
                {step.type === StepType.CreateFolder && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                )}
                {step.type === StepType.RunScript && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h4 className="mb-1 font-medium truncate text-slate-200">{step.title}</h4>
                
                {/* Description - Only show when selected or when it contains useful info */}
                {(currentStep === step.id || step.description.length > 10) && step.description && (
                  <div className={`mt-2 text-sm transition-all duration-300 ${
                    currentStep === step.id ? 'max-h-96 opacity-100' : 'max-h-24 opacity-80 line-clamp-2'
                  }`}>
                    <div className="p-3 leading-relaxed border rounded bg-slate-900/50 border-slate-700/30 text-slate-400">
                      {step.description}
                    </div>
                  </div>
                )}
                
                {/* Show path for files */}
                {step.path && (
                  <div className="flex items-center mt-2 text-xs text-slate-400">
                    <svg className="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span className="truncate">{step.path}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};