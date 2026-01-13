import { NextResponse } from "next/server";
import { saveUserFeedback, getAllUserFeedback } from "@/lib/models/qaTesterModels";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const id = await saveUserFeedback({
      userId: body.userId,
      feedbackText: body.feedbackText,
      sentiment: body.sentiment,
      source: body.source || "form",
    });

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const feedbacks = await getAllUserFeedback();
    return NextResponse.json(feedbacks);
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch feedbacks" }, { status: 500 });
  }
}
