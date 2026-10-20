import { db } from "../db/index.js";
import { auditLogs } from "../db/schema.js";
import crypto from "node:crypto";

/**
 * Record an audit log entry in the database.
 */
export async function logAdminAction({
  adminId,
  action,
  entityType,
  entityId = null,
  ipAddress = null,
  details = null,
}) {
  try {
    const id = `log_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const createdAt = new Date().toISOString();

    await db.insert(auditLogs).values({
      id,
      adminId,
      action,
      entityType,
      entityId,
      ipAddress,
      details: details ? (typeof details === "string" ? details : JSON.stringify(details)) : null,
      createdAt,
    });
  } catch (err) {
    console.error("Failed to write audit log:", err.message);
  }
}
