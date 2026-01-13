import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { assignRoleToUserSchema } from "@/app/schemas/rbac.schema";
import getClientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import { authMiddleware} from '@/app/middleware/auth.middleware';

// assign role to user

export async function POST(
    
  req: NextRequest,
  { params }: { params: { roleId: string } }
) {
    const user = await authMiddleware(req, { roles: ["executive", "superadmin"] });
    if (user instanceof NextResponse) return user;
  try {
    const body = await req.json();
    const { userId } = assignRoleToUserSchema.parse({ ...body, roleId: params.roleId });

    const client = await getClientPromise();
    const db = client.db();


    const user = await db.collection("staff_members").findOne({ id: userId });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });


    const role = await db.collection("roles").findOne({ id: params.roleId });
    if (!role) return NextResponse.json({ error: "Role not found" }, { status: 404 });


    const existing = await db.collection("user_roles").findOne({ userId, roleId: params.roleId });
    if (existing) return NextResponse.json({ error: "User already has this role" }, { status: 400 });


    const record = {
      id: uuidv4(),
      userId,
      roleId: params.roleId,
      assignedAt: new Date(),
    };

    await db.collection("user_roles").insertOne(record);

    return NextResponse.json(record, { status: 201 });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: err.format() }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
