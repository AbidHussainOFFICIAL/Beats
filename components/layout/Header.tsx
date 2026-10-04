"use client";

import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import MobileNav from "@/components/layout/MobileNav";
import { LogoIcon, ShopArrowIcon } from "@/components/icons";
import { useHideOnScroll } from "@/lib/hooks/useHideOnScroll";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { navLinks } from "@/lib/data";

/**
 * DESKTOP (lg+): unchanged. Pure CSS sticky release, no scroll listener —
 * the wrapper is 140vh tall so the sticky header naturally releases after
 * that much scrolling, and an equal negative bottom margin cancels the
 * extra height so Hero isn't pushed down. (140vh is written as a literal
 * in the wrapper's classes below because Tailwind needs to see the full
 * class name; it's tuned independently of Hero's 220vh runway.)
 *
 * MOBILE (<lg): the header is `fixed` instead, so it's available on every
 * screen of the page, and it slides out of view while scrolling down and
 * back in while scrolling up (see useHideOnScroll). The wrapper collapses
 * to zero height there — `main`'s own top padding already accounts for it.
 *
 * `id="home"` lives on the wrapper, not the <header>: the wrapper always
 * sits at the very top of the document, so the footer's back-to-top link
 * scrolls to 0. A fixed header's own position is "wherever the viewport
 * is", which would make that link a no-op on mobile.
 *
 * z-50: MobileNav's full-screen panel portals to <body> at z-40 and needs
 * the toggle button inside this header to stay visible above it.
 */
export default function Header() {
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const hidden = useHideOnScroll(isMobile);

  return (
    <div id="home" className="lg:h-[140vh] lg:-mb-[140vh]">
      <header
        className={`fixed inset-x-0 top-0 z-50 max-lg:pointer-events-none max-lg:transition-transform max-lg:duration-300 lg:sticky lg:inset-x-auto ${
          hidden ? "-translate-y-full" : ""
        }`}
      >
        <nav className="relative flex justify-end max-w-[70.8125rem] mx-auto">
          {/* Mobile: in-flow (so the header has a real height to slide
              away by), with the header itself click-through and only the
              logo/toggle re-enabled, so the empty strip between them
              doesn't block taps on the hero. Desktop: absolute, as before.
              items-center + a flex logo link (below) line the logo and the
              toggle up on one horizontal centerline. */}
          <ul className="relative lg:absolute top-0 left-0 w-full flex items-center justify-between px-6 pt-9 z-20">
            <li className="max-lg:pointer-events-auto">
              <Reveal variant="fade-down" duration={700}>
                {/* origin-left: scaling from the left edge keeps the logo
                    flush with the same 24px padding the toggle uses on the
                    right, instead of insetting it by the scale's 4px. */}
                <Link
                  href="/"
                  className="logo flex lg:inline-block transform origin-left lg:origin-center scale-[0.75] lg:scale-100 text-white transition-transform"
                >
                  <LogoIcon className="logo-svg transform transition-transform duration-700" style={{ transformStyle: "preserve-3d" }} />
                </Link>
              </Reveal>
            </li>
            <li className="lg:hidden max-lg:pointer-events-auto">
              <Reveal variant="fade-down" duration={700}>
                <MobileNav />
              </Reveal>
            </li>
          </ul>

          <ul className="hidden lg:flex relative items-center space-x-14 px-6 pt-6 z-20">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <Reveal variant="fade-left" duration={700} delay={i * 100}>
                  <Link href={link.href} className="nav-underline text-base font-bold pb-0.5">
                    {link.label}
                  </Link>
                </Reveal>
              </li>
            ))}
            <li>
              <Reveal variant="fade-left" duration={700} delay={400}>
                <a
                  href="#"
                  className="group relative flex font-light text-[0.9375rem] bg-[#1E1E21] rounded-lg w-[9.75rem] h-[3.4375rem] overflow-hidden transition-all border border-transparent hover:border-[#55555E] duration-700"
                  style={{ willChange: "transform" }}
                >
                  <span className="flex justify-center items-center h-full w-full transform group-hover:-translate-x-[0.625rem] transition-transform cursor-pointer duration-700">
                    Shop
                  </span>
                  <span className="absolute top-0 -right-[2.25rem] group-hover:-right-0 h-full flex justify-center items-center px-2 bg-[#313135] transition-all cursor-pointer duration-700">
                    <ShopArrowIcon className="w-5 h-5" />
                  </span>
                </a>
              </Reveal>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}