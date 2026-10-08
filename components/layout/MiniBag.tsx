"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ActionButton from "@/components/ui/ActionButton";
import QuantityStepper from "@/components/ui/QuantityStepper";
import TrimmedImage from "@/components/ui/TrimmedImage";
import { CloseIcon } from "@/components/icons";
import { TrashIcon } from "@/components/icons/store";
import { useCart } from "@/components/providers/CartProvider";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { formatNaira } from "@/lib/catalog";

const AOS_DEFAULT_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];

/**
 * The desktop mini-bag flyout, anchored under the header at the right. It
 * opens automatically when something is added to the bag and from the
 * header's bag icon; it closes on Escape, an outside click, navigation, or
 * the close button. On mobile there is no flyout — adding shows a toast and
 * the Bag tab opens the full Bag screen — so this renders nothing below lg.
 */
export default function MiniBag() {
  const { lines, count, subtotal, miniBagOpen, setMiniBagOpen, addedSignal, setQuantity, removeItem } = useCart();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  // The last "something was added" event this component has already acted
  // on — so growing the window past lg doesn't replay an old one.
  const handledSignalRef = useRef(addedSignal);

  useEffect(() => {
    if (addedSignal === handledSignalRef.current) return;
    handledSignalRef.current = addedSignal;
    if (addedSignal && isDesktop) setMiniBagOpen(true);
  }, [addedSignal, isDesktop, setMiniBagOpen]);

  // Close on navigation, and whenever the window drops below lg.
  useEffect(() => {
    setMiniBagOpen(false);
  }, [pathname, setMiniBagOpen]);

  useEffect(() => {
    if (!isDesktop) setMiniBagOpen(false);
  }, [isDesktop, setMiniBagOpen]);

  useEffect(() => {
    if (!miniBagOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (panelRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest("[data-minibag-toggle]")) return;
      setMiniBagOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMiniBagOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [miniBagOpen, setMiniBagOpen]);

  return (
    <AnimatePresence>
      {isDesktop && miniBagOpen && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-label="Your bag"
          className="fixed right-6 top-[5.5rem] z-[55] w-[22rem] rounded-xl border border-[#2A2A2E] bg-[#181A1B] p-5 shadow-2xl shadow-black/50"
          initial={{ opacity: 0, y: -12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: AOS_DEFAULT_EASE } }}
          exit={{ opacity: 0, y: -12, scale: 0.97, transition: { duration: 0.2, ease: AOS_DEFAULT_EASE } }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Your bag ({count})</h3>
            <button
              type="button"
              onClick={() => setMiniBagOpen(false)}
              aria-label="Close bag"
              className="-m-1 flex h-7 w-7 items-center justify-center rounded transition-colors hover:bg-white/5"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </div>

          {lines.length === 0 ? (
            <div className="mt-5">
              <p className="text-sm font-light text-[#BDC0C2]">Your bag is empty.</p>
              <ActionButton href="/#products" className="mt-4 w-full">
                Shop headphones
              </ActionButton>
            </div>
          ) : (
            <>
              <ul data-lenis-prevent className="visible-scrollbar mt-4 max-h-[18rem] divide-y divide-[#232325] overflow-y-auto pr-2">
                {lines.map(({ product, quantity }) => (
                  <li key={product.slug} className="flex gap-3 py-3">
                    <div className="h-16 w-16 shrink-0 rounded-lg bg-[#0F0F10] p-1.5">
                      <TrimmedImage src={product.image} alt={product.title} className="h-full w-full object-contain" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-semibold">{product.title}</p>
                        <button
                          type="button"
                          onClick={() => removeItem(product.slug)}
                          aria-label={`Remove ${product.title}`}
                          className="-m-1 flex h-6 w-6 shrink-0 items-center justify-center rounded text-[#BDC0C2] transition-colors hover:text-white"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <QuantityStepper size="sm" value={quantity} onChange={(next) => setQuantity(product.slug, next)} />
                        <p className="text-sm font-semibold">{formatNaira(product.price * quantity)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-[#232325] pt-4">
                <p className="text-sm font-light text-[#BDC0C2]">Subtotal</p>
                <p className="text-base font-semibold">{formatNaira(subtotal)}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <ActionButton href="/bag">View bag</ActionButton>
                <ActionButton variant="light" href="/checkout">
                  Checkout
                </ActionButton>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}