"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InfoPage from "@/components/store/InfoPage";
import Reveal from "@/components/ui/Reveal";
import ActionButton from "@/components/ui/ActionButton";
import FormField from "@/components/ui/FormField";
import DemoNotice from "@/components/ui/DemoNotice";
import { CheckCircleIcon } from "@/components/icons/store";
import { catalog, getProduct } from "@/lib/catalog";

const registerSchema = z.object({
  product: z.string().min(1, "Choose your color"),
  serial: z.string().trim().min(6, "Enter the serial number (at least 6 characters)"),
  purchaseDate: z
    .string()
    .min(1, "Choose the purchase date")
    .refine((value) => new Date(value) <= new Date(), "The purchase date can't be in the future"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
});

type RegisterValues = z.infer<typeof registerSchema>;

const headphones = catalog.filter((product) => product.kind === "headphones");

/** How long the fake "registering" pause lasts. */
const PROCESSING_MS = 600;

/**
 * Product registration. Demo only: nothing is sent or saved — it validates
 * the form and shows a confirmation.
 */
export default function RegisterView() {
  const [registered, setRegistered] = useState<RegisterValues | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { product: "" },
  });

  const onSubmit = async (values: RegisterValues) => {
    await new Promise((resolve) => setTimeout(resolve, PROCESSING_MS));
    setRegistered(values);
  };

  const handleRegisterAnother = () => {
    reset();
    setRegistered(null);
  };

  const registeredProduct = registered ? getProduct(registered.product) : undefined;

  return (
    <InfoPage title="Register" intro="Register your Beats 3 to activate your warranty.">
      {registered ? (
        <Reveal variant="zoom-in" duration={700} className="flex flex-col items-center rounded-xl bg-[#181A1B] px-6 py-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black">
            <CheckCircleIcon className="h-9 w-9" />
          </div>
          <h3 className="mt-5 text-2xl font-semibold">Product registered</h3>
          <p className="mt-2 max-w-[24rem] text-sm font-light leading-6 text-[#BDC0C2]">
            {registeredProduct?.title ?? "Your Beats 3"} (serial {registered.serial}) is now registered. We&apos;ll send
            the details to {registered.email}.
          </p>
          <ActionButton variant="light" onClick={handleRegisterAnother} className="mt-6 w-full sm:w-auto sm:min-w-[16rem]">
            Register another
          </ActionButton>
        </Reveal>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Reveal variant="fade-up" duration={700} offset={0} className="rounded-xl bg-[#181A1B] p-5 sm:p-6">
            <div className="grid gap-4">
              <div>
                <label htmlFor="register-product" className="mb-2 block text-[0.8125rem] font-light text-[#BDC0C2]">
                  Color
                </label>
                <select
                  id="register-product"
                  aria-invalid={errors.product ? true : undefined}
                  className={`field-input w-full rounded-lg border bg-[#0F0F10] px-3 py-3 text-sm font-light text-white outline-none transition-colors focus:ring-0 ${
                    errors.product ? "border-red-400/70 focus:border-red-400" : "border-[#2A2A2E] focus:border-white/40"
                  }`}
                  {...register("product")}
                >
                  <option value="">Select your color</option>
                  {headphones.map((product) => (
                    <option key={product.slug} value={product.slug}>
                      {product.title}
                    </option>
                  ))}
                </select>
                {errors.product && <p className="mt-2 text-xs text-red-400">{errors.product.message}</p>}
              </div>

              <FormField
                label="Serial number"
                autoComplete="off"
                placeholder="e.g. BT3-123456"
                error={errors.serial?.message}
                {...register("serial")}
              />
              <FormField
                label="Purchase date"
                type="date"
                error={errors.purchaseDate?.message}
                {...register("purchaseDate")}
              />
              <FormField
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>
          </Reveal>

          <ActionButton type="submit" variant="light" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Registering…" : "Register product"}
          </ActionButton>
          <DemoNotice />
        </form>
      )}
    </InfoPage>
  );
}