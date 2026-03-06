'use client';

import { anton, space, b5, roundedXl, shadow8 } from '../../consts';

interface AnalysisProgressProps {
  currentStep: number;
  steps: string[];
}

export function AnalysisProgress({ currentStep, steps }: AnalysisProgressProps) {
  return (
    <div className="p-20">
      <div className={`mx-auto max-w-2xl bg-white ${b5} ${roundedXl} p-10 ${shadow8}`}>
        <h2 className={`${anton} text-3xl uppercase text-center mb-8`}>
          Analyzing Listing...
        </h2>
        <div className="flex items-center justify-between gap-3">
          {steps.map((label, i) => {
            const isLastStep = currentStep >= steps.length - 1;
            let barBg: string;
            if (isLastStep || i < currentStep) {
              barBg = 'bg-[#90EE90]';
            } else if (i === currentStep) {
              barBg = 'bg-[#FADF0B] animate-pulse';
            } else {
              barBg = 'bg-gray-200';
            }

            const labelColor = i <= currentStep ? 'text-black' : 'text-gray-400';

            return (
              <div key={label} className="flex-1 flex flex-col">
                <div
                  data-testid={`step-bar-${i}`}
                  className={`h-4 ${b5} ${roundedXl} mb-2 ${barBg}`}
                />
                <span className={`${space} text-xs font-semibold ${labelColor}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
