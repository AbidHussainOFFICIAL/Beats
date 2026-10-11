"use client";

import { useEffect } from "react";
import ErrorState from "@/components/store/ErrorState";

/**
 * Catches an error in any store page and shows it INSIDE the shared shell, so
 * the header, footer and tab bar stay on screen.
 */
export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorState error={error} onRetry={reset} />;
}