import Hero from "@/components/sections/Hero";
import BrandLogos from "@/components/sections/BrandLogos";
import Specs from "@/components/sections/Specs";
import Case from "@/components/sections/Case";
import PromoBanner from "@/components/sections/PromoBanner";
import Products from "@/components/sections/Products";

/**
 * The landing page. Its header, footer and `<main>` wrapper now come from
 * the (store) group layout, so this renders just the sections.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandLogos />
      <Specs />
      <Case />
      <PromoBanner />
      <Products />
    </>
  );
}