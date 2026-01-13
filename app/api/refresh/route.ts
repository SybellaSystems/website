import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "thisis mysecretestringrefreshtoken"

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "thisismysecrteaccesspassword"

export async function POST(req: NextRequest) {
  const { refreshToken } = await req.json();

  if (!refreshToken) return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as { id: string; role: string };

    // Issue new access token
    const accessToken = jwt.sign({ id: payload.id, role: payload.role }, ACCESS_SECRET, { expiresIn: '15m' });

    return NextResponse.json({ accessToken });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }
}
