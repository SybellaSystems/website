import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./auth.middleware";

export async function permissionMiddleware(req: NextRequest, requiredPermissions: string[]) {
  const authResult = await authMiddleware(req, { roles: ["*"] });
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult;

  const userPermissions: string[] = Array.isArray(user.permissions)
    ? (user.permissions as string[])
    : typeof user.permissions === "string"
    ? (user.permissions as string).split(",").map((p) => p.trim())
    : [];


  if (userPermissions.includes("*")) return { user };

  const hasPermission = requiredPermissions.some((p) => userPermissions.includes(p));

  if (!hasPermission) {
    return NextResponse.json({ error: `Forbidden: this action require this permission, ${requiredPermissions} to be accomplished` }, { status: 403 });
  }

  return { user };
}
