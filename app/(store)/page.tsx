import Hero from "@/components/sections/Hero";
import BrandLogos from "@/components/sections/BrandLogos";
import Specs from "@/components/sections/Specs";
import Case from "@/components/sections/Case";
import PromoBanner from "@/components/sections/PromoBanner";
import Products from "@/components/sections/Products";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

/**
 * The landing page. Its header, footer and `<main>` wrapper come from the
 * (store) group layout, so this renders just the sections — plus the
 * structured data that tells search engines what the site and its brand are.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Beats",
          url: SITE_URL,
          logo: absoluteUrl("/icons/icon-512.png"),
        }}
      />
      <Hero />
      <BrandLogos />
      <Specs />
      <Case />
      <PromoBanner />
      <Products />
    </>
  );
}