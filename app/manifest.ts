import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

/**
 * The web app manifest (/manifest.webmanifest) — what lets phones and
 * desktop browsers install the site as an app ("Add to Home Screen"). The
 * icons are plain image files in public/icons/ (the "maskable" one has extra
 * margin so phones that crop icons into circles never clip the logo).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Beats",
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0F0F10",
    theme_color: "#141415",
    categories: ["shopping"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Shop headphones", url: "/#products" },
      { name: "Your bag", url: "/bag" },
    ],
  };
}