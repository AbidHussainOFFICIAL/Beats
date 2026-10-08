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

/**
 * Makes every page change start at the top of the new page.
 *
 * The header, footer and tab bar stay mounted between pages, so the browser
 * keeps the old scroll offset, and Next only scrolls to the top when the new
 * page's first element is off-screen — which leaves short pages opening
 * part-way down. This forces the top itself (through Lenis too, so its
 * internal position doesn't snap back). It deliberately does nothing for:
 *   - the first load (so refreshing keeps the browser's own restore),
 *   - links with a hash (e.g. "/#products"), which scroll to their section,
 *   - navigations flagged with preserveScrollOnNextNavigation().
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;
    previousPathnameRef.current = pathname;

    if (preserveNext) {
      preserveNext = false;
      return;
    }
    if (window.location.hash) return;

    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}