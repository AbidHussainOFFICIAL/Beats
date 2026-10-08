/**
 * The demo store's catalog and delivery rules. Pure data and helpers — no
 * React, no browser APIs — so it can be used from server components (static
 * params, metadata) and client components alike.
 *
 * The prices, "what's in the box" list and the case are DEMO placeholders;
 * swap in the real values here and every screen updates.
 */

/** Most units of one item a single bag line can hold. */
export const MAX_QUANTITY = 10;

export type ProductKind = "headphones" | "accessory";

export interface CatalogProduct {
  slug: string;
  kind: ProductKind;
  /** Product family, e.g. "Beats 3". */
  family: string;
  /** The variant's own name, e.g. the color. */
  name: string;
  /** Full display name, e.g. "Beats 3 Black". */
  title: string;
  /** Unit price in naira. */
  price: number;
  image: string;
  /** Every image shown in the product page's gallery (the first is `image`). */
  gallery: string[];
  /** CSS `background` for the color swatch. */
  swatch: string;
  tagline: string;
  description: string;
  features: string[];
  /** What's in the box. */
  box: string[];
}

const HEADPHONE_PRICE = 299000;

const HEADPHONE_DESCRIPTION =
  "Enjoy award-winning Beats sound with wireless listening freedom and a sleek, streamlined design with comfortable padded earphones, delivering first-rate playback.";

const HEADPHONE_FEATURES = [
  "Bluetooth v5.2 wireless listening",
  "Up to 40 hours of battery",
  "Fast charge 4.2-AAC",
  "Supports Apple Siri and Google",
  "Comfortable padded earphones",
];

const HEADPHONE_BOX = [
  "Beats 3 headphones",
  "Carrying case",
  "USB-C charging cable",
  "3.5 mm audio cable",
  "Quick start guide",
  "Warranty card",
];

function headphone(config: {
  slug: string;
  name: string;
  swatch: string;
  image: string;
  gallery?: string[];
}): CatalogProduct {
  return {
    slug: config.slug,
    kind: "headphones",
    family: "Beats 3",
    name: config.name,
    title: `Beats 3 ${config.name}`,
    price: HEADPHONE_PRICE,
    image: config.image,
    gallery: config.gallery ?? [config.image],
    swatch: config.swatch,
    tagline: "Award-winning Beats sound, completely wireless.",
    description: HEADPHONE_DESCRIPTION,
    features: HEADPHONE_FEATURES,
    box: HEADPHONE_BOX,
  };
}

export const catalog: CatalogProduct[] = [
  headphone({
    slug: "black",
    name: "Black",
    swatch: "#1A1A1C",
    image: "/images/content/headphone-1.png",
    gallery: [
      "/images/content/headphone-1.png",
      "/images/content/header-headphone-bkg.png",
      "/images/content/specs-headphones-bkg.png",
      "/images/content/sale-headphones-collapse-bkg.png",
    ],
  }),
  headphone({
    slug: "red-black",
    name: "Red Black",
    swatch: "linear-gradient(135deg, #D2202E 50%, #151516 50%)",
    image: "/images/content/headphone-2.png",
  }),
  headphone({
    slug: "blue",
    name: "Blue",
    swatch: "#2457D6",
    image: "/images/content/headphone-3.png",
  }),
  headphone({
    slug: "twilight-grey",
    name: "Twilight Grey",
    swatch: "#6E727D",
    image: "/images/content/headphone-4.png",
  }),
  headphone({
    slug: "night-black",
    name: "Night Black",
    swatch: "#0B0B0C",
    image: "/images/content/headphone-5.png",
  }),
  {
    slug: "case",
    kind: "accessory",
    family: "Accessories",
    name: "Case",
    title: "Beats 3 Case",
    price: 49000,
    image: "/images/content/case-headphone-case-bkg.png",
    gallery: ["/images/content/case-headphone-case-bkg.png"],
    swatch: "#1A1A1C",
    tagline: "A comfortable, adaptable home for your headphones.",
    description:
      "With a comfortable and adaptable case so that you can store it whenever you want, and keep your durability forever.",
    features: ["Made for Beats 3 headphones", "Store them whenever you want", "Keeps your headphones protected"],
    box: ["Beats 3 carrying case"],
  },
];

export function getProduct(slug: string): CatalogProduct | undefined {
  return catalog.find((product) => product.slug === slug);
}

/** The other colors of the same headphone (including the product itself). */
export function getColorVariants(product: CatalogProduct): CatalogProduct[] {
  if (product.kind !== "headphones") return [];
  return catalog.filter((candidate) => candidate.kind === "headphones");
}

/** Other products to suggest on a product page. */
export function getRelatedProducts(slug: string, count: number): CatalogProduct[] {
  return catalog.filter((product) => product.slug !== slug).slice(0, count);
}

/** "N299K" when `short` and the amount is a whole number of thousands, else "N299,000". */
export function formatNaira(amount: number, short = false): string {
  if (short && amount >= 1000 && amount % 1000 === 0) return `N${amount / 1000}K`;
  return `N${amount.toLocaleString("en-US")}`;
}

// --- Delivery -------------------------------------------------------------

export type ShippingMethodId = "standard" | "express";

export interface ShippingMethod {
  id: ShippingMethodId;
  label: string;
  minDays: number;
  maxDays: number;
  fee: number;
}

/** Standard delivery is free once the bag reaches this subtotal. */
export const FREE_STANDARD_SHIPPING_FROM = 500000;

const STANDARD_SHIPPING: ShippingMethod = {
  id: "standard",
  label: "Standard delivery",
  minDays: 3,
  maxDays: 5,
  fee: 5000,
};

export const SHIPPING_METHODS: ShippingMethod[] = [
  STANDARD_SHIPPING,
  { id: "express", label: "Express delivery", minDays: 1, maxDays: 2, fee: 12000 },
];

export function getShippingMethod(id: ShippingMethodId): ShippingMethod {
  return SHIPPING_METHODS.find((method) => method.id === id) ?? STANDARD_SHIPPING;
}

export function shippingFee(method: ShippingMethod, subtotal: number): number {
  if (method.id === "standard" && subtotal >= FREE_STANDARD_SHIPPING_FROM) return 0;
  return method.fee;
}

function addBusinessDays(from: Date, days: number): Date {
  const result = new Date(from);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const weekday = result.getDay();
    if (weekday !== 0 && weekday !== 6) added += 1;
  }
  return result;
}

function formatDeliveryDay(date: Date): string {
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

/** e.g. "Tue, 7 Oct – Thu, 9 Oct". Browser-only: it depends on the clock and time zone. */
export function deliveryWindowLabel(minDays: number, maxDays: number, from: Date): string {
  const earliest = formatDeliveryDay(addBusinessDays(from, minDays));
  const latest = formatDeliveryDay(addBusinessDays(from, maxDays));
  return earliest === latest ? earliest : `${earliest} – ${latest}`;
}