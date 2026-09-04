"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CloseIcon, MenuIcon, ShopArrowIcon } from "@/components/icons";
import { useLenis } from "@/components/providers/LenisProvider";
import { navLinks } from "@/lib/data";

// Matches AOS's default easing (CSS "ease"), same as Reveal.tsx/AnimatedHeading.
const AOS_DEFAULT_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];

/**
 * Mobile nav: a hamburger toggle (rendered in place, inside Header's own
 * layout) that opens a full-screen overlay panel.
 *
 * THE PANEL IS PORTALED TO document.body rather than rendered in place.
 * Header is `position: sticky` with its own z-index, which creates a local
 * stacking context — anything painted inside it, even a `position: fixed`
 * descendant, gets grouped into that context and compared against OTHER
 * top-level sections (Footer also carries a z-index) by DOM order rather
 * than reliably sitting above the whole page. If the menu happened to be
 * opened while scrolled near the footer, a same-stacking-context fixed
 * panel could end up rendered BELOW it. Portaling straight to <body>
 * sidesteps this entirely — the overlay always paints above everything,
 * regardless of where in the tree the toggle button itself lives.
 *
 * Header's z-index is raised to z-50 (see Header.tsx) specifically so its
 * own toggle button — the thing that turns into the close (X) icon — stays
 * visible and clickable above this panel (z-40) while it's open.
 *
 * LENIS: the panel carries `data-lenis-prevent` so Lenis leaves its native
 * `overflow-y-auto` scrolling alone instead of trying to smooth-scroll the
 * (locked) page underneath it, and `lenis.stop()`/`start()` run alongside
 * the existing body-scroll-lock so no residual Lenis momentum keeps
 * animating the background page while it's supposed to be frozen.
 */
export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelId = useId();
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const wasOpenRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const lenis = useLenis();

  // Portals can only render after mount (no `document` on the server) —
  // gating on a mounted flag avoids a hydration mismatch.
  useEffect(() => setMounted(true), []);

  // Lock body scroll (and pause Lenis) while the panel is open, and close
  // on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    firstLinkRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
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
    if (wasOpenRef.current && !isOpen) toggleButtonRef.current?.focus();
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  const duration = prefersReducedMotion ? 0 : 0.3;
  const staggerDelay = prefersReducedMotion ? 0 : 0.06;
  const baseDelay = prefersReducedMotion ? 0 : 0.1;

  return (
    <>
      {/* -m-2.5/p-2.5: the icon itself stays 18x18 (matching the original),
          but the tappable hit area is padded out to ~38px — comfortably
          closer to a real touch target than a bare 18px icon, without
          shifting where it visually sits in the header row (the negative
          margin cancels the added box size back out). */}
      <button
        ref={toggleButtonRef}
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center p-2.5 -m-2.5"
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
                id={panelId}
                role="dialog"
                aria-modal="true"
                aria-label="Site menu"
                data-lenis-prevent
                className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-[#0F0F10]/[0.98] backdrop-blur-sm lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration, ease: AOS_DEFAULT_EASE } }}
                exit={{ opacity: 0, transition: { duration: duration * 0.85, ease: AOS_DEFAULT_EASE } }}
              >
                <div className="flex flex-1 flex-col items-center justify-center px-6 py-24">
                  <ul className="flex flex-col items-center space-y-8">
                    {navLinks.map((link, i) => (
                      <motion.li
                        key={link.href}
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
                          onClick={() => setIsOpen(false)}
                          className="text-3xl font-semibold tracking-tight"
                        >
                          {link.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.a
                    href="#"
                    onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: duration + 0.1,
                        delay: baseDelay + navLinks.length * staggerDelay,
                        ease: AOS_DEFAULT_EASE,
                      },
                    }}
                    exit={{ opacity: 0, y: 12, transition: { duration: duration * 0.7 } }}
                    className="group relative flex font-light text-[0.9375rem] bg-[#1E1E21] rounded-lg w-[9.75rem] h-[3.4375rem] overflow-hidden mt-10 border border-transparent hover:border-[#55555E] transition-colors duration-700"
                  >
                    <span className="flex justify-center items-center h-full w-full">Shop</span>
                    <span className="absolute top-0 right-0 h-full flex justify-center items-center px-2 bg-[#313135]">
                      <ShopArrowIcon className="w-5 h-5" />
                    </span>
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}