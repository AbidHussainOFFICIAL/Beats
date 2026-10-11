/**
 * Site-wide constants used for metadata, the sitemap, structured data and the
 * web app manifest. Set NEXT_PUBLIC_SITE_URL to the real domain when you
 * deploy; until then it falls back to the local dev server.
 */

export const SITE_NAME = "Beats Landing Page";
export const SITE_DESCRIPTION = "Beats headphones landing page";
export const SITE_AUTHOR = "Abid Hussain";

/** The site's origin, without a trailing slash. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Turns a site path ("/products/black") into a full URL. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}