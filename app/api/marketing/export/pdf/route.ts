import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import getClientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

export async function GET() {
  // Skip MongoDB connection during build time
  const isBuildTime =
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.NEXT_PHASE === "phase-production-compile";

  if (isBuildTime) {
    return NextResponse.json(
      { error: "Service unavailable during build" },
      { status: 503 }
    );
  }

  try {
    const client = await getClientPromise();
    const db = client.db();
    const views = await db.collection("pageviews").find().toArray();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText("Marketing Analytics Report", {
      x: 50,
      y: height - 50,
      size: 18,
      font,
      color: rgb(0, 0.53, 0.71),
    });

    let y = height - 80;
    views.slice(0, 30).forEach((v, i) => {
      page.drawText(
        `${i + 1}. ${v.pageUrl} - ${v.ipAddress || "unknown"} - ${v.viewedAt}`,
        { x: 50, y: (y -= 20), size: 10, font, color: rgb(0, 0, 0) }
      );
    });

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="marketing_report.pdf"',
      },
    });
  } catch (error) {
    console.error("Export PDF Error:", error);
    return NextResponse.json(
      { error: "Failed to export PDF" },
      { status: 500 }
    );
  }
}
