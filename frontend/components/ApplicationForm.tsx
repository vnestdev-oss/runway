"use client";

import React, { useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/lib/form-schema";
import type { FormData } from "@/lib/form-schema";
import { FileUpload } from "./FileUpload";
import { ResourceTable } from "./ResourceTable";
import { SlideShow } from "./Slideshow";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2, ChevronDown } from "lucide-react";

export const STEPS = [
  "Get Started",
  "Student Details",
  "Startup Overview",
  "Solution & Market",
  "Faculty Mentor",
  "Resources",
  "Consent",
];

const inputBaseClasses =
  "w-full px-0 py-4 text-base border-0 border-b border-[#545454] bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-b-2 focus:border-purple-600 transition duration-200";

const errorClasses =
  "border-purple-500 focus:border-purple-500";

interface ApplicationFormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ currentStep, setCurrentStep }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<FormData>({
    // @ts-expect-error Temporary: Suppress type error due to multiple versions of @hookform/resolvers and react-hook-form
    resolver: zodResolver(formSchema),
    defaultValues: {
      resources: [],
      consent: false,
    },
    mode: "onChange",
  });

  const watchedResources = watch("resources") || [];
  const totalCost = watchedResources.reduce((sum, r) => sum + (r.cost || 0), 0);
  const resourceFieldErrors =
    errors.resources && Array.isArray(errors.resources)
      ? errors.resources.reduce((acc, error, index) => {
          const fieldErrors = error as FieldErrors<FormData["resources"][number]>;
          const messages: Partial<Record<keyof FormData["resources"][number], string>> = {};
          if (fieldErrors?.resourceName?.message) messages.resourceName = fieldErrors.resourceName.message;
          if (fieldErrors?.description?.message) messages.description = fieldErrors.description.message;
          if (fieldErrors?.cost?.message) messages.cost = fieldErrors.cost.message;
          if (Object.keys(messages).length) acc[index] = messages;
          return acc;
        }, {} as Record<number, Partial<Record<keyof FormData["resources"][number], string>>>)
      : undefined;

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof FormData)[] = [];

    switch (step) {
      case 1:
        // Get Started step has no validation
        return true;
      case 2:
        fieldsToValidate = [
          "fullName",
          "registerNumber",
          "contactNumber",
          "email",
          "schoolDepartment",
          "yearOfStudy",
        ];
        break;
      case 3:
        fieldsToValidate = ["startupName", "problemStatement", "proposedSolution"];
        break;
      case 4:
        fieldsToValidate = ["targetUsers", "innovation", "pptLink"];
        break;
      case 5:
        fieldsToValidate = ["facultyName", "facultyDepartment", "facultyEmail", "facultyContact"];
        break;
      case 6:
        fieldsToValidate = ["resources"];
        break;
      case 7:
        fieldsToValidate = ["consent"];
        break;
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const formData = new FormData();
      
      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === "pptFile" && value instanceof File) {
          formData.append("pptFile", value);
        } else if (key === "resources") {
          formData.append("resources", JSON.stringify(value));
        } else if (key === "consent") {
          formData.append("consent", value.toString());
        } else {
          formData.append(key, value as string);
        }
      });

      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Submission failed. Please try again.");
      }

      setSubmitStatus("success");
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSubmitStatus("idle");
    setErrorMessage("");
  };

  if (submitStatus === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-4 sm:px-6 md:px-8 py-8 md:py-12">
        <div className="relative rounded-md border border-[#545454] bg-[#060606] p-6 sm:p-8 md:p-10 max-w-2xl w-full">
          <div className="relative flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-green-900">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                We&apos;ve received your application!
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-xl">
                Thank you for applying. The VNEST team will review your application and reach out shortly.
              </p>
            </div>
           
          </div>
        </div>
      </div>
    );
  }

  if (submitStatus === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-4 sm:px-6 md:px-8 py-8 md:py-12">
        <div className="rounded-md border border-[#545454] bg-[#060606] p-6 sm:p-8 md:p-10 max-w-2xl w-full">
          <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-red-900 mb-4">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Submission Failed</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-4">{errorMessage}</p>
          <button
            onClick={handleRetry}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-md bg-purple-600 text-white text-sm sm:text-base font-semibold hover:bg-purple-700 transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Get Started";
      case 2:
        return "Student Details";
      case 3:
        return "Startup Overview";
      case 4:
        return "Solution & Market";
      case 5:
        return "Faculty Mentor";
      case 6:
        return "Resources";
      case 7:
        return "Consent Screen";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Learn about Runway and get answers to common questions.";
      case 2:
        return "Only one member per team needs to fill this.";
      case 3:
        return "Give us a crisp snapshot of your idea and the problem it solves.";
      case 4:
        return "Help us understand the market depth and how you will stand out.";
      case 5:
        return "Tell us about the faculty mentor guiding your journey.";
      case 6:
        return "";
      case 7:
        return "";
      default:
        return "";
    }
  };

  return (
    <div className="flex-1 bg-[#060606] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-8 sm:py-12 md:py-16 lg:py-20 pb-24 sm:pb-28 md:pb-32">
        {/* Header with Help Link */}
        {currentStep !== 1 && (
          <div className="flex justify-between items-start mb-8 md:mb-12">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 md:mb-3">{getStepTitle()}</h1>
              <p className="text-sm md:text-base text-gray-400">{getStepDescription()}</p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit as any)}
          className="space-y-10"
        >
          {/* Step 1: Get Started */}
          {currentStep === 1 && (
            <SlideShow
              slides={[
                // Slide 1: Introduction
                <div key="intro" className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 flex flex-col items-center justify-center min-h-[calc(100vh-400px)]">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Runway</h2>
                    {/* <p className="text-lg text-purple-400 font-medium">VNEST Pre-Incubation Program</p> */}
                    {/* <p className="text-lg text-gray-300 mt-4">From Idea to Impact</p> */}
                  </div>
                  <div className="space-y-4 max-w-2xl mx-auto px-4">
                    {/* <h3 className="text-2xl font-bold text-white text-center">What is Runway?</h3> */}
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed text-center">
                      Runway is VNEST&apos;s structured pre-incubation program designed to help VIT Chennai students transform early-stage ideas into startup-ready ventures. Whether you&apos;re at the idea stage or building your first prototype, Runway provides the mentorship, resources, and exposure needed to move forward.
                    </p>
                  </div>
                </div>,

                // Slide 2: Why Runway
                <div key="why" className="p-4 sm:p-6 md:p-8 space-y-4 md:space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Why Runway?</h2>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    Most great ideas fail early due to lack of guidance, resources, or validation. Runway exists to bridge that gap by offering:
                  </p>
                  <ol className="space-y-3 text-sm sm:text-base text-gray-300 list-decimal ml-4 sm:ml-6 marker:text-purple-400">
                    <li className="pl-2 sm:pl-3">
                      <span>A structured pathway from idea to incubation</span>
                    </li>
                    <li className="pl-2 sm:pl-3">
                      <span>Access to experienced faculty and industry mentors</span>
                    </li>
                    <li className="pl-2 sm:pl-3">
                      <span>Resource support for building early prototypes</span>
                    </li>
                    <li className="pl-2 sm:pl-3">
                      <span>Opportunities to present ideas to investors and experts</span>
                    </li>
                    <li className="pl-2 sm:pl-3">
                      <span>A fair and transparent selection process</span>
                    </li>
                  </ol>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-medium">
                    Runway is the entry point into VNEST&apos;s startup ecosystem.
                  </p>
                </div>,

                // Slide 3: Who Can Apply
                <div key="who" className="p-4 sm:p-6 md:p-8 space-y-4 md:space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Who Can Apply?</h2>
                  <ol className="space-y-3 text-sm sm:text-base text-gray-300 list-decimal ml-4 sm:ml-6 marker:text-purple-400">
                    <li className="pl-2 sm:pl-3">
                      <span>All VIT Chennai students (individuals or teams)</span>
                    </li>
                    <li className="pl-2 sm:pl-3">
                      <span>Any discipline or department</span>
                    </li>
                    <li className="pl-2 sm:pl-3">
                      <span>Any year of study</span>
                    </li>
                    <li className="pl-2 sm:pl-3">
                      <span>Ideas at ideation or early prototype stage</span>
                    </li>
                    <li className="pl-2 sm:pl-3">
                      <span>No prior startup experience is required</span>
                    </li>
                  </ol>
                </div>,

                // Slide 4: What You Need
                <div key="need" className="p-4 sm:p-6 md:p-8 space-y-4 md:space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">What You Need to Apply</h2>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    To apply for Runway, you will need:
                  </p>
                  <ol className="space-y-3 text-sm sm:text-base text-gray-300 list-decimal ml-4 sm:ml-6 marker:text-purple-400">
                    <li className="pl-2 sm:pl-3">
                      <span>A clear idea summary (problem and solution)</span>
                    </li>
                    <li className="pl-2 sm:pl-3">
                      <span>A faculty mentor willing to support the idea</span>
                    </li>
                    <li className="pl-2 sm:pl-3">
                      <span>A PPT submission using the provided template</span>
                    </li>
                    <li className="pl-2 sm:pl-3">
                      <span>A list of hardware resources required (if any)</span>
                    </li>
                  </ol>
                </div>,

                // Slide 5: How It Works
                <div key="how" className="p-4 sm:p-6 md:p-8 space-y-4 md:space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">How Runway Works</h2>
                  <ol className="space-y-4 text-sm sm:text-base text-gray-300 list-decimal list-inside">
                    <li className="pl-2">Submit your idea through the Runway portal</li>
                    <li className="pl-2">Ideas are reviewed by the VNEST evaluation committee</li>
                    <li className="pl-2">
                      Selected teams receive:
                      <ul className="mt-2 ml-4 sm:ml-6 space-y-2 list-disc">
                        <li>Mentorship access</li>
                        <li>Resource support (SSV or Incubation track)</li>
                        <li>Invitations to Demo Days and startup events</li>
                      </ul>
                    </li>
                    <li className="pl-2">High-potential teams are offered full incubation at VNEST</li>
                  </ol>
                </div>,

                // Slide 6: Tracks
                <div key="tracks" className="p-4 sm:p-6 md:p-8 space-y-4 md:space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Tracks Explained</h2>
                  <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="rounded-md bg-[#060606] p-4 sm:p-6 border border-[#545454]">
                      <h3 className="text-lg sm:text-xl font-semibold text-purple-400 mb-2">Incubation</h3>
                      <p className="text-sm sm:text-base text-gray-400 mb-3">For high-potential ideas ready for long-term support:</p>
                      <ol className="space-y-2 text-xs sm:text-sm text-gray-300 list-decimal ml-4 sm:ml-6 marker:text-purple-400">
                        <li className="pl-2 sm:pl-3">
                          <span>Dedicated workspace</span>
                        </li>
                        <li className="pl-2 sm:pl-3">
                          <span>Infrastructure and lab access</span>
                        </li>
                        <li className="pl-2 sm:pl-3">
                          <span>Investor and startup network</span>
                        </li>
                        <li className="pl-2 sm:pl-3">
                          <span>100% Academic attendance relaxation</span>
                        </li>
                      </ol>
                    </div>
                    <div className="rounded-md bg-[#060606] p-4 sm:p-6 border border-[#545454]">
                      <h3 className="text-lg sm:text-xl font-semibold text-purple-400 mb-2">SSV (Student Startup Venture)</h3>
                      <p className="text-sm sm:text-base text-gray-400 mb-3">For early-stage ideas requiring resources:</p>
                      <ol className="space-y-2 text-xs sm:text-sm text-gray-300 list-decimal ml-4 sm:ml-6 marker:text-purple-400">
                        <li className="pl-2 sm:pl-3">
                          <span>Access to requested resources</span>
                        </li>
                        <li className="pl-2 sm:pl-3">
                          <span>Mentorship support</span>
                        </li>
                        <li className="pl-2 sm:pl-3">
                          <span>No formal incubation commitment</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>,

          

                // Slide 8: FAQ
                <div key="faq" className="p-4 sm:p-6 md:p-8 space-y-4 md:space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    <div className="rounded-md bg-[#060606] border border-[#545454] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <h3 className="text-base sm:text-lg font-semibold text-white pr-2">Do I need a working prototype to apply?</h3>
                        <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform flex-shrink-0 ${openFaqIndex === 0 ? 'rotate-180' : ''}`} />
                      </button>
                      {openFaqIndex === 0 && (
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                          <p className="text-xs sm:text-sm text-gray-400">
                            A working prototype is not mandatory to apply. While having a prototype can strengthen your application, early-stage ideas without a prototype are also welcome and will be considered.
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="rounded-md bg-[#060606] border border-[#545454] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? null : 1)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <h3 className="text-base sm:text-lg font-semibold text-white pr-2">Can I apply as an individual?</h3>
                        <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform flex-shrink-0 ${openFaqIndex === 1 ? 'rotate-180' : ''}`} />
                      </button>
                      {openFaqIndex === 1 && (
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                          <p className="text-xs sm:text-sm text-gray-400">
                            Yes, you can apply either as an individual or as part of a team. However, if you are applying as a team, only one member needs to fill out and submit the application form on behalf of the entire team.
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="rounded-md bg-[#060606] border border-[#545454] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? null : 2)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <h3 className="text-base sm:text-lg font-semibold text-white pr-2">Is having a faculty mentor mandatory?</h3>
                        <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform flex-shrink-0 ${openFaqIndex === 2 ? 'rotate-180' : ''}`} />
                      </button>
                      {openFaqIndex === 2 && (
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                          <p className="text-xs sm:text-sm text-gray-400">
                            Yes. A faculty mentor is required to support and guide the idea. Their involvement helps ensure the feasibility, direction, and overall quality of the project.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>,

                // Slide 9: Ready to Begin
                <div key="ready" className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="space-y-4 text-center px-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Ready to Begin?</h2>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
                      If you have an idea and the willingness to build, Runway is your starting point.
                    </p>
                    <p className="text-sm sm:text-base text-purple-400 font-medium">
                      Apply now and take the first step toward building your startup with VNEST.
                    </p>
                  </div>
                </div>,
              ]}
              onComplete={() => setCurrentStep(2)}
            />
          )}

          {/* Step 2: Student Details */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <input
                    {...register("fullName")}
                    className={cn(inputBaseClasses, errors.fullName && errorClasses)}
                    placeholder="Full Name *"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-purple-400 mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("registerNumber")}
                    className={cn(inputBaseClasses, errors.registerNumber && errorClasses)}
                    placeholder="Register Number *"
                  />
                  {errors.registerNumber && (
                    <p className="text-sm text-purple-400 mt-1">{errors.registerNumber.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("contactNumber")}
                    className={cn(inputBaseClasses, errors.contactNumber && errorClasses)}
                    placeholder="Contact Number *"
                  />
                  {errors.contactNumber && (
                    <p className="text-sm text-purple-400 mt-1">{errors.contactNumber.message}</p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    {...register("email")}
                    className={cn(inputBaseClasses, errors.email && errorClasses)}
                    placeholder="Email *"
                  />
                  {errors.email && (
                    <p className="text-sm text-purple-400 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("schoolDepartment")}
                    className={cn(inputBaseClasses, errors.schoolDepartment && errorClasses)}
                    placeholder="School / Department *"
                  />
                  {errors.schoolDepartment && (
                    <p className="text-sm text-purple-400 mt-1">{errors.schoolDepartment.message}</p>
                  )}
                </div>

                <div>
                  <select
                    {...register("yearOfStudy")}
                    className={cn(
                      inputBaseClasses,
                      "bg-[#060606]",
                      errors.yearOfStudy && errorClasses
                    )}
                  >
                    <option value="" className="bg-[#060606] text-white">Year of Study *</option>
                    <option value="1" className="bg-[#060606] text-white">First Year</option>
                    <option value="2" className="bg-[#060606] text-white">Second Year</option>
                    <option value="3" className="bg-[#060606] text-white">Third Year</option>
                    <option value="4" className="bg-[#060606] text-white">Fourth Year</option>
                  </select>
                  {errors.yearOfStudy && (
                    <p className="text-sm text-purple-400 mt-1">{errors.yearOfStudy.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Startup Overview */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <input
                  {...register("startupName")}
                  className={cn(inputBaseClasses, errors.startupName && errorClasses)}
                  placeholder="Startup / Idea Name *"
                />
                {errors.startupName && (
                  <p className="text-sm text-purple-400 mt-1">{errors.startupName.message}</p>
                )}
              </div>

              <div>
                <textarea
                  {...register("problemStatement")}
                  rows={2}
                  className={cn(
                    inputBaseClasses,
                    "resize-none min-h-[60px] overflow-hidden",
                    errors.problemStatement && errorClasses
                  )}
                  placeholder="Problem Statement *"
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
                <div className="flex items-center justify-between mt-1">
                  <div>
                    {errors.problemStatement && (
                      <p className="text-sm text-purple-400">{errors.problemStatement.message}</p>
                    )}
                  </div>
                  <p className={cn(
                    "text-sm",
                    (watch("problemStatement")?.length || 0) > 300 
                      ? "text-purple-400" 
                      : "text-gray-500"
                  )}>
                    {watch("problemStatement")?.length || 0} / 300 characters
                  </p>
                </div>
              </div>

              <div>
                <textarea
                  {...register("proposedSolution")}
                  rows={2}
                  className={cn(
                    inputBaseClasses,
                    "resize-none min-h-[60px] overflow-hidden",
                    errors.proposedSolution && errorClasses
                  )}
                  placeholder="Proposed Solution *"
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
                <div className="flex items-center justify-between mt-1">
                  <div>
                    {errors.proposedSolution && (
                      <p className="text-sm text-purple-400">{errors.proposedSolution.message}</p>
                    )}
                  </div>
                  <p className={cn(
                    "text-sm",
                    (watch("proposedSolution")?.length || 0) > 300 
                      ? "text-purple-400" 
                      : "text-gray-500"
                  )}>
                    {watch("proposedSolution")?.length || 0} / 300 characters
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Solution & Market Details */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div>
                <textarea
                  {...register("targetUsers")}
                  rows={2}
                  className={cn(
                    inputBaseClasses,
                    "resize-none min-h-[60px] overflow-hidden",
                    errors.targetUsers && errorClasses
                  )}
                  placeholder="Target Users / Market *"
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
                <div className="flex items-center justify-between mt-1">
                  <div>
                    {errors.targetUsers && (
                      <p className="text-sm text-purple-400">{errors.targetUsers.message}</p>
                    )}
                  </div>
                  <p className={cn(
                    "text-sm",
                    (watch("targetUsers")?.length || 0) > 300 
                      ? "text-purple-400" 
                      : "text-gray-500"
                  )}>
                    {watch("targetUsers")?.length || 0} / 300 characters
                  </p>
                </div>
              </div>

              <div>
                <textarea
                  {...register("innovation")}
                  rows={2}
                  className={cn(
                    inputBaseClasses,
                    "resize-none min-h-[60px] overflow-hidden",
                    errors.innovation && errorClasses
                  )}
                  placeholder="Innovation / Uniqueness *"
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
                <div className="flex items-center justify-between mt-1">
                  <div>
                    {errors.innovation && (
                      <p className="text-sm text-purple-400">{errors.innovation.message}</p>
                    )}
                  </div>
                  <p className={cn(
                    "text-sm",
                    (watch("innovation")?.length || 0) > 300 
                      ? "text-purple-400" 
                      : "text-gray-500"
                  )}>
                    {watch("innovation")?.length || 0} / 300 characters
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="mb-2">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">PPT Submission</h3>
                      <p className="text-sm text-gray-400">Download the template, fill it out, upload to Google Drive, and paste the link below</p>
                    </div>
                    <a
                      href="/Runway-Template.pptx.pptx"
                      download
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm font-medium"
                    >
                      Download Template
                    </a>
                  </div>
                </div>
                <input
                  {...register("pptLink")}
                  className={cn(inputBaseClasses, errors.pptLink && errorClasses)}
                  placeholder="Google Drive Link *"
                  type="url"
                />
                {errors.pptLink && (
                  <p className="text-sm text-purple-400 mt-1">{errors.pptLink.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Faculty Mentor Details */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <input
                    {...register("facultyName")}
                    className={cn(inputBaseClasses, errors.facultyName && errorClasses)}
                    placeholder="Faculty Name *"
                  />
                  {errors.facultyName && (
                    <p className="text-sm text-purple-400 mt-1">{errors.facultyName.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("facultyDepartment")}
                    className={cn(inputBaseClasses, errors.facultyDepartment && errorClasses)}
                    placeholder="Department *"
                  />
                  {errors.facultyDepartment && (
                    <p className="text-sm text-purple-400 mt-1">{errors.facultyDepartment.message}</p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    {...register("facultyEmail")}
                    className={cn(inputBaseClasses, errors.facultyEmail && errorClasses)}
                    placeholder="Email *"
                  />
                  {errors.facultyEmail && (
                    <p className="text-sm text-purple-400 mt-1">{errors.facultyEmail.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("facultyContact")}
                    className={cn(inputBaseClasses, errors.facultyContact && errorClasses)}
                    placeholder="Contact Number *"
                  />
                  {errors.facultyContact && (
                    <p className="text-sm text-purple-400 mt-1">{errors.facultyContact.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("facultyEmployeeId")}
                    className={cn(inputBaseClasses, errors.facultyEmployeeId && errorClasses)}
                    placeholder="Employee ID *"
                  />
                  {errors.facultyEmployeeId && (
                    <p className="text-sm text-purple-400 mt-1">{errors.facultyEmployeeId.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Resource Requirements */}
          {currentStep === 6 && (
            <div className="space-y-8">
              <ResourceTable
                resources={watchedResources}
                onChange={(resources) => setValue("resources", resources, { shouldValidate: true })}
                errors={resourceFieldErrors}
                totalCost={totalCost}
              />
              {errors.resources &&
                (typeof errors.resources.message === "string" ? (
                  <p className="text-sm text-purple-400 mt-2">{errors.resources.message}</p>
                ) : (
                  errors.resources.root && (
                    <p className="text-sm text-purple-400 mt-2">{errors.resources.root.message}</p>
                  )
                ))}
            </div>
          )}

          {/* Step 7: Consent */}
          {currentStep === 7 && (
            <div className="space-y-8">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  {...register("consent")}
                  className="mt-1 w-5 h-5 rounded border-purple-600 bg-transparent text-purple-600 focus:ring-2 focus:ring-purple-600 accent-purple-600"
                />
                <label
                  htmlFor="consent"
                  className={cn(
                    "text-base text-white cursor-pointer",
                    errors.consent && "text-purple-400"
                  )}
                >
                  I confirm that all information submitted is accurate and original{" "}
                </label>
              </div>
              {errors.consent && (
                <p className="text-sm text-purple-400">{errors.consent.message}</p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep !== 1 && (
            <div className="fixed bottom-0 left-0 lg:left-[420px] right-0 bg-[#060606] border-t border-[#545454] p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between max-w-4xl mx-auto gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg transition-all bg-transparent text-white hover:bg-white/10 border border-white text-sm md:text-base"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Step Indicator */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {STEPS.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 sm:h-2 rounded-full transition-all ${
                        index + 1 === currentStep
                          ? "w-6 sm:w-8 bg-purple-600"
                          : index + 1 < currentStep
                          ? "w-1.5 sm:w-2 bg-purple-400"
                          : "w-1.5 sm:w-2 bg-gray-600"
                      }`}
                    />
                  ))}
                </div>

                {currentStep < STEPS.length ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg transition-all bg-purple-600 text-white hover:bg-purple-700 text-sm md:text-base"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg transition-all bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-sm md:text-base whitespace-nowrap"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        <span className="hidden sm:inline">Submitting...</span>
                      </>
                    ) : (
                      <span>Submit</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

