"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import PageHeading from "@/components/ui/PageHeading";
import ActionButton from "@/components/ui/ActionButton";
import QuantityStepper from "@/components/ui/QuantityStepper";
import Skeleton from "@/components/ui/Skeleton";
import TrimmedImage from "@/components/ui/TrimmedImage";
import EmptyState from "@/components/store/EmptyState";
import { TrashIcon } from "@/components/icons/store";
import { useCart, type CartLine } from "@/components/providers/CartProvider";
import { FREE_STANDARD_SHIPPING_FROM, formatNaira } from "@/lib/catalog";

const AOS_DEFAULT_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];

function BagLine({
  line,
  onQuantityChange,
  onRemove,
}: {
  line: CartLine;
  onQuantityChange: (next: number) => void;
  onRemove: () => void;
}) {
  const { product, quantity } = line;

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: AOS_DEFAULT_EASE } }}
      exit={{ opacity: 0, height: 0, transition: { duration: 0.25, ease: AOS_DEFAULT_EASE } }}
      className="overflow-hidden"
    >
      <div className="flex gap-4 py-5">
        <Link
          href={`/products/${product.slug}`}
          aria-label={`View ${product.title}`}
          className="block h-24 w-24 shrink-0 rounded-lg bg-[#181A1B] p-2 sm:h-28 sm:w-28"
        >
          <TrimmedImage src={product.image} alt="" className="pointer-events-none h-full w-full object-contain" />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href={`/products/${product.slug}`} className="block text-base font-semibold">
                {product.title}
              </Link>
              <p className="mt-1 flex items-center gap-2 text-[0.8125rem] font-light text-[#BDC0C2]">
                <span
                  aria-hidden="true"
                  className="inline-block h-3 w-3 rounded-full border border-white/20"
                  style={{ background: product.swatch }}
                />
                {product.name}
              </p>
              <p className="mt-1 text-[0.8125rem] font-light text-[#BDC0C2]">{formatNaira(product.price)} each</p>
            </div>
            <p className="shrink-0 text-base font-semibold">{formatNaira(product.price * quantity)}</p>
          </div>

          <div className="mt-auto flex items-center justify-between pt-3">
            <QuantityStepper value={quantity} onChange={onQuantityChange} />
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center gap-1.5 text-[0.8125rem] font-light text-[#BDC0C2] transition-colors hover:text-white"
            >
              <TrashIcon className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

function BagSkeleton() {
  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-5">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function BagView() {
  const { hydrated, lines, count, subtotal, setQuantity, removeItem } = useCart();

  const freeShippingProgress = Math.min(subtotal / FREE_STANDARD_SHIPPING_FROM, 1);
  const remainingForFreeShipping = Math.max(FREE_STANDARD_SHIPPING_FROM - subtotal, 0);

  return (
    <div className="mx-auto min-h-[60svh] max-w-[60.0625rem] px-6 pt-6">
      <PageHeading title="Bag" />

      {!hydrated ? (
        <BagSkeleton />
      ) : lines.length === 0 ? (
        <EmptyState
          title="Your bag is empty"
          message="Pick a pair of Beats 3 and they'll show up here."
          actionLabel="Shop headphones"
          actionHref="/#products"
        />
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
          <ul className="divide-y divide-[#232325] border-y border-[#232325]">
            <AnimatePresence initial={false}>
              {lines.map((line) => (
                <BagLine
                  key={line.product.slug}
                  line={line}
                  onQuantityChange={(next) => setQuantity(line.product.slug, next)}
                  onRemove={() => removeItem(line.product.slug)}
                />
              ))}
            </AnimatePresence>
          </ul>

          <Reveal variant="fade-up" duration={700} offset={0} className="rounded-xl bg-[#181A1B] p-5 sm:p-6 lg:sticky lg:top-24">
            <h3 className="text-lg font-semibold">Order summary</h3>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="font-light text-[#BDC0C2]">
                  Subtotal ({count} {count === 1 ? "item" : "items"})
                </dt>
                <dd className="font-semibold">{formatNaira(subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-light text-[#BDC0C2]">Shipping</dt>
                <dd className="font-light text-[#BDC0C2]">Chosen at checkout</dd>
              </div>
            </dl>

            <div className="mt-5">
              <p className="text-[0.8125rem] font-light leading-5 text-[#BDC0C2]">
                {remainingForFreeShipping > 0
                  ? `Add ${formatNaira(remainingForFreeShipping)} more for free standard delivery.`
                  : "You've unlocked free standard delivery."}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#2A2A2E]">
                <motion.div
                  className="h-full rounded-full bg-white"
                  initial={false}
                  animate={{ width: `${freeShippingProgress * 100}%` }}
                  transition={{ duration: 0.5, ease: AOS_DEFAULT_EASE }}
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#2A2A2E] pt-5">
              <p className="text-base font-semibold">Total</p>
              <p className="text-lg font-semibold">{formatNaira(subtotal)}</p>
            </div>
            <p className="mt-1 text-[0.75rem] font-light text-[#8E9296]">Before shipping.</p>

            <ActionButton variant="light" href="/checkout" className="mt-5 w-full">
              Checkout
            </ActionButton>
            <ActionButton href="/#products" className="mt-3 w-full">
              Continue shopping
            </ActionButton>
          </Reveal>
        </div>
      )}
    </div>
  );
}