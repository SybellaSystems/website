import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { roleSchema, createRoleSchema } from "@/app/schemas/rbac.schema";
import getClientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb"; 
import { authMiddleware } from '@/app/middleware/auth.middleware';


// get role by id

export async function GET(
  req: NextRequest,
  { params }: { params: { roleId: string } }
) {
    const user = await authMiddleware(req, { roles: ["*"] });
    if (user instanceof NextResponse) return user;
  try {
    const client = await getClientPromise();
    const db = client.db();

    const role = await db.collection("roles").findOne({ id: params.roleId });
    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json(role, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// update role

export async function PATCH(
  req: NextRequest,
  { params }: { params: { roleId: string } }
) {
    const user = await authMiddleware(req, { roles: ["executive","superadmin"] });
    if (user instanceof NextResponse) return user;
  try {
    const body = await req.json();
    const data = createRoleSchema.parse(body);

    const client = await getClientPromise();
    const db = client.db();

    const updateResult = await db.collection("roles").updateOne(
      { id: params.roleId },
      { $set: { ...data, updatedAt: new Date() } }
    );

    if (!updateResult) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json({message: "Role updated"}, { status: 200 });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: err.format() }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: { roleId: string } }
) {
    const user = await authMiddleware(req, { roles: ["executive","superadmin"] });
    if (user instanceof NextResponse) return user;
  try {
    const client = await getClientPromise();
    const db = client.db();

    const deleteResult = await db.collection("roles").deleteOne({ id: params.roleId });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Role deleted successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
