import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    return NextResponse.json({ message: "Cron job executed successfully" },{ status: 200 });
}