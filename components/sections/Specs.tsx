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
    <section id="specs" className="pl-6 mt-[4rem] lg:mt-[8.5rem] transition-[margin]">
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

      <div className="flex justify-between mt-[3.875rem] max-w-[31.25rem] mx-auto">
        <div className="min-w-[11.25rem]">
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
        <div className="flex items-center">
          <div className="max-w-[15.625rem] md:max-w-[18.75rem] transform translate-x-8 mb-5 transition-[max-width]">
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