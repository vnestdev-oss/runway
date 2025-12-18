"use client";

import { useState } from "react";
import { ApplicationForm, STEPS } from "@/components/ApplicationForm";
import { Sidebar } from "@/components/Sidebar";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="flex flex-col h-screen bg-[#060606]">
      {/* Header spanning full width */}
      <div className="w-full px-16 py-6 border-b border-[#545454] bg-[#060606]">
        <div className="flex items-center justify-between">
          <img src="/vnest.webp" alt="VNEST" className="h-14 ml-[4.36rem]" />
          <h1 className="text-3xl font-bold text-white">Runway: Pre-Incubation Program by VNEST</h1>
          <img src="/vitcc.webp" alt="VITCC" className="h-14 mr-[4.36rem]" />
        </div>
      </div>
      
      <div className="flex flex-1 min-h-0">
        <Sidebar steps={STEPS} currentStep={currentStep} />
        <main className="flex-1 overflow-auto hide-scrollbar">
          <ApplicationForm currentStep={currentStep} setCurrentStep={setCurrentStep} />
        </main>
      </div>
    </div>
  );
}

