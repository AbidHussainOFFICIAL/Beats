"use client";

import Reveal from "@/components/ui/Reveal";
import { LetterRow } from "@/components/ui/AnimatedHeading";
import { useAosReveal } from "@/lib/hooks/useAosReveal";
import { CartSmallIcon } from "@/components/icons";
import { products } from "@/lib/data";

const CHOOSE_LETTERS = ["C", "h", "o", "o", "s", "e"].map((char, i) => ({
  char,
  delay: i * 50,
  className: i === 0 ? undefined : "-ml-0.5",
}));

const STYLE_LETTERS = ["Y", "o", "u", "r", " ", "S", "t", "y", "l", "e"].map((char, i, arr) => ({
  char,
  delay: i * 50,
  className: i === 0 || arr[i - 1] === " " ? undefined : "-ml-0.5",
}));

export default function Products() {
  // Both lines share one trigger point (the original's two-line heading is a
  // single AOS-tracked block that just happens to wrap onto two visual lines).
  const { ref, inView } = useAosReveal<HTMLHeadingElement>({ offset: 300 });

  return (
    <section id="products" className="mt-[5.75rem] px-3 lg:mt-[11.75rem] transition-[margin]">
      <h2 ref={ref} className="aos-animation text-center text-[3.5rem] md:text-[4.5rem] transition-text">
        <span>
          <LetterRow letters={CHOOSE_LETTERS} inView={inView} />
        </span>
        <br />
        <span>
          <LetterRow letters={STYLE_LETTERS} inView={inView} />
        </span>
      </h2>

      <div className="flex flex-wrap justify-between mx-auto max-w-[23.25rem] lg:max-w-[35.25rem] mt-2.5 lg:mt-[2.625rem] transition-[max-width]">
        {products.map((product) => (
          <Reveal
            key={product.name}
            variant="zoom-in-up"
            duration={700}
            delay={product.delay}
            offset={300}
            className="flex flex-col justify-end bg-[#181A1B] px-2 py-2 rounded-lg h-[9.5rem] w-[10.125rem] mt-[6.25rem] group"
          >
            <div className="flex justify-center">
              <div className="w-[5.9375rem] mb-6 group-hover:-translate-y-10 transform transition-transform duration-1000">
                <img src={product.image} alt="headphone" className="w-full" />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <span className="block text-sm font-semibold">{product.name}</span>
                <span className="block text-sm font-semibold text-[#BDC0C2]">{product.price}</span>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  aria-label={`Add ${product.name} to bag`}
                  className="flex justify-center items-center bg-[#0A0A0B] group-hover:bg-white rounded-lg h-[2.1875rem] w-[2.1875rem] transition-colors duration-1000"
                >
                  <CartSmallIcon className="group-hover:stroke-black transition-all duration-1000" />
                </button>
              </div>
            </div>
          </Reveal>
        ))}
        {/* Spacer to preserve the original's flex-wrap balance on the last row */}
        <div className="h-[9.5rem] w-[10.125rem] mt-[6.25rem]" />
      </div>
    </section>
  );
}