"use client";

import Reveal from "@/components/ui/Reveal";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { usePressedState } from "@/lib/hooks/usePressedState";
import { brandLogos } from "@/lib/data";

/**
 * Extracted from Hero.tsx (was a local `BrandLogosRow` component used by
 * both its pinned and static branches). Kept in its own `<section className="px-6">`
 * wrapper so it retains the same horizontal inset it previously got for
 * free by being nested inside Hero's own `<section className="px-6">`.
 *
 * Two separate row layouts, chosen by breakpoint — only the one that applies
 * is ever mounted:
 *
 *   DESKTOP (lg+): the original row, unchanged — each logo flies in from the
 *   right and scales/fades on hover.
 *
 *   MOBILE / TABLET (<lg):
 *     - Logos are sized fluidly (18vw, capped at the original 72px) instead
 *       of by a fixed cap, and use a small minimum gap instead of fixed
 *       spacing, so all four fit down to 320px wide phones without
 *       overflowing the row.
 *     - They zoom/fade in in place. The desktop fly-in starts 100px off to
 *       the right, which on a phone starts the last logo off-screen, and it
 *       triggers a little before the row is actually visible; the offset
 *       here makes it trigger once the row is properly on screen.
 *     - Tap feedback uses real pointer events (see usePressedState), since
 *       `hover:` utilities never fire on touch in this app. The shrink is
 *       on an inner element so the link's own hit box never changes under
 *       the finger.
 *     - Tap area: an invisible 12px extension above and below each logo
 *       (a pseudo-element, so it doesn't affect layout) brings the touch
 *       target to roughly 44px tall.
 *     - The links are still placeholders ("#"). Lenis deliberately ignores
 *       a bare "#", so the browser would snap the page to the top on every
 *       tap; preventDefault stops that until there are real destinations.
 *
 * The first render (before the media query resolves) is always the mobile
 * row, so the server HTML matches the client's first render; on desktop it
 * is swapped for the desktop row right after mount, while still invisible.
 */

function DesktopBrandLogos() {
  return (
    <ul className="flex items-center justify-between space-x-4">
      {brandLogos.map((brand) => (
        <li key={brand.name} className="transform hover:scale-90 transition-transform duration-700">
          <Reveal variant="fade-left" duration={700} delay={brand.delay} offset={150}>
            <a href="#" className="block max-w-[6.25rem] hover:opacity-75 transition-opacity">
              <img src={brand.src} alt={brand.name} className="w-full cursor-pointer" />
            </a>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

function MobileBrandLogo({ brand }: { brand: (typeof brandLogos)[number] }) {
  const { isPressed, handlers } = usePressedState();

  return (
    <li>
      <Reveal variant="zoom-in" duration={700} delay={brand.delay} offset={300}>
        <a
          href="#"
          onClick={(event) => event.preventDefault()}
          {...handlers}
          className="relative block w-[clamp(3.25rem,18vw,4.5rem)] sm:w-[5.625rem] md:w-[6.25rem] before:absolute before:inset-x-0 before:-inset-y-3 before:content-['']"
        >
          <span className={`block transition-all duration-150 ${isPressed ? "scale-90 opacity-75" : ""}`}>
            <img src={brand.src} alt={brand.name} loading="lazy" decoding="async" className="w-full" />
          </span>
        </a>
      </Reveal>
    </li>
  );
}

function MobileBrandLogos() {
  return (
    <ul className="flex items-center justify-between gap-2">
      {brandLogos.map((brand) => (
        <MobileBrandLogo key={brand.name} brand={brand} />
      ))}
    </ul>
  );
}

export default function BrandLogos() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <section className="px-6">
      <div className="mt-[3rem] lg:mt-[5.5rem] max-w-[51.625rem] mx-auto transition-[margin]">
        {isDesktop ? <DesktopBrandLogos /> : <MobileBrandLogos />}
      </div>
    </section>
  );
}