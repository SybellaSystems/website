import getClientPromise from "../mongodb";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import {
  roleSchema,
  userRoleSchema,
} from "@/app/schemas/rbac.schema";



export async function createRole(data: z.infer<typeof roleSchema>) {
  const client = await getClientPromise();
  const db = client.db();
  const role = { ...data, id: uuidv4(), createdAt: new Date(), updatedAt: new Date() };
  const existing = await db.collection("roles").findOne({ name: data.name });
  if (existing) {
    throw new Error ("The role name exist")
  }
  await db.collection("roles").insertOne(role);
  return role;
}


export async function assignRoleToUser(userId: string, roleId: string) {
  const client = await getClientPromise();
  const db = client.db();
  const record = { id: uuidv4(), userId, roleId, assignedAt: new Date() };
  await db.collection("user_roles").insertOne(record);
  return record;
}

