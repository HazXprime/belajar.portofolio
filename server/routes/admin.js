import express from "express";
import crypto from "node:crypto";
import multer from "multer";
import { z } from "zod";
import { db } from "../db/index.js";
import {
  admins,
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
  mediaAssets,
  auditLogs,
} from "../db/schema.js";
import { eq, and, desc, asc, like, sql } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import { logAdminAction } from "../middleware/audit.js";
import { uploadMedia, deleteMedia } from "../services/cloudinary.js";

const router = express.Router();
router.use(requireAuth);

// Configure multer memory storage with file filter and size limit (max 5MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file format. Allowed: JPG, PNG, WEBP, GIF, SVG."));
    }
  },
});

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

/* ==========================================================================
   1. DASHBOARD OVERVIEW & METRICS
   ========================================================================== */
router.get("/dashboard", async (req, res, next) => {
  try {
    const [
      totalProjectsRes,
      draftProjectsRes,
      totalArticlesRes,
      draftArticlesRes,
      unreadMessagesRes,
      totalSkillsRes,
    ] = await Promise.all([
      db.select({ count: sql`count(*)` }).from(projects),
      db.select({ count: sql`count(*)` }).from(projects).where(eq(projects.status, "draft")),
      db.select({ count: sql`count(*)` }).from(blogPosts),
      db.select({ count: sql`count(*)` }).from(blogPosts).where(eq(blogPosts.status, "draft")),
      db.select({ count: sql`count(*)` }).from(contactMessages).where(eq(contactMessages.isRead, 0)),
      db.select({ count: sql`count(*)` }).from(skills),
    ]);

    const recentLogs = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(10);

    const recentMessages = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt))
      .limit(5);

    return res.json({
      success: true,
      stats: {
        totalProjects: Number(totalProjectsRes[0]?.count || 0),
        draftProjects: Number(draftProjectsRes[0]?.count || 0),
        totalArticles: Number(totalArticlesRes[0]?.count || 0),
        draftArticles: Number(draftArticlesRes[0]?.count || 0),
        unreadMessages: Number(unreadMessagesRes[0]?.count || 0),
        totalSkills: Number(totalSkillsRes[0]?.count || 0),
      },
      recentLogs,
      recentMessages,
    });
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   2. AUDIT LOGS
   ========================================================================== */
router.get("/audit-logs", async (req, res, next) => {
  try {
    const logs = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(100);

    return res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   3. PROFILE MANAGEMENT
   ========================================================================== */
router.get("/profile", async (req, res, next) => {
  try {
    const rows = await db.select().from(profiles).limit(1);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Profile not found." });
    }
    const prof = rows[0];
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

router.put("/profile", async (req, res, next) => {
  try {
    const payload = req.body;
    const now = new Date().toISOString();

    const existing = await db.select().from(profiles).limit(1);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Profile record does not exist." });
    }

    const current = existing[0];
    const updateData = {
      name: payload.name ?? current.name,
      title: payload.title ?? current.title,
      handle: payload.handle ?? current.handle,
      bioShort: payload.bioShort ?? current.bioShort,
      aboutLead: payload.aboutLead ?? current.aboutLead,
      aboutParagraphs: Array.isArray(payload.aboutParagraphs)
        ? JSON.stringify(payload.aboutParagraphs)
        : current.aboutParagraphs,
      highlights: Array.isArray(payload.highlights)
        ? JSON.stringify(payload.highlights)
        : current.highlights,
      avatarUrl: payload.avatarUrl ?? current.avatarUrl,
      location: payload.location ?? current.location,
      isAvailable: payload.isAvailable !== undefined ? (payload.isAvailable ? 1 : 0) : current.isAvailable,
      availabilityStatus: payload.availabilityStatus ?? current.availabilityStatus,
      contactEmail: payload.contactEmail ?? current.contactEmail,
      githubUrl: payload.githubUrl ?? current.githubUrl,
      linkedinUrl: payload.linkedinUrl ?? current.linkedinUrl,
      resumeUrl: payload.resumeUrl ?? current.resumeUrl,
      updatedAt: now,
    };

    await db.update(profiles).set(updateData).where(eq(profiles.id, current.id));

    await logAdminAction({
      adminId: req.admin.id,
      action: "update_profile",
      entityType: "profile",
      entityId: current.id,
      ipAddress: req.ip,
    });

    return res.json({ success: true, message: "Profile updated successfully." });
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   4. PROJECTS CRUD
   ========================================================================== */
router.get("/projects", async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search?.trim();

    const rows = await db
      .select({
        project: projects,
        category: categories,
      })
      .from(projects)
      .leftJoin(categories, eq(projects.categoryId, categories.id))
      .where(
        and(
          status && status !== "all" ? eq(projects.status, status) : undefined,
          search ? like(projects.title, `%${search}%`) : undefined
        )
      )
      .orderBy(asc(projects.sortOrder), desc(projects.updatedAt))
      .limit(limit)
      .offset(offset);

    const countQuery = await db
      .select({ count: sql`count(*)` })
      .from(projects)
      .where(
        and(
          status && status !== "all" ? eq(projects.status, status) : undefined,
          search ? like(projects.title, `%${search}%`) : undefined
        )
      );

    const total = Number(countQuery[0]?.count || 0);

    const parsed = rows.map(({ project, category }) => ({
      ...project,
      category,
      features: project.features ? JSON.parse(project.features) : [],
      techStack: project.techStack ? JSON.parse(project.techStack) : [],
    }));

    return res.json({
      success: true,
      data: parsed,
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

router.post("/projects", async (req, res, next) => {
  try {
    const b = req.body;
    if (!b.title || !b.summary || !b.description) {
      return res.status(400).json({ success: false, message: "Title, summary, and description are required." });
    }

    const id = `proj_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
    const slug = b.slug?.trim() ? slugify(b.slug) : slugify(b.title);
    const now = new Date().toISOString();

    // Check duplicate slug
    const duplicate = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
    if (duplicate.length > 0) {
      return res.status(400).json({ success: false, message: `Slug '${slug}' is already in use.` });
    }

    await db.insert(projects).values({
      id,
      title: b.title.trim(),
      slug,
      summary: b.summary.trim(),
      description: b.description.trim(),
      content: b.content || "",
      featured: b.featured ? 1 : 0,
      status: b.status === "published" ? "published" : "draft",
      repoUrl: b.repoUrl || null,
      liveUrl: b.liveUrl || null,
      thumbnailUrl: b.thumbnailUrl || null,
      features: Array.isArray(b.features) ? JSON.stringify(b.features) : JSON.stringify([]),
      techStack: Array.isArray(b.techStack) ? JSON.stringify(b.techStack) : JSON.stringify([]),
      sortOrder: parseInt(b.sortOrder) || 0,
      categoryId: b.categoryId || null,
      previewType: b.previewType || "dashboard",
      publishedAt: b.status === "published" ? now : null,
      createdAt: now,
      updatedAt: now,
    });

    // Gallery images
    if (Array.isArray(b.images) && b.images.length > 0) {
      for (let i = 0; i < b.images.length; i++) {
        const img = b.images[i];
        if (img.url) {
          await db.insert(projectImages).values({
            id: `pimg_${Date.now()}_${i}`,
            projectId: id,
            url: img.url,
            caption: img.caption || null,
            sortOrder: i,
            createdAt: now,
          });
        }
      }
    }

    await logAdminAction({
      adminId: req.admin.id,
      action: "create_project",
      entityType: "project",
      entityId: id,
      ipAddress: req.ip,
      details: { title: b.title, slug },
    });

    return res.status(201).json({ success: true, message: "Project created.", id, slug });
  } catch (err) {
    next(err);
  }
});

router.get("/projects/:id", async (req, res, next) => {
  try {
    const list = await db.select().from(projects).where(eq(projects.id, req.params.id)).limit(1);
    if (list.length === 0) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }
    const project = list[0];
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
        images,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.put("/projects/:id", async (req, res, next) => {
  try {
    const list = await db.select().from(projects).where(eq(projects.id, req.params.id)).limit(1);
    if (list.length === 0) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    const current = list[0];
    const b = req.body;
    const now = new Date().toISOString();

    let slug = current.slug;
    if (b.slug && b.slug.trim() !== current.slug) {
      slug = slugify(b.slug);
      const duplicate = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
      if (duplicate.length > 0 && duplicate[0].id !== current.id) {
        return res.status(400).json({ success: false, message: `Slug '${slug}' is already taken.` });
      }
    }

    await db
      .update(projects)
      .set({
        title: b.title ?? current.title,
        slug,
        summary: b.summary ?? current.summary,
        description: b.description ?? current.description,
        content: b.content ?? current.content,
        featured: b.featured !== undefined ? (b.featured ? 1 : 0) : current.featured,
        status: b.status ?? current.status,
        repoUrl: b.repoUrl !== undefined ? b.repoUrl : current.repoUrl,
        liveUrl: b.liveUrl !== undefined ? b.liveUrl : current.liveUrl,
        thumbnailUrl: b.thumbnailUrl !== undefined ? b.thumbnailUrl : current.thumbnailUrl,
        features: Array.isArray(b.features) ? JSON.stringify(b.features) : current.features,
        techStack: Array.isArray(b.techStack) ? JSON.stringify(b.techStack) : current.techStack,
        sortOrder: b.sortOrder !== undefined ? parseInt(b.sortOrder) : current.sortOrder,
        categoryId: b.categoryId !== undefined ? b.categoryId : current.categoryId,
        previewType: b.previewType ?? current.previewType,
        publishedAt: b.status === "published" && !current.publishedAt ? now : current.publishedAt,
        updatedAt: now,
      })
      .where(eq(projects.id, current.id));

    // Update gallery images if provided
    if (Array.isArray(b.images)) {
      await db.delete(projectImages).where(eq(projectImages.projectId, current.id));
      for (let i = 0; i < b.images.length; i++) {
        const img = b.images[i];
        if (img.url) {
          await db.insert(projectImages).values({
            id: `pimg_${Date.now()}_${i}`,
            projectId: current.id,
            url: img.url,
            caption: img.caption || null,
            sortOrder: i,
            createdAt: now,
          });
        }
      }
    }

    await logAdminAction({
      adminId: req.admin.id,
      action: "update_project",
      entityType: "project",
      entityId: current.id,
      ipAddress: req.ip,
      details: { title: b.title || current.title },
    });

    return res.json({ success: true, message: "Project updated." });
  } catch (err) {
    next(err);
  }
});

router.delete("/projects/:id", async (req, res, next) => {
  try {
    const list = await db.select().from(projects).where(eq(projects.id, req.params.id)).limit(1);
    if (list.length === 0) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    await db.delete(projects).where(eq(projects.id, req.params.id));

    await logAdminAction({
      adminId: req.admin.id,
      action: "delete_project",
      entityType: "project",
      entityId: req.params.id,
      ipAddress: req.ip,
    });

    return res.json({ success: true, message: "Project deleted." });
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   5. SKILLS CRUD
   ========================================================================== */
router.get("/skills", async (req, res, next) => {
  try {
    const rows = await db.select().from(skills).orderBy(asc(skills.sortOrder), asc(skills.name));
    return res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.post("/skills", async (req, res, next) => {
  try {
    const { name, category, proficiencyLevel, description, iconName, sortOrder, isFeatured } = req.body;
    if (!name || !category) {
      return res.status(400).json({ success: false, message: "Name and category required." });
    }

    const id = `sk_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
    const now = new Date().toISOString();

    await db.insert(skills).values({
      id,
      name: name.trim(),
      category: category.trim(),
      proficiencyLevel: proficiencyLevel || "established",
      description: description || null,
      iconName: iconName || null,
      sortOrder: parseInt(sortOrder) || 0,
      isFeatured: isFeatured ? 1 : 0,
      createdAt: now,
      updatedAt: now,
    });

    return res.status(201).json({ success: true, message: "Skill added.", id });
  } catch (err) {
    next(err);
  }
});

router.put("/skills/:id", async (req, res, next) => {
  try {
    const { name, category, proficiencyLevel, description, iconName, sortOrder, isFeatured } = req.body;
    const now = new Date().toISOString();

    await db
      .update(skills)
      .set({
        name,
        category,
        proficiencyLevel,
        description,
        iconName,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : undefined,
        isFeatured: isFeatured !== undefined ? (isFeatured ? 1 : 0) : undefined,
        updatedAt: now,
      })
      .where(eq(skills.id, req.params.id));

    return res.json({ success: true, message: "Skill updated." });
  } catch (err) {
    next(err);
  }
});

router.delete("/skills/:id", async (req, res, next) => {
  try {
    await db.delete(skills).where(eq(skills.id, req.params.id));
    return res.json({ success: true, message: "Skill deleted." });
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   6. EXPERIENCES CRUD
   ========================================================================== */
router.get("/experiences", async (req, res, next) => {
  try {
    const rows = await db.select().from(experiences).orderBy(asc(experiences.sortOrder), desc(experiences.startDate));
    return res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.post("/experiences", async (req, res, next) => {
  try {
    const b = req.body;
    if (!b.title || !b.company || !b.startDate || !b.description) {
      return res.status(400).json({ success: false, message: "Title, company, start date, and description required." });
    }

    const id = `exp_${Date.now()}`;
    const now = new Date().toISOString();

    await db.insert(experiences).values({
      id,
      title: b.title.trim(),
      company: b.company.trim(),
      location: b.location || null,
      employmentType: b.employmentType || "Full-time",
      startDate: b.startDate,
      endDate: b.isCurrent ? null : b.endDate,
      isCurrent: b.isCurrent ? 1 : 0,
      description: b.description.trim(),
      sortOrder: parseInt(b.sortOrder) || 0,
      createdAt: now,
      updatedAt: now,
    });

    return res.status(201).json({ success: true, message: "Experience added.", id });
  } catch (err) {
    next(err);
  }
});

router.put("/experiences/:id", async (req, res, next) => {
  try {
    const b = req.body;
    const now = new Date().toISOString();

    await db
      .update(experiences)
      .set({
        title: b.title,
        company: b.company,
        location: b.location,
        employmentType: b.employmentType,
        startDate: b.startDate,
        endDate: b.isCurrent ? null : b.endDate,
        isCurrent: b.isCurrent !== undefined ? (b.isCurrent ? 1 : 0) : undefined,
        description: b.description,
        sortOrder: b.sortOrder !== undefined ? parseInt(b.sortOrder) : undefined,
        updatedAt: now,
      })
      .where(eq(experiences.id, req.params.id));

    return res.json({ success: true, message: "Experience updated." });
  } catch (err) {
    next(err);
  }
});

router.delete("/experiences/:id", async (req, res, next) => {
  try {
    await db.delete(experiences).where(eq(experiences.id, req.params.id));
    return res.json({ success: true, message: "Experience deleted." });
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   7. EDUCATIONS & CERTIFICATIONS CRUD
   ========================================================================== */
router.get("/educations", async (req, res, next) => {
  try {
    const edus = await db.select().from(educations).orderBy(asc(educations.sortOrder));
    const certs = await db.select().from(certifications).orderBy(asc(certifications.sortOrder));
    return res.json({ success: true, educations: edus, certifications: certs });
  } catch (err) {
    next(err);
  }
});

router.post("/educations", async (req, res, next) => {
  try {
    const b = req.body;
    const id = `edu_${Date.now()}`;
    const now = new Date().toISOString();

    await db.insert(educations).values({
      id,
      degree: b.degree.trim(),
      institution: b.institution.trim(),
      fieldOfStudy: b.fieldOfStudy || null,
      startDate: b.startDate,
      endDate: b.isCurrent ? null : b.endDate,
      isCurrent: b.isCurrent ? 1 : 0,
      gradeOrHonors: b.gradeOrHonors || null,
      description: b.description || null,
      sortOrder: parseInt(b.sortOrder) || 0,
      createdAt: now,
      updatedAt: now,
    });

    return res.status(201).json({ success: true, message: "Education record added.", id });
  } catch (err) {
    next(err);
  }
});

router.put("/educations/:id", async (req, res, next) => {
  try {
    const b = req.body;
    const now = new Date().toISOString();

    await db
      .update(educations)
      .set({
        degree: b.degree,
        institution: b.institution,
        fieldOfStudy: b.fieldOfStudy,
        startDate: b.startDate,
        endDate: b.isCurrent ? null : b.endDate,
        isCurrent: b.isCurrent !== undefined ? (b.isCurrent ? 1 : 0) : undefined,
        gradeOrHonors: b.gradeOrHonors,
        description: b.description,
        sortOrder: b.sortOrder !== undefined ? parseInt(b.sortOrder) : undefined,
        updatedAt: now,
      })
      .where(eq(educations.id, req.params.id));

    return res.json({ success: true, message: "Education updated." });
  } catch (err) {
    next(err);
  }
});

router.delete("/educations/:id", async (req, res, next) => {
  try {
    await db.delete(educations).where(eq(educations.id, req.params.id));
    return res.json({ success: true, message: "Education deleted." });
  } catch (err) {
    next(err);
  }
});

router.post("/certifications", async (req, res, next) => {
  try {
    const b = req.body;
    const id = `cert_${Date.now()}`;
    const now = new Date().toISOString();

    await db.insert(certifications).values({
      id,
      name: b.name.trim(),
      issuingOrganization: b.issuingOrganization.trim(),
      issueDate: b.issueDate,
      expirationDate: b.expirationDate || null,
      credentialId: b.credentialId || null,
      credentialUrl: b.credentialUrl || null,
      sortOrder: parseInt(b.sortOrder) || 0,
      createdAt: now,
    });

    return res.status(201).json({ success: true, message: "Certification added.", id });
  } catch (err) {
    next(err);
  }
});

router.put("/certifications/:id", async (req, res, next) => {
  try {
    const b = req.body;
    await db
      .update(certifications)
      .set({
        name: b.name,
        issuingOrganization: b.issuingOrganization,
        issueDate: b.issueDate,
        expirationDate: b.expirationDate,
        credentialId: b.credentialId,
        credentialUrl: b.credentialUrl,
        sortOrder: b.sortOrder !== undefined ? parseInt(b.sortOrder) : undefined,
      })
      .where(eq(certifications.id, req.params.id));

    return res.json({ success: true, message: "Certification updated." });
  } catch (err) {
    next(err);
  }
});

router.delete("/certifications/:id", async (req, res, next) => {
  try {
    await db.delete(certifications).where(eq(certifications.id, req.params.id));
    return res.json({ success: true, message: "Certification deleted." });
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   8. BLOG POSTS CRUD
   ========================================================================== */
router.get("/blog", async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search?.trim();

    const rows = await db
      .select({
        post: blogPosts,
        category: categories,
      })
      .from(blogPosts)
      .leftJoin(categories, eq(blogPosts.categoryId, categories.id))
      .where(
        and(
          status && status !== "all" ? eq(blogPosts.status, status) : undefined,
          search ? like(blogPosts.title, `%${search}%`) : undefined
        )
      )
      .orderBy(desc(blogPosts.updatedAt))
      .limit(limit)
      .offset(offset);

    const countQuery = await db
      .select({ count: sql`count(*)` })
      .from(blogPosts)
      .where(
        and(
          status && status !== "all" ? eq(blogPosts.status, status) : undefined,
          search ? like(blogPosts.title, `%${search}%`) : undefined
        )
      );

    const total = Number(countQuery[0]?.count || 0);

    return res.json({
      success: true,
      data: rows.map(({ post, category }) => ({ ...post, category })),
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

router.post("/blog", async (req, res, next) => {
  try {
    const b = req.body;
    if (!b.title || !b.excerpt || !b.content) {
      return res.status(400).json({ success: false, message: "Title, excerpt, and content required." });
    }

    const id = `post_${Date.now()}`;
    const slug = b.slug?.trim() ? slugify(b.slug) : slugify(b.title);
    const now = new Date().toISOString();

    const duplicate = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    if (duplicate.length > 0) {
      return res.status(400).json({ success: false, message: `Slug '${slug}' is already in use.` });
    }

    await db.insert(blogPosts).values({
      id,
      title: b.title.trim(),
      slug,
      excerpt: b.excerpt.trim(),
      content: b.content,
      featuredImage: b.featuredImage || null,
      status: b.status === "published" ? "published" : "draft",
      categoryId: b.categoryId || null,
      seoTitle: b.seoTitle || null,
      seoDescription: b.seoDescription || null,
      publishedAt: b.status === "published" ? now : null,
      createdAt: now,
      updatedAt: now,
    });

    // Tag associations
    if (Array.isArray(b.tagIds)) {
      for (const tagId of b.tagIds) {
        await db.insert(postTags).values({
          id: `pt_${Date.now()}_${tagId}`,
          postId: id,
          tagId,
        });
      }
    }

    await logAdminAction({
      adminId: req.admin.id,
      action: "create_blog_post",
      entityType: "blog",
      entityId: id,
      ipAddress: req.ip,
      details: { title: b.title, slug },
    });

    return res.status(201).json({ success: true, message: "Post created.", id, slug });
  } catch (err) {
    next(err);
  }
});

router.get("/blog/:id", async (req, res, next) => {
  try {
    const list = await db.select().from(blogPosts).where(eq(blogPosts.id, req.params.id)).limit(1);
    if (list.length === 0) {
      return res.status(404).json({ success: false, message: "Blog post not found." });
    }

    const post = list[0];
    const tagsAssigned = await db
      .select({ id: tags.id, name: tags.name, slug: tags.slug })
      .from(postTags)
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(postTags.postId, post.id));

    return res.json({
      success: true,
      data: {
        ...post,
        tags: tagsAssigned,
        tagIds: tagsAssigned.map((t) => t.id),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.put("/blog/:id", async (req, res, next) => {
  try {
    const list = await db.select().from(blogPosts).where(eq(blogPosts.id, req.params.id)).limit(1);
    if (list.length === 0) {
      return res.status(404).json({ success: false, message: "Blog post not found." });
    }

    const current = list[0];
    const b = req.body;
    const now = new Date().toISOString();

    let slug = current.slug;
    if (b.slug && b.slug.trim() !== current.slug) {
      slug = slugify(b.slug);
      const duplicate = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
      if (duplicate.length > 0 && duplicate[0].id !== current.id) {
        return res.status(400).json({ success: false, message: `Slug '${slug}' is already taken.` });
      }
    }

    await db
      .update(blogPosts)
      .set({
        title: b.title ?? current.title,
        slug,
        excerpt: b.excerpt ?? current.excerpt,
        content: b.content ?? current.content,
        featuredImage: b.featuredImage !== undefined ? b.featuredImage : current.featuredImage,
        status: b.status ?? current.status,
        categoryId: b.categoryId !== undefined ? b.categoryId : current.categoryId,
        seoTitle: b.seoTitle !== undefined ? b.seoTitle : current.seoTitle,
        seoDescription: b.seoDescription !== undefined ? b.seoDescription : current.seoDescription,
        publishedAt: b.status === "published" && !current.publishedAt ? now : current.publishedAt,
        updatedAt: now,
      })
      .where(eq(blogPosts.id, current.id));

    // Update tags
    if (Array.isArray(b.tagIds)) {
      await db.delete(postTags).where(eq(postTags.postId, current.id));
      for (const tagId of b.tagIds) {
        await db.insert(postTags).values({
          id: `pt_${Date.now()}_${tagId}`,
          postId: current.id,
          tagId,
        });
      }
    }

    await logAdminAction({
      adminId: req.admin.id,
      action: "update_blog_post",
      entityType: "blog",
      entityId: current.id,
      ipAddress: req.ip,
      details: { title: b.title || current.title },
    });

    return res.json({ success: true, message: "Post updated." });
  } catch (err) {
    next(err);
  }
});

router.delete("/blog/:id", async (req, res, next) => {
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, req.params.id));
    await logAdminAction({
      adminId: req.admin.id,
      action: "delete_blog_post",
      entityType: "blog",
      entityId: req.params.id,
      ipAddress: req.ip,
    });
    return res.json({ success: true, message: "Post deleted." });
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   9. CATEGORIES & TAGS CRUD
   ========================================================================== */
router.get("/categories", async (req, res, next) => {
  try {
    const rows = await db.select().from(categories).orderBy(asc(categories.name));
    return res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.post("/categories", async (req, res, next) => {
  try {
    const { name, slug, description, type } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name required." });

    const finalSlug = slug?.trim() ? slugify(slug) : slugify(name);
    const duplicate = await db.select().from(categories).where(eq(categories.slug, finalSlug)).limit(1);
    if (duplicate.length > 0) {
      return res.status(400).json({ success: false, message: `Slug '${finalSlug}' is already in use.` });
    }

    const id = `cat_${Date.now()}`;

    await db.insert(categories).values({
      id,
      name: name.trim(),
      slug: finalSlug,
      description: description || null,
      type: type || "project",
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ success: true, message: "Category added.", id, data: { id, name, slug: finalSlug } });
  } catch (err) {
    next(err);
  }
});

router.put("/categories/:id", async (req, res, next) => {
  try {
    const { name, slug, description, type } = req.body;
    const finalSlug = slug?.trim() ? slugify(slug) : slugify(name);

    await db
      .update(categories)
      .set({
        name,
        slug: finalSlug,
        description,
        type,
      })
      .where(eq(categories.id, req.params.id));

    return res.json({ success: true, message: "Category updated." });
  } catch (err) {
    next(err);
  }
});

router.delete("/categories/:id", async (req, res, next) => {
  try {
    await db.delete(categories).where(eq(categories.id, req.params.id));
    return res.json({ success: true, message: "Category deleted." });
  } catch (err) {
    next(err);
  }
});

router.get("/tags", async (req, res, next) => {
  try {
    const rows = await db.select().from(tags).orderBy(asc(tags.name));
    return res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.post("/tags", async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Tag name required." });

    const slug = slugify(name);
    const id = `tag_${Date.now()}`;

    await db.insert(tags).values({
      id,
      name: name.trim(),
      slug,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ success: true, message: "Tag created.", id });
  } catch (err) {
    next(err);
  }
});

router.delete("/tags/:id", async (req, res, next) => {
  try {
    await db.delete(tags).where(eq(tags.id, req.params.id));
    return res.json({ success: true, message: "Tag deleted." });
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   10. CONTACT MESSAGES (INBOX)
   ========================================================================== */
router.get("/messages", async (req, res, next) => {
  try {
    const rows = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
    return res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.patch("/messages/:id/read", async (req, res, next) => {
  try {
    const { isRead } = req.body;
    await db
      .update(contactMessages)
      .set({ isRead: isRead ? 1 : 0 })
      .where(eq(contactMessages.id, req.params.id));

    return res.json({ success: true, message: "Message status updated." });
  } catch (err) {
    next(err);
  }
});

router.delete("/messages/:id", async (req, res, next) => {
  try {
    await db.delete(contactMessages).where(eq(contactMessages.id, req.params.id));
    return res.json({ success: true, message: "Message deleted." });
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   11. NAVIGATION ITEMS
   ========================================================================== */
router.get("/navigation", async (req, res, next) => {
  try {
    const rows = await db.select().from(navigationItems).orderBy(asc(navigationItems.sortOrder));
    return res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.post("/navigation", async (req, res, next) => {
  try {
    const { label, path, sortOrder, isExternal, isActive } = req.body;
    const id = `nav_${Date.now()}`;

    await db.insert(navigationItems).values({
      id,
      label: label.trim(),
      path: path.trim(),
      sortOrder: parseInt(sortOrder) || 0,
      isExternal: isExternal ? 1 : 0,
      isActive: isActive !== undefined ? (isActive ? 1 : 0) : 1,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ success: true, message: "Navigation item added.", id });
  } catch (err) {
    next(err);
  }
});

router.put("/navigation/:id", async (req, res, next) => {
  try {
    const { label, path, sortOrder, isExternal, isActive } = req.body;
    await db
      .update(navigationItems)
      .set({
        label,
        path,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : undefined,
        isExternal: isExternal !== undefined ? (isExternal ? 1 : 0) : undefined,
        isActive: isActive !== undefined ? (isActive ? 1 : 0) : undefined,
      })
      .where(eq(navigationItems.id, req.params.id));

    return res.json({ success: true, message: "Navigation updated." });
  } catch (err) {
    next(err);
  }
});

router.delete("/navigation/:id", async (req, res, next) => {
  try {
    await db.delete(navigationItems).where(eq(navigationItems.id, req.params.id));
    return res.json({ success: true, message: "Navigation item deleted." });
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   12. SITE SETTINGS
   ========================================================================== */
router.get("/settings", async (req, res, next) => {
  try {
    const rows = await db.select().from(siteSettings);
    const map = {};
    rows.forEach((r) => {
      map[r.key] = r.value;
    });
    return res.json({ success: true, data: map, list: rows });
  } catch (err) {
    next(err);
  }
});

router.put("/settings", async (req, res, next) => {
  try {
    const settingsObj = req.body; // e.g. { site_name: "...", contact_email: "..." }
    const now = new Date().toISOString();

    for (const [key, value] of Object.entries(settingsObj)) {
      const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
      if (existing.length > 0) {
        await db
          .update(siteSettings)
          .set({ value: String(value), updatedAt: now })
          .where(eq(siteSettings.key, key));
      } else {
        await db.insert(siteSettings).values({
          id: `set_${Date.now()}_${key}`,
          key,
          value: String(value),
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    await logAdminAction({
      adminId: req.admin.id,
      action: "update_settings",
      entityType: "settings",
      ipAddress: req.ip,
    });

    return res.json({ success: true, message: "Settings updated successfully." });
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   13. MEDIA MANAGEMENT & CLOUDINARY UPLOADS
   ========================================================================== */
router.get("/media", async (req, res, next) => {
  try {
    const rows = await db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt));
    return res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.post("/media/upload", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "File upload is required." });
    }

    const folder = req.body.folder || "portfolio/media";
    const altText = req.body.altText || req.file.originalname;

    const uploaded = await uploadMedia(req.file.buffer, folder, req.file.originalname, req.file.mimetype);

    const id = `asset_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
    const now = new Date().toISOString();

    await db.insert(mediaAssets).values({
      id,
      publicId: uploaded.publicId,
      url: uploaded.url,
      secureUrl: uploaded.secureUrl,
      format: uploaded.format,
      bytes: uploaded.bytes,
      width: uploaded.width || null,
      height: uploaded.height || null,
      folder: uploaded.folder,
      altText,
      createdAt: now,
    });

    await logAdminAction({
      adminId: req.admin.id,
      action: "upload_media",
      entityType: "media",
      entityId: id,
      ipAddress: req.ip,
      details: { publicId: uploaded.publicId },
    });

    return res.status(201).json({
      success: true,
      message: "Media uploaded successfully.",
      data: {
        id,
        publicId: uploaded.publicId,
        url: uploaded.secureUrl,
        format: uploaded.format,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/media/:id", async (req, res, next) => {
  try {
    const list = await db.select().from(mediaAssets).where(eq(mediaAssets.id, req.params.id)).limit(1);
    if (list.length === 0) {
      return res.status(404).json({ success: false, message: "Media asset not found." });
    }

    const asset = list[0];

    // Check if asset is referenced in project_images or projects
    const [projectThumbUse, projectImgUse, blogThumbUse] = await Promise.all([
      db.select({ id: projects.id }).from(projects).where(eq(projects.thumbnailUrl, asset.secureUrl)).limit(1),
      db.select({ id: projectImages.id }).from(projectImages).where(eq(projectImages.url, asset.secureUrl)).limit(1),
      db.select({ id: blogPosts.id }).from(blogPosts).where(eq(blogPosts.featuredImage, asset.secureUrl)).limit(1),
    ]);

    if (projectThumbUse.length > 0 || projectImgUse.length > 0 || blogThumbUse.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Conflict",
        message: "Cannot delete media asset because it is currently used by a project or blog post.",
      });
    }

    // Delete from Cloudinary
    await deleteMedia(asset.publicId);

    // Delete from DB
    await db.delete(mediaAssets).where(eq(mediaAssets.id, asset.id));

    await logAdminAction({
      adminId: req.admin.id,
      action: "delete_media",
      entityType: "media",
      entityId: asset.id,
      ipAddress: req.ip,
      details: { publicId: asset.publicId },
    });

    return res.json({ success: true, message: "Media asset deleted." });
  } catch (err) {
    next(err);
  }
});

export default router;
