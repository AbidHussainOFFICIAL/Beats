"use client";

import { useEffect, useState } from "react";
import type { ComponentType, MouseEvent, SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BagOutlineIcon, HeadphonesIcon, HomeIcon } from "@/components/icons/store";
import { useCart } from "@/components/providers/CartProvider";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useScrollToSection } from "@/lib/hooks/useScrollToSection";
import { usePressedState } from "@/lib/hooks/usePressedState";

interface Tab {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  isActive: (pathname: string) => boolean;
}

const tabs: Tab[] = [
  { href: "/", label: "Home", icon: HomeIcon, isActive: (pathname) => pathname === "/" },
  {
    href: "/#products",
    label: "Products",
    icon: HeadphonesIcon,
    isActive: (pathname) => pathname.startsWith("/products"),
  },
  {
    href: "/bag",
    label: "Bag",
    icon: BagOutlineIcon,
    isActive: (pathname) => pathname === "/bag" || pathname === "/checkout",
  },
];

function TabItem({ tab, active, badge }: { tab: Tab; active: boolean; badge: number }) {
  const { isPressed, handlers } = usePressedState();
  const pathname = usePathname();
  const scrollToSection = useScrollToSection();
  const Icon = tab.icon;

  // Tapping Home while already on the landing page glides back to the top
  // instead of doing nothing.
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (tab.href === "/" && pathname === "/") {
      event.preventDefault();
      scrollToSection("home");
    }
  };

  return (
    <Link
      href={tab.href}
      onClick={handleClick}
      aria-current={active ? "page" : undefined}
      {...handlers}
      className={`flex h-full flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium transition-colors duration-200 ${
        active ? "text-white" : "text-[#8E9296]"
      }`}
    >
      {/* The press-scale lives on this inner element so the link's own hit
          box never changes under the finger. */}
      <span className={`pointer-events-none relative flex flex-col items-center gap-1 transition-transform duration-150 ${isPressed ? "scale-90" : ""}`}>
        <Icon className="h-6 w-6" />
        {badge > 0 && (
          <motion.span
            key={badge}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.25 }}
            className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[0.625rem] font-semibold text-black"
          >
            {badge}
          </motion.span>
        )}
        {tab.label}
      </span>
    </Link>
  );
}

/**
 * The mobile app-style bottom navigation: Home, Products and Bag (with a
 * count). Hidden at lg+. It sits at z-30 — above the footer (also z-30, but
 * later in the DOM) and below the mobile menu overlay (z-40) and the
 * subscribe popover (z-60), so those always cover it.
 *
 * On the landing page it stays tucked away while the hero is on screen (the
 * hero is a full-screen pinned sequence of its own) and slides up once the
 * hero has scrolled away. On every other page it is always shown. While
 * hidden it is `invisible`, so it can't be tapped or tabbed to.
 */
export default function BottomTabBar() {
  const pathname = usePathname();
  const { hydrated, count } = useCart();
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [pastHero, setPastHero] = useState(false);

  const isHome = pathname === "/";
  const visible = !isHome || pastHero;

  useEffect(() => {
    if (!isHome || !isMobile) return;

    let rafId: number | null = null;
    const update = () => {
      rafId = null;
      const hero = document.getElementById("hero");
      // The hero is "scrolled away" once its bottom edge is above the top of the screen.
      setPastHero(hero ? hero.getBoundingClientRect().bottom <= 0 : true);
    };
    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      // Start from "hero on screen" next time, so coming back to the landing
      // page doesn't flash the bar before the first measurement.
      setPastHero(false);
    };
  }, [isHome, isMobile]);

  return (
    <nav
      aria-label="Primary"
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-[#232325] bg-[#141415] pb-[env(safe-area-inset-bottom)] transition-[transform,visibility] duration-300 lg:hidden ${
        visible ? "translate-y-0" : "invisible translate-y-full"
      }`}
    >
      <ul className="mx-auto flex h-16 max-w-[28rem]">
        {tabs.map((tab) => (
          <li key={tab.label} className="flex-1">
            <TabItem
              tab={tab}
              active={tab.isActive(pathname)}
              badge={tab.label === "Bag" && hydrated ? count : 0}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}