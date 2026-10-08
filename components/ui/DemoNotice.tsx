import { InfoCircleIcon } from "@/components/icons/store";

/** The "this is a demo" notice shown on checkout and order confirmation. */
export default function DemoNotice() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-[#2A2A2E] bg-[#141415] p-4 text-[0.8125rem] font-light leading-5 text-[#BDC0C2]">
      <InfoCircleIcon className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-white" />
      <p>This is a demo store. No real payment is taken and no order is actually placed.</p>
    </div>
  );
}