"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/**
 * Makes every Framer Motion animation on the site respect the visitor's
 * "reduce motion" setting. With `reducedMotion="user"`, when that setting is
 * on, movement and scaling (x, y, scale, rotate…) are skipped — elements
 * simply appear in place — while fades still play. Scroll-linked effects
 * (parallax, drift, the pinned hero) are handled separately in their own
 * components, since they aren't animations that MotionConfig controls.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}