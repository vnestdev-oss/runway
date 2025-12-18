"use client";

import React, { useEffect } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  steps: string[];
  currentStep: number;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ steps, currentStep, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "bg-[#060606] border-r border-[#545454] flex flex-col transition-transform duration-300 ease-in-out",
        // Mobile: fixed overlay
        "fixed lg:static inset-y-0 left-0 z-50",
        "w-[280px] sm:w-[320px] md:w-[360px] lg:w-[420px]",
        // Mobile transform
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Steps List */}
        <div className="flex-1 px-6 sm:px-8 md:px-12 lg:pl-25 lg:pr-16 pt-8 md:pt-14 pb-10 space-y-6 md:space-y-8 overflow-y-auto hide-scrollbar">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;
            const isPending = stepNumber > currentStep;

            return (
              <div key={index} className="flex items-center gap-3 md:gap-4">
                {/* Step Indicator */}
                <div
                  className={cn(
                    "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-medium flex-shrink-0",
                    isCompleted &&
                      "bg-purple-600 text-white",
                    isActive &&
                      "bg-purple-600 text-white",
                    isPending && "bg-gray-700 text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>

                {/* Step Name */}
                <span
                  className={cn(
                    "text-sm md:text-base font-medium",
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
    </>
  );
};

