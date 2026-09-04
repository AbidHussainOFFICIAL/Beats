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
 * IntersectionObserver-based port of AOS's trigger math.
 *
 * A PREVIOUS version of this hook computed AOS's exact trigger formula
 * itself: `triggerY = elementTop (+ anchor-placement adjustment) + offset`,
 * `inView = (scrollY + innerHeight) > triggerY` — re-evaluated via a
 * `scroll`/`resize` listener that called `getBoundingClientRect()` (a
 * synchronous, forced layout read) on every scroll tick. That's correct
 * math, but every `Reveal`/`AnimatedHeading` on the page creates its OWN
 * independent instance of this hook — so scrolling through a section with,
 * say, a dozen active reveals meant a dozen separate scroll listeners each
 * forcing a layout recalculation on the same frames. Chrome's own profiler
 * named this exact file/line as the main-thread cost behind mobile scroll
 * stutter (mobile's stacked layouts put more revealed elements in the same
 * scroll distance than desktop's side-by-side ones do, which is why it
 * only showed up there) — see `Recalculate style — useAosReveal.ts` and
 * the accompanying `requestAnimationFrame`/`Animation frame fired` cost in
 * the trace.
 *
 * This version reproduces the SAME trigger points using
 * `IntersectionObserver` instead, which tracks visibility at the browser's
 * compositor level — no scroll listener, no polling, no per-frame layout
 * read, regardless of how many instances are mounted at once.
 *
 * THE MATH: every one of AOS's anchor-placement formulas reduces to
 * `elementTop + offset + K`, where K is some fixed combination of the
 * element's own height and/or the viewport height (see
 * `anchorPlacementExtraOffset` below — it's a direct transcription of the
 * switch AOS itself uses). The original inequality
 * `scrollY + innerHeight > elementTop + offset + K` is exactly equivalent
 * to "the element's top edge has entered a viewport whose bottom edge has
 * been pulled up by `offset + K` pixels" — which is precisely what a
 * negative bottom `rootMargin` of that same size does to an
 * IntersectionObserver's root. `K` is computed once per element (from its
 * measured height and the current viewport height), not on every scroll
 * frame — only recomputed on resize/orientation-change, since that's the
 * only thing that can actually change it.
 */

function anchorPlacementExtraOffset(anchorPlacement: AnchorPlacement, elementHeight: number, viewportHeight: number): number {
  switch (anchorPlacement) {
    case "center-bottom":
      return elementHeight / 2;
    case "bottom-bottom":
      return elementHeight;
    case "top-center":
      return viewportHeight / 2;
    case "bottom-center":
      return viewportHeight / 2 + elementHeight;
    case "center-center":
      return viewportHeight / 2 + elementHeight / 2;
    case "top-top":
      return viewportHeight;
    case "bottom-top":
      return elementHeight + viewportHeight;
    case "center-top":
      return elementHeight / 2 + viewportHeight;
    case "top-bottom":
    default:
      return 0;
  }
}

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

    let observer: IntersectionObserver | null = null;
    let resizeRafId: number | null = null;

    const createObserver = () => {
      observer?.disconnect();

      // Measured once here (and again only on resize) — NOT on every
      // scroll frame, which is the whole point of this rewrite.
      const rect = node.getBoundingClientRect();
      const extra = anchorPlacementExtraOffset(anchorPlacement, rect.height, window.innerHeight);
      const margin = offset + extra;

      // A negative bottom rootMargin shrinks the observer's effective
      // viewport from the bottom by `margin` px, delaying intersection
      // until the element's top has been scrolled to within `margin` px
      // of the REAL viewport bottom — reproducing AOS's "larger offset
      // triggers later" behavior exactly.
      //
      // The +200px on top/left/right is a fix for a real bug, not a
      // stylistic choice: IntersectionObserver measures an element's
      // ACTUAL RENDERED position, including any active CSS transform —
      // and Reveal's "hidden" state applies exactly that (e.g. fade-down
      // is `translateY(-100px)`). For most elements that's harmless (a
      // ~100px measurement error self-corrects as the page scrolls), but
      // for anything inside `position: sticky` content — like Header's
      // logo/nav, which sits pinned near the top of the viewport
      // REGARDLESS of scroll — that -100px transform permanently shifts
      // it above y=0, so it never intersects, `inView` never flips true,
      // and Framer never animates it back to its resting position: a
      // permanent deadlock, not a timing glitch. Expanding the top/left/
      // right detection zone gives enough slack to tolerate any of
      // Reveal's ±100px hidden-state offsets without weakening the
      // bottom-edge math that actually implements `offset`/
      // `anchorPlacement`'s "triggers later as you scroll down" behavior.
      const transformForgivenessPx = 200;
      observer = new IntersectionObserver(
        (entries) => {
          // `entries[0]` is typed as possibly `undefined` under this
          // project's `noUncheckedIndexedAccess` tsconfig option — in
          // practice IntersectionObserver always calls back with at least
          // one entry for an observer watching exactly one node, but this
          // guard satisfies the type checker without turning that option
          // off, and costs nothing at runtime.
          const entry = entries[0];
          if (!entry) return;

          if (entry.isIntersecting) {
            hasTriggeredRef.current = true;
            setInView(true);
            // Nothing left to watch once a `once` reveal has fired —
            // disconnecting here is a small extra optimization the
            // previous version didn't have (it kept listening forever).
            if (once) observer?.disconnect();
          } else if (!once) {
            setInView(false);
          }
        },
        {
          rootMargin: `${transformForgivenessPx}px ${transformForgivenessPx}px -${margin}px ${transformForgivenessPx}px`,
          threshold: 0,
        }
      );

      observer.observe(node);
    };

    createObserver();

    // K depends on the element's own height and the viewport height, both
    // of which can change (window resize, phone rotation) — recompute and
    // recreate the observer when that happens. rAF-guarded so a burst of
    // resize events (e.g. dragging a window edge, or DevTools' device
    // toolbar) collapses to one recreation per frame rather than one per
    // event, for every mounted instance.
    const handleResize = () => {
      if (once && hasTriggeredRef.current) return;
      if (resizeRafId !== null) return;
      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = null;
        createObserver();
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
      observer?.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [offset, once, anchorPlacement]);

  return { ref, inView };
}