import type { ComponentType, SVGProps } from "react";
import {
  BatteryIcon,
  ConnectionIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  LoadIcon,
  MicrophoneIcon,
  TwitterIcon,
} from "@/components/icons";

// Absolute ("/#...") hrefs so these work from every page, not just the
// landing page. On the landing page LenisProvider still smooth-scrolls them.
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#specs", label: "Specs" },
  { href: "/#case", label: "Case" },
  { href: "/#products", label: "Products" },
] as const;

export interface Spec {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  lines: string[];
  /** matches the original's alternating left padding on the icon list */
  indent?: boolean;
  delay: number;
}

export const specs: Spec[] = [
  { icon: ConnectionIcon, title: "Connection", lines: ["Bluetooth v5.2"], indent: true, delay: 0 },
  { icon: BatteryIcon, title: "Battery", lines: ["Duration 40h"], delay: 250 },
  { icon: LoadIcon, title: "Load", lines: ["Fast charge 4.2-AAC"], delay: 500 },
  { icon: MicrophoneIcon, title: "Microphone", lines: ["Supports Apple Siri", "and Google"], indent: true, delay: 750 },
];

export interface Product {
  /** matches the product's slug in lib/catalog.ts (its page is /products/<slug>) */
  slug: string;
  name: string;
  price: string;
  image: string;
  delay: number;
}

export const products: Product[] = [
  { slug: "black", name: "Black", price: "N299K", image: "/images/content/headphone-1.png", delay: 0 },
  { slug: "red-black", name: "Red Black", price: "N299K", image: "/images/content/headphone-2.png", delay: 100 },
  { slug: "blue", name: "Blue", price: "N299K", image: "/images/content/headphone-3.png", delay: 200 },
  { slug: "twilight-grey", name: "Twilight Grey", price: "N299K", image: "/images/content/headphone-4.png", delay: 300 },
  { slug: "night-black", name: "Night Black", price: "N299K", image: "/images/content/headphone-5.png", delay: 400 },
];

export const brandLogos = [
  { name: "apple", src: "/images/brands/apple.png", delay: 0 },
  { name: "spotify", src: "/images/brands/spotify.png", delay: 100 },
  { name: "amazon", src: "/images/brands/amazon.png", delay: 200 },
  { name: "youtube", src: "/images/brands/youtube.png", delay: 300 },
];

export const footerProductLinks = [
  { label: "Headphones", href: "/#products", delay: 100 },
  { label: "Accessories", href: "/products/case", delay: 150 },
  { label: "Works with", href: "/works-with", delay: 200 },
  { label: "Your bag", href: "/bag", delay: 250 },
];

export const footerSupportLinks = [
  { label: "Product help", href: "/help", delay: 100 },
  { label: "Register", href: "/register", delay: 150 },
  { label: "Updates", href: "/updates", delay: 200 },
  { label: "Shipping & returns", href: "/shipping-returns", delay: 250 },
];

export const socials = [
  { icon: FacebookIcon, href: "#", label: "Facebook", delay: 150 },
  { icon: TwitterIcon, href: "#", label: "Twitter", delay: 200 },
  { icon: InstagramIcon, href: "#", label: "Instagram", delay: 250 },
  { icon: LinkedinIcon, href: "#", label: "LinkedIn", delay: 300 },
];