import Reveal from "@/components/ui/Reveal";
import PageHeading from "@/components/ui/PageHeading";
import ActionButton from "@/components/ui/ActionButton";
import { CheckIcon } from "@/components/icons";

/**
 * The "Works with" page the landing page's brand logos link to. The copy is
 * demo placeholder text drawn from the Beats 3 specs (Bluetooth v5.2, 40h
 * battery, Siri and Google support) — replace it with the real compatibility
 * details before launch.
 */
const platforms = [
  {
    name: "Apple",
    logo: "/images/brands/apple.png",
    summary: "Pair with your iPhone, iPad or Mac over Bluetooth v5.2 and talk to Siri hands-free.",
    points: ["Wireless Bluetooth v5.2 pairing", "Supports Apple Siri", "Fast charge 4.2-AAC"],
  },
  {
    name: "Spotify",
    logo: "/images/brands/spotify.png",
    summary: "Stream your playlists wirelessly and keep listening for up to 40 hours on a charge.",
    points: ["Up to 40 hours of battery", "Wireless Bluetooth v5.2", "Built-in microphone for calls"],
  },
  {
    name: "Amazon",
    logo: "/images/brands/amazon.png",
    summary: "Listen to your music, shows and audiobooks from Amazon over a stable wireless connection.",
    points: ["Wireless Bluetooth v5.2", "Comfortable padded earphones", "Up to 40 hours of battery"],
  },
  {
    name: "YouTube",
    logo: "/images/brands/youtube.png",
    summary: "Watch and listen to YouTube on your phone or computer with award-winning Beats sound.",
    points: ["Award-winning Beats sound", "Supports Google", "Wireless listening freedom"],
  },
];

export default function WorksWithView() {
  return (
    <div className="mx-auto min-h-[60svh] max-w-[60.0625rem] px-6 pt-6">
      <PageHeading title="Works with" />

      <Reveal variant="fade-up" duration={700} offset={0}>
        <p className="mx-auto mt-6 max-w-[28rem] text-center text-[0.9375rem] font-light leading-7 text-[#BDC0C2]">
          Beats 3 connects wirelessly to the devices and services you already use.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {platforms.map((platform, index) => (
          <Reveal
            key={platform.name}
            variant="zoom-in"
            duration={700}
            delay={(index % 2) * 100}
            offset={150}
            className="rounded-xl bg-[#181A1B] p-6"
          >
            <div className="flex h-8 items-center">
              <img src={platform.logo} alt={platform.name} className="h-full w-auto" />
            </div>
            <p className="mt-5 text-[0.9375rem] font-light leading-7 text-[#BDC0C2]">{platform.summary}</p>
            <ul className="mt-5 space-y-2.5">
              {platform.points.map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm font-light text-[#BDC0C2]">
                  <CheckIcon className="shrink-0 text-white" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal variant="fade-up" duration={700} offset={100} className="mt-12 flex flex-col items-center text-center">
        <h3 className="text-2xl font-semibold">Ready to listen?</h3>
        <ActionButton variant="light" href="/products/black" className="mt-5 w-full sm:w-auto sm:min-w-[16rem]">
          Shop Beats 3
        </ActionButton>
      </Reveal>
    </div>
  );
}