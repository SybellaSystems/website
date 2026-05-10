import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { setupInvitedStaffPassword } from "@/lib/models/StaffMember";

const schema = z.object({
  token: z.string().min(12),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/\d/, "Must contain number")
    .regex(/[\W_]/, "Must contain special character"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.parse(body);
    await setupInvitedStaffPassword(parsed.token, parsed.password);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to setup password" }, { status: 400 });
  }
}

