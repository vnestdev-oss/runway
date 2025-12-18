import { z } from "zod";

export const resourceSchema = z.object({
  resourceName: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  cost: z.coerce.number().min(0, "Cost must be a positive number").optional().default(0),
  link: z
    .string()
    .trim()
    .max(2048, "Link must be under 2048 characters")
    .optional()
    .or(z.literal("")),
});

export const formSchema = z.object({
  // Student Details
  fullName: z.string().min(1, "Full name is required"),
  registerNumber: z.string().min(1, "Register number is required"),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  schoolDepartment: z.string().min(1, "School/Department is required"),
  yearOfStudy: z.string().min(1, "Year of study is required"),

  // Startup/Idea Abstract
  startupName: z.string().min(1, "Startup/Idea name is required"),
  problemStatement: z
    .string()
    .min(1, "Problem statement is required")
    .max(300, "Problem statement must not exceed 300 characters"),
  proposedSolution: z
    .string()
    .min(1, "Proposed solution is required")
    .max(300, "Proposed solution must not exceed 300 characters"),
  targetUsers: z
    .string()
    .min(1, "Target users/market is required")
    .max(300, "Target users/market must not exceed 300 characters"),
  innovation: z
    .string()
    .min(1, "Innovation/uniqueness is required")
    .max(300, "Innovation/uniqueness must not exceed 300 characters"),
  pptLink: z
    .string()
    .min(1, "PPT drive link is required")
    .url("Please enter a valid URL")
    .refine(
      (url) => url.includes("drive.google.com") || url.includes("docs.google.com"),
      "Please provide a valid Google Drive link"
    ),

  // Faculty Mentor Details
  facultyName: z.string().min(1, "Faculty name is required"),
  facultyDepartment: z.string().min(1, "Faculty department is required"),
  facultyEmail: z.string().email("Invalid email address"),
  facultyContact: z.string().min(10, "Contact number must be at least 10 digits"),
  facultyEmployeeId: z.string().min(1, "Employee ID is required"),

  // Resource Requirements
  resources: z
    .array(resourceSchema)
    .min(0, "Resources are optional"),

  // Consent
  consent: z.boolean().refine((val) => val === true, {
    message: "",
  }),
});

export type FormData = z.infer<typeof formSchema>;
export type ResourceData = z.infer<typeof resourceSchema>;

