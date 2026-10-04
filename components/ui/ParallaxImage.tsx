"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import { useEffect, useRef } from "react";

type Direction = "up" | "down" | "left" | "right" | "rotate";

interface ParallaxImageProps extends Omit<HTMLMotionProps<"img">, "style" | "ref"> {
  /** matches simpleParallax's `orientation` option, plus a new "rotate"
   * option (not from simpleParallax) that drives a scroll-linked rotation
   * instead of a positional drift — see `rotateRange` below. */
  direction: Direction;
  className?: string;
  wrapperClassName?: string;
  /** px of total drift across the scroll range. Default 28 (subtle).
   * Unused when direction === "rotate" — see `rotateRange` instead. */
  distance?: number;
  /** Spring stiffness — higher = snappier/faster catch-up to scroll position, lower = laggier. Default 90. */
  springStiffness?: number;
  /**
   * When true, the drift only ever moves further toward its end position —
   * it holds at the furthest point reached and does NOT reverse if the user
   * scrolls back up. Default false (normal reversible scroll-linked drift).
   * Only affects x/y drift directions; not currently wired up for "rotate".
   */
  holdPeak?: boolean;
  /**
   * Opt-in explicit tracking mode. By default, scroll progress is tracked
   * RELATIVE TO THIS ELEMENT (via Framer's useScroll target), which for a
   * short element positioned near the top of the page means most of its
   * tracking range is already consumed before the user scrolls at all —
   * making the drift reach its max almost instantly and making `distance`
   * changes shift the LOAD-TIME starting offset rather than the travel speed.
   *
   * When scrollRangePx is set, progress is instead computed directly from
   * raw window.scrollY / scrollRangePx (clamped 0–1) — progress is exactly 0
   * at page load regardless of the element's position, and `distance` divided
   * by this range gives a real, directly tunable px-moved-per-px-scrolled speed.
   */
  scrollRangePx?: number;
  /**
   * Only meaningful together with scrollRangePx. The image stays completely
   * still (progress locked at 0) until window.scrollY passes this absolute
   * page position — only THEN does it start counting toward scrollRangePx.
   * Used to sequence the drift so it doesn't start until some other
   * scroll-driven sequence (e.g. Hero's pinned CTA reveal) has finished.
   */
  startAfterPx?: number;
  /**
   * Only used when direction === "rotate". Degrees, [from, to] as scroll
   * progress goes 0→1. Default [-8, 8] — a modest, subtle back-and-forth
   * tilt, matching the same restrained feel `distance`'s default (28px)
   * gives the positional drift directions. Combines naturally with any
   * static CSS rotation already on a wrapping element (e.g. a resting
   * tilt), since that's a separate element/transform — this only rotates
   * the <img> itself.
   */
  rotateRange?: [number, number];
}

/**
 * Plain <img> (not next/image) on purpose: these are decorative product/lifestyle
 * shots dropped in by hand into public/images, with no known fixed dimensions —
 * this preserves the original's intrinsic-size, width-driven scaling exactly.
 *
 * `useSpring` recreates the original's `delay: 0.5, transition: 'cubic-bezier(0,0,0,1)'`
 * setting — simpleParallax didn't apply scroll position directly, it eased toward
 * it, which is what gave the drift its smooth, slightly-lagging feel.
 *
 * NOTE on props typing: this intentionally extends framer-motion's own
 * `HTMLMotionProps<"img">` rather than React's `ImgHTMLAttributes<HTMLImageElement>`,
 * since the two disagree on several event handler signatures.
 */
export default function ParallaxImage({
  direction,
  className,
  wrapperClassName,
  distance = 28,
  springStiffness = 90,
  holdPeak = false,
  scrollRangePx,
  startAfterPx = 0,
  rotateRange,
  ...imageProps
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: elementRelativeProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Explicit-range mode: raw (window.scrollY - startAfterPx) / scrollRangePx,
  // clamped 0–1. Below startAfterPx, progress is locked at exactly 0 — the
  // image doesn't move at all until scroll passes that point, then it
  // reaches 1 after scrollRangePx more pixels of scroll.
  const manualProgress = useMotionValue(0);
  useEffect(() => {
    if (scrollRangePx === undefined) return;
    let rafId: number | null = null;
    const update = () => {
      rafId = null;
      const scrolledPastStart = window.scrollY - startAfterPx;
      manualProgress.set(Math.min(1, Math.max(0, scrolledPastStart / scrollRangePx)));
    };
    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [scrollRangePx, startAfterPx, manualProgress]);

  const progress = scrollRangePx !== undefined ? manualProgress : elementRelativeProgress;

  const DRIFT_PX = distance;

  const rawUpDown = useTransform(progress, [0, 1], [DRIFT_PX, -DRIFT_PX]);
  const rawDownUp = useTransform(progress, [0, 1], [-DRIFT_PX, DRIFT_PX]);
  const rawLeftRight = useTransform(progress, [0, 1], [-DRIFT_PX, DRIFT_PX]);
  const rawRightLeft = useTransform(progress, [0, 1], [DRIFT_PX, -DRIFT_PX]);
  // Always called unconditionally (Rules of Hooks — same reason rawUpDown/
  // rawDownUp/etc. above are all computed regardless of `direction` too),
  // then selected into `rotate` below only when direction === "rotate".
  // For every other direction this just settles at 0 and stays there —
  // zero behavior change for any existing caller.
  const rawRotate = useTransform(progress, [0, 1], rotateRange ?? [-8, 8]);

  const rawY = direction === "up" ? rawUpDown : direction === "down" ? rawDownUp : null;
  const rawX = direction === "left" ? rawRightLeft : direction === "right" ? rawLeftRight : null;
  const rawRotateSelected = direction === "rotate" ? rawRotate : null;

  // "Peak hold" mode: track the most extreme value reached so far and never
  // regress toward the start, even if the raw scroll-linked value would.
  const isMinPeak = direction === "up" || direction === "left";
  const heldY = useMotionValue(rawY ? rawY.get() : 0);
  const heldX = useMotionValue(rawX ? rawX.get() : 0);

  useMotionValueEvent(rawY ?? heldY, "change", (latest) => {
    if (!holdPeak || !rawY) return;
    const current = heldY.get();
    if (isMinPeak ? latest < current : latest > current) heldY.set(latest);
  });
  useMotionValueEvent(rawX ?? heldX, "change", (latest) => {
    if (!holdPeak || !rawX) return;
    const current = heldX.get();
    if (isMinPeak ? latest < current : latest > current) heldX.set(latest);
  });

  // Spring smoothing recreates the original's 0.5s eased transition. Higher
  // springStiffness = faster catch-up.
  const springConfig = { stiffness: springStiffness, damping: 20, mass: 0.6 };
  const y = useSpring(holdPeak ? heldY : rawY ?? 0, springConfig);
  const x = useSpring(holdPeak ? heldX : rawX ?? 0, springConfig);
  const rotate = useSpring(rawRotateSelected ?? 0, springConfig);

  return (
    <div ref={ref} className={wrapperClassName}>
      <motion.img {...imageProps} style={{ x, y, rotate, willChange: "transform" }} className={className} />
    </div>
  );
}