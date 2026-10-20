import express from "express";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { z } from "zod";
import { db } from "../db/index.js";
import { admins, sessions } from "../db/schema.js";
import { eq } from "drizzle-orm";
import {
  requireAuth,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
  generateSessionToken,
  hashToken,
} from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validation.js";
import { logAdminAction } from "../middleware/audit.js";

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

const bootstrapSchema = z.object({
  secret: z.string().min(1, "Bootstrap secret required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name required"),
});

/**
 * POST /api/auth/login
 */
router.post("/login", authLimiter, validate({ body: loginSchema }), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";

    const adminList = await db.select().from(admins).where(eq(admins.email, email.toLowerCase())).limit(1);
    if (adminList.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Invalid credentials.",
      });
    }

    const admin = adminList[0];
    const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordMatch) {
      await logAdminAction({
        adminId: admin.id,
        action: "login_failed",
        entityType: "auth",
        ipAddress,
        details: { reason: "incorrect_password" },
      });
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Invalid credentials.",
      });
    }

    // Generate session
    const rawToken = generateSessionToken();
    const tokenHash = hashToken(rawToken);
    const sessionId = `sess_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const expiresAt = Date.now() + SESSION_DURATION_MS;

    await db.insert(sessions).values({
      id: sessionId,
      adminId: admin.id,
      tokenHash,
      expiresAt,
      ipAddress: String(ipAddress),
      userAgent: req.headers["user-agent"] || "",
      createdAt: new Date().toISOString(),
    });

    // Set secure cookie
    res.cookie(SESSION_COOKIE_NAME, rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_MS,
    });

    await logAdminAction({
      adminId: admin.id,
      action: "login_success",
      entityType: "auth",
      ipAddress,
    });

    return res.json({
      success: true,
      message: "Login successful.",
      token: rawToken, // Provided for headless/API client support if cookies are blocked
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/logout
 */
router.post("/logout", async (req, res, next) => {
  try {
    const rawToken =
      req.cookies?.[SESSION_COOKIE_NAME] ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null);

    if (rawToken) {
      const tokenHash = hashToken(rawToken);
      await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
    }

    res.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me
 */
router.get("/me", requireAuth, (req, res) => {
  return res.json({
    success: true,
    admin: req.admin,
  });
});

/**
 * POST /api/auth/change-password
 */
router.post(
  "/change-password",
  requireAuth,
  validate({ body: changePasswordSchema }),
  async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const adminList = await db.select().from(admins).where(eq(admins.id, req.admin.id)).limit(1);

      if (adminList.length === 0) {
        return res.status(404).json({ success: false, message: "Admin not found." });
      }

      const admin = adminList[0];
      const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!valid) {
        return res.status(400).json({
          success: false,
          error: "Validation Error",
          message: "Current password is incorrect.",
        });
      }

      const newHash = await bcrypt.hash(newPassword, 12);
      await db
        .update(admins)
        .set({ passwordHash: newHash, updatedAt: new Date().toISOString() })
        .where(eq(admins.id, admin.id));

      await logAdminAction({
        adminId: admin.id,
        action: "password_changed",
        entityType: "admin",
        entityId: admin.id,
        ipAddress: req.ip,
      });

      return res.json({
        success: true,
        message: "Password updated successfully.",
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/auth/bootstrap
 * Safely initialize or re-initialize the root admin account using ADMIN_BOOTSTRAP_SECRET.
 */
router.post("/bootstrap", validate({ body: bootstrapSchema }), async (req, res, next) => {
  try {
    const { secret, email, password, name } = req.body;
    const envSecret = process.env.ADMIN_BOOTSTRAP_SECRET;

    if (!envSecret || secret !== envSecret) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "Invalid bootstrap secret authorization.",
      });
    }

    const now = new Date().toISOString();
    const passwordHash = await bcrypt.hash(password, 12);

    const existing = await db.select().from(admins).where(eq(admins.email, email.toLowerCase())).limit(1);
    if (existing.length > 0) {
      await db
        .update(admins)
        .set({ passwordHash, name, updatedAt: now })
        .where(eq(admins.email, email.toLowerCase()));

      return res.json({
        success: true,
        message: `Admin account for ${email} updated via bootstrap.`,
      });
    }

    const newId = `admin_${Date.now()}`;
    await db.insert(admins).values({
      id: newId,
      email: email.toLowerCase(),
      passwordHash,
      name,
      role: "admin",
      createdAt: now,
      updatedAt: now,
    });

    return res.status(201).json({
      success: true,
      message: `Admin account for ${email} successfully created.`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
