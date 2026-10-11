import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomTabBar from "@/components/layout/BottomTabBar";
import MiniBag from "@/components/layout/MiniBag";
import AddedToast from "@/components/layout/AddedToast";
import ScrollToTop from "@/components/layout/ScrollToTop";
import SkipLink from "@/components/layout/SkipLink";

/**
 * The frame every store screen shares: header, page content, footer, plus
 * the bag UI (desktop mini-bag flyout, mobile "added" toast) and the mobile
 * bottom tab bar. Rendered once by the (store) route group's layout, so it
 * stays mounted while the visitor moves between screens.
 *
 * The bottom padding below lg reserves room for the fixed tab bar (4rem) so
 * the footer is never hidden behind it. ScrollToTop makes every page change
 * start at the top of the new page, and SkipLink lets keyboard users jump
 * straight to the content.
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="pb-16 lg:pb-0">
      <SkipLink />
      <Header />
      {/* tabIndex -1 lets the skip link move focus here; the outline is
          hidden because focusing it programmatically isn't a "control". */}
      <main id="main" tabIndex={-1} className="relative pt-[4.375rem] z-10 focus:outline-none">
        {children}
      </main>
      <Footer />
      <BottomTabBar />
      <MiniBag />
      <AddedToast />
      <ScrollToTop />
    </div>
  );
}