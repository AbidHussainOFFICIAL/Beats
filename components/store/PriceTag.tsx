import { discountPercent, formatPrice, type CatalogProduct } from "@/lib/catalog";

const SIZES = {
  sm: { price: "text-xs", original: "text-[0.6875rem]" },
  md: { price: "text-sm", original: "text-xs" },
  lg: { price: "text-2xl", original: "text-base" },
} as const;

/**
 * A product's price: the current (sale) price, and — when it's on sale — the
 * struck-through original price and a "-25%" badge. Screen readers hear
 * "Was …" and "… off" instead of just the bare numbers.
 *
 * `short` writes whole-thousand amounts as "Rs 90K" (the landing page's style)
 * instead of "Rs 90,000".
 */
export default function PriceTag({
  product,
  size = "md",
  short = false,
}: {
  product: CatalogProduct;
  size?: keyof typeof SIZES;
  short?: boolean;
}) {
  const percent = discountPercent(product);
  const classes = SIZES[size];

  return (
    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={`font-semibold ${classes.price}`}>{formatPrice(product.price, short)}</span>
      {percent > 0 && (
        <>
          <del className={`font-light text-[#8E9296] ${classes.original}`}>
            <span className="sr-only">Was </span>
            {formatPrice(product.compareAtPrice, short)}
          </del>
          <span className="rounded bg-white px-1.5 py-0.5 text-[0.6875rem] font-semibold leading-none text-black">
            -{percent}%<span className="sr-only"> off</span>
          </span>
        </>
      )}
    </p>
  );
}