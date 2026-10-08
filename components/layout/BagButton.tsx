"use client";

import { motion } from "framer-motion";
import { BagIcon } from "@/components/icons";
import { useCart } from "@/components/providers/CartProvider";
import { usePressedState } from "@/lib/hooks/usePressedState";

/**
 * The header's bag icon (desktop). Shows how many units are in the bag and
 * toggles the mini-bag flyout. `data-minibag-toggle` lets the flyout's
 * outside-click handler ignore clicks on this button, so a click on it
 * closes the flyout once instead of closing and immediately reopening it.
 */
export default function BagButton() {
  const { hydrated, count, miniBagOpen, setMiniBagOpen } = useCart();
  const { isPressed, handlers } = usePressedState();

  return (
    <button
      type="button"
      data-minibag-toggle
      aria-label={count > 0 ? `Bag, ${count} ${count === 1 ? "item" : "items"}` : "Bag, empty"}
      aria-expanded={miniBagOpen}
      onClick={() => setMiniBagOpen(!miniBagOpen)}
      {...handlers}
      className={`relative flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-300 ${
        isPressed ? "bg-white text-black" : "text-white hover:bg-[#1E1E21]"
      }`}
    >
      <BagIcon className="pointer-events-none" />
      {hydrated && count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.25 }}
          className="absolute right-0 top-0 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-white px-1 text-[0.6875rem] font-semibold text-black"
        >
          {count}
        </motion.span>
      )}
    </button>
  );
}