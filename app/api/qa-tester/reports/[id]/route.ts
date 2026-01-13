import { NextResponse } from "next/server";
import { getQATestReportById, deleteQATestReport } from "@/lib/models/qaTesterModels";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const report = await getQATestReportById(params.id);
    if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(report);
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const deleted = await deleteQATestReport(params.id);
    if (!deleted) return NextResponse.json({ error: "Delete failed" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
  }
}
