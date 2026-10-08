import AnimatedHeading from "@/components/ui/AnimatedHeading";

/**
 * The big decorative page title used on every store screen — the same
 * per-letter, dark-gradient heading the landing page's section titles use
 * (Specs, Case, Products). It sizes fluidly so long titles still fit on
 * 320px phones, and tightens its line height on phones like the landing
 * sections do. It is the page's <h1>.
 */
export default function PageHeading({ title }: { title: string }) {
  const characters = title.split("");

  return (
    <AnimatedHeading
      as="h1"
      className="max-sm:leading-[4rem] text-center text-[clamp(2.75rem,13vw,3.5rem)] md:text-[4.5rem]"
      offset={0}
      letters={characters.map((char, i) => ({
        char: char === " " ? "\u00a0" : char,
        delay: i * 50,
        className: i === 0 || characters[i - 1] === " " ? undefined : "-ml-0.5",
      }))}
    />
  );
}