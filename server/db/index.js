import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.TURSO_DATABASE_URL || "file:local.db";
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

export const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client, { schema });

/**
 * Ensures all required database tables exist with proper constraints and indexes.
 * Works seamlessly with Turso remote and local libSQL.
 */
export async function ensureDatabaseTables() {
  const ddlStatements = [
    `CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at INTEGER NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      created_at TEXT NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      handle TEXT NOT NULL,
      bio_short TEXT NOT NULL,
      about_lead TEXT,
      about_paragraphs TEXT,
      highlights TEXT,
      avatar_url TEXT,
      location TEXT,
      is_available INTEGER NOT NULL DEFAULT 1,
      availability_status TEXT,
      contact_email TEXT,
      github_url TEXT,
      linkedin_url TEXT,
      resume_url TEXT,
      updated_at TEXT NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      type TEXT NOT NULL DEFAULT 'project',
      created_at TEXT NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      summary TEXT NOT NULL,
      description TEXT NOT NULL,
      content TEXT,
      featured INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'draft',
      repo_url TEXT,
      live_url TEXT,
      thumbnail_url TEXT,
      features TEXT,
      tech_stack TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
      preview_type TEXT DEFAULT 'dashboard',
      published_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS project_images (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      media_asset_id TEXT,
      url TEXT NOT NULL,
      caption TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      proficiency_level TEXT,
      description TEXT,
      icon_name TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_featured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS project_skills (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS experiences (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      employment_type TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT,
      is_current INTEGER NOT NULL DEFAULT 0,
      description TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS educations (
      id TEXT PRIMARY KEY,
      degree TEXT NOT NULL,
      institution TEXT NOT NULL,
      field_of_study TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT,
      is_current INTEGER NOT NULL DEFAULT 0,
      grade_or_honors TEXT,
      description TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS certifications (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      issuing_organization TEXT NOT NULL,
      issue_date TEXT NOT NULL,
      expiration_date TEXT,
      credential_id TEXT,
      credential_url TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      featured_image TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
      seo_title TEXT,
      seo_description TEXT,
      published_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS post_tags (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
      tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      ip_hash TEXT,
      created_at TEXT NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS site_settings (
      id TEXT PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS navigation_items (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      path TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_external INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS media_assets (
      id TEXT PRIMARY KEY,
      public_id TEXT NOT NULL UNIQUE,
      url TEXT NOT NULL,
      secure_url TEXT NOT NULL,
      format TEXT,
      bytes INTEGER,
      width INTEGER,
      height INTEGER,
      folder TEXT,
      alt_text TEXT,
      created_at TEXT NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      admin_id TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      ip_address TEXT,
      details TEXT,
      created_at TEXT NOT NULL
    );`,

    // Useful indexes
    `CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);`,
    `CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);`,
    `CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);`,
    `CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);`,
    `CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);`,
    `CREATE INDEX IF NOT EXISTS idx_messages_read ON contact_messages(is_read);`
  ];

  for (const stmt of ddlStatements) {
    try {
      await client.execute(stmt);
    } catch (err) {
      console.error("Migration statement error:", err.message);
    }
  }
}
