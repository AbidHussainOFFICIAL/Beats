"use client";

import { useEffect, useRef, useState, type ReactNode, type Ref } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import ParallaxImage from "@/components/ui/ParallaxImage";
import { BagIcon } from "@/components/icons";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { usePressedState } from "@/lib/hooks/usePressedState";
import { HERO_MOBILE_RUNWAY_HEIGHT_SVH, HERO_RUNWAY_HEIGHT_VH } from "@/lib/constants";

/**
 * Layouts, chosen in `Hero` at the bottom — only the one that applies is
 * ever mounted:
 *
 *   DESKTOP (lg+)
 *     1. Pinned scroll sequence (motion allowed).
 *     2. Static version of the same layout (reduced motion).
 *   MOBILE / TABLET (<lg)
 *     3. Pinned scroll sequence — HeroMobilePinned.
 *     4. Static stacked layout — HeroMobileStatic — for reduced motion and
 *        for very short screens (phones in landscape), where a pinned
 *        sequence would not fit.
 *
 * DESKTOP PINNED SEQUENCE — the hero is wrapped in a tall "runway" (220vh)
 * that the visible hero stays `sticky`-pinned within. As the user scrolls
 * through that runway we read progress (0→1) through the runway's own height
 * and use it to drive three phases:
 *
 *   Phase 1 (0     → ~0.30): everything as normal, fully visible, no CTA.
 *   Phase 2 (~0.30 → ~0.55): "On ear" heading fades and lifts; "Beats 3",
 *                            Overview and the paragraph shift up to fill
 *                            the space it leaves behind.
 *   Phase 3 (~0.60 → ~0.85): "Add to Bag" fades + scales in from nothing.
 *
 * Once the runway is fully scrolled, the section un-pins and the page
 * continues into Specs. The headphone image's own parallax drift is
 * sequenced to start only after the runway ends (see ParallaxImage).
 *
 * "On ear" SPACING NOTE: the "On ear" heading carries a webkit gradient-text
 * effect (see globals.css h1/h1-span gradient rules). Applying any
 * `transform` to that element OR to a wrapper immediately around it can
 * produce a rendering glitch (a single oversized, misplaced glyph). Spacing
 * around it is therefore done with margins on its neighbors, and the mobile
 * layouts only ever fade it with `opacity` and position it with plain
 * `top`/`inset` offsets — never transforms. The mobile heading goes further:
 * it doesn't use the gradient-clipped text at all (see
 * MOBILE_HEADING_SOLID_FILL), because animating per-letter spans inside
 * gradient-clipped text is what left a stray gradient fragment on screen
 * during page load. Its letters rise via `top` inside a plain clipping div.
 */

const HERO_DESCRIPTION =
  "Enjoy award-winning Beats sound with wireless listening freedom and a sleek, streamlined design with comfortable padded earphones, delivering first-rate playback.";

// Matches AOS's default easing (CSS "ease"), same as Reveal.tsx/AnimatedHeading —
// used for the one-time page-load entrances below.
const AOS_DEFAULT_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];

// --- Desktop pinned sequence phases (progress through the runway, 0→1) ---
const PHASE_FADE_OUT: [number, number] = [0.3, 0.55];
const PHASE_CTA_IN: [number, number] = [0.6, 0.85];

// --- Mobile pinned sequence phases (progress through the runway, 0→1) ---
const MOBILE_HEADING_FADE: [number, number] = [0.12, 0.45];
const MOBILE_IMAGE_SLIDE: [number, number] = [0.12, 0.6];
const MOBILE_TITLE_IN: [number, number] = [0.45, 0.62];
const MOBILE_OVERVIEW_IN: [number, number] = [0.5, 0.67];
const MOBILE_DESCRIPTION_IN: [number, number] = [0.55, 0.74];

/** How much bigger the headphone gets as it slides to the side. */
const MOBILE_IMAGE_END_SCALE = 1.25;
/** Fraction of the (scaled) headphone's width that ends up off-screen. 0.4
 * rather than 0.5 so the "b" logo on the ear cup stays recognizable. */
const MOBILE_IMAGE_HIDDEN_FRACTION = 0.4;
/** After the sequence ends and the hero scrolls away, the headphone drifts
 * up this many px extra (over one screen of scrolling) — i.e. faster than
 * the text, like the desktop parallax. */
const MOBILE_IMAGE_DRIFT_PX = 280;
/** Final gap (px) between the description and the "Add to Bag" button. */
const MOBILE_BUTTON_GAP_PX = 48;

// Per-letter entrance delays (ms) — the same stagger as the desktop heading.
// The space is rendered as a fixed-width gap.
const MOBILE_HEADING_LETTERS = [
  { char: "O", delay: 0 },
  { char: "n", delay: 50 },
  { char: " ", delay: 50 },
  { char: "e", delay: 100 },
  { char: "a", delay: 150 },
  { char: "r", delay: 150 },
];

/** Cancels globals.css's gradient-text rule (`h1, h1 span` with
 * background-clip: text) for the mobile heading and paints it in one solid
 * color instead — the midpoint of that gradient (#363436 → #292a2b), so it
 * looks the same. The gradient-clipped text is what left a stray fragment on
 * screen while the per-letter spans animated in; without background-clip: text
 * there is nothing to glitch. Applied to the <h1> and to every letter span. */
const MOBILE_HEADING_SOLID_FILL = "[background:none] [-webkit-text-fill-color:#302f30]";

/** Props for a one-time fade-and-rise on mount; nothing at all under reduced motion. */
function mountIn(reduced: boolean | null, delay: number) {
  return reduced
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: AOS_DEFAULT_EASE } },
      };
}

/**
 * The "Add to Bag" button, shared by every layout. Tap feedback uses real
 * pointer events (see usePressedState) because `hover:` utilities never
 * fire on touch devices in this app. Colors only — no scale — so the
 * button's hit box never changes under the pointer.
 *
 * `compact` is the column-width version used in the mobile pinned sequence:
 * it fills its wrapper, and its bag icon is dropped below 360px so the
 * label and price still fit.
 */
function AddToBagButton({ compact = false }: { compact?: boolean }) {
  const { isPressed, handlers } = usePressedState();

  return (
    <button
      type="button"
      {...handlers}
      className={`group relative flex items-center justify-center rounded-lg overflow-hidden transition-all duration-300 ${
        compact ? "w-full h-12" : "w-[15.5rem] h-[3.4375rem]"
      } ${isPressed ? "bg-white text-black" : "bg-[#1E1E21] hover:bg-white hover:text-black"}`}
    >
      <BagIcon
        className={`transition-all duration-300 ${compact ? "mr-2 hidden min-[360px]:block" : "mr-4"} ${
          isPressed ? "stroke-black" : "group-hover:stroke-black"
        }`}
      />
      <span className={`cursor-pointer ${compact ? "text-[0.8125rem]" : "text-[0.9375rem]"}`}>Add to Bag</span>
      <span className={`font-bold cursor-pointer ${compact ? "ml-2 text-sm" : "ml-4 text-xl"}`}>N399k</span>
    </button>
  );
}

/** Desktop-only headphone: absolutely positioned, bled above the heading,
 * with a parallax drift. The wrapper is `w-full` on purpose — it takes its
 * share of the flex row alongside the text column, exactly as before. */
function HeroHeadphoneImage({ parallaxStartAfterPx }: { parallaxStartAfterPx?: number }) {
  return (
    <div className="w-full">
      <div className="absolute top-0 left-40 transform -translate-y-[31rem] -translate-x-[5.6875rem] w-[18.75rem] z-0">
        <Reveal variant="fade-down" duration={700} delay={200}>
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

/** Desktop, reduced-motion fallback: the pinned layout's text, un-pinned. */
function HeroStaticText() {
  return (
    <div className="relative w-full">
      <AnimatedHeading
        as="h1"
        className="text-[7.5rem] font-semibold leading-[6rem] pl-12"
        letters={[
          { char: "O", delay: 0 },
          { char: "n", delay: 50, className: "-ml-[0.25rem]" },
          { char: "\u00a0", delay: 50 },
          { char: "e", delay: 100, className: "-ml-[1rem]" },
          { char: "a", delay: 150, className: "-ml-[0.25rem]" },
          { char: "r", delay: 150, className: "-ml-[0.25rem]" },
        ]}
      />

      <Reveal variant="zoom-in" delay={300}>
        <h4 className="text-[4rem] font-semibold leading-[1.40625rem] mt-16 transition-text">Beats 3</h4>
      </Reveal>

      <Reveal variant="zoom-in" delay={350}>
        <p className="text-xl font-semibold mt-[3.125rem] mb-5 transition-text">Overview</p>
      </Reveal>

      <Reveal variant="zoom-in" delay={400}>
        <p className="text-[1rem] leading-[2rem] text-[#BDC0C2] font-light max-w-[24.875rem] transition-text">
          {HERO_DESCRIPTION}
        </p>
      </Reveal>

      <div className="mt-[3.4375rem]">
        <Reveal variant="zoom-in" delay={450} className="inline-block">
          <AddToBagButton />
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
 * a rapid back-and-forth scroll a spring has to visibly "catch up" and
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
          className="text-sm md:text-[1rem] leading-[2rem] text-[#BDC0C2] font-light max-w-[27.375rem] sm:max-w-[22.875rem] md:max-w-[24.875rem] transition-text"
        >
          {HERO_DESCRIPTION}
        </motion.p>
      </motion.div>

      <motion.div className="mt-4 inline-block" style={{ opacity: ctaOpacity, scale: ctaScale, y: ctaY }}>
        <AddToBagButton />
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

/**
 * Mobile poster: a big "On ear" with the headphone layered in FRONT of it.
 * The image is in normal flow at its fixed width (so it sets the poster's
 * height) and the heading is absolutely positioned behind it — `top-[18%]`
 * is how far down the poster the heading sits (higher = further toward the
 * ear cups). The heading's size is fluid (26vw, between 4.25rem and 7rem)
 * so it fits from 320px phones up.
 *
 * The heading's letters rise into place one by one on load, using `top`
 * instead of the transforms the desktop heading uses, and are painted in a
 * solid color instead of gradient-clipped text (see the note at the top of
 * this file). Kerning is done with letter-spacing and an em-wide gap for the
 * space, so it scales with the fluid size.
 *
 * Both mobile layouts use this; the pinned one passes a scroll-driven
 * heading opacity, a scroll-driven transform for the image, and its text
 * column as `children` (positioned against the poster's own box).
 */
function MobilePoster({
  reduced,
  headingOpacity,
  imageStyle,
  imageRef,
  children,
}: {
  reduced: boolean | null;
  headingOpacity?: MotionValue<number>;
  imageStyle?: MotionStyle;
  imageRef?: Ref<HTMLDivElement>;
  children?: ReactNode;
}) {
  return (
    <div className="relative w-full">
      {/* Scroll-driven fade lives on this outer wrapper; the page-load rise
          lives on the letters inside the clipping div, so the two never
          fight over the same property. Each letter rises by animating
          `top` (a layout property, in em so it scales with the fluid font
          size) rather than a transform, and the clip is on a plain div —
          never on the gradient text itself. */}
      <motion.div style={{ opacity: headingOpacity }} className="absolute inset-x-0 top-[18%] z-0">
        <div className="overflow-hidden">
          <h1
            aria-label="On ear"
            className={`whitespace-nowrap text-center text-[clamp(4.25rem,26vw,7rem)] font-semibold leading-[1.1] tracking-[-0.03em] ${MOBILE_HEADING_SOLID_FILL}`}
          >
            {MOBILE_HEADING_LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                initial={reduced ? false : { opacity: 0, top: "1.2em" }}
                animate={{
                  opacity: 1,
                  top: "0em",
                  transition: { duration: 0.8, delay: 0.15 + letter.delay / 1000, ease: AOS_DEFAULT_EASE },
                }}
                className={`relative inline-block ${MOBILE_HEADING_SOLID_FILL} ${letter.char === " " ? "w-[0.3em]" : ""}`}
              >
                {letter.char === " " ? "\u00a0" : letter.char}
              </motion.span>
            ))}
          </h1>
        </div>
      </motion.div>

      {/* The image's entrance lives on the inner <img> so it can't conflict
          with the scroll-driven transform on this wrapper. */}
      <motion.div ref={imageRef} style={imageStyle} className="relative z-10 mx-auto w-[10.5rem] sm:w-[13rem]">
        <motion.img
          src="/images/content/header-headphone-bkg.png"
          role="presentation"
          alt=""
          initial={reduced ? false : { opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1, ease: AOS_DEFAULT_EASE } }}
          className="w-full"
        />
      </motion.div>

      {children}
    </div>
  );
}

/**
 * MOBILE / TABLET pinned sequence (<lg). The hero stays pinned for about one
 * screen of scrolling, scrubbed directly by scroll position (no springs, so
 * it reverses cleanly):
 *
 *   rest      : headphone with "On ear" behind it, "Add to Bag" underneath.
 *   0.12–0.45 : "On ear" fades out.
 *   0.12–0.60 : the headphone slides left until ~40% of it is off-screen,
 *               growing a little as it goes; "Add to Bag" slides right
 *               with it, into the text column's width, and up until it
 *               sits just below where the description will end.
 *   0.45–0.74 : "Beats 3", then "Overview", then the description, fade in
 *               on the right.
 *   after 1.0 : the section un-pins and scrolls away; the headphone keeps
 *               drifting up (MOBILE_IMAGE_DRIFT_PX) so it leaves faster
 *               than the text — the same idea as the desktop parallax.
 *
 * Geometry: the sticky box starts at the same y as the hero's resting
 * position (main's `pt-[4.375rem]`), so the hero pins from the very first
 * pixel of scroll instead of scrolling a little first. The image scales
 * from its TOP edge (originY: 0) so it grows downward, away from the
 * header's logo row. Its x travel is computed from the viewport width and
 * its own measured width, because the image starts centered and ends
 * hugging the left screen edge. The button's x travel is measured from the
 * DOM too: the distance between where it rests and where the text column
 * starts. It sits above the image (z-20) for the few frames where the
 * growing image passes behind it.
 *
 * COUPLING — the text column's left offsets (7.375rem / 9.25rem) are
 * derived from the image's final geometry: its visible right edge lands at
 * (1 − MOBILE_IMAGE_HIDDEN_FRACTION) × MOBILE_IMAGE_END_SCALE × its width
 * (= 0.75 × 168px = 126px, or 0.75 × 208px = 156px at `sm`), plus a 16px gap,
 * minus the section's 24px side padding. The button wrapper uses the same
 * numbers for its width, so at rest it is exactly as wide as the column.
 * Change the fraction, the scale, or the image widths in MobilePoster and
 * those offsets need updating too.
 */
function HeroMobilePinned() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const viewportWidthRef = useRef(typeof window === "undefined" ? 0 : window.innerWidth);
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });
  // 0 at the exact moment the section un-pins (runway bottom reaches the
  // viewport bottom), 1 one screen of scrolling later.
  const { scrollYProgress: releaseProgress } = useScroll({
    target: runwayRef,
    offset: ["end end", "end start"],
  });

  useEffect(() => {
    const measure = () => {
      viewportWidthRef.current = window.innerWidth;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const headingOpacity = useTransform(scrollYProgress, MOBILE_HEADING_FADE, [1, 0]);

  const imageProgress = useTransform(scrollYProgress, MOBILE_IMAGE_SLIDE, [0, 1]);
  const imageScale = useTransform(imageProgress, [0, 1], [1, MOBILE_IMAGE_END_SCALE]);
  const imageX = useTransform(imageProgress, (t) => {
    const imageWidth = imageRef.current?.offsetWidth ?? 0;
    // Final center sits (0.5 − hidden fraction) × scaled width from the
    // screen's left edge; it starts at the screen's center.
    const finalCenter = (0.5 - MOBILE_IMAGE_HIDDEN_FRACTION) * imageWidth * MOBILE_IMAGE_END_SCALE;
    return t * (finalCenter - viewportWidthRef.current / 2);
  });
  const buttonX = useTransform(imageProgress, (t) => {
    const column = columnRef.current;
    const button = buttonRef.current;
    if (!column || !button) return 0;
    return t * (column.offsetLeft - button.offsetLeft);
  });
  // Rises until it sits MOBILE_BUTTON_GAP_PX below the description's final
  // position (measured, so it adapts to however many lines the text wraps
  // to). Never moves downward. The column and the sticky box share the same
  // top edge, so their offsets are directly comparable.
  const buttonY = useTransform(imageProgress, (t) => {
    const column = columnRef.current;
    const description = descriptionRef.current;
    const button = buttonRef.current;
    if (!column || !description || !button) return 0;
    const descriptionBottom = column.offsetTop + description.offsetTop + description.offsetHeight;
    return t * Math.min(0, descriptionBottom + MOBILE_BUTTON_GAP_PX - button.offsetTop);
  });
  const imageDrift = useTransform(releaseProgress, [0, 1], [0, -MOBILE_IMAGE_DRIFT_PX]);

  const titleOpacity = useTransform(scrollYProgress, MOBILE_TITLE_IN, [0, 1]);
  const titleX = useTransform(scrollYProgress, MOBILE_TITLE_IN, [24, 0]);
  const overviewOpacity = useTransform(scrollYProgress, MOBILE_OVERVIEW_IN, [0, 1]);
  const overviewX = useTransform(scrollYProgress, MOBILE_OVERVIEW_IN, [24, 0]);
  const descriptionOpacity = useTransform(scrollYProgress, MOBILE_DESCRIPTION_IN, [0, 1]);
  const descriptionX = useTransform(scrollYProgress, MOBILE_DESCRIPTION_IN, [24, 0]);

  return (
    <div ref={runwayRef} className="relative" style={{ height: `${HERO_MOBILE_RUNWAY_HEIGHT_SVH}svh` }}>
      <div className="sticky top-[4.375rem] h-[calc(100svh-4.375rem)]">
        <MobilePoster
          reduced={false}
          headingOpacity={headingOpacity}
          imageRef={imageRef}
          imageStyle={{ x: imageX, y: imageDrift, scale: imageScale, originY: 0 }}
        >
          <div
            ref={columnRef}
            className="absolute inset-y-0 left-[7.375rem] right-0 z-10 flex flex-col justify-center pb-16 sm:left-[9.25rem] sm:right-auto sm:w-[22rem]"
          >
            <motion.h4
              style={{ opacity: titleOpacity, x: titleX }}
              className="mb-4 text-[2rem] font-semibold leading-none sm:text-[2.5rem]"
            >
              Beats 3
            </motion.h4>
            <motion.p
              style={{ opacity: overviewOpacity, x: overviewX }}
              className="mb-2 text-base font-semibold sm:text-lg"
            >
              Overview
            </motion.p>
            <motion.p
              ref={descriptionRef}
              style={{ opacity: descriptionOpacity, x: descriptionX }}
              className="text-[0.8125rem] font-light leading-[1.375rem] text-[#BDC0C2] sm:text-sm sm:leading-[1.625rem]"
            >
              {HERO_DESCRIPTION}
            </motion.p>
          </div>
        </MobilePoster>

        <motion.div
          ref={buttonRef}
          style={{ x: buttonX, y: buttonY }}
          className="relative z-20 mx-auto mt-6 w-[calc(100%-7.375rem)] sm:w-[22rem]"
        >
          <motion.div {...mountIn(false, 0.5)}>
            <AddToBagButton compact />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * MOBILE / TABLET static layout (<lg): the poster, then everything stacked
 * and centered underneath — no pinning, no scroll-driven motion. Used for
 * reduced motion and for very short screens, where nothing is locked behind
 * a scroll animation and the whole hero scrolls normally.
 */
function HeroMobileStatic() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="mx-auto flex w-full max-w-[28rem] flex-col items-center text-center">
      <MobilePoster reduced={prefersReducedMotion} />

      <motion.h4
        {...mountIn(prefersReducedMotion, 0.3)}
        className="mt-2 text-[2rem] font-semibold leading-none sm:text-[2.5rem]"
      >
        Beats 3
      </motion.h4>

      <motion.p {...mountIn(prefersReducedMotion, 0.4)} className="mt-5 mb-3 text-base font-semibold sm:text-lg">
        Overview
      </motion.p>

      <motion.p
        {...mountIn(prefersReducedMotion, 0.5)}
        className="max-w-[21rem] text-sm font-light leading-[1.625rem] text-[#BDC0C2] sm:max-w-[24rem]"
      >
        {HERO_DESCRIPTION}
      </motion.p>

      <motion.div {...mountIn(prefersReducedMotion, 0.6)} className="mt-6">
        <AddToBagButton />
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  // Below roughly this height the pinned mobile sequence doesn't fit
  // (the headphone alone is taller than a landscape phone's screen).
  const isShortScreen = useMediaQuery("(max-height: 540px)");
  const prefersReducedMotion = useReducedMotion();
  const usePinnedSequence = isDesktop && !prefersReducedMotion;

  if (usePinnedSequence) {
    return (
      <section className="px-6">
        <HeroPinnedSequence />
      </section>
    );
  }

  if (isDesktop) {
    return (
      <section className="px-6">
        <div className="relative flex items-stretch max-w-[60.0625rem] mx-auto">
          <HeroHeadphoneImage />
          <HeroStaticText />
        </div>
      </section>
    );
  }

  return (
    <section className="px-6">
      {prefersReducedMotion || isShortScreen ? <HeroMobileStatic /> : <HeroMobilePinned />}
    </section>
  );
}