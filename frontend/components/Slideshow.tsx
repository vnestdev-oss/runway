"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideShowProps {
  slides: React.ReactNode[];
  onComplete?: () => void;
}

export const SlideShow: React.FC<SlideShowProps> = ({ slides, onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="relative h-full flex flex-col">
      {/* Slide Content */}
      <div className="flex-1 overflow-auto hide-scrollbar pb-32">
        <div className="min-h-full">
          {slides[currentSlide]}
        </div>
      </div>

      {/* Navigation Controls - Fixed to Bottom */}
      <div className="fixed bottom-0 left-[420px] right-0 bg-[#060606] border-t border-[#545454] p-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Left Button */}
          <button
            type="button"
            onClick={goToPreviousSlide}
            disabled={isFirstSlide}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all border ${
              isFirstSlide
                ? "bg-gray-700 text-gray-500 cursor-not-allowed border-gray-700"
                : "bg-transparent text-white hover:bg-white/10 border-white"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          {/* Slide Indicator */}
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "w-8 bg-purple-600"
                    : "w-2 bg-gray-600 hover:bg-gray-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Right Button / Get Started Button */}
          {isLastSlide && onComplete ? (
            <button
              type="button"
              onClick={onComplete}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
            >
              <span>Get Started</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={goToNextSlide}
              disabled={isLastSlide}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                isLastSlide
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
