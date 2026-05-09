import { NextRequest, NextResponse } from "next/server";
import { loginStaff } from "@/lib/models/StaffMember";
import { loginSchema } from "@/app/schemas/user.schema";
import { serialize } from "cookie";
import  { RateLimiter }  from "@/lib/security"


const rateLimiter = new RateLimiter(60_000, 5);

export async function POST(req: NextRequest) {
  try {
    const identifier =
      req.headers.get("x-forwarded-for") ||
      req.ip ||
      "unknown";


    if (!rateLimiter.isAllowed(identifier)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a bit and try again." },
        { status: 429 }
      );
    }


    const body = await req.json();
    const parsed = loginSchema.parse(body);


    const { accessToken, refreshToken } = await loginStaff(parsed);


    const response = NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
    });


    response.cookies.set("adminToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    sameSite: "strict",
    });


    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: "strict",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}


