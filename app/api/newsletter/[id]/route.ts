// /app/api/newsletter/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { deleteSubscriber } from "@/lib/models/NewsLetter";
import { authMiddleware } from "@/app/middleware/auth.middleware";
import { logger } from "@/lib/logger";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await authMiddleware(req, {roles: ['executive']});
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, message: "Subscriber ID is required" }, { status: 400 });
    }

    const result = await deleteSubscriber(id);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Subscriber deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/newsletter/[id] error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
