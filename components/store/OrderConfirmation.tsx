"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import PageHeading from "@/components/ui/PageHeading";
import ActionButton from "@/components/ui/ActionButton";
import Skeleton from "@/components/ui/Skeleton";
import TrimmedImage from "@/components/ui/TrimmedImage";
import DemoNotice from "@/components/ui/DemoNotice";
import EmptyState from "@/components/store/EmptyState";
import { CheckCircleIcon } from "@/components/icons/store";
import { useCart } from "@/components/providers/CartProvider";
import { deliveryWindowLabel, formatNaira } from "@/lib/catalog";

const AOS_DEFAULT_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];

/** A label/value pair inside the confirmation's detail cards. */
function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[0.8125rem] font-light text-[#BDC0C2]">{label}</p>
      <div className="mt-1 text-sm font-semibold leading-6">{children}</div>
    </div>
  );
}

/**
 * The screen shown after "Place order". It reads the last order from the
 * browser-saved store, so it survives a refresh; if there isn't one (someone
 * opened the URL directly) it says so instead of showing an empty receipt.
 */
export default function OrderConfirmation() {
  const { hydrated, order } = useCart();

  if (!hydrated) {
    return (
      <div className="mx-auto min-h-[60svh] max-w-[60.0625rem] px-6 pt-6">
        <PageHeading title="Thank you" />
        <div className="mx-auto mt-10 max-w-[40rem] space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto min-h-[60svh] max-w-[60.0625rem] px-6 pt-6">
        <PageHeading title="Orders" />
        <EmptyState
          title="No recent order"
          message="When you place an order, its confirmation will show up here."
          actionLabel="Shop headphones"
          actionHref="/#products"
        />
      </div>
    );
  }

  const { details } = order;
  const firstName = details.fullName.split(" ")[0] ?? details.fullName;
  const placedOn = new Date(order.placedAt);
  const placedLabel = placedOn.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const arrivalLabel = deliveryWindowLabel(order.deliveryMinDays, order.deliveryMaxDays, placedOn);

  return (
    <div className="mx-auto min-h-[60svh] max-w-[60.0625rem] px-6 pt-6">
      <PageHeading title="Thank you" />

      <div className="mx-auto mt-10 max-w-[40rem]">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.2, ease: AOS_DEFAULT_EASE } }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black"
          >
            <CheckCircleIcon className="h-9 w-9" />
          </motion.div>
          <h3 className="mt-5 text-2xl font-semibold">Order confirmed</h3>
          <p className="mt-2 max-w-[26rem] text-sm font-light leading-6 text-[#BDC0C2]">
            Thanks, {firstName}. We&apos;ve sent the details to {details.email}.
          </p>
        </div>

        <Reveal variant="fade-up" duration={700} delay={100} offset={0} className="mt-8 rounded-xl bg-[#181A1B] p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-3">
            <Detail label="Order number">{order.id}</Detail>
            <Detail label="Placed on">{placedLabel}</Detail>
            <Detail label="Estimated delivery">{arrivalLabel}</Detail>
          </div>
        </Reveal>

        <Reveal variant="fade-up" duration={700} delay={150} offset={0} className="mt-4 rounded-xl bg-[#181A1B] p-5 sm:p-6">
          <h3 className="text-lg font-semibold">Items</h3>
          <ul className="mt-4 divide-y divide-[#232325]">
            {order.lines.map((line) => (
              <li key={line.slug} className="flex items-center gap-3 py-3">
                <div className="h-14 w-14 shrink-0 rounded-lg bg-[#0F0F10] p-1.5">
                  <TrimmedImage src={line.image} alt="" className="h-full w-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{line.title}</p>
                  <p className="text-[0.8125rem] font-light text-[#BDC0C2]">Qty {line.quantity}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold">{formatNaira(line.price * line.quantity)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-3 space-y-3 border-t border-[#232325] pt-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="font-light text-[#BDC0C2]">Subtotal</dt>
              <dd className="font-semibold">{formatNaira(order.subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="font-light text-[#BDC0C2]">{order.deliveryLabel}</dt>
              <dd className="font-semibold">{order.shipping === 0 ? "Free" : formatNaira(order.shipping)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-[#2A2A2E] pt-4">
            <p className="text-base font-semibold">Total</p>
            <p className="text-lg font-semibold">{formatNaira(order.total)}</p>
          </div>
        </Reveal>

        <Reveal variant="fade-up" duration={700} delay={200} offset={0} className="mt-4 rounded-xl bg-[#181A1B] p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Detail label="Shipping to">
              {details.fullName}
              <br />
              {details.street}
              <br />
              {details.city}, {details.state}
            </Detail>
            <Detail label="Contact">
              {details.email}
              <br />
              {details.phone}
            </Detail>
          </div>
        </Reveal>

        <div className="mt-6">
          <DemoNotice />
        </div>

        <ActionButton variant="light" href="/" className="mt-6 w-full sm:mx-auto sm:w-auto sm:min-w-[16rem]">
          Continue shopping
        </ActionButton>
      </div>
    </div>
  );
}