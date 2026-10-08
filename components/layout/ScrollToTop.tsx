"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "@/components/providers/LenisProvider";

let preserveNext = false;
let preserveTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Call this from a link's onClick when the NEXT navigation should keep the
 * current scroll position (e.g. switching a product's color). It lapses after
 * a second, so a click that doesn't navigate can't affect a later page change.
 */
export function preserveScrollOnNextNavigation(): void {
  preserveNext = true;
  if (preserveTimer) clearTimeout(preserveTimer);
  preserveTimer = setTimeout(() => {
    preserveNext = false;
  }, 1000);
}

/** The "#section" part of the link the visitor last clicked, and when. */
const lastClick = { hash: "", at: 0 };
/** A click older than this is no longer treated as the cause of a navigation. */
const CLICK_MEMORY_MS = 5000;

/**
 * Makes every page change start at the top of the new page.
 *
 * The header, footer and tab bar stay mounted between pages, so the browser
 * keeps the old scroll offset, and Next only scrolls to the top when the new
 * page's first element is off-screen. This forces the top itself (through
 * Lenis too, so its internal position doesn't snap back), and checks once
 * more on the next frame in case something nudged it in between. It
 * deliberately does nothing for:
 *   - the first load (so refreshing keeps the browser's own restore),
 *   - links that point at a "#section" (e.g. "/#products"), which scroll to
 *     that section instead,
 *   - navigations flagged with preserveScrollOnNextNavigation().
 *
 * "Is this a hash link?" comes from the clicked link itself, NOT from
 * window.location: when this runs right after a page change, the address bar
 * may not have been updated yet, so it can still show the PREVIOUS page's
 * "#hash" — which used to make the reset skip itself after arriving through
 * a "/#products" link.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      const anchor = target instanceof Element ? target.closest<HTMLAnchorElement>("a[href]") : null;
      let hash = "";
      if (anchor) {
        try {
          const url = new URL(anchor.href, window.location.href);
          if (url.origin === window.location.origin) hash = url.hash;
        } catch {
          // Not a parseable URL — treat it as having no hash.
        }
      }
      lastClick.hash = hash;
      lastClick.at = Date.now();
    };

    // Capture phase, so it runs before any link's own handler and the stored
    // value is already in place when the navigation completes.
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;
    previousPathnameRef.current = pathname;

    const clickedHash = Date.now() - lastClick.at < CLICK_MEMORY_MS ? lastClick.hash : "";
    lastClick.hash = "";

    if (preserveNext) {
      preserveNext = false;
      return;
    }
    if (clickedHash) return;

    const resetScroll = () => {
      window.scrollTo(0, 0);
      lenis?.scrollTo(0, { immediate: true });
    };
    resetScroll();
    const frameId = requestAnimationFrame(() => {
      if (window.scrollY > 0) resetScroll();
    });
    return () => cancelAnimationFrame(frameId);
  }, [pathname, lenis]);

  return null;
}