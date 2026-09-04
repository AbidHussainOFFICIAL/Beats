import Reveal from "@/components/ui/Reveal";
import ParallaxImage from "@/components/ui/ParallaxImage";
import { BagIcon } from "@/components/icons";

export default function PromoBanner() {
  return (
    <section className="relative mt-[5.75rem] px-6 lg:mt-[11.75rem] transition-[margin]">
      <Reveal variant="zoom-in" duration={700} offset={300}>
        <div className="flex items-center justify-between bg-[#181A1B] rounded-xl px-6 948:px-[9.125rem] py-[2.1875rem] 948:py-[3.125rem] max-w-[60.5rem] mx-auto transition-[padding] group">
          <div className="relative z-10">
            <h3 className="text-[1.125rem] md:text-[1.5rem] leading-[1.8125rem] sm:leading-[2.8125rem] font-semibold text-[#BDC0C2] group-hover:text-white transition-text transition-all">
              <span className="inline-block md:group-hover:-translate-y-8 transition-transform duration-700 ease-in-out">
                Immerse yourself in
              </span>
              <br />
              <span className="inline-block md:group-hover:-translate-y-8 transition-transform duration-700 ease-in-out delay-100">
                your music
              </span>
            </h3>
            <p className="text-sm md:text-base font-light text-[#BDC0C2] my-3 transition-text">
              Buy Now, up to 40% off.
            </p>
            <div>
              <Reveal variant="zoom-in" duration={700} delay={50} offset={300}>
                <button
                  type="button"
                  className="flex items-center justify-center bg-black group-hover:bg-white rounded-lg w-[9.25rem] h-[3.4375rem] transition-all duration-700"
                >
                  <BagIcon className="mr-4 group-hover:stroke-black transition-all duration-700" />
                  <span className="text-[0.9375rem] group-hover:text-black cursor-pointer transition-colors duration-700">
                    Buy now
                  </span>
                </button>
              </Reveal>
            </div>
          </div>
          <div>
            {/*
              Restored the original `593:static` toggle: at 593px and above
              (every width from small tablets through desktop) this needs
              to be `static` — normal in-flow layout, sitting next to the
              text as a flex sibling — which is what actually keeps it
              contained inside the card instead of bleeding off the edge
              of the page. A previous version made this `absolute` at
              every width to fix a mobile scroll issue, but that also
              broke this desktop-and-up containment (the image bled off
              the right side of the whole viewport once nothing switched
              it back to static).
              The real, narrower problem was only ever the sub-593px case:
              absolute positioning + the full 300px desktop width + the
              full -9.0625rem offset, all applied uniformly down to small
              phones. That's what's actually scaled down below — width
              and offset only, position mode is back to the original.
            */}
            <div className="absolute -bottom-4 -right-6 593:static w-[9.5rem] 593:w-[18.75rem] md:w-[21.875rem] z-0 transition-[width]">
              <ParallaxImage
                src="/images/content/sale-headphones-collapse-bkg.png"
                alt="collapsed headphones"
                direction="left"
                wrapperClassName="images1 w-full"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
