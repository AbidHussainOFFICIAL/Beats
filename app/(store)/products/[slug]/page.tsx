import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/store/ProductDetail";
import { catalog, getProduct } from "@/lib/catalog";

interface ProductPageProps {
  params: { slug: string };
}

// Every product page is generated at build time from the catalog.
export function generateStaticParams() {
  return catalog.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: ProductPageProps): Metadata {
  const product = getProduct(params.slug);
  if (!product) return { title: "Product not found" };
  return { title: product.title, description: product.tagline };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  // `key` resets the gallery/quantity state when switching colors.
  return <ProductDetail key={product.slug} product={product} />;
}