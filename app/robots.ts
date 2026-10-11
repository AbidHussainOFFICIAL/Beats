import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/** /robots.txt — crawl everything except the visitor-specific pages, and point to the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/bag", "/checkout", "/order-confirmation"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}