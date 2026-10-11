"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import PriceTag from "@/components/store/PriceTag";
import { preserveScrollOnNextNavigation } from "@/components/layout/ScrollToTop";
import { useLenis } from "@/components/providers/LenisProvider";
import { CheckIcon, CloseIcon } from "@/components/icons";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { usePressedState } from "@/lib/hooks/usePressedState";
import { POPOVER_EASE } from "@/lib/motion";
import type { CatalogProduct } from "@/lib/catalog";

interface ColorSheetProps {
  open: boolean;
  onClose: () => void;
  /** The product page currently shown. */
  current: CatalogProduct;
  /** Every color to choose from (including `current`). */
  variants: CatalogProduct[];
}

function ColorOption({
  variant,
  selected,
  onChoose,
  onClose,
}: {
  variant: CatalogProduct;
  selected: boolean;
  onChoose: () => void;
  onClose: () => void;
}) {
  const { isPressed, handlers } = usePressedState();
  const className = `flex w-full items-center gap-4 rounded-xl p-3 text-left transition-colors duration-200 ${
    selected || isPressed ? "bg-[#2A2A2E]" : "bg-transparent"
  }`;

  const content = (
    <>
      <div
        aria-hidden="true"
        className="h-10 w-10 shrink-0 rounded-full border border-white/20"
        style={{ background: variant.swatch }}
      />
      <div className="min-w-0 flex-1">
        <div className="text-base font-semibold">{variant.name}</div>
        <div className="mt-0.5">
          <PriceTag product={variant} size="sm" short />
        </div>
      </div>
      {selected && <CheckIcon className="shrink-0 text-white" />}
    </>
  );

  // The color already showing just closes the sheet; the others switch to
  // that color's page (without jumping the page back to the top).
  if (selected) {
    return (
      <button type="button" aria-current="true" onClick={onClose} {...handlers} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link
      href={`/products/${variant.slug}`}
      replace
      scroll={false}
      onClick={() => {
        preserveScrollOnNextNavigation();
        onChoose();
      }}
      {...handlers}
      className={className}
    >
      {content}
    </Link>
  );
}

/**
 * The mobile color picker: a sheet that slides up from the bottom of the
 * screen, listing every color with its price. Swipe it down (by its handle),
 * tap outside it, press Escape or tap the X to dismiss. Mobile only — on
 * desktop the product page shows the color swatches inline instead, so this
 * closes itself if the window grows past lg.
 *
 * While open it locks page scroll (and pauses Lenis), moves focus to the
 * current color, and keeps Tab inside the sheet. Same stacking as the other
 * overlays: it sits above the tab bar (z-30) and the header (z-50).
 */
export default function ColorSheet({ open, onClose, current, variants }: ColorSheetProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const lenis = useLenis();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Portals can only render after mount (no `document` on the server).
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open && isDesktop) onClose();
  }, [open, isDesktop, onClose]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();

    const focusFrame = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("[aria-current='true']")?.focus({ preventScroll: true });
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, lenis, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && !isDesktop && (
        <>
          <motion.div
            key="color-backdrop"
            aria-hidden="true"
            className="fixed inset-0 z-[60] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.25 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            onClick={onClose}
          />

          <motion.div
            key="color-sheet"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Choose a color"
            data-lenis-prevent
            className="fixed inset-x-0 bottom-0 z-[61] max-h-[85svh] overflow-y-auto rounded-t-2xl border-t border-[#2A2A2E] bg-[#1E1E21] px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-2"
            initial={{ y: "100%" }}
            animate={{ y: 0, transition: { duration: 0.4, ease: POPOVER_EASE } }}
            exit={{ y: "100%", transition: { duration: 0.3, ease: POPOVER_EASE } }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_event, info) => {
              if (info.offset.y > 100 || info.velocity.y > 600) onClose();
            }}
          >
            {/* The handle is the only part that starts a swipe-down, so the
                list below can scroll normally. */}
            <div className="flex touch-none justify-center pb-3 pt-2" onPointerDown={(event) => dragControls.start(event)}>
              <div className="h-1.5 w-10 rounded-full bg-[#3A3A3F]" />
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Choose a color</h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-m-1 flex h-9 w-9 items-center justify-center rounded transition-colors hover:bg-white/5"
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            <ul className="mt-3 space-y-1">
              {variants.map((variant) => (
                <li key={variant.slug}>
                  <ColorOption
                    variant={variant}
                    selected={variant.slug === current.slug}
                    onChoose={onClose}
                    onClose={onClose}
                  />
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}