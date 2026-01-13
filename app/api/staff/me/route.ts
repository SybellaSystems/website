import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getStaffMemberOut } from "@/lib/models/StaffMember";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { id: string };

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
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
