import { NextResponse, NextRequest } from "next/server";
import { createUpdate, getAllUpdates } from "@/lib/models/Update";
import { authMiddleware } from "@/app/middleware/auth.middleware";
import { permissionMiddleware } from "@/app/middleware/permissionMiddleware";

export async function GET() {
  try {
    const updates = await getAllUpdates();
    return NextResponse.json(updates, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await authMiddleware(request, { roles: ["*"] });
  // If middleware returned a NextResponse, it means auth failed
  if (authResult instanceof NextResponse) return authResult;
  const permissionResult = await permissionMiddleware(request as any, ["create_updates"]);
  if (permissionResult instanceof NextResponse) return permissionResult;
  try {
    const data = await request.json();
    const update = await createUpdate(data);
    return NextResponse.json(update, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
