import { test, describe, before, after } from "node:test";
import assert from "node:assert";
import app from "../server/app.js";
import { ensureDatabaseTables } from "../server/db/index.js";
import { seedDatabase } from "../server/db/seed.js";

let server;
let baseUrl;
let authToken;

describe("API Endpoints Suite", () => {
  before(async () => {
    await ensureDatabaseTables();
    await seedDatabase();

    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(() => {
    if (server) {
      server.close();
    }
  });

  test("GET /api/health returns status ok", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, "ok");
  });

  test("GET /sitemap.xml returns XML sitemap", async () => {
    const res = await fetch(`${baseUrl}/sitemap.xml`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get("content-type"), "application/xml; charset=utf-8");
    const text = await res.text();
    assert.ok(text.includes("<urlset"));
    assert.ok(text.includes("<loc>"));
  });

  test("GET /api/profile returns developer details", async () => {
    const res = await fetch(`${baseUrl}/api/profile`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data.name);
    assert.ok(body.data.handle);
    assert.ok(Array.isArray(body.data.aboutParagraphs));
  });

  test("GET /api/projects returns published projects with pagination", async () => {
    const res = await fetch(`${baseUrl}/api/projects?limit=5`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length > 0);
    assert.ok(body.pagination.total >= body.data.length);

    // Verify all returned projects have status 'published'
    for (const proj of body.data) {
      assert.strictEqual(proj.status, "published");
      assert.ok(Array.isArray(proj.techStack));
    }
  });

  test("GET /api/projects/:slug returns single project detail", async () => {
    const res = await fetch(`${baseUrl}/api/projects/devpulse-api-health-monitor`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.slug, "devpulse-api-health-monitor");
  });

  test("GET /api/skills returns list and grouped categories", async () => {
    const res = await fetch(`${baseUrl}/api/skills`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(Array.isArray(body.grouped));
  });

  test("POST /api/contact submits valid message and rejects spam honeypot", async () => {
    // Valid submission
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Recruiter",
        email: "recruiter@example.com",
        subject: "Opportunity Discussion",
        message: "Hello Sunaryo, I reviewed your portfolio and would like to connect.",
      }),
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);

    // Spam honeypot filled
    const spamRes = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Bot User",
        email: "bot@spam.com",
        subject: "Spam Offer",
        message: "Buy these cheap products immediately!",
        honeypot: "I am a bot filling this hidden field",
      }),
    });
    assert.strictEqual(spamRes.status, 200);
    const spamBody = await spamRes.json();
    assert.strictEqual(spamBody.success, true); // Silent discard
  });

  test("Protected /api/admin/dashboard rejects unauthorized requests", async () => {
    const res = await fetch(`${baseUrl}/api/admin/dashboard`);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.success, false);
  });

  test("Protected /api/admin/media/upload rejects unauthorized uploads", async () => {
    const res = await fetch(`${baseUrl}/api/admin/media/upload`, {
      method: "POST",
    });
    assert.strictEqual(res.status, 401);
  });

  test("POST /api/auth/login succeeds with valid credentials and sets session", async () => {
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@example.com",
        password: "AdminPortfolio#2026!",
      }),
    });

    assert.strictEqual(loginRes.status, 200);
    const loginBody = await loginRes.json();
    assert.strictEqual(loginBody.success, true);
    assert.ok(loginBody.token);
    assert.strictEqual(loginBody.admin.email, "admin@example.com");

    authToken = loginBody.token;

    // Use token for authenticated admin request
    const adminRes = await fetch(`${baseUrl}/api/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    assert.strictEqual(adminRes.status, 200);
    const adminBody = await adminRes.json();
    assert.strictEqual(adminBody.success, true);
    assert.ok(typeof adminBody.stats.totalProjects === "number");
  });

  test("Admin CRUD workflow on Categories", async () => {
    assert.ok(authToken, "Auth token must be set from login test");

    const uniqueCatSlug = `cloud-arch-${Date.now()}`;

    // 1. CREATE
    const createRes = await fetch(`${baseUrl}/api/admin/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        name: "Cloud Architecture",
        slug: uniqueCatSlug,
        type: "project",
        description: "Cloud and serverless systems",
      }),
    });
    assert.strictEqual(createRes.status, 201);
    const createBody = await createRes.json();
    assert.strictEqual(createBody.success, true);
    const catId = createBody.id || createBody.data?.id;
    assert.ok(catId);

    // 2. READ via admin
    const listRes = await fetch(`${baseUrl}/api/admin/categories`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert.strictEqual(listRes.status, 200);
    const listBody = await listRes.json();
    const found = listBody.data.find((c) => c.id === catId);
    assert.ok(found);
    assert.strictEqual(found.name, "Cloud Architecture");

    // 3. UPDATE
    const updateRes = await fetch(`${baseUrl}/api/admin/categories/${catId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        name: "Cloud & Distributed Systems",
        slug: uniqueCatSlug,
        type: "project",
        description: "Updated description for distributed systems",
      }),
    });
    assert.strictEqual(updateRes.status, 200);

    // 4. DELETE
    const deleteRes = await fetch(`${baseUrl}/api/admin/categories/${catId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert.strictEqual(deleteRes.status, 200);
  });

  test("Draft content isolation: draft items cannot be viewed on public endpoints", async () => {
    assert.ok(authToken);

    const uniqueDraftSlug = `confidential-internal-${Date.now()}`;

    // Create a draft project via admin
    const createRes = await fetch(`${baseUrl}/api/admin/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title: "Confidential Internal Prototype",
        slug: uniqueDraftSlug,
        summary: "Not yet ready for public view.",
        description: "Deep internal architecture undergoing security review.",
        status: "draft",
        techStack: ["Node.js", "Docker"],
      }),
    });
    assert.strictEqual(createRes.status, 201);
    const draftBody = await createRes.json();
    const draftId = draftBody.id || draftBody.data?.id;
    assert.ok(draftId);

    // Verify public projects list does NOT include the draft project
    const publicListRes = await fetch(`${baseUrl}/api/projects?search=Confidential`);
    const publicListBody = await publicListRes.json();
    assert.strictEqual(publicListBody.data.length, 0);

    // Verify public project detail by slug returns 404
    const publicDetailRes = await fetch(`${baseUrl}/api/projects/${uniqueDraftSlug}`);
    assert.strictEqual(publicDetailRes.status, 404);

    // Clean up draft project
    await fetch(`${baseUrl}/api/admin/projects/${draftId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    });
  });
});
