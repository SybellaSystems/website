import { z } from "zod";
import { v4 as uuidv4 } from "uuid";


export const roleSchema = z.object({
  id: z.string().uuid().default(() => uuidv4()),
  name: z.string().min(3).max(30),
  description: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});


export const userRoleSchema = z.object({
  id: z.string().uuid().default(() => uuidv4()),
  userId: z.string().uuid(),
  roleId: z.string().uuid(),
  assignedAt: z.date().default(() => new Date())
});

export const createRoleSchema = z.object({
  name: z.string().min(3).max(30),
  description: z.string().optional()
});



export const assignRoleToUserSchema = z.object({
  userId: z.string().uuid(),
  roleId: z.string().uuid()
});

