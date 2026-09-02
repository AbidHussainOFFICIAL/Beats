"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import ParallaxImage from "@/components/ui/ParallaxImage";
import { BagIcon } from "@/components/icons";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { HERO_RUNWAY_HEIGHT_VH } from "@/lib/constants";

/**
 * HERO SCROLL SEQUENCE — desktop only.
 *
 * The hero is wrapped in a tall "runway" (220vh) that the visible hero stays
 * `sticky`-pinned within. As the user scrolls through that runway, we're not
 * scrolling the page past the hero — we're reading scroll progress (0→1)
 * through the runway's own height and using it to drive three phases:
 *
 *   Phase 1 (0     → ~0.30): everything as normal, fully visible, no CTA.
 *   Phase 2 (~0.30 → ~0.55): "On ear" heading + Overview text fade out and
 *                            lift slightly; "Beats 3" shifts up to fill the
 *                            space they leave behind.
 *   Phase 3 (~0.60 → ~0.85): "Add to Bag" button fades + scales in from
 *                            nothing — genuinely absent until this point.
 *
 * Once the runway is fully scrolled, the section un-pins and the page
 * continues normally into Specs. The headphone image's own parallax drift
 * (see ParallaxImage) is now SEQUENCED to start only after the runway ends —
 * it stays completely still through all three phases, then begins its
 * upward drift once the user continues scrolling past the pinned sequence.
 *
 * MOBILE / REDUCED MOTION: this entire mechanism is gated behind
 * `usePinnedSequence` (desktop width AND no reduced-motion preference). When
 * false, the ORIGINAL static/Reveal-based hero renders — unchanged from
 * before this update. This is a hard JS branch, not just responsive CSS, so
 * mobile's behavior is guaranteed identical to what it was previously.
 *
 * "On ear" / Beats 3 SPACING NOTE: the "On ear" heading carries a clip-path
 * mask + webkit gradient-text effect (see globals.css .aos-animation and the
 * h1/h1-span gradient rules). Applying any `transform` to that element OR to
 * a wrapper immediately around it — even just for a small vertical shift —
 * produced a rendering glitch (a single oversized, misplaced glyph). Extra
 * spacing between "On ear" and "Beats 3" is therefore done by pushing
 * "Beats 3" DOWN via its own margin-top instead, which is a plain h4 with
 * none of that fragile styling and is safe to adjust freely.
 */

const PHASE_FADE_OUT: [number, number] = [0.3, 0.55];
const PHASE_CTA_IN: [number, number] = [0.6, 0.85];
// Matches AOS's default easing (CSS "ease"), same as Reveal.tsx/AnimatedHeading —
// used for the one-time page-load entrance on Beats 3/Overview/paragraph below.
const AOS_DEFAULT_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];

function HeroHeadphoneImage({ parallaxStartAfterPx }: { parallaxStartAfterPx?: number }) {
  return (
    <div className="w-0 lg:w-full transition-[width]">
      <div className="absolute top-0 -right-40 lg:left-40 transform -translate-y-[25rem] md:-translate-y-[29rem] lg:-translate-y-[31rem] -translate-x-[34vw] lg:-translate-x-[5.6875rem] w-[15.9375rem] md:w-[18.75rem] z-0 transition-[width]">
        {/* Mobile: fades in, no parallax drift (parallax was desktop-only via .headphones) */}
        <Reveal variant="fade-down" duration={700} delay={200} className="lg:hidden">
          <img src="/images/content/header-headphone-bkg.png" role="presentation" alt="" className="w-full" />
        </Reveal>
        <Reveal variant="fade-down" duration={700} delay={200} className="hidden lg:block">
          <ParallaxImage
            src="/images/content/header-headphone-bkg.png"
            alt=""
            direction="up"
            distance={240}
            springStiffness={220}
            scrollRangePx={500}
            startAfterPx={parallaxStartAfterPx}
            wrapperClassName="headphones w-full"
            className="w-full"
          />
        </Reveal>
      </div>
    </div>
  );
}

/** Original, unchanged, non-pinned hero text — used for mobile AND as the
 * reduced-motion fallback on desktop. */
function HeroStaticText() {
  return (
    <div className="relative w-full">
      <AnimatedHeading
        as="h1"
        className="text-[5rem] md:text-[7.5rem] font-semibold leading-[6rem] pl-[0.9375rem] md:pl-12"
        letters={[
          { char: "O", delay: 0 },
          { char: "n", delay: 50, className: "-ml-[0.125rem] md:-ml-[0.25rem]" },
          { char: "\u00a0", delay: 50 },
          { char: "e", delay: 100, className: "-ml-[0.5rem] md:-ml-[1rem]" },
          { char: "a", delay: 150, className: "-ml-[0.125rem] md:-ml-[0.25rem]" },
          { char: "r", delay: 150, className: "-ml-[0.125rem] md:-ml-[0.25rem]" },
        ]}
      />

      <Reveal variant="zoom-in" delay={300}>
        <h4 className="text-[2.5rem] md:text-[4rem] font-semibold leading-[1.40625rem] mt-4 md:mt-16 transition-text">
          Beats 3
        </h4>
      </Reveal>

      <Reveal variant="zoom-in" delay={350}>
        <p className="text-lg md:text-xl font-semibold mt-[3.125rem] mb-5 transition-text">Overview</p>
      </Reveal>

      <Reveal variant="zoom-in" delay={400}>
        <p className="text-sm md:text-[1rem] leading-[2rem] text-[#BDC0C2] font-light max-w-[27.375rem] sm:max-w-[22.875rem] md:max-w-[24.875rem] transition-all">
          Enjoy award-winning Beats sound with wireless listening freedom and a sleek, streamlined design with
          comfortable padded earphones, delivering first-rate playback.
        </p>
      </Reveal>

      <div className="mt-[3.4375rem]">
        <Reveal variant="zoom-in" delay={450} className="inline-block">
          <button
            type="button"
            className="group relative flex items-center justify-center bg-[#1E1E21] hover:bg-white hover:text-black rounded-lg w-[15.5rem] h-[3.4375rem] overflow-hidden transition-all duration-300"
          >
            <BagIcon className="mr-4 group-hover:stroke-black transition-all duration-300" />
            <span className="text-[0.9375rem] cursor-pointer">Add to Bag</span>
            <span className="ml-4 text-xl font-bold cursor-pointer">N399k</span>
          </button>
        </Reveal>
      </div>
    </div>
  );
}

/** Desktop scroll-sequence version of the hero text — phases driven by
 * runwayProgress (0→1), passed down from the pinned wrapper.
 *
 * Only "On ear" fades out. "Beats 3", the "Overview" label, and the
 * paragraph all stay fully visible and just shift up together (as one
 * group) to fill the space "On ear" leaves behind.
 *
 * These values are tied DIRECTLY to scroll position — no spring smoothing.
 * A prior version wrapped each in useSpring, which added lag/momentum: on
 * a rapid back-and-forth scroll (the exact "up down up down" pattern users
 * naturally do while testing), a spring has to visibly "catch up" and
 * fights against a direction reversal mid-catch-up — that's what reads as
 * a heavy, forceful resistance rather than smooth 1:1 tracking. Direct
 * useTransform values always exactly match the current scroll position,
 * with nothing to fight. */
function HeroPinnedText({ runwayProgress }: { runwayProgress: MotionValue<number> }) {
  const onEarOpacity = useTransform(runwayProgress, PHASE_FADE_OUT, [1, 0]);
  const onEarLift = useTransform(runwayProgress, PHASE_FADE_OUT, [0, -28]);
  const staysShift = useTransform(runwayProgress, PHASE_FADE_OUT, [0, -150]);
  const ctaOpacity = useTransform(runwayProgress, PHASE_CTA_IN, [0, 1]);
  const ctaScale = useTransform(runwayProgress, PHASE_CTA_IN, [0.85, 1]);
  const ctaLiftOwn = useTransform(runwayProgress, PHASE_CTA_IN, [20, 0]);
  // `transform` doesn't affect layout, so when the "stays" group (Beats 3/
  // Overview/paragraph) shifts up via staysShift, the CTA button — a
  // separate element below it — doesn't move with it at all, it just stays
  // at its original position, leaving a growing gap as staysShift grows.
  // Combining staysShift into the CTA's own y makes it follow the paragraph
  // up (closing that gap) while still fading/scaling in on its own timing.
  const ctaY = useTransform([staysShift, ctaLiftOwn], (values) => {
    const [stays, ownLift] = values as [number, number];
    return stays + ownLift;
  });

  return (
    <div className="relative w-full">
      <motion.div style={{ opacity: onEarOpacity, y: onEarLift }}>
        <AnimatedHeading
          as="h1"
          className="text-[5rem] md:text-[7.5rem] font-semibold leading-[6rem] pl-[0.9375rem] md:pl-12"
          letters={[
            { char: "O", delay: 0 },
            { char: "n", delay: 50, className: "-ml-[0.125rem] md:-ml-[0.25rem]" },
            { char: "\u00a0", delay: 50 },
            { char: "e", delay: 100, className: "-ml-[0.5rem] md:-ml-[1rem]" },
            { char: "a", delay: 150, className: "-ml-[0.125rem] md:-ml-[0.25rem]" },
            { char: "r", delay: 150, className: "-ml-[0.125rem] md:-ml-[0.25rem]" },
          ]}
        />
      </motion.div>

      <motion.div style={{ y: staysShift }}>
        <motion.h4
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.2, ease: AOS_DEFAULT_EASE } }}
          className="text-[2.5rem] md:text-[4rem] font-semibold leading-[1.40625rem] mt-4 md:mt-16 transition-text"
        >
          Beats 3
        </motion.h4>
        <motion.p
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.3, ease: AOS_DEFAULT_EASE } }}
          className="text-lg md:text-xl font-semibold mt-[3.125rem] mb-5 transition-text"
        >
          Overview
        </motion.p>
        <motion.p
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.5, ease: AOS_DEFAULT_EASE } }}
          className="text-sm md:text-[1rem] leading-[2rem] text-[#BDC0C2] font-light max-w-[27.375rem] sm:max-w-[22.875rem] md:max-w-[24.875rem] transition-all"
        >
          Enjoy award-winning Beats sound with wireless listening freedom and a sleek, streamlined design with
          comfortable padded earphones, delivering first-rate playback.
        </motion.p>
      </motion.div>

      <motion.div className="mt-4 inline-block" style={{ opacity: ctaOpacity, scale: ctaScale, y: ctaY }}>
        <button
          type="button"
          className="group relative flex items-center justify-center bg-[#1E1E21] hover:bg-white hover:text-black rounded-lg w-[15.5rem] h-[3.4375rem] overflow-hidden transition-all duration-300"
        >
          <BagIcon className="mr-4 group-hover:stroke-black transition-all duration-300" />
          <span className="text-[0.9375rem] cursor-pointer">Add to Bag</span>
          <span className="ml-4 text-xl font-bold cursor-pointer">N399k</span>
        </button>
      </motion.div>
    </div>
  );
}

function HeroPinnedSequence() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  // Measure exactly where the runway ends (its absolute position in the
  // document, in scrollY pixels) so the headphone image's own parallax can
  // be told not to start moving until scroll passes that point — i.e. not
  // until the whole pinned phase sequence (On ear fade, CTA reveal) has
  // finished and the page is genuinely continuing on into Specs.
  //
  // The sticky content is exactly one viewport tall, so the release point
  // (where runwayProgress genuinely reaches 1 and the section un-pins) is
  // runwayTop + runwayHeight − viewportHeight, NOT runwayTop + runwayHeight.
  // A prior version omitted the "− viewportHeight" term, gating the image to
  // wait roughly one full screen height longer than the sequence actually
  // takes — by which point the image had already scrolled out of view.
  const [runwayEndPx, setRunwayEndPx] = useState<number | undefined>(undefined);
  useEffect(() => {
    const measure = () => {
      const node = runwayRef.current;
      if (!node) return;
      const runwayTop = node.getBoundingClientRect().top + window.scrollY;
      setRunwayEndPx(runwayTop + node.offsetHeight - window.innerHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div ref={runwayRef} className="relative" style={{ height: `${HERO_RUNWAY_HEIGHT_VH}vh` }}>
      <div className="sticky top-[10rem] h-[calc(100vh-10rem)] flex items-start">
        <div className="relative flex max-w-[60.0625rem] mx-auto w-full">
          <HeroHeadphoneImage parallaxStartAfterPx={runwayEndPx} />
          <HeroPinnedText runwayProgress={scrollYProgress} />
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersReducedMotion = useReducedMotion();
  const usePinnedSequence = isDesktop && !prefersReducedMotion;

  if (usePinnedSequence) {
    return (
      <section className="px-6">
        <HeroPinnedSequence />
      </section>
    );
  }

  return (
    <section className="px-6">
      <div className="relative flex max-w-[60.0625rem] mx-auto">
        <HeroHeadphoneImage />
        <HeroStaticText />
      </div>
    </section>
  );
}