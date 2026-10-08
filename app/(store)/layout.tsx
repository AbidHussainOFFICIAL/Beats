import type { ReactNode } from "react";
import PageShell from "@/components/layout/PageShell";

/**
 * Every store screen — the landing page, product pages, bag, checkout and so
 * on — lives in this route group, so they all share ONE header, footer and
 * tab bar that stay mounted while navigating. (Without a shared layout each
 * page would remount them, replaying the header's entrance animation on
 * every navigation.) The group name doesn't appear in any URL.
 */
export default function StoreLayout({ children }: { children: ReactNode }) {
  return <PageShell>{children}</PageShell>;
}