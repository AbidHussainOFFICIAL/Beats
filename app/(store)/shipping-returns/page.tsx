import type { Metadata } from "next";
import InfoPage, { InfoSection } from "@/components/store/InfoPage";
import DeliveryWindow from "@/components/store/DeliveryWindow";
import {
  FREE_STANDARD_SHIPPING_FROM,
  SHIPPING_METHODS,
  formatNaira,
} from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shipping & returns",
  description: "Delivery options, returns and warranty for your Beats order.",
};

// The delivery options come straight from lib/catalog.ts so they always match
// checkout. The returns and warranty text is demo copy — replace it with the
// real policy before launch.
export default function ShippingReturnsPage() {
  return (
    <InfoPage title="Shipping" intro="How your order gets to you, and what to do if it isn't right.">
      <InfoSection title="Delivery">
        <ul className="space-y-4">
          {SHIPPING_METHODS.map((method) => (
            <li key={method.id}>
              <p className="font-semibold text-white">{method.label}</p>
              <p>
                Arrives <DeliveryWindow minDays={method.minDays} maxDays={method.maxDays} />
              </p>
              <p>
                {formatNaira(method.fee)}
                {method.id === "standard" && `, free on orders over ${formatNaira(FREE_STANDARD_SHIPPING_FROM)}`}
              </p>
            </li>
          ))}
        </ul>
      </InfoSection>

      <InfoSection title="Returns">
        <p>
          Changed your mind? Return your Beats 3 in their original condition and packaging within 30 days for a refund.
        </p>
      </InfoSection>

      <InfoSection title="Warranty">
        <p>Every Beats 3 comes with a one-year limited warranty against manufacturing defects.</p>
      </InfoSection>
    </InfoPage>
  );
}