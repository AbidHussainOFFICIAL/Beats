"use client";

import { useEffect } from "react";
import ErrorState from "@/components/store/ErrorState";

/**
 * The fallback for errors that happen OUTSIDE a store page — e.g. in the
 * shared header or footer themselves — so it can't rely on that shell and
 * stands alone.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[100svh] flex-col justify-center py-10">
      <ErrorState error={error} onRetry={reset} />
    </main>
  );
}