import Reveal from "@/components/ui/Reveal";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import ScrollRevealImage from "@/components/ui/ScrollRevealImage";
import { InfoIcon } from "@/components/icons";

const CASE_LETTERS = ["C", "a", "s", "e"];

export default function Case() {
  return (
    <section id="case" className="mt-[5.75rem] lg:mt-[11.75rem] transition-[margin]">
      <AnimatedHeading
        as="h2"
        className="text-center text-[3.5rem] md:text-[4.5rem]"
        offset={300}
        letters={CASE_LETTERS.map((char, i) => ({ char, delay: i * 50, className: i === 0 ? undefined : "-ml-0.5" }))}
      />

      <div className="flex justify-between mt-[3.875rem] max-w-[32.4375rem] md:max-w-[37.25rem] mx-auto">
        <div className="flex items-center min-w-[8.125rem]">
          <div className="max-w-[15.625rem] md:max-w-[18.75rem] -translate-x-12 transition-[max-width]">
            <ScrollRevealImage
              src="/images/content/case-headphone-case-bkg.png"
              alt="headphone case"
              fromX={-140}
              fromScale={0.6}
              wrapperClassName="case-headphones w-full"
              className="w-full"
            />
          </div>
        </div>
        <div className="flex flex-col justify-end md:justify-center pr-6 min-w-[14.5rem] w-[14.5rem] md:min-w-[16.5rem] md:w-[16.5rem]">
          <Reveal variant="fade-up" duration={700} delay={50} offset={300}>
            <p className="text-[#BDC0C2] text-[0.9375rem] md:text-[1rem] leading-[2rem] font-light transition-text">
              With a comfortable and adaptable case so that you can store it whenever you want, and keep your
              durability forever.
            </p>
          </Reveal>
          <div className="mt-[3.4375rem]">
            <Reveal variant="zoom-in" duration={700} delay={100} offset={300} className="inline-block">
              <button
                type="button"
                className="group flex items-center justify-center bg-[#1E1E21] hover:bg-white rounded-lg w-[9.75rem] h-[3.4375rem] overflow-hidden transition-colors duration-300"
              >
                <InfoIcon className="group-hover:stroke-black transition-colors duration-300" />
                <span className="ml-4 cursor-pointer group-hover:text-black transition-colors duration-300">
                  More info
                </span>
              </button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}