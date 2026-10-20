import { v2 as cloudinary } from "cloudinary";
import { db } from "../db/index.js";
import { profiles, projects, blogPosts, mediaAssets } from "../db/schema.js";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";
import dotenv from "dotenv";

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("=== CLOUDINARY ASSET MIGRATION TOOL ===");
console.log(`Cloud Name : ${cloudName || "(not set)"}`);
console.log(`API Key    : ${apiKey ? "******" + apiKey.slice(-4) : "(not set)"}`);
console.log(`API Secret : ${apiSecret ? "Present" : "(not set)"}\n`);

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

async function uploadUrlToCloudinary(url, folder, publicIdPrefix) {
  if (!url || url.includes("res.cloudinary.com")) {
    return null; // Already on Cloudinary or empty
  }

  const customPublicId = `${publicIdPrefix}_${crypto.randomBytes(4).toString("hex")}`;
  console.log(`-> Uploading to Cloudinary [${folder}]: ${url.slice(0, 60)}...`);

  const result = await cloudinary.uploader.upload(url, {
    folder,
    public_id: customPublicId,
    resource_type: "image",
    overwrite: true,
  });

  const now = new Date().toISOString();
  const assetId = `asset_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;

  await db.insert(mediaAssets).values({
    id: assetId,
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    format: result.format,
    bytes: result.bytes,
    width: result.width || null,
    height: result.height || null,
    folder: folder,
    altText: customPublicId,
    createdAt: now,
  });

  return result.secure_url;
}

async function runMigration() {
  try {
    const ping = await cloudinary.api.ping();
    console.log("✔ Cloudinary credentials verified successfully:", ping);
  } catch (err) {
    console.error("\n❌ Cloudinary Connection Error:", err.error?.message || err.message);
    console.error("Tip: Pastikan CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, dan CLOUDINARY_API_SECRET di file .env sesuai dengan akun Cloudinary Console Anda (Settings > Account / Programmable Media).");
    process.exit(1);
  }

  console.log("\n-> Starting asset migration to Cloudinary & updating Turso DB...");

  // 1. Profile Avatar
  const profileList = await db.select().from(profiles);
  for (const prof of profileList) {
    if (prof.avatarUrl && !prof.avatarUrl.includes("res.cloudinary.com")) {
      try {
        const secureUrl = await uploadUrlToCloudinary(prof.avatarUrl, "portfolio/profile", "avatar");
        if (secureUrl) {
          await db.update(profiles).set({ avatarUrl: secureUrl }).where(eq(profiles.id, prof.id));
          console.log(`   ✔ Updated profile avatar to: ${secureUrl}`);
        }
      } catch (e) {
        console.error(`   ✖ Failed to upload profile avatar:`, e.message);
      }
    }
  }

  // 2. Projects Thumbnails
  const projectList = await db.select().from(projects);
  for (const proj of projectList) {
    if (proj.thumbnailUrl && !proj.thumbnailUrl.includes("res.cloudinary.com")) {
      try {
        const secureUrl = await uploadUrlToCloudinary(proj.thumbnailUrl, "portfolio/projects", `proj_${proj.slug}`);
        if (secureUrl) {
          await db.update(projects).set({ thumbnailUrl: secureUrl }).where(eq(projects.id, proj.id));
          console.log(`   ✔ Updated project [${proj.title}] thumbnail to: ${secureUrl}`);
        }
      } catch (e) {
        console.error(`   ✖ Failed to upload project thumbnail [${proj.title}]:`, e.message);
      }
    }
  }

  // 3. Blog Posts Featured Images
  const postList = await db.select().from(blogPosts);
  for (const post of postList) {
    if (post.featuredImage && !post.featuredImage.includes("res.cloudinary.com")) {
      try {
        const secureUrl = await uploadUrlToCloudinary(post.featuredImage, "portfolio/blog", `blog_${post.slug}`);
        if (secureUrl) {
          await db.update(blogPosts).set({ featuredImage: secureUrl }).where(eq(blogPosts.id, post.id));
          console.log(`   ✔ Updated blog post [${post.title}] image to: ${secureUrl}`);
        }
      } catch (e) {
        console.error(`   ✖ Failed to upload blog post image [${post.title}]:`, e.message);
      }
    }
  }

  console.log("\n✔ All assets migrated and Turso database records updated successfully!");
}

runMigration().catch(console.error);
