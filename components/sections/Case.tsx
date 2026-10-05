"use client";

import Reveal from "@/components/ui/Reveal";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import ScrollRevealImage from "@/components/ui/ScrollRevealImage";
import { InfoIcon } from "@/components/icons";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { usePressedState } from "@/lib/hooks/usePressedState";

const CASE_LETTERS = ["C", "a", "s", "e"];

const CASE_DESCRIPTION =
  "With a comfortable and adaptable case so that you can store it whenever you want, and keep your durability forever.";

/**
 * Two body layouts under the shared heading, chosen at the `sm` (640px)
 * breakpoint — only the one that applies is ever mounted:
 *
 *   CaseWide (sm+, including tablets and desktop): the original side-by-side
 *   layout — the case image on the left, the text and button on the right.
 *
 *   CaseMobile (<sm): stacked and centered, like the Specs section above it.
 *   The side-by-side layout squeezed a 144px image next to a 168px text
 *   column, which wrapped the short paragraph onto six airy lines; stacked,
 *   the image can be much larger and the paragraph gets a comfortable line
 *   length. The image rises into place instead of flying in from beyond the
 *   screen's left edge, and its triggers sit a little later than the
 *   desktop's so the image, text and button reveal in order as they come
 *   into view.
 *
 * The first render (before the media query resolves) is always the mobile
 * layout, so the server HTML matches the client's first render; on wider
 * screens it is swapped for CaseWide right after mount, while still hidden.
 */

/**
 * Tap feedback uses real pointer events (see usePressedState) because
 * `hover:` utilities never fire on touch devices in this app. Colors only —
 * no scale — so the button's hit box never changes under the finger. On
 * desktop a press looks the same as hover, so nothing changes there.
 *
 * "More info" has no destination yet, so it does nothing when tapped.
 */
function MoreInfoButton() {
  const { isPressed, handlers } = usePressedState();

  return (
    <button
      type="button"
      {...handlers}
      className={`group flex items-center justify-center rounded-lg w-[9.75rem] h-[3.4375rem] overflow-hidden transition-colors duration-300 ${
        isPressed ? "bg-white" : "bg-[#1E1E21] hover:bg-white"
      }`}
    >
      <InfoIcon className={`transition-colors duration-300 ${isPressed ? "stroke-black" : "group-hover:stroke-black"}`} />
      <span
        className={`ml-4 cursor-pointer transition-colors duration-300 ${
          isPressed ? "text-black" : "group-hover:text-black"
        }`}
      >
        More info
      </span>
    </button>
  );
}

function CaseWide() {
  return (
    <div className="flex justify-between mt-[3.875rem] max-w-[32.4375rem] md:max-w-[37.25rem] mx-auto">
      <div className="flex items-center min-w-[8.125rem]">
        <div className="max-w-[15.625rem] md:max-w-[18.75rem] -translate-x-12 transition-[max-width]">
          <ScrollRevealImage
            src="/images/content/case-headphone-case-bkg.png"
            alt="headphone case"
            fromX={-140}
            fromScale={0.6}
            wrapperClassName="case-headphones w-full"
            className="w-full"
          />
        </div>
      </div>
      <div className="flex flex-col justify-end md:justify-center pr-6 min-w-[14.5rem] w-[14.5rem] md:min-w-[16.5rem] md:w-[16.5rem]">
        <Reveal variant="fade-up" duration={700} delay={50} offset={300}>
          <p className="text-[#BDC0C2] text-[0.9375rem] md:text-[1rem] leading-[2rem] font-light transition-text">
            {CASE_DESCRIPTION}
          </p>
        </Reveal>
        <div className="mt-[3.4375rem]">
          <Reveal variant="zoom-in" duration={700} delay={100} offset={300} className="inline-block">
            <MoreInfoButton />
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function CaseMobile() {
  return (
    <>
      <div className="mx-auto mt-6 max-w-[14rem]">
        <ScrollRevealImage
          src="/images/content/case-headphone-case-bkg.png"
          alt="headphone case"
          fromY={40}
          fromScale={0.85}
          wrapperClassName="case-headphones w-full"
          className="w-full"
        />
      </div>

      <Reveal variant="fade-up" duration={700} delay={50} offset={250}>
        <p className="mx-auto mt-8 max-w-[19rem] text-center text-[0.9375rem] font-light leading-[1.75rem] text-[#BDC0C2]">
          {CASE_DESCRIPTION}
        </p>
      </Reveal>

      <div className="mt-8 flex justify-center">
        <Reveal variant="zoom-in" duration={700} delay={100} offset={250} className="inline-block">
          <MoreInfoButton />
        </Reveal>
      </div>
    </>
  );
}

export default function Case() {
  const isWide = useMediaQuery("(min-width: 640px)");

  return (
    <section id="case" className="px-6 mt-[5.75rem] lg:mt-[11.75rem] transition-[margin]">
      {/* max-sm:leading-[4rem]: below sm the heading's inherited 1.5 line
          height made its box 84px tall around 56px text — tightened to 64px
          on phones only; sm+ keeps the inherited value exactly as before. */}
      <AnimatedHeading
        as="h2"
        className="max-sm:leading-[4rem] text-center text-[3.5rem] md:text-[4.5rem]"
        offset={300}
        letters={CASE_LETTERS.map((char, i) => ({ char, delay: i * 50, className: i === 0 ? undefined : "-ml-0.5" }))}
      />

      {isWide ? <CaseWide /> : <CaseMobile />}
    </section>
  );
}