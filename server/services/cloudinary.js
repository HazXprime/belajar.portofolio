import { v2 as cloudinary } from "cloudinary";
import crypto from "node:crypto";
import dotenv from "dotenv";

dotenv.config();

const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Upload an in-memory buffer to Cloudinary.
 * Falls back to secure data uri / placeholder if credentials are not configured yet.
 *
 * @param {Buffer} buffer
 * @param {string} folder - e.g. "portfolio/projects", "portfolio/blog", "portfolio/profile"
 * @param {string} originalName
 * @param {string} mimeType
 * @returns {Promise<{publicId: string, url: string, secureUrl: string, bytes: number, format: string, width?: number, height?: number}>}
 */
export async function uploadMedia(buffer, folder = "portfolio/media", originalName = "asset", mimeType = "image/jpeg") {
  if (!isConfigured) {
    console.warn("[Cloudinary] Credentials not set in environment. Using local base64 fallback.");
    const base64 = buffer.toString("base64");
    const dataUri = `data:${mimeType};base64,${base64}`;
    const syntheticId = `${folder.replace(/\//g, "_")}_${crypto.randomBytes(8).toString("hex")}`;
    const format = mimeType.split("/")[1] || "png";

    return {
      publicId: syntheticId,
      url: dataUri,
      secureUrl: dataUri,
      bytes: buffer.length,
      format,
      width: 1200,
      height: 800,
      folder,
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "svg"],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          publicId: result.public_id,
          url: result.url,
          secureUrl: result.secure_url,
          bytes: result.bytes,
          format: result.format,
          width: result.width,
          height: result.height,
          folder,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Deletes an asset from Cloudinary by public ID.
 *
 * @param {string} publicId
 * @returns {Promise<any>}
 */
export async function deleteMedia(publicId) {
  if (!isConfigured) {
    console.warn(`[Cloudinary] Fallback delete for asset ${publicId}`);
    return { result: "ok" };
  }

  return cloudinary.uploader.destroy(publicId);
}

/**
 * Generates an optimized responsive image delivery URL.
 */
export function getOptimizedImageUrl(publicIdOrUrl, options = {}) {
  if (!publicIdOrUrl) return "";
  if (publicIdOrUrl.startsWith("data:") || publicIdOrUrl.startsWith("http://") || publicIdOrUrl.startsWith("https://")) {
    return publicIdOrUrl;
  }
  if (!isConfigured) return publicIdOrUrl;

  const { width = 800, quality = "auto", format = "auto" } = options;
  return cloudinary.url(publicIdOrUrl, {
    fetch_format: format,
    quality: quality,
    width,
    crop: "limit",
    secure: true,
  });
}
