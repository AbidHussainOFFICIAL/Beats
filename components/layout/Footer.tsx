"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import SubscribeForm from "@/components/ui/SubscribeForm";
import { LogoIcon, ArrowUpIcon } from "@/components/icons";
import { usePressedState } from "@/lib/hooks/usePressedState";
import { footerProductLinks, footerSupportLinks, socials } from "@/lib/data";

// Matches AOS's default easing (CSS "ease"), same as Reveal.tsx/AnimatedHeading.
const AOS_DEFAULT_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];

function SocialLink({ social }: { social: (typeof socials)[number] }) {
  const { isPressed, handlers } = usePressedState();
  const Icon = social.icon;

  return (
    <a
      href={social.href}
      aria-label={social.label}
      {...handlers}
      className={[
        "flex justify-center items-center rounded h-8 w-8 group transform hover:-translate-y-1 transition-all duration-700",
        isPressed
          ? "bg-white text-black scale-90 duration-75"
          : "text-[#F8F8F8] bg-[#181A1B] hover:text-black hover:bg-white",
      ].join(" ")}
    >
      <Icon />
    </a>
  );
}

function BackToTopLink() {
  const { isPressed, handlers } = usePressedState();

  return (
    <a
      href="#home"
      aria-label="Back to top"
      {...handlers}
      className={[
        "flex justify-center items-center rounded w-9 h-9 group transition-colors",
        isPressed ? "bg-white scale-90 duration-75" : "bg-[#181A1B] hover:bg-white",
      ].join(" ")}
    >
      <ArrowUpIcon className={isPressed ? "stroke-black" : "group-hover:stroke-black transition-colors"} />
    </a>
  );
}

interface FooterLink {
  label: string;
  href: string;
  delay: number;
}

/**
 * MOBILE-ONLY collapsible section (Products/Support), collapsed by default.
 * Desktop never renders this component at all — see the `hidden lg:block`
 * / `lg:hidden` split further down — it keeps its original always-visible
 * two-column list completely untouched.
 *
 * Chevron button styling/behavior deliberately matches SubscribeForm's
 * mobile dropdown trigger exactly (same size, same colors, same rotate
 * treatment) so the two collapsible affordances on this page read as the
 * same UI pattern rather than two different ones.
 *
 * Height is animated to/from `"auto"` rather than a hardcoded pixel value —
 * Framer Motion measures the content's real height itself, so this stays
 * correct regardless of how many links a section has or how any of their
 * labels wrap, with no fixed height to keep in sync by hand.
 */
function FooterAccordionSection({ title, links }: { title: string; links: FooterLink[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#232325] last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex items-center justify-between w-full py-2 pl-4 pr-2 text-left"
      >
        {/* pl-4/pr-2: matches the Subscribe bar's own button padding
            (pl-4 pr-2) exactly, so both the title text and the chevron
            button align on the same vertical lines as their Subscribe
            bar counterparts. */}
        <span className="font-medium text-sm text-white">{title}</span>
        <span className="flex items-center justify-center bg-[#181A1B] text-white h-9 w-9 rounded-lg shrink-0">
          <ArrowUpIcon className={`transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-180"}`} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.3, ease: AOS_DEFAULT_EASE } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.25, ease: AOS_DEFAULT_EASE } }}
            className="overflow-hidden"
          >
            <ul className="space-y-2 pb-4 pl-4 pr-[1.125rem]">
              {/* pl-4: matches the header button's own pl-4 directly above,
                  so the links line up under "Products"/"Support" rather
                  than sitting flush against the left edge while the title
                  above them is now indented. pr-[1.125rem] (18px, not a
                  plain pr-2/8px): the boxed chevron buttons are 36px wide
                  with their 16px-wide icon centered inside, leaving ~10px
                  of empty space on each side — so the icon's actual visible
                  edge sits ~10px further in than the button's own edge.
                  This bare chevron has no such box, so matching the
                  button's outer 8px inset alone wasn't enough; the extra
                  10px here lands it on the icon GLYPHS' actual position,
                  not just the containers' edges. */}
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="flex items-center justify-between text-[#BDC0C2] font-light text-[0.9375rem] hover:text-white transition-colors"
                  >
                    <span>{link.label}</span>
                    {/* Same ArrowUpIcon used everywhere else in this
                        footer (Subscribe's dropdown, back-to-top, the
                        section headers) — just rotated 90° instead of
                        180°, and rendered small/dim rather than inside a
                        boxed button, so it reads as a light "this is
                        tappable" mark (classic iOS-settings-row
                        convention) rather than another full control.
                        stroke is currentColor, so it brightens along with
                        the text on hover automatically, no separate
                        hover rule needed for it. */}
                    <ArrowUpIcon className="w-2.5 h-2.5 rotate-90 opacity-40 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative mt-[5.75rem] px-6 lg:mt-[11.75rem] transition-[margin] z-30">
      <div className="flex flex-col md:flex-row md:space-x-20 lg:space-x-40 max-w-[70.8125rem] mx-auto">
        {/* flex-col below lg, flex-row lg+: below lg this stacks the logo
            (if visible in the md–lg range) above the mobile accordion
            block; at lg+ it's `flex-row justify-between` — identical to
            what this container always rendered, so desktop is completely
            unaffected by this change. */}
        <div className="flex-1 flex flex-col lg:flex-row lg:justify-between">
          <div className="hidden md:block mb-6 lg:mb-0">
            <Reveal variant="fade-right" duration={700} anchorPlacement="top-bottom">
              <Link href="/" className="logo mt-2 inline-block transform scale-[0.75] text-white transition-transform">
                <LogoIcon className="logo-svg transform transition-transform duration-700" style={{ transformStyle: "preserve-3d" }} />
              </Link>
            </Reveal>
          </div>

          {/* Desktop (lg+): original two-column side-by-side layout,
              completely unchanged — same markup, same classes, same
              Reveal-per-link stagger as before this change. */}
          <div className="hidden lg:block">
            <Reveal variant="fade-up" duration={700} delay={50} anchorPlacement="top-bottom">
              <h5 className="font-semibold text-xl mb-4">Products</h5>
            </Reveal>
            <ul className="space-y-2">
              {footerProductLinks.map((link) => (
                <li key={link.label}>
                  <Reveal variant="fade-up" duration={700} delay={link.delay} anchorPlacement="top-bottom">
                    <a href={link.href} className="text-[#BDC0C2] font-light text-[0.9375rem] hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block">
            <Reveal variant="fade-up" duration={700} delay={50} anchorPlacement="top-bottom">
              <h5 className="font-semibold text-xl mb-4">Support</h5>
            </Reveal>
            <ul className="space-y-2">
              {footerSupportLinks.map((link) => (
                <li key={link.label}>
                  <Reveal variant="fade-up" duration={700} delay={link.delay} anchorPlacement="top-bottom">
                    <a href={link.href} className="text-[#BDC0C2] font-light text-[0.9375rem] hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile (<lg): new stacked accordion — Products above Support,
              single column, both collapsed by default. Replaces the
              uneven two-column list entirely at this width; each section
              still gets its own scroll-triggered entrance via Reveal. */}
          <div className="lg:hidden w-full">
            <Reveal variant="fade-up" duration={700} delay={50} anchorPlacement="top-bottom">
              <FooterAccordionSection title="Products" links={footerProductLinks} />
            </Reveal>
            <Reveal variant="fade-up" duration={700} delay={100} anchorPlacement="top-bottom">
              <FooterAccordionSection title="Support" links={footerSupportLinks} />
            </Reveal>
          </div>
        </div>

        <div className="flex-1 mt-10 md:mt-0">
          <Reveal variant="fade-left" duration={700} delay={100} anchorPlacement="top-bottom">
            <SubscribeForm />
          </Reveal>

          <div className="flex items-center justify-between mt-6">
            <div className="flex space-x-5">
              {socials.map((social) => (
                <Reveal key={social.label} variant="fade-up" duration={700} delay={social.delay} anchorPlacement="top-bottom">
                  <SocialLink social={social} />
                </Reveal>
              ))}
            </div>

            <div className="transform hover:-translate-y-1 transition-transform duration-700 mr-2 lg:mr-0">
              {/* mr-2 (mobile only, lg:mr-0 on desktop): the mobile
                  Subscribe bar's chevron button has an 8px inset from its
                  container's right edge (see SubscribeForm.tsx's pl-4
                  pr-2) — this 8px margin brings back-to-top in to meet it,
                  and that mobile alignment is already correct/unaffected.
                  Desktop's bar (DesktopSubscribeBar) is different: it has
                  no external right margin at all, so its own right edge
                  sits flush with this column's true edge — lg:mr-0 removes
                  the mobile-only inset there so back-to-top aligns flush
                  with that same edge instead of sitting 8px short of it. */}
              <Reveal variant="fade-up" duration={700} delay={350} anchorPlacement="top-bottom">
                <BackToTopLink />
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 my-2">
        {/* Was the only element in the whole footer with no entrance
            animation at all — popped in instantly while everything else
            staggered in. delay=400 continues that same sequence, landing
            just after back-to-top (350) as the last item to appear. */}
        <Reveal variant="fade-up" duration={700} delay={400} anchorPlacement="top-bottom">
          <p className="text-[#A2A6A9] text-center font-light text-[0.8125rem]">
            Created By{" "}
            <a
              href="https://abidhussain.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-underline text-[#A2A6A9] hover:text-white transition-colors pb-0.5"
            >
              Abid Hussain
            </a>
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
