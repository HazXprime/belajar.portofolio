import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// 1. Admins
export const admins = sqliteTable("admins", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// 2. Admin Sessions
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  adminId: text("admin_id").notNull().references(() => admins.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: integer("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: text("created_at").notNull(),
});

// 3. Developer Profile
export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  handle: text("handle").notNull(),
  bioShort: text("bio_short").notNull(),
  aboutLead: text("about_lead"),
  aboutParagraphs: text("about_paragraphs"), // JSON string array
  highlights: text("highlights"), // JSON string array of {label, value}
  avatarUrl: text("avatar_url"),
  location: text("location"),
  isAvailable: integer("is_available").notNull().default(1),
  availabilityStatus: text("availability_status"),
  contactEmail: text("contact_email"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  resumeUrl: text("resume_url"),
  updatedAt: text("updated_at").notNull(),
});

// 4. Categories
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  type: text("type").notNull().default("project"), // 'project' | 'blog'
  createdAt: text("created_at").notNull(),
});

// 5. Tags
export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: text("created_at").notNull(),
});

// 6. Projects
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  content: text("content"), // Rich text or Markdown
  featured: integer("featured").notNull().default(0), // 0 or 1
  status: text("status").notNull().default("draft"), // 'draft' | 'published'
  repoUrl: text("repo_url"),
  liveUrl: text("live_url"),
  thumbnailUrl: text("thumbnail_url"),
  features: text("features"), // JSON array of string highlights
  techStack: text("tech_stack"), // JSON array of string names
  sortOrder: integer("sort_order").notNull().default(0),
  categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
  previewType: text("preview_type").default("dashboard"),
  publishedAt: text("published_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// 7. Project Gallery Images
export const projectImages = sqliteTable("project_images", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  mediaAssetId: text("media_asset_id"),
  url: text("url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

// 8. Skills
export const skills = sqliteTable("skills", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // frontend, backend, databases, tools, deployment
  proficiencyLevel: text("proficiency_level"), // established, learning
  description: text("description"),
  iconName: text("icon_name"),
  sortOrder: integer("sort_order").notNull().default(0),
  isFeatured: integer("is_featured").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// 8b. Project Skills (Junction)
export const projectSkills = sqliteTable("project_skills", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  skillId: text("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
});

// 9. Experiences
export const experiences = sqliteTable("experiences", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  employmentType: text("employment_type"), // Full-time, Contract, Internship, Freelance
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  isCurrent: integer("is_current").notNull().default(0),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// 10. Educations
export const educations = sqliteTable("educations", {
  id: text("id").primaryKey(),
  degree: text("degree").notNull(),
  institution: text("institution").notNull(),
  fieldOfStudy: text("field_of_study"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  isCurrent: integer("is_current").notNull().default(0),
  gradeOrHonors: text("grade_or_honors"),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// 11. Certifications
export const certifications = sqliteTable("certifications", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  issuingOrganization: text("issuing_organization").notNull(),
  issueDate: text("issue_date").notNull(),
  expirationDate: text("expiration_date"),
  credentialId: text("credential_id"),
  credentialUrl: text("credential_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

// 12. Blog Posts
export const blogPosts = sqliteTable("blog_posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  status: text("status").notNull().default("draft"), // 'draft' | 'published'
  categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  publishedAt: text("published_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// 13. Blog Post Tags (Junction)
export const postTags = sqliteTable("post_tags", {
  id: text("id").primaryKey(),
  postId: text("post_id").notNull().references(() => blogPosts.id, { onDelete: "cascade" }),
  tagId: text("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
});

// 14. Contact Messages
export const contactMessages = sqliteTable("contact_messages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: integer("is_read").notNull().default(0),
  ipHash: text("ip_hash"),
  createdAt: text("created_at").notNull(),
});

// 15. Site Settings
export const siteSettings = sqliteTable("site_settings", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// 16. Navigation Items
export const navigationItems = sqliteTable("navigation_items", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  path: text("path").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isExternal: integer("is_external").notNull().default(0),
  isActive: integer("is_active").notNull().default(1),
  createdAt: text("created_at").notNull(),
});

// 17. Media Assets (Cloudinary)
export const mediaAssets = sqliteTable("media_assets", {
  id: text("id").primaryKey(),
  publicId: text("public_id").notNull().unique(),
  url: text("url").notNull(),
  secureUrl: text("secure_url").notNull(),
  format: text("format"),
  bytes: integer("bytes"),
  width: integer("width"),
  height: integer("height"),
  folder: text("folder"),
  altText: text("alt_text"),
  createdAt: text("created_at").notNull(),
});

// 18. Audit Logs
export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  adminId: text("admin_id"),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  ipAddress: text("ip_address"),
  details: text("details"), // JSON string
  createdAt: text("created_at").notNull(),
});
