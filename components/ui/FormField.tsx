"use client";

import { forwardRef, useId, type InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * A labelled text input styled like the subscribe popover's field (dark,
 * thin border, white focus border). Works with react-hook-form's `register`
 * (the ref is forwarded). The `field-input` class hooks into the autofill
 * override in globals.css so Chrome's autofill doesn't paint it light blue.
 */
const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { label, error, className = "", ...inputProps },
  ref
) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[0.8125rem] font-light text-[#BDC0C2]">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`field-input w-full rounded-lg border bg-[#0F0F10] px-3 py-3 text-sm font-light text-white placeholder-[#6B6B70] outline-none transition-colors focus:ring-0 ${
          error ? "border-red-400/70 focus:border-red-400" : "border-[#2A2A2E] focus:border-white/40"
        } ${className}`}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

export default FormField;