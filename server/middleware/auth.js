import crypto from "node:crypto";
import { db } from "../db/index.js";
import { sessions, admins } from "../db/schema.js";
import { eq, and, gt } from "drizzle-orm";

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Hash raw token with SHA-256 before database lookup.
 */
export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Generates a cryptographically strong 32-byte session token.
 */
export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Express middleware to enforce authenticated admin session.
 */
export async function requireAuth(req, res, next) {
  try {
    const rawToken =
      req.cookies?.[SESSION_COOKIE_NAME] ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null);

    if (!rawToken) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication session required.",
      });
    }

    const tokenHash = hashToken(rawToken);
    const now = Date.now();

    const activeSessions = await db
      .select({
        sessionId: sessions.id,
        adminId: sessions.adminId,
        expiresAt: sessions.expiresAt,
        admin: {
          id: admins.id,
          email: admins.email,
          name: admins.name,
          role: admins.role,
        },
      })
      .from(sessions)
      .innerJoin(admins, eq(sessions.adminId, admins.id))
      .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, now)))
      .limit(1);

    if (activeSessions.length === 0) {
      // Clear invalid cookie
      res.clearCookie(SESSION_COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Session expired or invalid.",
      });
    }

    const currentSession = activeSessions[0];
    req.admin = currentSession.admin;
    req.sessionId = currentSession.sessionId;

    // Sliding session: extend if more than half elapsed
    if (currentSession.expiresAt - now < SESSION_DURATION_MS / 2) {
      const newExpiry = now + SESSION_DURATION_MS;
      await db
        .update(sessions)
        .set({ expiresAt: newExpiry })
        .where(eq(sessions.id, currentSession.sessionId));
    }

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An error occurred while verifying your session.",
    });
  }
}
