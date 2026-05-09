import jwt from 'jsonwebtoken';

function getAccessSecret() {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not configured");
  }
  return secret;
}

function getRefreshSecret() {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not configured");
  }
  return secret;
}

export function createAccessToken(payload: { id: string; role: string, permissions?: string[] }) {
  return jwt.sign(payload, getAccessSecret(), { expiresIn: '1h' });
}

export function createRefreshToken(payload: { id: string; role: string, permissions?: string[] }) {
  return jwt.sign(payload, getRefreshSecret(), { expiresIn: '7d' });
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, getAccessSecret()) as { id: string; role: string, permissions?: string[] };
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, getRefreshSecret()) as { id: string; role: string, permissions?: string[] };
  } catch {
    return null;
  }
}
