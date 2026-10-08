"use client";

import { useEffect, useState } from "react";
import { deliveryWindowLabel } from "@/lib/catalog";

/**
 * "Tue, 7 Oct – Thu, 9 Oct" for a delivery speed, counted in business days
 * from today. Dates depend on the visitor's clock and time zone, so they're
 * only computed after mount; until then it shows the plain day range, which
 * is also what the server renders — so nothing mismatches.
 */
export default function DeliveryWindow({ minDays, maxDays }: { minDays: number; maxDays: number }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(deliveryWindowLabel(minDays, maxDays, new Date()));
  }, [minDays, maxDays]);

  return <span>{label ?? `${minDays}–${maxDays} business days`}</span>;
}