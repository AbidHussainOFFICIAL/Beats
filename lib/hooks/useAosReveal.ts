"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export type AnchorPlacement =
  | "top-bottom"
  | "center-bottom"
  | "bottom-bottom"
  | "top-center"
  | "bottom-center"
  | "center-center"
  | "top-top"
  | "bottom-top"
  | "center-top";

interface UseAosRevealOptions {
  /** px — matches data-aos-offset. Larger = triggers later (more scroll needed). */
  offset?: number;
  /** matches data-aos-once */
  once?: boolean;
  /** matches data-aos-anchor-placement, default "top-bottom" */
  anchorPlacement?: AnchorPlacement;
}

/**
 * Direct port of AOS's own trigger math (from aos.js), rather than an
 * approximation via Framer Motion's IntersectionObserver `viewport.margin`.
 *
 * The margin-based approach required guessing a viewport height to convert
 * "offset" into a margin percentage/pixel value — on any screen shorter than
 * that guess, offsets would eat a disproportionate share of the trigger zone,
 * firing far later than intended, and firing on a smaller/less gradual window
 * (reads as "sudden"). This hook instead measures the real element position
 * and real viewport height on every scroll, exactly like AOS did:
 *
 *   triggerY = elementTop (+ anchor-placement adjustment) + offset
 *   inView   = (scrollY + innerHeight) > triggerY
 *
 * No estimates, no conversion — same numbers AOS itself used.
 */
export function useAosReveal<T extends HTMLElement>({
  offset = 120,
  once = false,
  anchorPlacement = "top-bottom",
}: UseAosRevealOptions = {}): { ref: RefObject<T>; inView: boolean } {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let rafId: number | null = null;

    const evaluate = () => {
      rafId = null;
      const rect = node.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;

      // Mirrors AOS's anchorPlacement switch exactly (see aos.js source).
      let triggerBase = elementTop;
      switch (anchorPlacement) {
        case "center-bottom":
          triggerBase += rect.height / 2;
          break;
        case "bottom-bottom":
          triggerBase += rect.height;
          break;
        case "top-center":
          triggerBase += window.innerHeight / 2;
          break;
        case "bottom-center":
          triggerBase += window.innerHeight / 2 + rect.height;
          break;
        case "center-center":
          triggerBase += window.innerHeight / 2 + rect.height / 2;
          break;
        case "top-top":
          triggerBase += window.innerHeight;
          break;
        case "bottom-top":
          triggerBase += rect.height + window.innerHeight;
          break;
        case "center-top":
          triggerBase += rect.height / 2 + window.innerHeight;
          break;
        case "top-bottom":
        default:
          break;
      }

      const triggerY = triggerBase + offset;
      const viewportBottom = window.scrollY + window.innerHeight;
      const shouldShow = viewportBottom > triggerY;

      if (shouldShow) {
        hasTriggeredRef.current = true;
        setInView(true);
      } else if (!once) {
        setInView(false);
      }
      // if `once` and already triggered, leave it visible (ignore shouldShow=false)
    };

    const requestEvaluate = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(evaluate);
      }
    };

    evaluate(); // initial check on mount, matches AOS running once on DOMContentLoaded
    window.addEventListener("scroll", requestEvaluate, { passive: true });
    window.addEventListener("resize", requestEvaluate);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", requestEvaluate);
      window.removeEventListener("resize", requestEvaluate);
    };
  }, [offset, once, anchorPlacement]);

  return { ref, inView };
}