import crypto from "crypto";
import { NextResponse } from "next/server";
import { findStaffByEmail } from "@/lib/models/StaffMember";
import { saveResetToken } from "@/lib/models/passwordResetModel";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Prevent email enumeration — always respond 200 OK
    const staff = await findStaffByEmail(email);

    if (staff) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      await saveResetToken(email, hashedToken, expiresAt);

      const resetLink = `https://sybellasystems.co.rw/reset-password?token=${resetToken}&email=${encodeURIComponent(
        email
      )}`;

      await sendEmail({
        receiver: email,
        subject: "Password Reset Request",
        message: `
          Hello, <br/>
          You requested a password reset for your Sybella Systems account.<br/>
          Click the link below to reset your password:<br/>
          <a href="${resetLink}" target="_blank">${resetLink}</a><br/><br/>
          This link will expire in 5 minutes.<br/><br/>
          If you didn’t request this, please ignore this email.
        `,
      });
    }

    return NextResponse.json({
      message: "If the email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("request-reset error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
