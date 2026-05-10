import { NextRequest, NextResponse } from "next/server";
import { readAdminTokenFromRequest } from "@/lib/auth/admin-session";
import { verifyAccessToken } from "@/app/utils/jwt";
import getClientPromise from "@/lib/mongodb";
import { ROLE_DEFAULT_PERMISSIONS, type AdminRole, type PlatformPermission } from "@/lib/rbac/roles";

type GuardOptions = {
  roles?: AdminRole[];
  permissions?: PlatformPermission[];
  allowSelfIdFromParam?: string;
};

type GuardContext = {
  id: string;
  role: AdminRole;
  permissions: PlatformPermission[];
  departmentId?: string | null;
};

export async function requireAdminAccess(
  req: NextRequest,
  options?: GuardOptions
): Promise<GuardContext | NextResponse> {
  const token = readAdminTokenFromRequest(req);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await getClientPromise();
  const staff = await client.db().collection("staff_members").findOne({ id: payload.id });
  if (!staff) {
    return NextResponse.json({ error: "Staff account not found" }, { status: 401 });
  }
  if (staff.isActive === false) {
    return NextResponse.json({ error: "Account suspended" }, { status: 403 });
  }

  const role = (staff.role || payload.role || "viewer") as AdminRole;
  const permissions = [
    ...new Set<PlatformPermission>([
      ...(ROLE_DEFAULT_PERMISSIONS[role] ?? []),
      ...((staff.permissions as PlatformPermission[] | undefined) ?? []),
    ]),
  ];

  if (options?.roles?.length && !options.roles.includes(role)) {
    return NextResponse.json({ error: "Forbidden: role restricted" }, { status: 403 });
  }

  if (options?.permissions?.length) {
    const missing = options.permissions.filter((permission) => !permissions.includes(permission));
    if (missing.length > 0) {
      return NextResponse.json({ error: "Forbidden: insufficient permissions" }, { status: 403 });
    }
  }

  return {
    id: payload.id,
    role,
    permissions,
    departmentId: (staff.departmentId as string | undefined) ?? null,
  };
}

