import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { createRoleSchema, roleSchema } from "@/app/schemas/rbac.schema";
import { createRole } from "@/lib/models/RolePermission";
import getClientPromise from "@/lib/mongodb";
import { authMiddleware} from '@/app/middleware/auth.middleware';

// create role

export async function POST(req: NextRequest) {
  const user = await authMiddleware(req, { roles: ["executive","superadmin"] });
  if (user instanceof NextResponse) return user;
  try {

    const body = await req.json();
    const data = roleSchema.parse(body);

    const role = await createRole(data);
    return NextResponse.json(role, { status: 201 });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: err.format() }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// get all roles

export async function GET(req: NextRequest) {
  const user = await authMiddleware(req, { roles: ["executive","superadmin"] });
  if (user instanceof NextResponse) return user;
  try {
    const client = await getClientPromise();
    const db = client.db();
    const roles = await db.collection("roles").find().toArray();

    return NextResponse.json(roles, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
