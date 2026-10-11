import type { MetadataRoute } from "next";
import { catalog } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

/**
 * /sitemap.xml — the pages search engines should know about. The bag,
 * checkout and order confirmation are left out on purpose (they're private to
 * each visitor; see robots.ts). Product pages come straight from the catalog,
 * so a new product is listed automatically.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/works-with"), lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/help"), lastModified, changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/updates"), lastModified, changeFrequency: "monthly", priority: 0.3 },
    { url: absoluteUrl("/shipping-returns"), lastModified, changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/register"), lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];

  const products: MetadataRoute.Sitemap = catalog.map((product) => ({
    url: absoluteUrl(`/products/${product.slug}`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...pages, ...products];
}