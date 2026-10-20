import express from "express";
import { z } from "zod";
import crypto from "node:crypto";
import { db } from "../db/index.js";
import {
  profiles,
  projects,
  projectImages,
  skills,
  experiences,
  educations,
  certifications,
  blogPosts,
  categories,
  tags,
  postTags,
  contactMessages,
  siteSettings,
  navigationItems,
} from "../db/schema.js";
import { eq, and, desc, asc, like, sql } from "drizzle-orm";
import { contactLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validation.js";

const router = express.Router();

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address").max(150),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000),
  honeypot: z.string().optional(), // Spam trap: must be empty
});

/**
 * GET /api/profile
 */
router.get("/profile", async (req, res, next) => {
  try {
    const list = await db.select().from(profiles).limit(1);
    if (list.length === 0) {
      return res.status(404).json({ success: false, message: "Profile not found." });
    }
    const prof = list[0];
    return res.json({
      success: true,
      data: {
        ...prof,
        aboutParagraphs: prof.aboutParagraphs ? JSON.parse(prof.aboutParagraphs) : [],
        highlights: prof.highlights ? JSON.parse(prof.highlights) : [],
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/projects
 */
router.get("/projects", async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
    const offset = (page - 1) * limit;
    const categorySlug = req.query.category;
    const search = req.query.search?.trim();
    const featured = req.query.featured;

    let query = db
      .select({
        id: projects.id,
        title: projects.title,
        slug: projects.slug,
        summary: projects.summary,
        description: projects.description,
        featured: projects.featured,
        status: projects.status,
        repoUrl: projects.repoUrl,
        liveUrl: projects.liveUrl,
        thumbnailUrl: projects.thumbnailUrl,
        features: projects.features,
        techStack: projects.techStack,
        sortOrder: projects.sortOrder,
        previewType: projects.previewType,
        publishedAt: projects.publishedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(projects)
      .leftJoin(categories, eq(projects.categoryId, categories.id))
      .where(
        and(
          eq(projects.status, "published"),
          featured !== undefined ? eq(projects.featured, featured === "true" || featured === "1" ? 1 : 0) : undefined,
          categorySlug && categorySlug !== "all" ? eq(categories.slug, categorySlug) : undefined,
          search ? like(projects.title, `%${search}%`) : undefined
        )
      )
      .orderBy(asc(projects.sortOrder), desc(projects.publishedAt))
      .limit(limit)
      .offset(offset);

    const rows = await query;

    // Total count for pagination
    const countQuery = await db
      .select({ count: sql`count(*)` })
      .from(projects)
      .leftJoin(categories, eq(projects.categoryId, categories.id))
      .where(
        and(
          eq(projects.status, "published"),
          featured !== undefined ? eq(projects.featured, featured === "true" || featured === "1" ? 1 : 0) : undefined,
          categorySlug && categorySlug !== "all" ? eq(categories.slug, categorySlug) : undefined,
          search ? like(projects.title, `%${search}%`) : undefined
        )
      );

    const total = Number(countQuery[0]?.count || 0);

    const parsedRows = rows.map((p) => ({
      ...p,
      features: p.features ? JSON.parse(p.features) : [],
      techStack: p.techStack ? JSON.parse(p.techStack) : [],
    }));

    return res.json({
      success: true,
      data: parsedRows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/projects/:slug
 */
router.get("/projects/:slug", async (req, res, next) => {
  try {
    const list = await db
      .select({
        project: projects,
        category: categories,
      })
      .from(projects)
      .leftJoin(categories, eq(projects.categoryId, categories.id))
      .where(and(eq(projects.slug, req.params.slug), eq(projects.status, "published")))
      .limit(1);

    if (list.length === 0) {
      return res.status(404).json({ success: false, message: "Project not found or not published." });
    }

    const { project, category } = list[0];
    const images = await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, project.id))
      .orderBy(asc(projectImages.sortOrder));

    return res.json({
      success: true,
      data: {
        ...project,
        features: project.features ? JSON.parse(project.features) : [],
        techStack: project.techStack ? JSON.parse(project.techStack) : [],
        category,
        images,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/skills
 */
router.get("/skills", async (req, res, next) => {
  try {
    const rows = await db
      .select()
      .from(skills)
      .orderBy(asc(skills.sortOrder), asc(skills.name));

    // Also organize by category for convenient section rendering
    const categoriesMap = {
      frontend: { id: "frontend", title: "Frontend Development", skills: [] },
      backend: { id: "backend", title: "Backend Development", skills: [] },
      databases: { id: "databases", title: "Databases & Storage", skills: [] },
      tools: { id: "tools", title: "Tools & Workflow", skills: [] },
      deployment: { id: "deployment", title: "Deployment & Infrastructure", skills: [] },
    };

    rows.forEach((sk) => {
      const cat = categoriesMap[sk.category] || {
        id: sk.category,
        title: sk.category.charAt(0).toUpperCase() + sk.category.slice(1),
        skills: [],
      };
      cat.skills.push({
        id: sk.id,
        name: sk.name,
        status: sk.proficiencyLevel || "established",
        description: sk.description,
        iconName: sk.iconName,
        isFeatured: sk.isFeatured === 1,
      });
      categoriesMap[sk.category] = cat;
    });

    return res.json({
      success: true,
      data: rows,
      grouped: Object.values(categoriesMap),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/experiences
 */
router.get("/experiences", async (req, res, next) => {
  try {
    const rows = await db
      .select()
      .from(experiences)
      .orderBy(asc(experiences.sortOrder), desc(experiences.startDate));

    return res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/educations
 */
router.get("/educations", async (req, res, next) => {
  try {
    const eduList = await db
      .select()
      .from(educations)
      .orderBy(asc(educations.sortOrder), desc(educations.startDate));

    const certList = await db
      .select()
      .from(certifications)
      .orderBy(asc(certifications.sortOrder), desc(certifications.issueDate));

    return res.json({
      success: true,
      data: {
        educations: eduList,
        certifications: certList,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/blog
 */
router.get("/blog", async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 9));
    const offset = (page - 1) * limit;
    const categorySlug = req.query.category;
    const search = req.query.search?.trim();

    const rows = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        featuredImage: blogPosts.featuredImage,
        publishedAt: blogPosts.publishedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(blogPosts)
      .leftJoin(categories, eq(blogPosts.categoryId, categories.id))
      .where(
        and(
          eq(blogPosts.status, "published"),
          categorySlug && categorySlug !== "all" ? eq(categories.slug, categorySlug) : undefined,
          search ? like(blogPosts.title, `%${search}%`) : undefined
        )
      )
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit)
      .offset(offset);

    const countQuery = await db
      .select({ count: sql`count(*)` })
      .from(blogPosts)
      .leftJoin(categories, eq(blogPosts.categoryId, categories.id))
      .where(
        and(
          eq(blogPosts.status, "published"),
          categorySlug && categorySlug !== "all" ? eq(categories.slug, categorySlug) : undefined,
          search ? like(blogPosts.title, `%${search}%`) : undefined
        )
      );

    const total = Number(countQuery[0]?.count || 0);

    return res.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/blog/:slug
 */
router.get("/blog/:slug", async (req, res, next) => {
  try {
    const list = await db
      .select({
        post: blogPosts,
        category: categories,
      })
      .from(blogPosts)
      .leftJoin(categories, eq(blogPosts.categoryId, categories.id))
      .where(and(eq(blogPosts.slug, req.params.slug), eq(blogPosts.status, "published")))
      .limit(1);

    if (list.length === 0) {
      return res.status(404).json({ success: false, message: "Blog post not found or not published." });
    }

    const { post, category } = list[0];

    // Get tags
    const postTagRows = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
      })
      .from(postTags)
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(postTags.postId, post.id));

    return res.json({
      success: true,
      data: {
        ...post,
        category,
        tags: postTagRows,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/categories
 */
router.get("/categories", async (req, res, next) => {
  try {
    const type = req.query.type;
    const rows = await db
      .select()
      .from(categories)
      .where(type ? eq(categories.type, type) : undefined)
      .orderBy(asc(categories.name));

    return res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/tags
 */
router.get("/tags", async (req, res, next) => {
  try {
    const rows = await db.select().from(tags).orderBy(asc(tags.name));
    return res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/navigation
 */
router.get("/navigation", async (req, res, next) => {
  try {
    const rows = await db
      .select()
      .from(navigationItems)
      .where(eq(navigationItems.isActive, 1))
      .orderBy(asc(navigationItems.sortOrder));

    return res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/settings
 */
router.get("/settings", async (req, res, next) => {
  try {
    const rows = await db.select().from(siteSettings);
    const configMap = {};
    rows.forEach((s) => {
      configMap[s.key] = s.value;
    });

    return res.json({ success: true, data: configMap });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/contact
 */
router.post(
  "/contact",
  contactLimiter,
  validate({ body: contactSchema }),
  async (req, res, next) => {
    try {
      const { name, email, subject, message, honeypot } = req.body;

      // Honeypot spam bot trap
      if (honeypot && honeypot.trim().length > 0) {
        // Pretend success to silent bots
        return res.json({
          success: true,
          message: "Thank you for reaching out! Your inquiry has been received.",
        });
      }

      const ip = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
      const ipHash = crypto.createHash("sha256").update(String(ip)).digest("hex").slice(0, 16);
      const id = `msg_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
      const createdAt = new Date().toISOString();

      await db.insert(contactMessages).values({
        id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        isRead: 0,
        ipHash,
        createdAt,
      });

      return res.status(201).json({
        success: true,
        message: "Thank you! Your message has been sent successfully. I will get back to you soon.",
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
