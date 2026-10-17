import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind classes safely avoiding conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Validates external URLs to ensure they use safe HTTPS/HTTP protocols
 * and prevents javascript: or data: injection.
 */
export function isSafeUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}
