import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomTabBar from "@/components/layout/BottomTabBar";
import MiniBag from "@/components/layout/MiniBag";
import AddedToast from "@/components/layout/AddedToast";
import ScrollToTop from "@/components/layout/ScrollToTop";

/**
 * The frame every store screen shares: header, page content, footer, plus
 * the bag UI (desktop mini-bag flyout, mobile "added" toast) and the mobile
 * bottom tab bar. Rendered once by the (store) route group's layout, so it
 * stays mounted while the visitor moves between screens.
 *
 * The bottom padding below lg reserves room for the fixed tab bar (4rem) so
 * the footer is never hidden behind it. ScrollToTop makes every page change
 * start at the top of the new page.
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="pb-16 lg:pb-0">
      <Header />
      <main className="relative pt-[4.375rem] z-10">{children}</main>
      <Footer />
      <BottomTabBar />
      <MiniBag />
      <AddedToast />
      <ScrollToTop />
    </div>
  );
}