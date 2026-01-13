import { NextResponse } from "next/server";
import { saveOrUpdateMetrics } from "@/lib/models/qaTesterModels";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = await saveOrUpdateMetrics({
      reportId: body.reportId,
      bugFixRate: body.bugFixRate,
      avgResolutionTime: body.avgResolutionTime,
      testCoverage: body.testCoverage,
    });

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to save metrics" }, { status: 500 });
  }
}
