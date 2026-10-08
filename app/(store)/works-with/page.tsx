import type { Metadata } from "next";
import WorksWithView from "@/components/store/WorksWithView";

export const metadata: Metadata = {
  title: "Works with",
  description: "Beats 3 works with the devices and services you already use.",
};

export default function WorksWithPage() {
  return <WorksWithView />;
}