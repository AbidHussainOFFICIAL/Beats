"use client";

import { useState } from "react";

/**
 * A tap/click "pressed" state driven by real pointer events instead of the
 * CSS `:active` pseudo-class.
 *
 * WHY: `:active` is well-known to be unreliable on <a> tags whose href
 * triggers navigation — even a same-page anchor jump like "#home" or "#"
 * counts. On mobile specifically, when a tap starts navigating, the browser
 * can lose track of the follow-up event that's supposed to clear `:active`,
 * so the "pressed" look gets stuck on screen indefinitely (confirmed: this
 * is exactly what was happening to Footer's social icons and back-to-top
 * button — both real navigating anchors).
 *
 * Tracking press state ourselves via pointerdown/up/leave/cancel means WE
 * decide exactly when it turns on and off — not the browser's internal
 * bookkeeping around a navigation it's mid-way through — so it can't get
 * stuck. pointerleave/pointercancel are included specifically so a finger
 * sliding off the element (not just a clean tap-and-lift) still correctly
 * clears it.
 *
 * Also used for plain non-navigating elements (Products' cards/cart
 * buttons) — those were never at risk of the :active-stuck bug specifically
 * (no href, no navigation to interrupt the event sequence), but this same
 * pointer-driven approach still gives clean, consistent, reliable tap
 * feedback across the whole app rather than mixing mechanisms.
 */
export function usePressedState() {
  const [isPressed, setIsPressed] = useState(false);
  return {
    isPressed,
    handlers: {
      onPointerDown: () => setIsPressed(true),
      onPointerUp: () => setIsPressed(false),
      onPointerLeave: () => setIsPressed(false),
      onPointerCancel: () => setIsPressed(false),
    },
  };
}