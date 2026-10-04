"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CloseIcon, MenuIcon, ShopArrowIcon } from "@/components/icons";
import { useLenis } from "@/components/providers/LenisProvider";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { usePressedState } from "@/lib/hooks/usePressedState";
import { navLinks } from "@/lib/data";

// Matches AOS's default easing (CSS "ease"), same as Reveal.tsx/AnimatedHeading.
const AOS_DEFAULT_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];

/**
 * Shop button: a plain flex row — the label takes all the space left of the
 * icon block and centers itself within it, and the icon sits in its own
 * fixed square. Nothing is absolutely positioned, so the two can never
 * overlap. Tap feedback uses real pointer events (see usePressedState)
 * since `hover:` doesn't apply on touch.
 *
 * Shop has no destination yet (same placeholder "#" as the desktop button).
 * preventDefault stops the bare "#" from snapping the page to the top;
 * point this at the real shop URL when there is one.
 */
function ShopButton({
  duration,
  delay,
  onNavigate,
}: {
  duration: number;
  delay: number;
  onNavigate: () => void;
}) {
  const { isPressed, handlers } = usePressedState();

  return (
    <motion.a
      href="#"
      onClick={(event) => {
        event.preventDefault();
        onNavigate();
      }}
      {...handlers}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0, transition: { duration: duration + 0.1, delay, ease: AOS_DEFAULT_EASE } }}
      exit={{ opacity: 0, y: 12, transition: { duration: duration * 0.7 } }}
      className={`flex w-full h-[3.4375rem] overflow-hidden rounded-lg border border-[#2A2A2E] font-light text-[0.9375rem] transition-colors duration-300 ${
        isPressed ? "bg-white text-black" : "bg-[#1E1E21] text-white"
      }`}
    >
      <span className="flex flex-1 items-center justify-center">Shop</span>
      <span
        className={`flex w-[3.4375rem] shrink-0 items-center justify-center transition-colors duration-300 ${
          isPressed ? "bg-[#E4E4E7]" : "bg-[#313135]"
        }`}
      >
        <ShopArrowIcon className="w-5 h-5" />
      </span>
    </motion.a>
  );
}

/**
 * Mobile nav: a hamburger toggle (rendered in place, inside Header's own
 * layout) that opens a full-screen overlay panel.
 *
 * THE PANEL IS PORTALED TO document.body rather than rendered in place.
 * Header carries its own z-index (and, on mobile, a transform while it
 * slides away), which creates a local stacking context — anything painted
 * inside it would be compared against other top-level sections by DOM order
 * rather than reliably sitting above the whole page. Portaling straight to
 * <body> sidesteps this: the overlay always paints above everything,
 * regardless of where in the tree the toggle button itself lives. Header's
 * z-50 keeps the toggle (which becomes the close X) above this panel's z-40.
 *
 * LENIS: the panel carries `data-lenis-prevent` so Lenis leaves its native
 * `overflow-y-auto` scrolling alone, and `lenis.stop()/start()` run
 * alongside the body-scroll-lock so no residual Lenis momentum keeps
 * animating the frozen page behind it.
 */
export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const wasOpenRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const lenis = useLenis();

  // Portals can only render after mount (no `document` on the server) —
  // gating on a mounted flag avoids a hydration mismatch.
  useEffect(() => setMounted(true), []);

  // The panel is `lg:hidden`, so growing past that breakpoint (rotating a
  // tablet, resizing a window) hides it visually — without this, isOpen
  // would stay true with the page still scroll-locked and nothing to close.
  useEffect(() => {
    if (isDesktop) setIsOpen(false);
  }, [isDesktop]);

  // While open: lock body scroll, pause Lenis, move focus into the panel,
  // close on Escape, and keep Tab inside the menu.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    firstLinkRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const toggle = toggleButtonRef.current;
      const panel = panelRef.current;
      if (!toggle || !panel) return;

      // The toggle sits at the top of the screen but its DOM position is in
      // the header, while the panel's links are portaled to the end of
      // <body> — so native Tab order wouldn't follow the visual order (or
      // stay inside the menu). Cycle through them manually instead.
      const stops = [toggle, ...Array.from(panel.querySelectorAll<HTMLElement>("a[href]"))];
      const current = stops.indexOf(document.activeElement as HTMLElement);
      const step = event.shiftKey ? -1 : 1;
      const nextIndex =
        current === -1 ? (event.shiftKey ? stops.length - 1 : 0) : (current + step + stops.length) % stops.length;

      event.preventDefault();
      stops[nextIndex]?.focus({ preventScroll: true });
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, lenis]);

  // Return focus to the toggle button once the panel closes, so keyboard
  // users land back where they started instead of losing their place.
  useEffect(() => {
    if (wasOpenRef.current && !isOpen) toggleButtonRef.current?.focus({ preventScroll: true });
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  // In-page links ("/" and "#section") are scrolled by Lenis. Two things
  // would otherwise get in the way:
  //   - Lenis ignores scrollTo() while stopped, and the menu has it stopped
  //     until the panel finishes closing — so it's restarted first.
  //   - Next's own hash/home handling would also jump the page natively.
  //     preventDefault() makes Next's Link skip that; for "#section" links
  //     LenisProvider's document-level click handler then does the smooth
  //     scroll, and for "/" it's done here. With Lenis off (reduced motion)
  //     nothing is intercepted and the browser/Next behave natively.
  const handleNavLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (lenis && (href === "/" || href.startsWith("#"))) {
      event.preventDefault();
      lenis.start();
      if (href === "/") lenis.scrollTo(0);
    }
    setIsOpen(false);
  };

  const duration = prefersReducedMotion ? 0 : 0.3;
  const staggerDelay = prefersReducedMotion ? 0 : 0.06;
  const baseDelay = prefersReducedMotion ? 0 : 0.1;

  return (
    <>
      {/* -m-3.5/p-3.5: the icon itself stays 18x18, but the tappable hit
          area is padded out to 46px — above the 44px touch-target
          guideline — without shifting where it visually sits in the header
          row (the negative margin cancels the added box size back out). */}
      <button
        ref={toggleButtonRef}
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center p-3.5 -m-3.5"
      >
        <span className="relative block w-[18px] h-[18px]">
          <MenuIcon
            className={`absolute inset-0 transition-all duration-300 ${
              isOpen ? "opacity-0 rotate-45 scale-75" : "opacity-100 rotate-0 scale-100"
            }`}
          />
          <CloseIcon
            className={`absolute inset-0 transition-all duration-300 ${
              isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-45 scale-75"
            }`}
          />
        </span>
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={panelRef}
                id={panelId}
                role="dialog"
                aria-modal="true"
                aria-label="Site menu"
                data-lenis-prevent
                className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-[#0F0F10] lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration, ease: AOS_DEFAULT_EASE } }}
                exit={{ opacity: 0, transition: { duration: duration * 0.85, ease: AOS_DEFAULT_EASE } }}
              >
                {/* Same max-width + px-6 as Header's nav row, so the links'
                    left edge lines up exactly with the logo above them.
                    The max-height variants tighten spacing on short screens
                    (phones in landscape). */}
                <div className="mx-auto flex w-full max-w-[70.8125rem] flex-1 flex-col justify-center px-6 pt-24 pb-12 [@media(max-height:32rem)]:pt-20 [@media(max-height:32rem)]:pb-6">
                  <div className="w-full sm:max-w-md">
                    <ul>
                      {navLinks.map((link, i) => (
                        <motion.li
                          key={link.href}
                          className="border-b border-[#232325]"
                          initial={{ opacity: 0, y: 24 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: { duration: duration + 0.1, delay: baseDelay + i * staggerDelay, ease: AOS_DEFAULT_EASE },
                          }}
                          exit={{ opacity: 0, y: 12, transition: { duration: duration * 0.7 } }}
                        >
                          <Link
                            ref={i === 0 ? firstLinkRef : undefined}
                            href={link.href}
                            onClick={(event) => handleNavLinkClick(event, link.href)}
                            className="block py-5 text-3xl font-semibold tracking-tight [@media(max-height:32rem)]:py-3"
                          >
                            {link.label}
                          </Link>
                        </motion.li>
                      ))}
                    </ul>

                    <div className="mt-8 [@media(max-height:32rem)]:mt-5">
                      <ShopButton
                        duration={duration}
                        delay={baseDelay + navLinks.length * staggerDelay}
                        onNavigate={() => setIsOpen(false)}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}