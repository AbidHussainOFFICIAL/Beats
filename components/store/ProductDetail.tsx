"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import ActionButton from "@/components/ui/ActionButton";
import QuantityStepper from "@/components/ui/QuantityStepper";
import TrimmedImage, { preloadTrimmedImage } from "@/components/ui/TrimmedImage";
import { preserveScrollOnNextNavigation } from "@/components/layout/ScrollToTop";
import DeliveryWindow from "@/components/store/DeliveryWindow";
import { useCart } from "@/components/providers/CartProvider";
import { CheckIcon } from "@/components/icons";
import { ChevronRightIcon, TruckIcon } from "@/components/icons/store";
import {
  FREE_STANDARD_SHIPPING_FROM,
  SHIPPING_METHODS,
  formatNaira,
  getColorVariants,
  getRelatedProducts,
  type CatalogProduct,
} from "@/lib/catalog";
import { specs } from "@/lib/data";

const AOS_DEFAULT_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];
const ADDED_CONFIRMATION_MS = 1600;

/** A smaller product card for the "You may also like" row. The whole card is one link (an empty overlay link, so the text inside stays plain). */
function RelatedCard({ product, delay }: { product: CatalogProduct; delay: number }) {
  return (
    <Reveal variant="zoom-in" duration={700} delay={delay} className="relative rounded-lg bg-[#181A1B] p-2.5">
      <Link
        href={`/products/${product.slug}`}
        aria-label={`View ${product.title}`}
        className="absolute inset-0 z-10 rounded-lg"
      />
      <div className="relative w-full" style={{ paddingBottom: "75%" }}>
        <TrimmedImage src={product.image} alt="" className="absolute inset-0 h-full w-full object-contain p-1" />
      </div>
      <p className="mt-2 line-clamp-2 text-[0.8125rem] font-semibold leading-4">{product.title}</p>
      <p className="mt-0.5 text-xs font-light text-[#BDC0C2]">{formatNaira(product.price, true)}</p>
    </Reveal>
  );
}

export default function ProductDetail({ product }: { product: CatalogProduct }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const addedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Same reasoning as every other timer in this app: a raw setTimeout isn't
  // tied to the component's lifecycle, so clear it on unmount.
  useEffect(() => {
    return () => {
      if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current);
    };
  }, []);

  // Crop every gallery image ahead of time so switching images is instant.
  useEffect(() => {
    product.gallery.forEach(preloadTrimmedImage);
  }, [product.gallery]);

  const variants = getColorVariants(product);
  const related = getRelatedProducts(product.slug, 3);
  const activeSrc = product.gallery[activeImage] ?? product.image;
  const isHeadphones = product.kind === "headphones";

  const handleAddToBag = () => {
    addItem(product.slug, quantity);
    setJustAdded(true);
    if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current);
    addedTimeoutRef.current = setTimeout(() => setJustAdded(false), ADDED_CONFIRMATION_MS);
  };

  // "Buy now" skips the flyout/toast (silent) since it goes straight to checkout.
  const handleBuyNow = () => {
    addItem(product.slug, quantity, { silent: true });
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-[60.0625rem] px-6 pt-6 lg:pt-10">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[0.8125rem] font-light text-[#BDC0C2]">
        <Link href="/" className="transition-colors hover:text-white">
          Home
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5 opacity-60" />
        <Link href="/#products" className="transition-colors hover:text-white">
          {product.family}
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5 opacity-60" />
        <span aria-current="page" className="text-white">
          {product.name}
        </span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <Reveal variant="zoom-in" duration={700} offset={0} className="lg:sticky lg:top-24 lg:self-start">
          {/* A fixed square (padding-bottom: 100% of the width) with the image
              laid over it absolutely, so the tile's size can never depend on
              the image inside it — each image just fits within it. */}
          <div className="relative w-full overflow-hidden rounded-xl bg-[#181A1B]" style={{ paddingBottom: "100%" }}>
            <AnimatePresence mode="wait" initial={false}>
              <TrimmedImage
                key={activeSrc}
                src={activeSrc}
                alt={product.title}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.35, ease: AOS_DEFAULT_EASE } }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2, ease: AOS_DEFAULT_EASE } }}
                className="absolute inset-0 h-full w-full object-contain p-6"
              />
            </AnimatePresence>
          </div>

          {product.gallery.length > 1 && (
            <ul className="mt-3 flex gap-3">
              {product.gallery.map((src, index) => (
                <li key={src}>
                  <button
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show image ${index + 1} of ${product.gallery.length}`}
                    aria-current={index === activeImage ? "true" : undefined}
                    className={`h-16 w-16 rounded-lg border bg-[#181A1B] p-1.5 transition-colors ${
                      index === activeImage ? "border-white/60" : "border-transparent hover:border-white/30"
                    }`}
                  >
                    <TrimmedImage src={src} alt="" className="pointer-events-none h-full w-full object-contain" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Reveal>

        {/* Info */}
        <div>
          <Reveal variant="fade-up" duration={700} offset={0}>
            <p className="text-sm font-light text-[#BDC0C2]">{product.family}</p>
            {/* The global h1 rule paints headings in a near-invisible gradient
                (the landing page's decorative look). This is the page's real
                title, so those fills are cancelled to keep it plain white. */}
            <h1 className="mt-1 text-[2.25rem] font-semibold leading-tight md:text-[3rem] [background:none] [-webkit-text-fill-color:#ffffff]">
              {product.title}
            </h1>
            <p className="mt-3 text-2xl font-semibold">{formatNaira(product.price)}</p>
            <p className="mt-4 max-w-[28rem] text-[0.9375rem] font-light leading-7 text-[#BDC0C2]">
              {product.description}
            </p>
          </Reveal>

          {variants.length > 1 && (
            <Reveal variant="fade-up" duration={700} delay={50} offset={0} className="mt-6">
              <p className="text-sm font-light text-[#BDC0C2]">
                Color: <span className="font-semibold text-white">{product.name}</span>
              </p>
              <ul className="mt-3 flex flex-wrap gap-3">
                {variants.map((variant) => {
                  const selected = variant.slug === product.slug;
                  return (
                    <li key={variant.slug}>
                      <Link
                        href={`/products/${variant.slug}`}
                        replace
                        scroll={false}
                        onClick={preserveScrollOnNextNavigation}
                        aria-label={variant.name}
                        aria-current={selected ? "true" : undefined}
                        className={`block h-9 w-9 rounded-full border border-white/20 transition-shadow ${
                          selected ? "ring-2 ring-white ring-offset-2 ring-offset-[#0F0F10]" : "hover:ring-2 hover:ring-white/40 hover:ring-offset-2 hover:ring-offset-[#0F0F10]"
                        }`}
                        style={{ background: variant.swatch }}
                      />
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          )}

          <Reveal variant="fade-up" duration={700} delay={100} offset={0} className="mt-6">
            <p className="mb-3 text-sm font-light text-[#BDC0C2]">Quantity</p>
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <ActionButton variant="light" onClick={handleAddToBag} className="w-full sm:w-auto sm:min-w-[12rem]">
                {justAdded ? (
                  <>
                    <CheckIcon />
                    Added to bag
                  </>
                ) : (
                  "Add to Bag"
                )}
              </ActionButton>
              <ActionButton onClick={handleBuyNow} className="w-full sm:w-auto sm:min-w-[10rem]">
                Buy now
              </ActionButton>
            </div>
          </Reveal>

          <Reveal variant="fade-up" duration={700} delay={150} offset={0} className="mt-6 rounded-xl bg-[#181A1B] p-5">
            <div className="flex items-start gap-4">
              <TruckIcon className="mt-0.5 h-6 w-6 shrink-0 text-white" />
              <div className="min-w-0 text-sm">
                <p className="font-semibold">Delivery estimate</p>
                <ul className="mt-2 space-y-1.5 font-light text-[#BDC0C2]">
                  {SHIPPING_METHODS.map((method) => (
                    <li key={method.id}>
                      {method.label}: <DeliveryWindow minDays={method.minDays} maxDays={method.maxDays} />
                      <span className="block text-[0.8125rem] text-[#8E9296]">
                        {method.id === "standard"
                          ? `${formatNaira(method.fee)}, free over ${formatNaira(FREE_STANDARD_SHIPPING_FROM, true)}`
                          : formatNaira(method.fee)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal variant="fade-up" duration={700} delay={200} offset={0}>
            <ul className="mt-6 space-y-2.5">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-light text-[#BDC0C2]">
                  <CheckIcon className="shrink-0 text-white" />
                  {feature}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      {isHeadphones && (
        <section aria-labelledby="specs-heading" className="mt-16 lg:mt-24">
          <Reveal variant="fade-up" duration={700}>
            <h3 id="specs-heading" className="text-2xl font-semibold">
              Tech specs
            </h3>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {specs.map((spec, index) => (
              <Reveal
                key={spec.title}
                variant="zoom-in"
                duration={700}
                delay={(index % 2) * 100}
                offset={200}
                className="flex flex-col items-center rounded-lg bg-[#181A1B] px-3 py-5 text-center"
              >
                <span className="flex h-7 items-center justify-center">
                  <spec.icon />
                </span>
                <h4 className="mt-3 text-base font-semibold">{spec.title}</h4>
                <div className="mt-1 text-[0.8125rem] font-light leading-5 text-[#BDC0C2]">
                  {spec.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="box-heading" className="mt-16 lg:mt-24">
        <Reveal variant="fade-up" duration={700}>
          <h3 id="box-heading" className="text-2xl font-semibold">
            What&apos;s in the box
          </h3>
        </Reveal>
        <Reveal variant="fade-up" duration={700} delay={50} className="mt-6 rounded-xl bg-[#181A1B] p-5 sm:p-6">
          <ul className="grid gap-3 sm:grid-cols-2">
            {product.box.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm font-light text-[#BDC0C2]">
                <CheckIcon className="shrink-0 text-white" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section aria-labelledby="related-heading" className="mt-16 lg:mt-24">
        <Reveal variant="fade-up" duration={700}>
          <h3 id="related-heading" className="text-2xl font-semibold">
            You may also like
          </h3>
        </Reveal>
        <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-[34rem]">
          {related.map((item, index) => (
            <RelatedCard key={item.slug} product={item} delay={(index % 3) * 100} />
          ))}
        </div>
      </section>
    </div>
  );
}