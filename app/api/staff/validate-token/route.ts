import crypto from "crypto";
import { NextResponse } from "next/server";
import { findValidResetToken } from "@/lib/models/passwordResetModel";

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const resetRecord = await findValidResetToken(email, hashedToken);

    const isValid = !!resetRecord;
    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error("validate-token error:", error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
