import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { LogoIcon, MenuIcon, ShopArrowIcon } from "@/components/icons";
import { navLinks } from "@/lib/data";

/**
 * Pure CSS sticky release, no JS/scroll listener at all:
 *
 * The outer div is given a fixed height (HEADER_STICKY_VH), so the sticky
 * header naturally releases (stops sticking) once that much has been
 * scrolled. An equal NEGATIVE bottom margin cancels the extra height back
 * out, so this wrapper doesn't push Hero further down the page — it still
 * occupies that height for sticky-tracking purposes, it just doesn't add
 * any extra visual space.
 */
// Releases somewhat before the full hero runway ends (Hero's own runway is
// 220vh) — a plain, separate number, tuned independently of Hero's timing
// since it only needs to roughly track it, not match it exactly.
const HEADER_STICKY_VH = 140;

export default function Header() {
  return (
    <div style={{ height: `${HEADER_STICKY_VH}vh`, marginBottom: `-${HEADER_STICKY_VH}vh` }}>
      <header id="home" className="sticky top-0 z-30">
        <nav className="relative flex justify-end max-w-[70.8125rem] mx-auto">
          <ul className="absolute top-0 left-0 w-full flex justify-between px-6 pt-9 z-20">
            <li>
              <Reveal variant="fade-down" duration={700}>
                <Link
                  href="/"
                  className="logo inline-block transform scale-[0.75] lg:scale-100 text-white transition-transform"
                >
                  <LogoIcon className="logo-svg transform transition-transform duration-700" style={{ transformStyle: "preserve-3d" }} />
                </Link>
              </Reveal>
            </li>
            <li className="lg:translate-x-32 xl:hidden transition-transform duration-700">
              <Reveal variant="fade-down" duration={700}>
                <a href="#" aria-label="Open menu" className="opacity-100 lg:opacity-0 transition-opacity duration-700">
                  <MenuIcon />
                </a>
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