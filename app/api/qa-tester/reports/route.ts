import { NextResponse } from "next/server";
import { getAllQATestReports } from "@/lib/models/qaTesterModels";

export async function GET() {
  try {
    const reports = await getAllQATestReports();
    return NextResponse.json(reports);
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
