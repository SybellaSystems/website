import { z } from "zod";

export const updateSchema = z.object({
  title: z.string().min(3, "Title is required"),
  category: z.enum(["news", "announcement", "event", "general"]).default("general"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
  author: z.string().min(3, "Author is required"),
  published: z.boolean().optional().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type UpdateSchema = z.infer<typeof updateSchema>;
