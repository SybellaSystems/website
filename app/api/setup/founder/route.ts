import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import getClientPromise from "@/lib/mongodb";
import { createAccessToken, createRefreshToken } from "@/app/utils/jwt";
import { ADMIN_ACCESS_COOKIE, ADMIN_REFRESH_COOKIE } from "@/lib/auth/cookies";

const schema = z.object({
  names: z.string().min(3),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/\d/)
    .regex(/[\W_]/),
});

export async function POST(req: NextRequest) {
  if (!process.env.MONGODB_URI && !process.env.MONGO_URL) {
    return NextResponse.json(
      { error: "MONGODB_URI is not set. Add it to .env.local before creating founder account." },
      { status: 400 }
    );
  }

  const body = await req.json();
  const parsed = schema.parse(body);

  const client = await getClientPromise();
  const db = client.db();
  const count = await db.collection("staff_members").countDocuments();
  if (count > 0) {
    return NextResponse.json({ error: "Founder setup is locked because staff users already exist." }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(parsed.password, 10);
  const account = {
    id: crypto.randomUUID(),
    names: parsed.names.trim(),
    email: parsed.email.toLowerCase().trim(),
    password: hashedPassword,
    role: "founder",
    isActive: true,
    permissions: [],
    inviteStatus: "accepted",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await db.collection("staff_members").insertOne(account);

  const accessToken = createAccessToken({ id: account.id, role: account.role, permissions: [] });
  const refreshToken = createRefreshToken({ id: account.id, role: account.role, permissions: [] });
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
  response.cookies.set(ADMIN_REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

