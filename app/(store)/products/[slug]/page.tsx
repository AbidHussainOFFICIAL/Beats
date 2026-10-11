import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/store/ProductDetail";
import JsonLd from "@/components/seo/JsonLd";
import { catalog, formatNaira, getProduct } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

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

  const description = `${product.tagline} ${formatNaira(product.price)}.`;
  // The share image (what a pasted link shows) is a ready-made file,
  // public/og/products/<slug>.png — one per product.
  const shareImage = { url: `/og/products/${product.slug}.png`, width: 1200, height: 630, alt: product.title };

  return {
    title: product.title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.title,
      description,
      type: "website",
      url: `/products/${product.slug}`,
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: [shareImage],
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const url = absoluteUrl(`/products/${product.slug}`);

  return (
    <>
      {/* Structured data: lets search engines show the price and availability. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          description: product.description,
          sku: product.slug,
          image: product.gallery.map(absoluteUrl),
          brand: { "@type": "Brand", name: "Beats" },
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "NGN",
            price: String(product.price),
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: product.family, item: absoluteUrl("/#products") },
            { "@type": "ListItem", position: 3, name: product.name, item: url },
          ],
        }}
      />
      {/* `key` resets the gallery/quantity state when switching colors. */}
      <ProductDetail key={product.slug} product={product} />
    </>
  );
}