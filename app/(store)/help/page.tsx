import type { Metadata } from "next";
import InfoPage, { InfoSection } from "@/components/store/InfoPage";
import ActionButton from "@/components/ui/ActionButton";

export const metadata: Metadata = {
  title: "Product help",
  description: "Pairing, charging and care tips for your Beats 3.",
};

// Demo copy based on the Beats 3 specs on the landing page — replace with the
// real setup instructions before launch.
export default function HelpPage() {
  return (
    <InfoPage title="Help" intro="Quick answers for getting the most out of your Beats 3.">
      <InfoSection title="Pair your headphones">
        <ol className="list-decimal space-y-2 pl-5">
          <li>Turn on Bluetooth on your phone, tablet or computer.</li>
          <li>Switch on your Beats 3 and keep them close to the device.</li>
          <li>Pick Beats 3 from the list of available devices.</li>
          <li>Wait for the confirmation sound — you&apos;re connected.</li>
        </ol>
      </InfoSection>

      <InfoSection title="Charging and battery">
        <p>
          Beats 3 play for up to 40 hours on a full charge, and Fast Charge (4.2-AAC) gives you a quick top-up when
          you&apos;re short on time.
        </p>
      </InfoSection>

      <InfoSection title="Siri and Google">
        <p>
          The built-in microphone supports Apple Siri and Google, so you can ask for music, directions or calls
          hands-free once your headphones are paired.
        </p>
      </InfoSection>

      <InfoSection title="Care and storage">
        <p>
          Keep your headphones in their case when you&apos;re not using them, and wipe the padded earphones with a soft,
          dry cloth.
        </p>
      </InfoSection>

      <InfoSection title="Still stuck?">
        <p>This is a demo store, so there&apos;s no support desk behind these pages.</p>
        <ActionButton variant="light" href="/#products" className="mt-4 w-full sm:w-auto sm:min-w-[14rem]">
          Back to shopping
        </ActionButton>
      </InfoSection>
    </InfoPage>
  );
}