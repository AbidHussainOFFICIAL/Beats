"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Reveal from "@/components/ui/Reveal";
import PageHeading from "@/components/ui/PageHeading";
import ActionButton from "@/components/ui/ActionButton";
import FormField from "@/components/ui/FormField";
import Skeleton from "@/components/ui/Skeleton";
import TrimmedImage from "@/components/ui/TrimmedImage";
import DemoNotice from "@/components/ui/DemoNotice";
import DeliveryWindow from "@/components/store/DeliveryWindow";
import EmptyState from "@/components/store/EmptyState";
import { useCart } from "@/components/providers/CartProvider";
import {
  SHIPPING_METHODS,
  formatNaira,
  getShippingMethod,
  shippingFee,
} from "@/lib/catalog";

const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .regex(/^\+?[\d\s-]{7,}$/, "Enter a valid phone number"),
  street: z.string().trim().min(5, "Enter your street address"),
  city: z.string().trim().min(2, "Enter your city"),
  state: z.string().trim().min(2, "Enter your state"),
  delivery: z.enum(["standard", "express"]),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

/** How long the fake "processing" pause lasts before the order is placed. */
const PROCESSING_MS = 700;

function CheckoutSection({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <Reveal variant="fade-up" duration={700} offset={0} className="rounded-xl bg-[#181A1B] p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F0F10] text-[0.8125rem] font-semibold"
        >
          {step}
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </Reveal>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-6">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
      <Skeleton className="h-72 w-full" />
    </div>
  );
}

export default function CheckoutView() {
  const router = useRouter();
  const { hydrated, lines, count, subtotal, placeOrder } = useCart();
  // True from the moment the order is placed until the confirmation screen
  // takes over — placing the order empties the bag, which would otherwise
  // flash the "bag is empty" screen in between.
  const [redirecting, setRedirecting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { delivery: "standard" },
  });

  const selectedMethod = getShippingMethod(watch("delivery"));
  const shipping = shippingFee(selectedMethod, subtotal);
  const total = subtotal + shipping;

  const onSubmit = async (values: CheckoutValues) => {
    // Demo only: no payment, no network request — a short pause so the
    // button's "Placing order…" state is visible.
    await new Promise((resolve) => setTimeout(resolve, PROCESSING_MS));
    setRedirecting(true);
    placeOrder(values);
    router.push("/order-confirmation");
  };

  return (
    <div className="mx-auto min-h-[60svh] max-w-[60.0625rem] px-6 pt-6">
      <PageHeading title="Checkout" />

      {redirecting ? (
        <p className="mt-16 text-center text-sm font-light text-[#BDC0C2]" role="status">
          Placing your order…
        </p>
      ) : !hydrated ? (
        <CheckoutSkeleton />
      ) : lines.length === 0 ? (
        <EmptyState
          title="Nothing to check out"
          message="Your bag is empty. Add a pair of Beats 3 first."
          actionLabel="Shop headphones"
          actionHref="/#products"
        />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start"
        >
          <div className="space-y-6">
            <CheckoutSection step={1} title="Contact">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FormField
                    label="Full name"
                    autoComplete="name"
                    placeholder="Ada Okafor"
                    error={errors.fullName?.message}
                    {...register("fullName")}
                  />
                </div>
                <FormField
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
                <FormField
                  label="Phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+234 801 234 5678"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
              </div>
            </CheckoutSection>

            <CheckoutSection step={2} title="Shipping address">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FormField
                    label="Street address"
                    autoComplete="street-address"
                    placeholder="12 Admiralty Way"
                    error={errors.street?.message}
                    {...register("street")}
                  />
                </div>
                <FormField
                  label="City"
                  autoComplete="address-level2"
                  placeholder="Lagos"
                  error={errors.city?.message}
                  {...register("city")}
                />
                <FormField
                  label="State"
                  autoComplete="address-level1"
                  placeholder="Lagos State"
                  error={errors.state?.message}
                  {...register("state")}
                />
              </div>
            </CheckoutSection>

            <CheckoutSection step={3} title="Delivery">
              <fieldset className="space-y-3">
                <legend className="sr-only">Delivery method</legend>
                {SHIPPING_METHODS.map((method) => {
                  const fee = shippingFee(method, subtotal);
                  return (
                    <label key={method.id} className="relative block cursor-pointer">
                      <input type="radio" value={method.id} className="peer sr-only" {...register("delivery")} />
                      <div className="flex items-start justify-between gap-4 rounded-lg border border-[#2A2A2E] bg-[#0F0F10] p-4 transition-colors peer-checked:border-white peer-focus-visible:ring-2 peer-focus-visible:ring-white/40 [&_p]:cursor-pointer [&_span]:cursor-pointer">
                        <div>
                          <p className="text-sm font-semibold">{method.label}</p>
                          <p className="mt-1 text-[0.8125rem] font-light text-[#BDC0C2]">
                            Arrives <DeliveryWindow minDays={method.minDays} maxDays={method.maxDays} />
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold">{fee === 0 ? "Free" : formatNaira(fee)}</p>
                      </div>
                    </label>
                  );
                })}
              </fieldset>
            </CheckoutSection>
          </div>

          <Reveal variant="fade-up" duration={700} offset={0} className="rounded-xl bg-[#181A1B] p-5 sm:p-6 lg:sticky lg:top-24">
            <h3 className="text-lg font-semibold">
              Order summary ({count} {count === 1 ? "item" : "items"})
            </h3>

            <ul className="mt-4 divide-y divide-[#232325]">
              {lines.map(({ product, quantity }) => (
                <li key={product.slug} className="flex items-center gap-3 py-3">
                  <div className="h-14 w-14 shrink-0 rounded-lg bg-[#0F0F10] p-1.5">
                    <TrimmedImage src={product.image} alt="" className="h-full w-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{product.title}</p>
                    <p className="text-[0.8125rem] font-light text-[#BDC0C2]">Qty {quantity}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold">{formatNaira(product.price * quantity)}</p>
                </li>
              ))}
            </ul>

            <dl className="mt-3 space-y-3 border-t border-[#232325] pt-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="font-light text-[#BDC0C2]">Subtotal</dt>
                <dd className="font-semibold">{formatNaira(subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-light text-[#BDC0C2]">Shipping</dt>
                <dd className="font-semibold">{shipping === 0 ? "Free" : formatNaira(shipping)}</dd>
              </div>
            </dl>

            <div className="mt-4 flex items-center justify-between border-t border-[#2A2A2E] pt-4">
              <p className="text-base font-semibold">Total</p>
              <p className="text-lg font-semibold">{formatNaira(total)}</p>
            </div>

            <ActionButton type="submit" variant="light" disabled={isSubmitting} className="mt-5 w-full">
              {isSubmitting ? "Placing order…" : "Place order"}
            </ActionButton>

            <div className="mt-4">
              <DemoNotice />
            </div>
          </Reveal>
        </form>
      )}
    </div>
  );
}