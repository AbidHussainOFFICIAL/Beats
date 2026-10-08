"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import TrimmedImage from "@/components/ui/TrimmedImage";
import { CheckIcon } from "@/components/icons";
import { useCart } from "@/components/providers/CartProvider";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { getProduct } from "@/lib/catalog";

const TOAST_DURATION_MS = 3200;
const AOS_DEFAULT_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];

/**
 * The mobile "Added to bag" confirmation: a small card above the tab bar
 * with a "View bag" link, shown for a few seconds after something is added.
 * On desktop the mini-bag flyout does this job, so this stays hidden at lg+.
 */
export default function AddedToast() {
  const { addedSignal } = useCart();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [visible, setVisible] = useState(false);
  const handledSignalRef = useRef(addedSignal);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (addedSignal === handledSignalRef.current) return;
    handledSignalRef.current = addedSignal;
    if (!addedSignal || isDesktop) return;

    setVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(false), TOAST_DURATION_MS);
  }, [addedSignal, isDesktop]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const product = addedSignal ? getProduct(addedSignal.slug) : undefined;

  return (
    <AnimatePresence>
      {visible && product && (
        <motion.div
          role="status"
          className="fixed inset-x-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 mx-auto flex max-w-[24rem] items-center gap-3 rounded-xl border border-[#2A2A2E] bg-[#1E1E21] p-3 shadow-2xl shadow-black/50 lg:hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: AOS_DEFAULT_EASE } }}
          exit={{ opacity: 0, y: 16, transition: { duration: 0.2, ease: AOS_DEFAULT_EASE } }}
        >
          <div className="h-12 w-12 shrink-0 rounded-lg bg-[#0F0F10] p-1.5">
            <TrimmedImage src={product.image} alt="" className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[0.8125rem] font-semibold">
              <CheckIcon className="shrink-0" />
              Added to bag
            </p>
            <p className="truncate text-xs font-light text-[#BDC0C2]">{product.title}</p>
          </div>
          <Link
            href="/bag"
            onClick={() => setVisible(false)}
            className="shrink-0 rounded-lg bg-white px-4 py-2.5 text-[0.8125rem] font-medium text-black"
          >
            View bag
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}