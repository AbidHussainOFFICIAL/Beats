"use client";

import { useCallback } from "react";
import { useLenis } from "@/components/providers/LenisProvider";

/**
 * Returns a function that scrolls to the element with the given id.
 *
 * With Lenis active the scroll gets the same eased motion as every other
 * in-page jump. `lenis.start()` is called first because Lenis ignores
 * scrollTo() while stopped — which is the case while the mobile menu is
 * open — and it's a no-op when Lenis is already running. When Lenis is off
 * (reduced motion) the browser's own instant scroll is used instead.
 *
 * For plain `<a href="#...">` links this isn't needed: LenisProvider already
 * routes those through Lenis. This is for buttons, which aren't anchors.
 */
export function useScrollToSection() {
  const lenis = useLenis();

  return useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;

      if (lenis) {
        lenis.start();
        lenis.scrollTo(target);
      } else {
        target.scrollIntoView();
      }
    },
    [lenis]
  );
}