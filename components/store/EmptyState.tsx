import Reveal from "@/components/ui/Reveal";
import ActionButton from "@/components/ui/ActionButton";
import { BagIcon } from "@/components/icons";

/** A centered card for screens with nothing to show (empty bag, no recent order). */
export default function EmptyState({
  title,
  message,
  actionLabel,
  actionHref,
}: {
  title: string;
  message: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <Reveal
      variant="zoom-in"
      duration={700}
      className="mx-auto mt-12 flex max-w-[24rem] flex-col items-center rounded-xl bg-[#181A1B] px-6 py-10 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0F0F10] text-white">
        <BagIcon />
      </div>
      <h3 className="mt-5 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm font-light leading-6 text-[#BDC0C2]">{message}</p>
      <ActionButton variant="light" href={actionHref} className="mt-6 w-full">
        {actionLabel}
      </ActionButton>
    </Reveal>
  );
}