import type { Metadata } from "next";
import BagView from "@/components/store/BagView";

export const metadata: Metadata = { title: "Bag" };

export default function BagPage() {
  return <BagView />;
}