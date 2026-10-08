import type { Metadata } from "next";
import OrderConfirmation from "@/components/store/OrderConfirmation";

// A demo order's confirmation has no business in search results.
export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export default function OrderConfirmationPage() {
  return <OrderConfirmation />;
}