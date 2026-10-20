import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import publicRouter from "./routes/public.js";
import { db } from "./db/index.js";
import { projects, blogPosts } from "./db/schema.js";
import { eq, desc } from "drizzle-orm";

dotenv.config();

export const app = express();

// Trust proxy for reverse proxies / Vercel
app.set("trust proxy", 1);

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Managed at gateway/vercel or handled flexibly for external images
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  "http://127.0.0.1:5173",
  process.env.APP_URL,
  ...(process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(",") : []),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, same-origin)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS.`));
    },
    credentials: true,
  })
);

// Parsers
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Dynamic XML Sitemap Generator
app.get("/sitemap.xml", async (req, res, next) => {
  try {
    const siteUrl = process.env.APP_URL || "https://your-portfolio-domain.vercel.app";
    const [projectRows, blogRows] = await Promise.all([
      db.select({ slug: projects.slug, updatedAt: projects.updatedAt }).from(projects).where(eq(projects.status, "published")),
      db.select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt }).from(blogPosts).where(eq(blogPosts.status, "published")),
    ]);

    const staticRoutes = ["", "/about", "/projects", "/skills", "/blog", "/contact"];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    for (const r of staticRoutes) {
      xml += `  <url>\n    <loc>${siteUrl}${r}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${r === "" ? "1.0" : "0.8"}</priority>\n  </url>\n`;
    }

    // Projects
    for (const p of projectRows) {
      xml += `  <url>\n    <loc>${siteUrl}/projects/${p.slug}</loc>\n    <lastmod>${p.updatedAt.split("T")[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    // Blog
    for (const b of blogRows) {
      xml += `  <url>\n    <loc>${siteUrl}/blog/${b.slug}</loc>\n    <lastmod>${b.updatedAt.split("T")[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    xml += `</urlset>`;

    res.header("Content-Type", "application/xml");
    return res.send(xml);
  } catch (err) {
    next(err);
  }
});

// Mount Routes
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api", publicRouter);

// 404 for undefined API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: `API endpoint ${req.method} ${req.originalUrl} does not exist.`,
  });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  const status = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  return res.status(status).json({
    success: false,
    error: err.name || "InternalServerError",
    message: isProduction && status === 500 ? "An unexpected server error occurred." : err.message,
  });
});

export default app;
