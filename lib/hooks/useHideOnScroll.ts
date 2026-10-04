"use client";

import { useEffect, useState } from "react";

/** Within this distance (px) of the page top, the header is always shown. */
const ALWAYS_SHOW_WITHIN_PX = 80;
/** Scroll movement (px) needed in one direction before it counts as a direction change. */
const DIRECTION_THRESHOLD_PX = 8;

/**
 * Returns `true` while the user is scrolling down (header should hide) and
 * `false` while scrolling up or near the top (header should show).
 *
 * Pass `enabled = false` to turn it off entirely (no listener is attached
 * and the result is always `false`) — Header only enables it below `lg`, so
 * desktop never pays for a scroll listener it doesn't use.
 */
export function useHideOnScroll(enabled: boolean): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setHidden(false);
      return;
    }

    let anchorY = window.scrollY;
    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      const y = window.scrollY;

      if (y <= ALWAYS_SHOW_WITHIN_PX) {
        setHidden(false);
        anchorY = y;
        return;
      }

      const delta = y - anchorY;
      if (Math.abs(delta) < DIRECTION_THRESHOLD_PX) return;

      setHidden(delta > 0);
      anchorY = y;
    };

    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled]);

  return hidden;
}