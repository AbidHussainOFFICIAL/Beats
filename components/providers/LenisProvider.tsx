"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

/**
 * Read the shared Lenis instance from any client component — e.g. to call
 * `lenis?.stop()` / `lenis?.start()` around something that needs native
 * scroll to itself for a moment (see MobileNav.tsx). Returns null before
 * Lenis has mounted on the client, if reduced-motion skipped it entirely,
 * or if called outside this provider.
 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

/**
 * Wraps the app to add Lenis's eased "smooth scroll" feel on top of
 * otherwise-ordinary native scrolling.
 *
 * IMPORTANT — this does NOT create a virtual/fake scroll container. Lenis
 * (in this default configuration, no `wrapper`/`content` options) still
 * scrolls the real document; it just animates how the scroll position
 * changes over time instead of jumping in native discrete steps. That
 * matters a lot given everything this app already depends on real scroll
 * position: `useAosReveal`'s IntersectionObserver, Framer Motion's
 * `useScroll` (ParallaxImage, ScrollRevealImage, Hero's pinned sequence),
 * and Header's `position: sticky` mechanism all keep working completely
 * unmodified — they all read genuine scroll position, and Lenis is just
 * smoothing how that position arrives at each value.
 *
 * Deliberately NOT configuring any touch-specific option here (e.g.
 * `syncTouch`) — Lenis's own default leaves touch scrolling native/
 * untouched, which is exactly what's wanted after everything this app
 * already went through chasing down mobile scroll regressions. Smoothing
 * touch too would be a deliberate follow-up decision, not a default.
 */
export default function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  // Same preference the rest of the app already respects (see Hero.tsx).
  // Lenis is a pure aesthetic easing layer on top of otherwise-normal
  // scrolling, so anyone who's asked for reduced motion skips it entirely
  // and gets plain native (instant, non-eased) scroll instead.
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setLenis(null);
      return;
    }

    const instance = new Lenis({
      duration: 1.2,
      // Lenis's own commonly-recommended default: an expo-out ease.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    setLenis(instance);

    // Every in-page hash link (Header's nav, MobileNav's nav, Footer's
    // "back to top") relied on the BROWSER's native anchor-jump +
    // `scroll-behavior: smooth` — both removed from globals.css/layout.tsx
    // specifically because they'd otherwise fight Lenis's own smoothing.
    // This delegated (document-level, not per-link) click handler routes
    // any hash link that points at the CURRENT page through Lenis's
    // `scrollTo` instead, so they keep the exact same eased motion as
    // normal wheel scrolling — and being delegated, it transparently covers
    // every current hash link plus any added later, with no per-link wiring.
    //
    // It matches both bare hashes ("#specs") and same-page absolute ones
    // ("/#specs", which the nav and footer use so they also work from other
    // pages). A link whose path is a DIFFERENT page is left alone, so it
    // navigates normally and the browser/Next scrolls to the hash on arrival.
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href*='#']");
      if (!anchor) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
      if (!url.hash || url.hash === "#") return;

      const destination = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!destination) return;
      event.preventDefault();
      instance.scrollTo(destination);
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      instance.destroy();
      setLenis(null);
    };
  }, [prefersReducedMotion]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}