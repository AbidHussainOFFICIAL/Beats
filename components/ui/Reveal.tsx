"use client";

import { motion } from "framer-motion";
import type { ReactNode, Ref } from "react";
import { useAosReveal, type AnchorPlacement } from "@/lib/hooks/useAosReveal";

export type RevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "zoom-in-up"
  | "zoom-in-down"
  | "zoom-in-left"
  | "zoom-in-right";

export type { AnchorPlacement };

interface RevealProps {
  children: ReactNode;
  /** Matches the original data-aos value */
  variant?: RevealVariant;
  /** ms — matches data-aos-duration */
  duration?: number;
  /** ms — matches data-aos-delay (applied on entrance only, matching AOS) */
  delay?: number;
  /**
   * px — matches data-aos-offset (larger = triggers later, needs more scroll).
   * Default: 120, UNLESS anchorPlacement is explicitly set and offset isn't
   * — in that case the effective default is 0, matching AOS's real behavior.
   */
  offset?: number;
  /** matches data-aos-once (AOS default is false: re-animate every time it re-enters view) */
  once?: boolean;
  /** matches data-aos-anchor-placement, default "top-bottom" */
  anchorPlacement?: AnchorPlacement;
  className?: string;
  as?: "div" | "span" | "li";
}

// AOS's default translate distance is 100px for fades, with a 0.6 scale for zoom-ins.
// fade-left ENTERS FROM THE RIGHT (starts at +x, animates left into place).
// fade-right ENTERS FROM THE LEFT (starts at -x, animates right into place).
const hiddenStateFor = (variant: RevealVariant) => {
  switch (variant) {
    case "fade-up":
      return { opacity: 0, y: 100 };
    case "fade-down":
      return { opacity: 0, y: -100 };
    case "fade-left":
      return { opacity: 0, x: 100 };
    case "fade-right":
      return { opacity: 0, x: -100 };
    case "zoom-in":
      return { opacity: 0, scale: 0.6 };
    case "zoom-in-up":
      return { opacity: 0, scale: 0.6, y: 100 };
    case "zoom-in-down":
      return { opacity: 0, scale: 0.6, y: -100 };
    case "zoom-in-left":
      return { opacity: 0, scale: 0.6, x: -100 };
    case "zoom-in-right":
      return { opacity: 0, scale: 0.6, x: 100 };
    default:
      return { opacity: 0 };
  }
};

// AOS's default easing is CSS "ease", i.e. cubic-bezier(0.25, 0.1, 0.25, 1.0).
const AOS_DEFAULT_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];

export default function Reveal({
  children,
  variant = "fade-up",
  duration = 700,
  delay = 0,
  offset,
  once = false,
  anchorPlacement,
  className,
  as = "div",
}: RevealProps) {
  const hidden = hiddenStateFor(variant);

  // Mirrors AOS's real default-resolution logic exactly: AOS only applies its
  // global default offset (120) when NEITHER anchor-placement NOR offset was
  // set on the element. If anchor-placement IS set but offset is NOT, the
  // effective offset is 0 — not 120. Footer links set anchor-placement="top-bottom"
  // with no explicit offset in the original markup, so their real offset is 0.
  // Defaulting to 120 unconditionally (as a prior version of this file did)
  // pushed their trigger point past the total scrollable document height for
  // elements near the very bottom of the page — a threshold that can never be
  // satisfied, since you can't scroll further than the document's actual end.
  // That's what made every footer link after the first one stay invisible.
  const effectiveAnchorPlacement = anchorPlacement ?? "top-bottom";
  const effectiveOffset = offset ?? (anchorPlacement !== undefined ? 0 : 120);

  const { ref, inView } = useAosReveal<HTMLElement>({
    offset: effectiveOffset,
    once,
    anchorPlacement: effectiveAnchorPlacement,
  });
  const MotionTag = motion[as];

  return (
    <MotionTag
      // `MotionTag` is a union of motion.div | motion.span | motion.li (chosen
      // dynamically via the `as` prop), so TS computes its ref type as an
      // intersection of all three elements' ref types — which no single real
      // DOM node can satisfy. The hook's ref is correctly typed as a plain
      // HTMLElement at runtime; this cast just satisfies that TS quirk.
      ref={ref as Ref<HTMLDivElement & HTMLSpanElement & HTMLLIElement>}
      className={className}
      initial={hidden}
      animate={
        inView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              transition: { duration: duration / 1000, delay: delay / 1000, ease: AOS_DEFAULT_EASE },
            }
          : {
              ...hidden,
              // Exit plays at the same duration/easing as entrance, but with
              // NO delay — matching AOS, whose transition-delay resets to 0
              // the instant an element leaves the viewport.
              transition: { duration: duration / 1000, ease: AOS_DEFAULT_EASE },
            }
      }
    >
      {children}
    </MotionTag>
  );
}