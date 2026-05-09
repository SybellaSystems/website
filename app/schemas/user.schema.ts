import { z } from "zod";
import { v4 as uuidv4 } from "uuid";


export const PREDIFINEDROLES = ["executive", "manager", "sales", "accountant", "superadmin", "cto"] as const;


export const staffMemberSchema = z.object({
  id: z.string().uuid().default(() => uuidv4()),
  names: z.string().min(5).max(40).transform(n => n.trim()),
  email: z.string().email().transform(e => e.toLowerCase()),
  password: z.string()
    .min(8)
    .max(25)
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/\d/, "Must contain number")
    .regex(/[\W_]/, "Must contain special char"),
  role: z.union([z.enum(PREDIFINEDROLES), z.string()]), 
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.coerce.date().optional(),
  lastLogin: z.date().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  deletedAt: z.date().optional(),
});

// schema to get staffmember

export const staffMemberOutScheme = staffMemberSchema.omit({password: true})

// schema to update staffMember

export const staffMemberUpdateSchema = staffMemberSchema
    .omit({ id: true,  createdAt: true, password: true })
    .partial()


// 

export const staffMemberSelfUpdateSchema = staffMemberSchema
  .omit({ id: true, role: true, isActive: true, password: true, createdAt: true })
  .partial();

  // query 

export const staffMemberQuerySchema = z.object({
  role: z.string().optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional()
});

// password reset schema

export const staffMemberPasswordSchema = z.object({
  oldPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(25, "Password is too long")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/\d/, "Must contain number")
    .regex(/[\W_]/, "Must contain special char"),
  newPassword: z.string()
    .min(8, "New password must be at least 8 characters")
    .max(25, "New password is too long")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/\d/, "Must contain number")
    .regex(/[\W_]/, "Must contain special char"),
});

// User Login

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});


