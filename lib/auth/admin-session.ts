import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { verifyAccessToken } from "@/app/utils/jwt";
import { ADMIN_ACCESS_COOKIE } from "@/lib/auth/cookies";

export type AdminSession = {
  id: string;
  role: string;
  permissions?: string[];
};

export function readAdminTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1] ?? null;
  }

  return req.cookies.get(ADMIN_ACCESS_COOKIE)?.value ?? null;
}

export function getServerAdminSession(): AdminSession | null {
  const token = cookies().get(ADMIN_ACCESS_COOKIE)?.value;
  if (!token) return null;

  const payload = verifyAccessToken(token);
  if (!payload) return null;

  return {
    id: payload.id,
    role: payload.role,
    permissions: payload.permissions,
  };
}

