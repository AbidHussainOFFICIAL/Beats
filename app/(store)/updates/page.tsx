import type { Metadata } from "next";
import InfoPage, { InfoSection } from "@/components/store/InfoPage";

export const metadata: Metadata = {
  title: "Updates",
  description: "Software and firmware updates for your Beats 3.",
};

// Demo copy: the version and notes below are placeholders — replace them with
// real release information when there is one.
export default function UpdatesPage() {
  return (
    <InfoPage title="Updates" intro="Keep your Beats 3 current with the latest improvements.">
      <InfoSection title="Latest firmware">
        <p className="text-base font-semibold text-white">Version 1.0.0</p>
        <p className="mt-1">You&apos;re up to date — this is the first release.</p>
      </InfoSection>

      <InfoSection title="How to update">
        <ol className="list-decimal space-y-2 pl-5">
          <li>Charge your headphones to at least 50%.</li>
          <li>Connect them to your phone over Bluetooth.</li>
          <li>Keep them close to the phone until the update finishes.</li>
        </ol>
      </InfoSection>

      <InfoSection title="Release notes">
        <ul className="list-disc space-y-2 pl-5">
          <li>Bluetooth v5.2 wireless connection.</li>
          <li>Fast Charge (4.2-AAC) support.</li>
          <li>Siri and Google voice assistant support.</li>
        </ul>
      </InfoSection>
    </InfoPage>
  );
}