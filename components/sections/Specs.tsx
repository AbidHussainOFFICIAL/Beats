"use client";

import { motion } from "framer-motion";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import ScrollRevealImage from "@/components/ui/ScrollRevealImage";
import { useAosReveal } from "@/lib/hooks/useAosReveal";
import { specs } from "@/lib/data";

const SPECS_LETTERS = ["S", "p", "e", "c", "s"];

// Matches AOS's default easing (CSS "ease"), same as Reveal.tsx/AnimatedHeading.
const AOS_DEFAULT_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];

export default function Specs() {
  // ONE shared trigger for the whole list — measured against the <ul> itself,
  // not per-item. Each item still staggers in via its own `spec.delay`, but
  // all of them key off the same inView boolean, so the group shows together
  // (and hides together on the way back up) instead of each item requiring
  // its own extra scroll distance to trigger independently.
  const { ref, inView } = useAosReveal<HTMLUListElement>({ offset: 300 });

  return (
    <section id="specs" className="px-6 mt-[4rem] lg:mt-[8.5rem] transition-[margin]">
      <AnimatedHeading
        as="h2"
        className="text-center text-[3.5rem] md:text-[4.5rem]"
        offset={300}
        letters={SPECS_LETTERS.map((char, i) => ({
          char,
          delay: i * 50,
          className: i === 0 ? undefined : "-ml-0.5",
        }))}
      />

      {/* Below sm this was previously a fixed-width flex row (icon list
          min-w-[11.25rem] + image container, side by side) inside a
          section that only had LEFT padding (pl-6, no pr-6) — the combined
          widths didn't fit a phone-width viewport, and the missing right
          padding meant content could sit flush against the screen edge.
          Below sm it now stacks vertically and centers instead; sm+ is
          untouched from the original side-by-side layout. */}
      <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-center sm:justify-between sm:gap-0 mt-[3.875rem] max-w-[31.25rem] mx-auto">
        <div className="w-full max-w-[13rem] sm:max-w-none sm:min-w-[11.25rem] sm:w-auto">
          <ul ref={ref} className="space-y-7">
            {specs.map((spec) => (
              <li
                key={spec.title}
                className={`transform hover:scale-110 transition-transform duration-700 ${spec.indent ? "pl-6" : ""}`}
              >
                <motion.span
                  className="block"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={
                    inView
                      ? {
                          opacity: 1,
                          scale: 1,
                          transition: { duration: 0.7, delay: spec.delay / 1000, ease: AOS_DEFAULT_EASE },
                        }
                      : {
                          opacity: 0,
                          scale: 0.6,
                          // No delay on exit, matching AOS's transition-delay
                          // reset the instant an element leaves the viewport.
                          transition: { duration: 0.7, ease: AOS_DEFAULT_EASE },
                        }
                  }
                >
                  <span className="block">
                    <spec.icon />
                  </span>
                  <span className="block text-base font-semibold">{spec.title}</span>
                  {spec.lines.map((line) => (
                    <span key={line} className="block text-xs text-[#BDC0C2] font-light">
                      {line}
                    </span>
                  ))}
                </motion.span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-center sm:justify-start">
          <div className="max-w-[12.5rem] sm:max-w-[15.625rem] md:max-w-[18.75rem] sm:transform sm:translate-x-8 mb-0 sm:mb-5 transition-[max-width]">
            <ScrollRevealImage
              src="/images/content/specs-headphones-bkg.png"
              alt="black headphones"
              fromX={140}
              fromY={140}
              fromScale={0.6}
              wrapperClassName="images1 w-full"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}