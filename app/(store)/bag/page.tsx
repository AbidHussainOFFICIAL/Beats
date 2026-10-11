import type { Metadata } from "next";
import BagView from "@/components/store/BagView";

export const metadata: Metadata = { title: "Bag", robots: { index: false, follow: false } };

export default function BagPage() {
  return <BagView />;
}