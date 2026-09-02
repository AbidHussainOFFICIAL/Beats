"use client";

import { motion, useScroll, useTransform, type HTMLMotionProps } from "framer-motion";
import { useAosReveal } from "@/lib/hooks/useAosReveal";

interface ScrollRevealImageProps extends Omit<HTMLMotionProps<"img">, "style" | "ref"> {
  /** px offset to start from horizontally (positive = starts to the right, negative = starts to the left). Settles to 0. */
  fromX?: number;
  /** px offset to start from vertically (positive = starts below, negative = starts above). Settles to 0. */
  fromY?: number;
  /** Starting scale (e.g. 0.6 = starts at 60% size). Settles to 1 (full size). */
  fromScale?: number;
  /** ms — duration of the one-time entrance animation, once triggered. Default 650. */
  duration?: number;
  /** px amplitude of the ongoing left-right drift once settled. Default 20 (subtle). Set to 0 to disable. */
  driftAmount?: number;
  /** Which direction the drift moves first as the user scrolls down. Default "left". */
  driftDirection?: "left" | "right";
  className?: string;
  wrapperClassName?: string;
}

// Matches AOS's default easing (CSS "ease"), same as Reveal.tsx/AnimatedHeading.
const AOS_DEFAULT_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];

/**
 * ONE-TIME entrance reveal + ONGOING ambient drift, layered on separate
 * elements so they don't fight over the same transform:
 *
 *   - Outer wrapper: a binary "has this entered view" trigger (same
 *     useAosReveal hook Reveal.tsx/AnimatedHeading use), driving a proper
 *     TIME-based animation (opacity/position/scale settle over `duration`ms)
 *     that plays automatically once triggered — not scrubbed by scroll
 *     position, so scrolling fast doesn't skip past it.
 *   - Inner image: a small, continuous, scroll-linked left-right drift
 *     (same mechanism as ParallaxImage), which keeps animating for as long
 *     as the image is on screen. Being on a nested element, its transform
 *     composes with the outer wrapper's rather than conflicting with it.
 *
 * A prior version tied position/scale/opacity directly to scroll progress
 * through an "entrance window" — meaning the reveal only completed if the
 * user scrolled exactly that distance, and could be skipped entirely by a
 * fast scroll. This version separates "arrive once" (time-based) from
 * "drift while present" (scroll-based) instead.
 *
 * NOTE on props typing: this extends framer-motion's own `HTMLMotionProps<"img">`
 * rather than React's `ImgHTMLAttributes<HTMLImageElement>` — the two disagree
 * on several event handler signatures (e.g. onAnimationStart), so spreading
 * plain ImgHTMLAttributes onto <motion.img> causes a TS2322 type error.
 */
export default function ScrollRevealImage({
  fromX = 0,
  fromY = 0,
  fromScale = 0.6,
  duration = 650,
  driftAmount = 20,
  driftDirection = "left",
  className,
  wrapperClassName,
  ...imageProps
}: ScrollRevealImageProps) {
  const { ref, inView } = useAosReveal<HTMLDivElement>({ offset: 150 });

  // Continuous drift, tracked against the SAME element the entrance trigger
  // measures — both hooks just read getBoundingClientRect from it, so one
  // shared ref works for both.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const driftX = useTransform(
    scrollYProgress,
    [0, 1],
    driftDirection === "left" ? [driftAmount, -driftAmount] : [-driftAmount, driftAmount]
  );

  return (
    <div ref={ref} className={wrapperClassName}>
      <motion.div
        initial={{ opacity: 0, x: fromX, y: fromY, scale: fromScale }}
        animate={
          inView
            ? { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: duration / 1000, ease: AOS_DEFAULT_EASE } }
            : {
                opacity: 0,
                x: fromX,
                y: fromY,
                scale: fromScale,
                transition: { duration: duration / 1000, ease: AOS_DEFAULT_EASE },
              }
        }
      >
        <motion.img {...imageProps} style={{ x: driftX, willChange: "transform" }} className={className} />
      </motion.div>
    </div>
  );
}