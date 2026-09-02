"use client";

import { motion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { useAosReveal } from "@/lib/hooks/useAosReveal";

// AOS's default easing is CSS "ease" — cubic-bezier(0.25, 0.1, 0.25, 1.0).
const AOS_DEFAULT_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];

export interface HeadingLetter {
  char: ReactNode;
  /** ms — matches the original data-aos-delay per letter (applies on entrance only) */
  delay?: number;
  /** e.g. "-ml-[1.1875rem] md:-ml-[1.75rem]" — matches original kerning classes */
  className?: string;
}

interface AnimatedHeadingProps {
  as?: ElementType;
  letters: HeadingLetter[];
  className?: string;
  duration?: number;
  /** viewport offset in px, matches data-aos-offset (larger = triggers LATER) */
  offset?: number;
}

export default function AnimatedHeading({
  as: Tag = "h2",
  letters,
  className,
  duration = 700,
  offset = 300,
}: AnimatedHeadingProps) {
  const { ref, inView } = useAosReveal<HTMLElement>({ offset });

  return (
    <Tag ref={ref} className={`aos-animation transition-text ${className ?? ""}`}>
      <LetterRow letters={letters} duration={duration} inView={inView} />
    </Tag>
  );
}

/**
 * Bare letter-span row, sharing a single `inView` trigger from a parent
 * useAosReveal call — used when a heading needs multiple independently
 * masked lines under one outer <h2> (see Products' two-line heading, which
 * calls useAosReveal itself and passes inView down to two LetterRows).
 */
export function LetterRow({
  letters,
  duration = 700,
  inView,
}: {
  letters: HeadingLetter[];
  duration?: number;
  inView: boolean;
}) {
  return (
    <>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className={`inline-block ${letter.className ?? ""}`}
          initial={{ opacity: 0, y: 100 }}
          animate={
            inView
              ? {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: duration / 1000,
                    delay: (letter.delay ?? 0) / 1000,
                    ease: AOS_DEFAULT_EASE,
                  },
                }
              : {
                  opacity: 0,
                  y: 100,
                  // No delay on exit, matching AOS's transition-delay reset.
                  transition: { duration: duration / 1000, ease: AOS_DEFAULT_EASE },
                }
          }
        >
          {letter.char}
        </motion.span>
      ))}
    </>
  );
}