import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SubscribeForm from "@/components/ui/SubscribeForm";
import { LogoIcon, ArrowUpIcon } from "@/components/icons";
import { footerProductLinks, footerSupportLinks, socials } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative mt-[5.75rem] px-6 lg:mt-[11.75rem] transition-[margin] z-30">
      <div className="flex flex-col md:flex-row md:space-x-20 lg:space-x-40 max-w-[70.8125rem] mx-auto">
        <div className="flex-1 flex md:justify-between">
          <div className="hidden md:block">
            <Reveal variant="fade-right" duration={700} anchorPlacement="top-bottom">
              <Link href="/" className="logo mt-2 inline-block transform scale-[0.75] text-white transition-transform">
                <LogoIcon className="logo-svg transform transition-transform duration-700" style={{ transformStyle: "preserve-3d" }} />
              </Link>
            </Reveal>
          </div>

          <div className="mr-6 md:mr-0">
            <Reveal variant="fade-up" duration={700} delay={50} anchorPlacement="top-bottom">
              <h5 className="font-semibold text-xl mb-4">Products</h5>
            </Reveal>
            <ul className="space-y-2">
              {footerProductLinks.map((link) => (
                <li key={link.label}>
                  <Reveal variant="fade-up" duration={700} delay={link.delay} anchorPlacement="top-bottom">
                    <a href={link.href} className="text-[#BDC0C2] font-light text-[0.9375rem] hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Reveal variant="fade-up" duration={700} delay={50} anchorPlacement="top-bottom">
              <h5 className="font-semibold text-xl mb-4">Support</h5>
            </Reveal>
            <ul className="space-y-2">
              {footerSupportLinks.map((link) => (
                <li key={link.label}>
                  <Reveal variant="fade-up" duration={700} delay={link.delay} anchorPlacement="top-bottom">
                    <a href={link.href} className="text-[#BDC0C2] font-light text-[0.9375rem] hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1 mt-5 md:mt-0">
          <Reveal variant="fade-left" duration={700} delay={100} anchorPlacement="top-bottom">
            <SubscribeForm />
          </Reveal>

          <div className="flex items-center justify-between mt-6">
            <div className="flex space-x-5">
              {socials.map((social) => (
                <Reveal key={social.label} variant="fade-up" duration={700} delay={social.delay} anchorPlacement="top-bottom">
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="flex justify-center items-center text-[#F8F8F8] hover:text-black bg-[#181A1B] hover:bg-white rounded h-8 w-8 group transform hover:-translate-y-1 transition-all duration-700"
                  >
                    <social.icon />
                  </a>
                </Reveal>
              ))}
            </div>

            <div className="transform hover:-translate-y-1 transition-transform duration-700">
              <Reveal variant="fade-left" duration={700} delay={350} anchorPlacement="top-bottom">
                <a
                  href="#home"
                  aria-label="Back to top"
                  className="flex justify-center items-center bg-[#181A1B] hover:bg-white rounded w-9 h-9 group transition-colors"
                >
                  <ArrowUpIcon className="group-hover:stroke-black transition-colors" />
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 my-2">
        <p className="text-[#A2A6A9] text-center font-light text-[0.8125rem]">Created By Jake Bogan</p>
      </div>
    </footer>
  );
}
