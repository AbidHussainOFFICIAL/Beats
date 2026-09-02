import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import BrandLogos from "@/components/sections/BrandLogos";
import Specs from "@/components/sections/Specs";
import Case from "@/components/sections/Case";
import PromoBanner from "@/components/sections/PromoBanner";
import Products from "@/components/sections/Products";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="relative pt-[4.375rem] z-10">
        <Hero />
        <BrandLogos />
        <Specs />
        <Case />
        <PromoBanner />
        <Products />
      </main>
      <Footer />
    </>
  );
}