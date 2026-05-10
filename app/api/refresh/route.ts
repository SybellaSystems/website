import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ADMIN_ACCESS_COOKIE, ADMIN_REFRESH_COOKIE } from '@/lib/auth/cookies';

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "thisis mysecretestringrefreshtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "thisismysecrteaccesspassword";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const refreshToken = body?.refreshToken || req.cookies.get(ADMIN_REFRESH_COOKIE)?.value;

  if (!refreshToken) return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as { id: string; role: string };

    // Issue new access token
    const accessToken = jwt.sign({ id: payload.id, role: payload.role }, ACCESS_SECRET, { expiresIn: '15m' });

    const response = NextResponse.json({ accessToken });
    response.cookies.set(ADMIN_ACCESS_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
      sameSite: "lax",
    });
    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }
}
