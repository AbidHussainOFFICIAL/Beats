import type { Metadata } from "next";
import CheckoutView from "@/components/store/CheckoutView";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return <CheckoutView />;
}