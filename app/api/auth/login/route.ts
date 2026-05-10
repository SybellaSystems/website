import { NextRequest, NextResponse } from "next/server";
import { loginStaff } from "@/lib/models/StaffMember";
import { loginSchema } from "@/app/schemas/user.schema";
import { RateLimiter } from "@/lib/security";
import { ADMIN_ACCESS_COOKIE, ADMIN_REFRESH_COOKIE } from "@/lib/auth/cookies";

const rateLimiter = new RateLimiter(60_000, 5);

export async function POST(req: NextRequest) {
  try {
    const identifier = req.headers.get("x-forwarded-for") || req.ip || "unknown";
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
    response.cookies.set(ADMIN_ACCESS_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60, // 1 hour
      sameSite: "lax",
    });
    response.cookies.set(ADMIN_REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to sign in" }, { status: 400 });
  }
}
