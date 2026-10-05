"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import ScrollRevealImage from "@/components/ui/ScrollRevealImage";
import { useAosReveal } from "@/lib/hooks/useAosReveal";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { specs } from "@/lib/data";

const SPECS_LETTERS = ["S", "p", "e", "c", "s"];

// Matches AOS's default easing (CSS "ease"), same as Reveal.tsx/AnimatedHeading.
const AOS_DEFAULT_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];

/**
 * Two body layouts under the shared heading, chosen at the `sm` (640px)
 * breakpoint — only the one that applies is ever mounted:
 *
 *   SpecsWide (sm+, including tablets and desktop): the original layout —
 *   the zigzag spec list on the left, the headphone on the right.
 *
 *   SpecsMobile (<sm): the headphone first, then the four specs as a 2×2
 *   grid of equal, centered cards. The stacked desktop list left the text
 *   sitting off-center under the centered heading and made the section
 *   longer than a screen; a centered grid keeps everything visible
 *   together. Each card reveals on its own as it scrolls into view (the
 *   list's single shared trigger fired before the lower items were on a
 *   phone's screen), and the headphone rises into place instead of flying
 *   in diagonally from off-screen.
 *
 * The first render (before the media query resolves) is always the mobile
 * layout, so the server HTML matches the client's first render; on wider
 * screens it is swapped for SpecsWide right after mount, while still hidden.
 */

function SpecsWide() {
  // ONE shared trigger for the whole list — measured against the <ul> itself,
  // not per-item. Each item still staggers in via its own `spec.delay`, but
  // all of them key off the same inView boolean, so the group shows together
  // (and hides together on the way back up) instead of each item requiring
  // its own extra scroll distance to trigger independently.
  const { ref, inView } = useAosReveal<HTMLUListElement>({ offset: 300 });

  return (
    <div className="flex flex-row items-center justify-between mt-[3.875rem] max-w-[31.25rem] mx-auto">
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
      <div className="flex items-center justify-start">
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
  );
}

/**
 * One spec card. Every icon sits in the same fixed-height box so the titles
 * line up across a row no matter how tall each icon is, and the grid
 * stretches the cards in a row to equal height (the Microphone card has a
 * second detail line). The zoom-in matches the scale/fade the desktop list
 * items use; `delay` only staggers the two cards of a row, since each row
 * triggers separately as it scrolls into view.
 */
function MobileSpecCard({ spec, delay }: { spec: (typeof specs)[number]; delay: number }) {
  return (
    <Reveal
      variant="zoom-in"
      duration={700}
      delay={delay}
      offset={250}
      className="flex flex-col items-center rounded-lg bg-[#181A1B] px-3 py-5 text-center"
    >
      <span className="flex h-7 items-center justify-center">
        <spec.icon />
      </span>
      <h3 className="mt-3 text-base font-semibold">{spec.title}</h3>
      <div className="mt-1 text-[0.8125rem] font-light leading-5 text-[#BDC0C2]">
        {spec.lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </div>
    </Reveal>
  );
}

function SpecsMobile() {
  return (
    <>
      <div className="mx-auto mt-6 max-w-[14rem]">
        <ScrollRevealImage
          src="/images/content/specs-headphones-bkg.png"
          alt="black headphones"
          fromY={40}
          fromScale={0.85}
          wrapperClassName="images1 w-full"
          className="w-full"
        />
      </div>

      <div className="mx-auto mt-10 grid max-w-[21rem] grid-cols-2 gap-3">
        {specs.map((spec, i) => (
          <MobileSpecCard key={spec.title} spec={spec} delay={(i % 2) * 100} />
        ))}
      </div>
    </>
  );
}

export default function Specs() {
  const isWide = useMediaQuery("(min-width: 640px)");

  return (
    <section id="specs" className="px-6 mt-[4rem] lg:mt-[8.5rem] transition-[margin]">
      {/* max-sm:leading-[4rem]: below sm the heading's inherited 1.5 line
          height made its box 84px tall around 56px text — tightened to 64px
          on phones only; sm+ keeps the inherited value exactly as before. */}
      <AnimatedHeading
        as="h2"
        className="max-sm:leading-[4rem] text-center text-[3.5rem] md:text-[4.5rem]"
        offset={300}
        letters={SPECS_LETTERS.map((char, i) => ({
          char,
          delay: i * 50,
          className: i === 0 ? undefined : "-ml-0.5",
        }))}
      />

      {isWide ? <SpecsWide /> : <SpecsMobile />}
    </section>
  );
}