"use client";

import type { ReactNode } from "react";
import { MinusIcon, PlusIcon } from "@/components/icons/store";
import { usePressedState } from "@/lib/hooks/usePressedState";
import { MAX_QUANTITY } from "@/lib/catalog";

function StepButton({
  label,
  disabled,
  onClick,
  size,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  size: "sm" | "md";
  children: ReactNode;
}) {
  const { isPressed, handlers } = usePressedState();

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      {...handlers}
      className={`flex items-center justify-center rounded-lg transition-colors duration-200 disabled:opacity-40 disabled:hover:bg-[#1E1E21] disabled:hover:text-white ${
        size === "sm" ? "h-7 w-7" : "h-9 w-9"
      } ${isPressed ? "bg-white text-black" : "bg-[#1E1E21] text-white hover:bg-white hover:text-black"}`}
    >
      {children}
    </button>
  );
}

/** A − / value / + control. Clamped to 1…MAX_QUANTITY. */
export default function QuantityStepper({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
}) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className="inline-flex items-center gap-1" role="group" aria-label="Quantity">
      <StepButton label="Decrease quantity" disabled={value <= 1} onClick={() => onChange(value - 1)} size={size}>
        <MinusIcon className={iconSize} />
      </StepButton>
      <span
        className={`text-center font-semibold ${size === "sm" ? "w-7 text-xs" : "w-9 text-sm"}`}
        aria-live="polite"
      >
        {value}
      </span>
      <StepButton
        label="Increase quantity"
        disabled={value >= MAX_QUANTITY}
        onClick={() => onChange(value + 1)}
        size={size}
      >
        <PlusIcon className={iconSize} />
      </StepButton>
    </div>
  );
}