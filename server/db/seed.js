import { db, client, ensureDatabaseTables } from "./index.js";
import {
  admins,
  profiles,
  categories,
  tags,
  projects,
  skills,
  experiences,
  educations,
  certifications,
  blogPosts,
  postTags,
  siteSettings,
  navigationItems,
} from "./schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export async function seedDatabase() {
  console.log("-> Ensuring database tables...");
  await ensureDatabaseTables();

  const now = new Date().toISOString();

  // 1. Profile Seed
  const existingProfiles = await db.select().from(profiles).limit(1);
  if (existingProfiles.length === 0) {
    console.log("-> Seeding default profile...");
    await db.insert(profiles).values({
      id: "profile-main",
      name: "Sunaryo Adi Putra",
      title: "Full-Stack Developer",
      handle: "Adiputra.dev",
      bioShort: "Building reliable, accessible, and performant web experiences from database queries to interactive interfaces.",
      aboutLead: "I am an early-career Full-Stack Developer with a disciplined engineering mindset and a commitment to clean, well-tested code.",
      aboutParagraphs: JSON.stringify([
        "My journey started with building interactive frontends and quickly grew into understanding the full web lifecycle—from relational schema design and RESTful APIs to client-side state management and responsive styling.",
        "Rather than chasing every fleeting trend, I prioritize foundational computer science concepts: data flow clarity, semantic accessibility, predictable asynchronous handling, and defense-in-depth web security.",
        "Currently, I am strengthening my full-stack capabilities by engineering end-to-end full-stack applications, deepening my understanding of database indexing, and adopting strict automated testing workflows."
      ]),
      highlights: JSON.stringify([
        { label: "Focus", value: "Modern React & Node.js ecosystem" },
        { label: "Approach", value: "Maintainable, accessible, security-conscious" },
        { label: "Learning", value: "Docker workflows & Microservices patterns" },
        { label: "Availability", value: "Full-time & Contract roles" }
      ]),
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      location: "Cilacap, Indonesia / Remote",
      isAvailable: 1,
      availabilityStatus: "Open to Junior Full-Stack & Frontend Opportunities",
      contactEmail: process.env.VITE_CONTACT_EMAIL || "adiputrayy1927@gmail.com",
      githubUrl: "https://github.com/placeholder-dev",
      linkedinUrl: "https://linkedin.com/in/placeholder-dev",
      resumeUrl: "",
      updatedAt: now,
    });
  }

  // 2. Categories
  console.log("-> Seeding categories...");
  const defaultCategories = [
    { id: "cat-fs", name: "Full-Stack", slug: "full-stack", type: "project", description: "End-to-end full stack web applications" },
    { id: "cat-fe", name: "Frontend", slug: "frontend", type: "project", description: "Interactive user interfaces and client applications" },
    { id: "cat-sec", name: "Security & Tools", slug: "security-tools", type: "project", description: "Developer tools and web security utilities" },
    { id: "cat-be", name: "Backend", slug: "backend", type: "project", description: "APIs, microservices, and database systems" },
    { id: "cat-blog-eng", name: "Engineering & Architecture", slug: "engineering-architecture", type: "blog", description: "System design and software engineering principles" },
    { id: "cat-blog-sec", name: "Web Security", slug: "web-security", type: "blog", description: "OWASP guidelines, authentication, and secure coding" },
  ];

  for (const cat of defaultCategories) {
    const existing = await db.select().from(categories).where(eq(categories.slug, cat.slug)).limit(1);
    if (existing.length === 0) {
      await db.insert(categories).values({ ...cat, createdAt: now });
    }
  }

  // 3. Tags
  console.log("-> Seeding tags...");
  const defaultTags = [
    { id: "tag-react", name: "React", slug: "react" },
    { id: "tag-nodejs", name: "Node.js", slug: "nodejs" },
    { id: "tag-typescript", name: "TypeScript", slug: "typescript" },
    { id: "tag-security", name: "Security", slug: "security" },
    { id: "tag-database", name: "Database", slug: "database" },
    { id: "tag-turso", name: "Turso", slug: "turso" },
    { id: "tag-tailwind", name: "Tailwind CSS", slug: "tailwind-css" },
  ];

  for (const t of defaultTags) {
    const existing = await db.select().from(tags).where(eq(tags.slug, t.slug)).limit(1);
    if (existing.length === 0) {
      await db.insert(tags).values({ ...t, createdAt: now });
    }
  }

  // 4. Projects
  console.log("-> Seeding projects...");
  const sampleProjects = [
    {
      id: "proj-devpulse",
      title: "DevPulse API Health Monitor",
      slug: "devpulse-api-health-monitor",
      summary: "A centralized dashboard for tracking external API health, uptime response times, and incident notifications with automated email alerts.",
      description: "DevPulse monitors microservices and API endpoints with configurable ping intervals, calculating uptime percentages, p95 response latencies, and triggering automated incident notifications.",
      content: "### Architectural Highlights\n- Built on an asynchronous event loop that schedules health check pings without blocking UI threads.\n- Utilizes relational time-series indexing to render 24-hour latency percentiles smoothly.\n- Strict rate-limiting on webhook receiver endpoints to prevent denial-of-service abuse.\n- End-to-end security with HttpOnly cookies and role-based access control.",
      featured: 1,
      status: "published",
      repoUrl: "https://github.com/placeholder-dev/devpulse-api-monitor",
      liveUrl: "https://devpulse-demo.example.com",
      thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      features: JSON.stringify([
        "Scheduled health checks with configurable ping intervals",
        "Real-time latency metrics visualized via clean SVG charts",
        "Webhook alerts for server downtime or degraded latency",
        "Role-based mock authentication with JWT in secure cookies"
      ]),
      techStack: JSON.stringify(["React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"]),
      sortOrder: 1,
      categoryId: "cat-fs",
      previewType: "dashboard",
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "proj-taskflow",
      title: "TaskFlow Collaborative Kanban",
      slug: "taskflow-collaborative-kanban",
      summary: "An intuitive task management board with drag-and-drop mechanics, offline persistence via IndexedDB, and filterable priority tags.",
      description: "TaskFlow empowers development teams to organize sprints effortlessly with smooth drag-and-drop column workflows, subtask checklists, and offline-first data synchronization.",
      content: "### Architectural Highlights\n- Local-first architecture persisting state to IndexedDB with automatic background sync when reconnected.\n- Keyboard accessible navigation conforming to WCAG 2.1 AA drag-and-drop standards.\n- Zero layout shift during rapid card movement and column reorganizations.",
      featured: 1,
      status: "published",
      repoUrl: "https://github.com/placeholder-dev/taskflow-kanban",
      liveUrl: "https://taskflow-demo.example.com",
      thumbnailUrl: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=800&q=80",
      features: JSON.stringify([
        "Responsive drag-and-drop column workflow with keyboard accessibility",
        "Local-first state architecture using browser storage with export/import",
        "Subtask checklists with real-time completion progress tracking",
        "Dark tech aesthetic with smooth visual feedback and focus indicators"
      ]),
      techStack: JSON.stringify(["React 18", "Tailwind CSS", "Lucide React", "Vite", "IndexedDB"]),
      sortOrder: 2,
      categoryId: "cat-fe",
      previewType: "kanban",
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "proj-secureshare",
      title: "SecureShare Ephemeral Notes",
      slug: "secureshare-ephemeral-notes",
      summary: "A privacy-focused self-destructing text sharing utility that encrypts payloads in-browser before submission and wipes records after reading.",
      description: "SecureShare implements zero-knowledge encrypted messaging. All client notes are encrypted with 256-bit AES-GCM before ever leaving the browser, ensuring the server cannot read any message contents.",
      content: "### Architectural Highlights\n- Client-side cryptographic key generation using the native browser Web Crypto API.\n- Cryptographic hash storage prevents dictionary matching on ephemeral link identifiers.\n- Enforced single-read purge with transactional record deletion.",
      featured: 1,
      status: "published",
      repoUrl: "https://github.com/placeholder-dev/secureshare-vault",
      liveUrl: "https://secureshare-demo.example.com",
      thumbnailUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
      features: JSON.stringify([
        "Client-side AES-GCM 256-bit payload encryption using Web Crypto API",
        "Single-view expiration with automatic server-side purge",
        "Rate-limited endpoints to prevent automated scraping",
        "Zero persistent logging of unencrypted user data"
      ]),
      techStack: JSON.stringify(["React", "Web Crypto API", "Node.js", "Redis", "Tailwind CSS"]),
      sortOrder: 3,
      categoryId: "cat-sec",
      previewType: "security",
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "proj-gitpulse",
      title: "GitPulse Profile Insight",
      slug: "gitpulse-profile-insight",
      summary: "A technical dashboard querying the public GitHub REST API to summarize commit frequency, primary languages, and repository activity trends.",
      description: "A fast analytical dashboard visualizing developer activity, repository stars, language breakdowns, and commit cadence with client-side caching and graceful rate limit management.",
      content: "### Architectural Highlights\n- Client-side cache headers with exponential backoff on GitHub API rate limits.\n- Strict URL sanitization and input validation preventing script injection.\n- Instant skeleton loading states.",
      featured: 1,
      status: "published",
      repoUrl: "https://github.com/placeholder-dev/gitpulse-profile-insight",
      liveUrl: "https://gitpulse-demo.example.com",
      thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      features: JSON.stringify([
        "Safe URL validation and error boundaries for external rate limits",
        "Language distribution metrics and repository stars breakdown",
        "Interactive filtering by star count, license, and last push date",
        "Skeleton loading states and zero layout shift on data load"
      ]),
      techStack: JSON.stringify(["React", "GitHub REST API", "Tailwind CSS", "Vite"]),
      sortOrder: 4,
      categoryId: "cat-fe",
      previewType: "analytics",
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    }
  ];

  for (const p of sampleProjects) {
    const existing = await db.select().from(projects).where(eq(projects.slug, p.slug)).limit(1);
    if (existing.length === 0) {
      await db.insert(projects).values(p);
    }
  }

  // 5. Skills
  console.log("-> Seeding skills...");
  const rawSkills = [
    // Frontend
    { id: "sk-react", name: "React.js", category: "frontend", proficiencyLevel: "established", description: "Hooks, functional components, state management", iconName: "Atom", sortOrder: 1, isFeatured: 1 },
    { id: "sk-js", name: "JavaScript (ES6+)", category: "frontend", proficiencyLevel: "established", description: "Async/await, closures, array methods, DOM APIs", iconName: "Code2", sortOrder: 2, isFeatured: 1 },
    { id: "sk-ts", name: "TypeScript", category: "frontend", proficiencyLevel: "learning", description: "Interfaces, generics, type guards in React", iconName: "FileCode", sortOrder: 3, isFeatured: 1 },
    { id: "sk-html", name: "HTML5 & Semantic Web", category: "frontend", proficiencyLevel: "established", description: "Accessible markup, ARIA roles, modern forms", iconName: "Layout", sortOrder: 4, isFeatured: 0 },
    { id: "sk-tailwind", name: "CSS3 & Tailwind CSS", category: "frontend", proficiencyLevel: "established", description: "Flexbox, CSS Grid, custom design systems", iconName: "Palette", sortOrder: 5, isFeatured: 1 },
    { id: "sk-vite", name: "Vite", category: "frontend", proficiencyLevel: "established", description: "Fast HMR, module bundling, modern build tooling", iconName: "Zap", sortOrder: 6, isFeatured: 0 },
    // Backend
    { id: "sk-node", name: "Node.js", category: "backend", proficiencyLevel: "established", description: "Event loop, streams, module system, NPM", iconName: "Server", sortOrder: 7, isFeatured: 1 },
    { id: "sk-express", name: "Express.js", category: "backend", proficiencyLevel: "established", description: "Middleware chains, route modularization, error handlers", iconName: "Cpu", sortOrder: 8, isFeatured: 1 },
    { id: "sk-rest", name: "RESTful API Design", category: "backend", proficiencyLevel: "established", description: "HTTP verbs, status codes, JSON payload design", iconName: "Network", sortOrder: 9, isFeatured: 1 },
    { id: "sk-auth", name: "Authentication Security", category: "backend", proficiencyLevel: "established", description: "Sessions, secure HTTP-only cookies, bcrypt hashing", iconName: "ShieldCheck", sortOrder: 10, isFeatured: 1 },
    { id: "sk-val", name: "Input Validation (Zod)", category: "backend", proficiencyLevel: "established", description: "Schema-based sanitization and data validation", iconName: "CheckCircle", sortOrder: 11, isFeatured: 0 },
    // Databases
    { id: "sk-turso", name: "Turso / libSQL", category: "databases", proficiencyLevel: "established", description: "Edge-replicated SQLite, remote branching, fast reads", iconName: "Database", sortOrder: 12, isFeatured: 1 },
    { id: "sk-drizzle", name: "Drizzle ORM", category: "databases", proficiencyLevel: "established", description: "Type-safe database queries and automated migrations", iconName: "Layers", sortOrder: 13, isFeatured: 1 },
    { id: "sk-postgres", name: "PostgreSQL", category: "databases", proficiencyLevel: "established", description: "Schema design, joins, foreign keys, indexing basics", iconName: "Database", sortOrder: 14, isFeatured: 0 },
    // Deployment & Tools
    { id: "sk-vercel", name: "Vercel", category: "deployment", proficiencyLevel: "established", description: "Automated Git CI/CD, preview deployments, serverless", iconName: "Cloud", sortOrder: 15, isFeatured: 1 },
    { id: "sk-cloudinary", name: "Cloudinary", category: "deployment", proficiencyLevel: "established", description: "Optimized image transformations and authenticated asset storage", iconName: "Image", sortOrder: 16, isFeatured: 1 },
    { id: "sk-git", name: "Git & GitHub", category: "tools", proficiencyLevel: "established", description: "Feature branching, pull requests, merge conflict resolution", iconName: "GitBranch", sortOrder: 17, isFeatured: 0 },
  ];

  for (const sk of rawSkills) {
    const existing = await db.select().from(skills).where(eq(skills.id, sk.id)).limit(1);
    if (existing.length === 0) {
      await db.insert(skills).values({ ...sk, createdAt: now, updatedAt: now });
    }
  }

  // 6. Experiences
  console.log("-> Seeding experiences...");
  const sampleExp = [
    {
      id: "exp-1",
      title: "Full-Stack Developer (Independent / Freelance)",
      company: "Self-Employed",
      location: "Cilacap, Indonesia",
      employmentType: "Freelance",
      startDate: "2024-01",
      endDate: null,
      isCurrent: 1,
      description: "Designing and developing production-ready web applications with React, Node.js, and relational databases. Implementing secure authentication flows, automated content management systems, and performant REST APIs.",
      sortOrder: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "exp-2",
      title: "Junior Web Developer Trainee",
      company: "Tech Academy Mentorship",
      location: "Remote",
      employmentType: "Apprenticeship",
      startDate: "2023-06",
      endDate: "2023-12",
      isCurrent: 0,
      description: "Engaged in hands-on pair programming, code reviews, and full-stack software development projects. Mastered clean architecture, testing strategies, and modern CI/CD deployment workflows.",
      sortOrder: 2,
      createdAt: now,
      updatedAt: now,
    }
  ];

  for (const exp of sampleExp) {
    const existing = await db.select().from(experiences).where(eq(experiences.id, exp.id)).limit(1);
    if (existing.length === 0) {
      await db.insert(experiences).values(exp);
    }
  }

  // 7. Educations & Certifications
  console.log("-> Seeding education & certifications...");
  const sampleEdu = [
    {
      id: "edu-1",
      degree: "Bachelor of Computer Science / Informatics",
      institution: "State University",
      fieldOfStudy: "Software Engineering & Systems",
      startDate: "2020-09",
      endDate: "2024-08",
      isCurrent: 0,
      gradeOrHonors: "GPA 3.8 / 4.0",
      description: "Core coursework: Data Structures & Algorithms, Database Systems, Web Architectures, Software Security, Distributed Systems.",
      sortOrder: 1,
      createdAt: now,
      updatedAt: now,
    }
  ];

  for (const edu of sampleEdu) {
    const existing = await db.select().from(educations).where(eq(educations.id, edu.id)).limit(1);
    if (existing.length === 0) {
      await db.insert(educations).values(edu);
    }
  }

  const sampleCert = [
    {
      id: "cert-1",
      name: "Full-Stack Web Development Professional",
      issuingOrganization: "Meta & Coursera",
      issueDate: "2024-05",
      expirationDate: null,
      credentialId: "META-FS-98421",
      credentialUrl: "https://coursera.org/verify/credential-meta-placeholder",
      sortOrder: 1,
      createdAt: now,
    },
    {
      id: "cert-2",
      name: "Web Application Security & OWASP Top 10",
      issuingOrganization: "Certified Security Institute",
      issueDate: "2024-07",
      expirationDate: null,
      credentialId: "SEC-OWASP-4412",
      credentialUrl: "https://example.com/certs/security-placeholder",
      sortOrder: 2,
      createdAt: now,
    }
  ];

  for (const cert of sampleCert) {
    const existing = await db.select().from(certifications).where(eq(certifications.id, cert.id)).limit(1);
    if (existing.length === 0) {
      await db.insert(certifications).values(cert);
    }
  }

  // 8. Blog Posts
  console.log("-> Seeding blog posts...");
  const samplePost = {
    id: "post-1",
    title: "Building Secure, Serverless-Ready CMS Backends with Turso and Drizzle ORM",
    slug: "building-secure-cms-backends-turso-drizzle",
    excerpt: "A deep dive into setting up edge-compatible SQLite databases with libSQL, type-safe query generation using Drizzle ORM, and HttpOnly session cookies.",
    content: `## Why Relational SQLite at the Edge?

Modern serverless platforms like Vercel execute code in stateless compute instances across worldwide regions. Traditional connection-heavy database engines require connection pooling proxies to avoid socket exhaustion.

**Turso / libSQL** changes this equation by providing an edge-replicated SQLite engine accessible via lightweight HTTP protocol queries.

### Key Architectural Advantages
1. **Zero Cold-Start Latency**: Queries travel via standard HTTP/libSQL pipelines without holding persistent TCP pools.
2. **Strict Foreign Key Constraints**: Ensures referential integrity between projects, categories, and media assets.
3. **Type Safety with Drizzle**: Drizzle ORM maps table definitions into TypeScript types with zero runtime bloat.

### Hardening Authentication Sessions
Never store sensitive JWTs or session tokens in \`localStorage\` where cross-site scripting (XSS) can harvest credentials. Always use:
- \`HttpOnly\`: Browser scripts cannot read the cookie.
- \`Secure\`: Cookie travels strictly over HTTPS.
- \`SameSite=Lax\`: Protects against cross-site request forgery while preserving navigation UX.`,
    featuredImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    categoryId: "cat-blog-eng",
    seoTitle: "Building Secure CMS Backends with Turso & Drizzle ORM",
    seoDescription: "Learn how to build edge-compatible, type-safe full stack CMS backends using Turso libSQL and Drizzle ORM with secure session handling.",
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  const existingPost = await db.select().from(blogPosts).where(eq(blogPosts.slug, samplePost.slug)).limit(1);
  if (existingPost.length === 0) {
    await db.insert(blogPosts).values(samplePost);
    await db.insert(postTags).values([
      { id: "pt-1", postId: "post-1", tagId: "tag-turso" },
      { id: "pt-2", postId: "post-1", tagId: "tag-security" },
      { id: "pt-3", postId: "post-1", tagId: "tag-nodejs" },
    ]);
  }

  // 9. Navigation Items
  console.log("-> Seeding navigation items...");
  const defaultNav = [
    { id: "nav-1", label: "Home", path: "/", sortOrder: 1, isExternal: 0, isActive: 1, createdAt: now },
    { id: "nav-2", label: "About", path: "/about", sortOrder: 2, isExternal: 0, isActive: 1, createdAt: now },
    { id: "nav-3", label: "Projects", path: "/projects", sortOrder: 3, isExternal: 0, isActive: 1, createdAt: now },
    { id: "nav-4", label: "Skills", path: "/skills", sortOrder: 4, isExternal: 0, isActive: 1, createdAt: now },
    { id: "nav-5", label: "Blog", path: "/blog", sortOrder: 5, isExternal: 0, isActive: 1, createdAt: now },
    { id: "nav-6", label: "Contact", path: "/contact", sortOrder: 6, isExternal: 0, isActive: 1, createdAt: now },
  ];

  for (const nav of defaultNav) {
    const existing = await db.select().from(navigationItems).where(eq(navigationItems.id, nav.id)).limit(1);
    if (existing.length === 0) {
      await db.insert(navigationItems).values(nav);
    }
  }

  // 10. Site Settings
  console.log("-> Seeding site settings...");
  const settingsList = [
    { id: "set-1", key: "site_name", value: "Sunaryo Adi Putra | Full-Stack Developer" },
    { id: "set-2", key: "site_tagline", value: "Engineering Reliable, Secure, and High-Performance Web Applications" },
    { id: "set-3", key: "site_description", value: "Official portfolio and CMS of Sunaryo Adi Putra, Full-Stack Developer specializing in React, Node.js, Turso, and Cloud Infrastructure." },
    { id: "set-4", key: "contact_email", value: "adiputrayy1927@gmail.com" },
    { id: "set-5", key: "allow_contact_form", value: "true" },
  ];
  for (const s of settingsList) {
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, s.key)).limit(1);
    if (existing.length === 0) {
      await db.insert(siteSettings).values({ ...s, createdAt: now, updatedAt: now });
    }
  }

  // 11. Admin bootstrap
  const existingAdmins = await db.select().from(admins).limit(1);
  if (existingAdmins.length === 0) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "AdminPortfolio#2026!";
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    console.log(`-> Creating initial admin account: ${adminEmail}`);
    await db.insert(admins).values({
      id: "admin-master",
      email: adminEmail,
      passwordHash,
      name: "Administrator",
      role: "admin",
      createdAt: now,
      updatedAt: now,
    });
    console.log("-> Initial admin created successfully.");
  }

  console.log("-> Database seed completed successfully.");
}

// If run directly from CLI
if (process.argv[1]?.endsWith("seed.js")) {
  seedDatabase()
    .then(() => {
      console.log("Database seeded.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seeding error:", err);
      process.exit(1);
    });
}
