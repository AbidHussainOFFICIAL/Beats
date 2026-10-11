"use client";

import PageHeading from "@/components/ui/PageHeading";
import Reveal from "@/components/ui/Reveal";
import ActionButton from "@/components/ui/ActionButton";

/**
 * The "something went wrong" screen's content, shared by the app's error
 * boundaries. `onRetry` re-renders the part of the page that failed. The
 * digest is a short code Next attaches to server errors — handy to quote
 * when reporting a problem.
 */
export default function ErrorState({
  error,
  onRetry,
}: {
  error: Error & { digest?: string };
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto min-h-[60svh] max-w-[60.0625rem] px-6 pt-6">
      <PageHeading title="Oops" />
      <Reveal
        variant="fade-up"
        duration={700}
        offset={0}
        className="mx-auto mt-8 flex max-w-[24rem] flex-col items-center text-center"
      >
        <h3 className="text-2xl font-semibold">Something went wrong</h3>
        <p className="mt-2 text-sm font-light leading-6 text-[#BDC0C2]">
          We couldn&apos;t load this page. You can try again, or head back to the start.
        </p>
        {error.digest && <p className="mt-2 text-xs font-light text-[#8E9296]">Error code: {error.digest}</p>}
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
          <ActionButton variant="light" onClick={onRetry} className="w-full">
            Try again
          </ActionButton>
          <ActionButton href="/" className="w-full">
            Back to home
          </ActionButton>
        </div>
      </Reveal>
    </div>
  );
}