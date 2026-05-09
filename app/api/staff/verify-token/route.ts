import crypto from "crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { findValidResetToken, deleteResetToken } from "@/lib/models/passwordResetModel";
import { updateStaffPassword2fa } from "@/lib/models/StaffMember";

export async function POST(req: Request) {
  try {
    const { email, token, newPassword } = await req.json();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const resetRecord = await findValidResetToken(email, hashedToken);

    if (!resetRecord) {
      return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateStaffPassword2fa(email, hashedPassword);
    await deleteResetToken(email);

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("verify-token error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
