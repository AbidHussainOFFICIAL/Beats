"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import ParallaxImage from "@/components/ui/ParallaxImage";
import { usePressedState } from "@/lib/hooks/usePressedState";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { BagIcon } from "@/components/icons";

/**
 * Buy Now button — same tap-feedback pattern established throughout this
 * app (Footer's socials/back-to-top, Products' cart button): real pointer
 * events, not `:hover`-dependent, since this app's `hover:` utilities are
 * gated to real-hover-capable devices (see tailwind.config.ts's
 * hoverOnlyWhenSupported) and therefore never fire on touch at all.
 *
 * The visual press-scale lives on an INNER `motion.span`, not on the
 * button element that's actually listening for pointer events — same
 * stable-hit-box fix Products' AddToBagButton needed: if the element
 * listening for pointerleave also shrinks under the cursor, the shrink
 * itself can push the cursor outside the button's new (smaller) bounds
 * even though the mouse never moved, firing a spurious pointerleave that
 * flips the pressed state back off — which grows the button back to full
 * size, which can put the cursor back inside it, repeat. Keeping the
 * outer button's hit box permanently fixed-size breaks that loop.
 *
 * `group-hover:` classes are left fully intact alongside the new
 * `isPressed`-driven ones — desktop's existing hover treatment is
 * untouched; touch now gets an equivalent via tap instead of just
 * inheriting nothing from a `:hover` that can never match.
 *
 * Clicking it opens the hero product's page, where the color is chosen.
 */
function BuyNowButton() {
  const router = useRouter();
  const { isPressed, handlers } = usePressedState();

  return (
    <button
      type="button"
      onClick={() => router.push("/products/black")}
      {...handlers}
      className={`flex items-center justify-center rounded-lg cursor-pointer w-32 h-11 593:w-[9.25rem] 593:h-[3.4375rem] transition-all duration-700 ${
        isPressed ? "bg-white" : "bg-black group-hover:bg-white"
      }`}
    >
      <motion.span
        className="flex items-center justify-center cursor-pointer"
        animate={{ scale: isPressed ? 0.92 : 1 }}
        transition={{ duration: 0.12 }}
      >
        <BagIcon
          className={`mr-3 593:mr-4 transition-all duration-700 ${isPressed ? "stroke-black" : "group-hover:stroke-black"}`}
        />
        <span
          className={`text-sm 593:text-[0.9375rem] cursor-pointer transition-colors duration-700 ${
            isPressed ? "text-black" : "group-hover:text-black"
          }`}
        >
          Buy now
        </span>
      </motion.span>
    </button>
  );
}

export default function PromoBanner() {
  // Matches this component's own custom 593px breakpoint (see the
  // 593:static/593:overflow-visible classes throughout below) — used to
  // pick which ParallaxImage direction renders, since `direction` is a
  // per-instance prop and can't itself be made responsive via CSS classes.
  // Same pattern Hero.tsx already uses for its own desktop/mobile split.
  const isDesktop = useMediaQuery("(min-width: 593px)");

  return (
    <section className="relative mt-[5.75rem] max-sm:mt-[4rem] px-6 lg:mt-[11.75rem] transition-[margin]">
      <Reveal variant="zoom-in" duration={700} offset={300}>
        {/*
          overflow-hidden 593:overflow-visible: mobile-only clipping — this
          is the single mechanism that makes the new circle+image badge
          below work at all (both get cleanly cut off by the card's own
          rounded edge instead of needing separate fragile absolute-
          position math per element). 593:overflow-visible restores
          desktop's original unclipped bleed effect exactly as it was —
          that treatment was already confirmed working and is untouched
          otherwise.

          pt-[2.1875rem] pb-5 593:py-[2.1875rem]: mobile-only asymmetric
          padding (top unchanged, bottom reduced) shifts the text/button
          block up within the card, freeing room at the bottom-right for
          the new badge. 593:py-[2.1875rem] restores the original
          symmetric padding at 593px+, unchanged.
        */}
        <div className="relative flex items-center justify-between bg-[#181A1B] rounded-xl overflow-hidden 593:overflow-visible px-6 948:px-[9.125rem] pt-[2.1875rem] pb-5 593:py-[2.1875rem] 948:py-[3.125rem] max-w-[60.5rem] mx-auto transition-[padding] group">
          <div className="relative z-10">
            <h3 className="text-[1.125rem] md:text-[1.5rem] leading-[1.8125rem] sm:leading-[2.8125rem] font-semibold text-[#BDC0C2] group-hover:text-white transition-text transition-all">
              <span className="inline-block md:group-hover:-translate-y-8 transition-transform duration-700 ease-in-out">
                Immerse yourself in
              </span>
              <br />
              <span className="inline-block md:group-hover:-translate-y-8 transition-transform duration-700 ease-in-out delay-100">
                your music
              </span>
            </h3>
            <p className="text-sm md:text-base font-light text-[#BDC0C2] my-3 transition-text">
              Buy Now, up to 40% off.
            </p>
            <div>
              <Reveal variant="zoom-in" duration={700} delay={50} offset={300}>
                <BuyNowButton />
              </Reveal>
            </div>
          </div>

          <div>
            {/* Mobile-only (hidden at 593px+) white quarter-circle badge.
                Sized and positioned so its CENTER sits exactly at the
                card's bottom-right corner (offset on both axes equals the
                radius) — that guarantees precisely one quarter of it
                falls within the card's visible area, with the rest
                clipped away by the card's own overflow-hidden above. Sits
                behind the image (z-0, image is z-[1]) so the dark
                headphones read as a product badge sitting on a white
                accent, not a separate floating shape. */}
            <div
              aria-hidden="true"
              className="absolute -bottom-[9rem] -right-[7.5rem] w-60 h-60 rounded-full bg-white z-0 593:hidden"
            />

            {/*
              Base (mobile, <593) values are the NEW badge-sized/positioned
              treatment: smaller width, tighter offsets, z-[1] to sit above
              the new circle. Everything from 593: onward is 100% IDENTICAL
              to the original file — 593:static (switches out of absolute
              positioning entirely, so the base offset/z-index values below
              stop applying at all past this point), 593:w-[18.75rem], and
              md:w-[21.875rem] are all unchanged.
            */}
            <div className="absolute -bottom-2 -right-6 w-28 z-[1] rotate-12 593:rotate-0 593:static 593:w-[18.75rem] md:w-[21.875rem] transition-[width]">
              {/*
                Desktop (isDesktop, 593px+): direction="left" — the exact
                original ParallaxImage usage, byte-for-byte unchanged.
                Mobile: direction="rotate" instead — replaces the
                positional drift with a scroll-linked rotation, which
                combines with the wrapper's own static rotate-12 resting
                tilt above (a separate element/transform, so no conflict)
                for a "badge tilts further as you scroll" effect rather
                than a straight-line slide. rotateRange kept close to the
                component's own default (±8°) for a subtle, restrained
                motion rather than a dramatic spin.
              */}
              {isDesktop ? (
                <ParallaxImage
                  src="/images/content/sale-headphones-collapse-bkg.png"
                  alt="collapsed headphones"
                  direction="left"
                  wrapperClassName="images1 w-full"
                  className="w-full"
                />
              ) : (
                <ParallaxImage
                  src="/images/content/sale-headphones-collapse-bkg.png"
                  alt="collapsed headphones"
                  direction="rotate"
                  rotateRange={[-8, 8]}
                  wrapperClassName="images1 w-full"
                  className="w-full"
                />
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
