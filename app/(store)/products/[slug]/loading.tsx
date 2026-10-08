import Skeleton from "@/components/ui/Skeleton";

/** Shown inside the shared shell while a product page loads. Mirrors the page's two-column layout. */
export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-[60.0625rem] px-6 pt-6 lg:pt-10" aria-busy="true">
      <Skeleton className="h-4 w-48" />
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-[3.4375rem] w-full" />
        </div>
      </div>
    </div>
  );
}