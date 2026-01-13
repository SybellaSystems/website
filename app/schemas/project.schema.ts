import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(2, "Title is required"),
  overview: z.string().min(5, "Overview is required"),
  image: z.string().url("Must be a valid image URL"),
  demoLink: z.string().url("Must be a valid URL").optional(),
  problemSolved: z.string().min(5, "Problem solved description required"),
  techStack: z.array(z.string()).min(1, "At least one tech stack item required"),
  partners: z.array(z.string()).optional(),
  callToAction: z.string().optional(),
  isActive: z.boolean().optional().default(true),
   createdAt: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().optional()
  ),
  updatedAt: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().optional()
  ),
});

export type ProjectInput = z.infer<typeof projectSchema>;
