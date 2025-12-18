"use client";

import { useState } from "react";
import { ApplicationForm, STEPS } from "@/components/ApplicationForm";
import { Sidebar } from "@/components/Sidebar";
import { Menu, X } from "lucide-react";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#060606]">
      {/* Header spanning full width */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-4 md:py-6 border-b border-[#545454] bg-[#060606]">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2 hover:bg-gray-800 rounded-lg transition-colors z-50"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <img src="/vnest.webp" alt="VNEST" className="h-6 sm:h-10 md:h-12 lg:h-14 md:ml-8 lg:ml-[4.36rem]" />
          <h1 className="text-xs sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-bold text-white text-center flex-1 px-1 sm:px-2 leading-tight">
            <span>Runway</span>
            <span className="hidden sm:inline">: Pre-Incubation Program by VNEST</span>
          </h1>
          <img src="/vitcc.webp" alt="VITCC" className="h-6 sm:h-10 md:h-12 lg:h-14 md:mr-8 lg:mr-[4.36rem]" />
        </div>
      </div>
      
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar 
          steps={STEPS} 
          currentStep={currentStep} 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <main className="flex-1 overflow-auto hide-scrollbar">
          <ApplicationForm currentStep={currentStep} setCurrentStep={setCurrentStep} />
        </main>
      </div>
    </div>
  );
}

