"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePressedState } from "@/lib/hooks/usePressedState";

interface ActionButtonProps {
  children: ReactNode;
  /** "dark" is the landing page's button look; "light" is the white primary action. */
  variant?: "dark" | "light";
  /** Renders a link instead of a button. */
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  /** Extra classes for sizing/layout (e.g. "w-full"). */
  className?: string;
}

/**
 * The store's standard button, in the same visual language as the landing
 * page's buttons (rounded-lg, 55px tall, dark fill that turns white on
 * hover). Tap feedback uses real pointer events (see usePressedState)
 * because `hover:` utilities never fire on touch devices in this app. Only
 * colors change while pressed — no scale — so the hit box never moves under
 * the finger. Pass plain text and icons as children (a `span` would pick up
 * globals.css's `cursor: default`).
 */
export default function ActionButton({
  children,
  variant = "dark",
  href,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: ActionButtonProps) {
  const { isPressed, handlers } = usePressedState();

  const colors =
    variant === "light"
      ? isPressed
        ? "bg-[#D4D4D8] text-black"
        : "bg-white text-black hover:bg-[#E4E4E7]"
      : isPressed
        ? "bg-white text-black"
        : "bg-[#1E1E21] text-white hover:bg-white hover:text-black";

  const classes = `flex h-[3.4375rem] items-center justify-center gap-3 rounded-lg px-6 text-[0.9375rem] transition-colors duration-300 disabled:cursor-default disabled:opacity-60 ${colors} ${className}`;

  if (href) {
    return (
      <Link href={href} onClick={onClick} {...handlers} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} {...handlers} className={classes}>
      {children}
    </button>
  );
}