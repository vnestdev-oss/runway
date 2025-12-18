"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressTimelineProps {
  steps: string[];
  currentStep: number;
}

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isPending = stepNumber > currentStep;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm transition duration-200 shadow-lg",
                    isCompleted &&
                      "bg-gradient-to-br from-emerald-400 to-lime-300 text-gray-900 shadow-[0_10px_30px_rgba(52,211,153,0.25)]",
                    isActive &&
                      "bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-500 text-white ring-4 ring-violet-400/30 shadow-[0_10px_40px_rgba(99,102,241,0.35)]",
                    isPending && "bg-white/10 text-slate-400 border border-white/10"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-gray-900" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <p
                  className={cn(
                    "mt-2 text-xs font-medium text-center max-w-[120px]",
                    isActive && "text-violet-200",
                    isCompleted && "text-emerald-200",
                    isPending && "text-slate-400"
                  )}
                >
                  {step}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 transition-colors rounded-full",
                    isCompleted
                      ? "bg-gradient-to-r from-emerald-400 to-lime-300"
                      : "bg-white/10"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

