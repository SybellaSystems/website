import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import getClientPromise from "@/lib/mongodb";
import { requireAdminAccess } from "@/lib/rbac/guard";
import { ADMIN_ROLES } from "@/lib/rbac/roles";

const patchSchema = z.object({
  action: z.enum(["suspend", "reactivate", "update"]).optional(),
  role: z.enum(ADMIN_ROLES).optional(),
  departmentId: z.string().nullable().optional(),
  supervisorId: z.string().nullable().optional(),
  permissions: z.array(z.string()).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdminAccess(req, { permissions: ["users.update"] });
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  const parsed = patchSchema.parse(body);

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.action === "suspend") updateData.isActive = false;
  if (parsed.action === "reactivate") updateData.isActive = true;
  if (parsed.role) updateData.role = parsed.role;
  if (parsed.permissions) updateData.permissions = parsed.permissions;
  if (parsed.departmentId !== undefined) updateData.departmentId = parsed.departmentId;
  if (parsed.supervisorId !== undefined) updateData.supervisorId = parsed.supervisorId;

  const client = await getClientPromise();
  const res = await client.db().collection("staff_members").updateOne({ id: params.id }, { $set: updateData });
  if (!res.matchedCount) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  await client.db().collection("company_activity_logs").insertOne({
    actorId: auth.id,
    targetUserId: params.id,
    action: parsed.action || "update",
    payload: updateData,
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true });
}

