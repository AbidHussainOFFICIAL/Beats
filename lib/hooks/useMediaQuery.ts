"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe media query hook. Always starts at `false` (matching what the
 * server renders) and updates after mount via `window.matchMedia` — this
 * intentionally avoids a hydration mismatch at the cost of a one-frame
 * "flash" from the default/mobile branch to the matched branch on desktop
 * load. That trade-off is standard practice for this exact scenario.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}