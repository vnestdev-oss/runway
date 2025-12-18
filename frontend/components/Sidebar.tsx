"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  steps: string[];
  currentStep: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-[420px] self-stretch bg-[#060606] border-r border-[#545454] flex flex-col">
      {/* Steps List */}
      <div className="flex-1 pl-25 pr-16 pt-14 pb-10 space-y-8">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isPending = stepNumber > currentStep;

          return (
            <div key={index} className="flex items-center gap-4">
              {/* Step Indicator */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-base font-medium flex-shrink-0",
                  isCompleted &&
                    "bg-purple-600 text-white",
                  isActive &&
                    "bg-purple-600 text-white",
                  isPending && "bg-gray-700 text-gray-400"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  stepNumber
                )}
              </div>

              {/* Step Name */}
              <span
                className={cn(
                  "text-base font-medium",
                  isActive && "text-purple-400",
                  isCompleted && "text-white",
                  isPending && "text-gray-400"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

