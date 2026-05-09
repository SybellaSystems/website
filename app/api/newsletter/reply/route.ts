import { NextRequest, NextResponse } from "next/server";
import { replyToSubscriber } from "@/lib/models/NewsLetter";
import { authMiddleware } from "@/app/middleware/auth.middleware";
import { logger } from "@/lib/logger";
import { SecurityValidator } from "@/lib/security";


export async function POST(req: NextRequest) {
  try {

    const user = await authMiddleware(req, {roles: ['executive', 'marketing', 'superadmin']});
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }


    const body = await req.json();
    const { id, subject, message } = body;

    if (!id || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    SecurityValidator.sanitizeText(subject);
    SecurityValidator.sanitizeText(message);


    const result = await replyToSubscriber({ id, subject, message });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Reply sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
