import { NextRequest, NextResponse } from "next/server";
import { getStaffMemberOut } from "@/lib/models/StaffMember";
import { readAdminTokenFromRequest } from "@/lib/auth/admin-session";
import { verifyAccessToken } from "@/app/utils/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = readAdminTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const staff = await getStaffMemberOut(payload.id);
    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: staff.id,
      names: staff.names,
      email: staff.email,
      role: staff.role,
      phone: staff.phone,
      permissions: staff.permissions,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
