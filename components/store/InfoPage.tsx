import type { ReactNode } from "react";
import PageHeading from "@/components/ui/PageHeading";
import Reveal from "@/components/ui/Reveal";

/** The shared layout for the simple content pages (Help, Updates, Shipping, Register): the big page title, an optional intro, then a narrow column of cards. */
export default function InfoPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto min-h-[60svh] max-w-[60.0625rem] px-6 pt-6">
      <PageHeading title={title} />
      {intro && (
        <Reveal variant="fade-up" duration={700} offset={0}>
          <p className="mx-auto mt-6 max-w-[28rem] text-center text-[0.9375rem] font-light leading-7 text-[#BDC0C2]">
            {intro}
          </p>
        </Reveal>
      )}
      <div className="mx-auto mt-10 max-w-[40rem] space-y-4">{children}</div>
    </div>
  );
}

/** One card inside an InfoPage. */
export function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal variant="fade-up" duration={700} offset={150} className="rounded-xl bg-[#181A1B] p-5 sm:p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-3 text-sm font-light leading-7 text-[#BDC0C2]">{children}</div>
    </Reveal>
  );
}