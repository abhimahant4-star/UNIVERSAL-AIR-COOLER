// Edge-safe JWT helpers (used by middleware and server code).
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "uac_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 16) throw new Error("JWT_SECRET is missing or too short");
  return new TextEncoder().encode(s);
}

export type SessionPayload = { adminId: string; email: string; name: string };

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret());
}

export async function verifySession(token?: string | null): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    // Reject sessions from before the MongoDB switch (numeric admin ids).
    if (typeof payload.adminId !== "string" || !/^[a-f0-9]{24}$/i.test(payload.adminId)) return null;
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
