import { NextRequest, NextResponse } from "next/server";
import { updateSelfPassword } from "@/lib/models/StaffMember";
import { authMiddleware } from "@/app/middleware/auth.middleware";

export async function PATCH(req: NextRequest) {
  const user = await authMiddleware(req, { roles: ["*"] });
  if (user instanceof NextResponse) return user;

  const body = await req.json();

  try {
    await updateSelfPassword(user.id, body);
    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
