import Reveal from "@/components/ui/Reveal";
import { brandLogos } from "@/lib/data";

/**
 * Extracted from Hero.tsx (was a local `BrandLogosRow` component used by
 * both its pinned and static branches). Kept in its own `<section className="px-6">`
 * wrapper so it retains the same horizontal inset it previously got for
 * free by being nested inside Hero's own `<section className="px-6">`.
 */
export default function BrandLogos() {
  return (
    <section className="px-6">
      <div className="mt-[3rem] lg:mt-[5.5rem] max-w-[51.625rem] mx-auto transition-[margin]">
        <ul className="flex items-center justify-between space-x-4">
          {brandLogos.map((brand) => (
            <li key={brand.name} className="transform hover:scale-90 transition-transform duration-700">
              <Reveal variant="fade-left" duration={700} delay={brand.delay} offset={150}>
                <a href="#" className="block max-w-[5.625rem] sm:max-w-[6.25rem] hover:opacity-75 transition-opacity">
                  <img src={brand.src} alt={brand.name} className="w-full cursor-pointer" />
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}