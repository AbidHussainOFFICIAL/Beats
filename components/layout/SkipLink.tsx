"use client";

import type { MouseEvent } from "react";

/**
 * "Skip to content" — the first thing a keyboard user can tab to, which jumps
 * past the header and navigation straight to the page's <main>. It's
 * invisible until it receives focus.
 *
 * The click is handled by hand (rather than as a plain "#main" link) so that
 * focus actually moves into <main>; LenisProvider's document-level hash-link
 * handler would otherwise scroll there without moving focus, and
 * stopImmediatePropagation keeps it out of this one.
 */
export default function SkipLink() {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();
    document.getElementById("main")?.focus();
  };

  return (
    <a
      href="#main"
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-black"
    >
      Skip to content
    </a>
  );
}