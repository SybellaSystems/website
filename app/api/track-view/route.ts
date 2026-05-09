import { NextRequest, NextResponse } from "next/server";
import { PageView } from "@/lib/models/PageView";

export async function POST(req: NextRequest) {
  try {
    const { pageUrl, visitorId } = await req.json();

    let ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.ip ||
      "unknown";

    // Skip localhost
    if (ip === "::1" || ip === "127.0.0.1") ip = "localhost";

    const userAgent = req.headers.get("user-agent") || "unknown";

    let geo = { country: "Unknown", region: "Unknown", city: "Unknown" };
    if (ip !== "localhost" && ip !== "unknown") {
      try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();
        geo = {
          country: data.country_name,
          region: data.region,
          city: data.city,
        };
      } catch (err) {
        console.error("Geo lookup failed", err);
      }
    }

    const result = await PageView.record(ip, userAgent, pageUrl, visitorId, geo);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}
