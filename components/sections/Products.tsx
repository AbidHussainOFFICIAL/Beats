"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { LetterRow } from "@/components/ui/AnimatedHeading";
import { useAosReveal } from "@/lib/hooks/useAosReveal";
import { usePressedState } from "@/lib/hooks/usePressedState";
import { CartSmallIcon, CheckIcon } from "@/components/icons";
import { products } from "@/lib/data";

const CHOOSE_LETTERS = ["C", "h", "o", "o", "s", "e"].map((char, i) => ({
  char,
  delay: i * 50,
  className: i === 0 ? undefined : "-ml-0.5",
}));

// The space character (i === 4) was previously falling through to the same
// "-ml-0.5" squeeze every other letter gets, because the old check only
// ever looked at whether the PREVIOUS character was a space (to avoid
// squeezing the letter right after one) — it never checked whether the
// CURRENT character being processed was itself the space. That's a real
// bug, not a style choice: it was pulling the space tight against "r",
// which is why "Your" and "Style" read as one squished word instead of
// two. Fixed by excluding the space from the squeeze entirely, plus giving
// it an explicit w-[0.35em] (scales with the heading's own font-size at
// every breakpoint, rather than a fixed px value that would look
// proportionally different at text-[3.5rem] vs md:text-[4.5rem]) for
// deliberate breathing room beyond just restoring normal spacing.
const STYLE_LETTERS = ["Y", "o", "u", "r", " ", "S", "t", "y", "l", "e"].map((char, i, arr) => {
  if (char === " ") {
    return { char, delay: i * 50, className: "w-[0.35em]" };
  }
  return {
    char,
    delay: i * 50,
    className: i === 0 || arr[i - 1] === " " ? undefined : "-ml-0.5",
  };
});

// How long the checkmark confirmation stays up before reverting to the
// plain cart icon.
const ADDED_TO_BAG_DURATION_MS = 1400;

function AddToBagButton({
  productName,
  added,
  onAdd,
}: {
  productName: string;
  added: boolean;
  onAdd: () => void;
}) {
  const { isPressed, handlers } = usePressedState();
  // Tap feedback and the "added" confirmation both want the button visibly
  // white — treating them as one combined "highlighted" state means a tap
  // that lands right as the confirmation is already showing doesn't fight
  // itself into two competing background states.
  const highlighted = added || isPressed;

  return (
    // Plain <button>, not motion.button, and NO scale animation on this
    // element — this is deliberate. The previous version had the pointer
    // handlers AND the press-scale on the same element: shrinking to 0.85
    // scale under the cursor could push the cursor outside the button's
    // now-smaller bounds even though the mouse never moved, firing a
    // spurious pointerleave — which flips isPressed back off, which grows
    // the button back to full size, which can put the cursor back inside
    // it, repeat. That feedback loop is what looked like the cursor
    // flickering and the confirmation animation replaying multiple times
    // from one click. Keeping this outer element's hit box permanently
    // fixed-size breaks the loop entirely; the visual shrink now lives on
    // an inner element that pointer events don't listen on at all.
    //
    // cursor-pointer here AND on the inner spans below: globals.css has a
    // rule targeting `span` elements specifically (originally to stop
    // text-selection cursors on copy) that sets `cursor: default` — CSS
    // cursor is decided by whichever EXACT element the pointer is over,
    // not just inherited from an ancestor, so hovering one of the inner
    // spans below was winning over this button's own cursor-pointer. A
    // class selector beats a plain tag selector in specificity, so adding
    // cursor-pointer directly on those spans too correctly overrides it.
    <button
      type="button"
      aria-label={added ? `${productName} added to bag` : `Add ${productName} to bag`}
      onClick={onAdd}
      {...handlers}
      className={`flex justify-center items-center rounded-lg h-[2.1875rem] w-[2.1875rem] cursor-pointer transition-colors duration-300 ${
        highlighted ? "bg-white" : "bg-[#0A0A0B] group-hover:bg-white"
      }`}
    >
      <motion.span
        className="flex items-center justify-center cursor-pointer"
        animate={{ scale: isPressed ? 0.85 : 1 }}
        transition={{ duration: 0.12 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {added ? (
            <motion.span
              key="check"
              className="flex cursor-pointer"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: [0.4, 1.15, 1] }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.35, times: [0, 0.6, 1] }}
            >
              <CheckIcon className="stroke-black" />
            </motion.span>
          ) : (
            <motion.span
              key="cart"
              className="flex cursor-pointer"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              <CartSmallIcon
                className={`transition-all duration-300 ${isPressed ? "stroke-black" : "group-hover:stroke-black"}`}
              />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </button>
  );
}

function ProductCard({ product }: { product: (typeof products)[number] }) {
  const [added, setAdded] = useState(false);
  const addedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clears the confirmation-revert timer on unmount — same reasoning as
  // every other timer in this app (SubscribeForm, MobileNav): a raw
  // setTimeout isn't tied to component lifecycle, so without this a stale
  // timer could fire after the fact.
  useEffect(() => {
    return () => {
      if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current);
    };
  }, []);

  const handleAddToBag = () => {
    setAdded(true);
    if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current);
    addedTimeoutRef.current = setTimeout(() => setAdded(false), ADDED_TO_BAG_DURATION_MS);
  };

  return (
    // No overflow-hidden here (a previous version added it to contain a
    // card-level press-scale effect that's been removed — tap feedback now
    // lives only on the cart button below, per feedback that a whole-card
    // press didn't feel right). Also fixes a real bug that overflow-hidden
    // caused as a side effect: the product image bleeds slightly above the
    // card's own top edge by design, which needs `overflow: visible`
    // (the default) to render uncropped — overflow-hidden was clipping it.
    <Reveal
      variant="zoom-in-up"
      duration={700}
      delay={product.delay}
      offset={300}
      className="flex flex-col justify-end bg-[#181A1B] px-2 py-2 rounded-lg h-[9.5rem] w-[14rem] sm:w-[10.125rem] sm:mt-[6.25rem] group"
    >
      <div className="flex justify-center">
        <div className="w-[5.9375rem] mb-6 group-hover:-translate-y-10 transform transition-transform duration-1000">
          <img src={product.image} alt="headphone" className="w-full" />
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span className="block text-sm font-semibold">{product.name}</span>
          <span className="block text-sm font-semibold text-[#BDC0C2]">{product.price}</span>
        </div>
        <div className="flex items-end">
          <AddToBagButton productName={product.name} added={added} onAdd={handleAddToBag} />
        </div>
      </div>
    </Reveal>
  );
}

export default function Products() {
  // Both lines share one trigger point (the original's two-line heading is a
  // single AOS-tracked block that just happens to wrap onto two visual lines).
  const { ref, inView } = useAosReveal<HTMLHeadingElement>({ offset: 300 });

  return (
    <section id="products" className="mt-[5.75rem] px-6 sm:px-3 lg:mt-[11.75rem] transition-[margin]">
      {/* leading-[3.75rem] md:leading-[1.5]: previously no explicit
          line-height at all, so both breakpoints inherited Tailwind's
          global default (html { line-height: 1.5 }) — for the mobile font
          size (text-[3.5rem]/56px) that's 84px per line, leaving a large
          gap between "Choose" and "Your Style". Tightened for mobile only;
          md:leading-[1.5] explicitly re-pins desktop to the exact same
          value it was already inheriting, so it's genuinely unchanged
          rather than just "not obviously different". */}
      <h2
        ref={ref}
        className="aos-animation text-center text-[3.5rem] md:text-[4.5rem] leading-[3.75rem] md:leading-[1.5] transition-text"
      >
        <span>
          <LetterRow letters={CHOOSE_LETTERS} inView={inView} />
        </span>
        <br />
        <span>
          <LetterRow letters={STYLE_LETTERS} inView={inView} />
        </span>
      </h2>

      {/* Desktop (lg+) gap restored to its exact original value
          (lg:mt-[2.625rem]) — that one was fine on its own; it only read
          as "huge" by contrast with how tight mobile was. Below lg, mt-10
          was a first pass that still needed a bit more room — bumped to
          mt-14 per follow-up feedback; lg:mt-[2.625rem] is untouched. */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-0 mx-auto max-w-[14rem] sm:max-w-[23.25rem] lg:max-w-[35.25rem] mt-14 lg:mt-[2.625rem] transition-[max-width]">
        {products.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
        {/* Spacer to preserve the original's flex-wrap balance on the last
            row — only relevant to the sm+ multi-column layout; mobile's
            single centered column doesn't need it. */}
        <div className="hidden sm:block h-[9.5rem] w-[10.125rem] mt-[6.25rem]" />
      </div>
    </section>
  );
}