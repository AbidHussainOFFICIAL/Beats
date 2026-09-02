"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SubscribeArrowIcon } from "@/components/icons";

const subscribeSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

type SubscribeValues = z.infer<typeof subscribeSchema>;

/**
 * Dummy subscribe form — validates the email client-side only.
 * No network request is made; wire `onSubmit` up to a real API route
 * (Mailchimp / ConvertKit / Resend, etc.) when you're ready.
 */
export default function SubscribeForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscribeValues>({ resolver: zodResolver(subscribeSchema) });

  const onSubmit = (_values: SubscribeValues) => {
    // Dummy: no API call. Replace this with a real POST when ready.
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex items-center justify-between bg-[#181A1B] rounded-lg py-2 px-4"
      >
        <div className="flex-1 mr-2">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="block w-full outline-none outline-0 border-none border-0 border-transparent bg-transparent caret-white placeholder-[#BDC0C2] focus:border-transparent focus:bg-transparent focus:text-white focus:placeholder-gray-500 focus:outline-none focus:ring-0 focus:ring-transparent focus:placeholder:text-transparent font-light text-[0.9375rem]"
            {...register("email")}
          />
        </div>

        <button
          type="submit"
          className="group relative flex bg-[#0A0A0B] min-w-[8.125rem] w-[8.125rem] h-[3.1875rem] rounded-lg overflow-hidden border border-transparent hover:border-[#3F3F45] transition-all duration-700"
          style={{ willChange: "transform" }}
        >
          <span className="flex justify-center items-center h-full w-full transform group-hover:-translate-x-[14px] transition-transform cursor-pointer duration-700">
            Subscribe
          </span>
          <span className="absolute top-0 -right-[30px] group-hover:-right-0 h-full flex justify-center items-center px-1.5 bg-[#29292D] transition-all cursor-pointer duration-700">
            <SubscribeArrowIcon />
          </span>
        </button>
      </form>

      {errors.email && <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>}
      {submitted && !errors.email && <p className="mt-2 text-xs text-[#BDC0C2]">Thanks — you&apos;re on the list.</p>}
    </div>
  );
}
