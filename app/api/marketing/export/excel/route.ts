import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import getClientPromise from "@/lib/mongodb";


export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const client = await getClientPromise();
    const db = client.db();
    const collection = db.collection("pageviews");

    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const pageUrl = searchParams.get("page");

    const query: any = {};
    if (start && end) query.viewedAt = { $gte: new Date(start), $lte: new Date(end) };
    if (pageUrl) query.pageUrl = pageUrl;

    const data = await collection.find(query).toArray();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Page Views");

    worksheet.columns = [
      { header: "IP Address", key: "ipAddress", width: 20 },
      { header: "User Agent", key: "userAgent", width: 40 },
      { header: "Page URL", key: "pageUrl", width: 30 },
      { header: "Country", key: "country", width: 15 },
      { header: "Region", key: "region", width: 15 },
      { header: "Viewed At", key: "viewedAt", width: 25 },
    ];

    data.forEach((item) => worksheet.addRow(item));

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": "attachment; filename=page_views.xlsx",
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Export Excel Error:", error);
    return NextResponse.json({ error: "Failed to export Excel" }, { status: 500 });
  }
}
