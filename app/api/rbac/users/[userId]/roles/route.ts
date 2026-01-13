import { NextRequest, NextResponse } from "next/server";
import getClientPromise from "@/lib/mongodb";
import { authMiddleware} from '@/app/middleware/auth.middleware';


export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const client = await getClientPromise();
    const db = client.db();


    const assignments = await db
      .collection("user_roles")
      .find({ userId: params.userId })
      .toArray();


    const roleIds = assignments.map((a) => a.roleId);
    const roles = await db
      .collection("roles")
      .find({ id: { $in: roleIds } })
      .toArray();

    return NextResponse.json(roles, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// delete user role

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const user = await authMiddleware(req, { roles: ["executive","superadmin", "manager"] });
  if (user instanceof NextResponse) return user
  try {
    const body = await req.json();
    const { roleId } = body; 

    const client = await getClientPromise();
    const db = client.db();

    const deleteResult = await db
      .collection("user_roles")
      .deleteOne({ userId: params.userId, roleId });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: "Role assignment not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Role removed from user" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
