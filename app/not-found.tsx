import PageShell from "@/components/layout/PageShell";
import PageHeading from "@/components/ui/PageHeading";
import Reveal from "@/components/ui/Reveal";
import ActionButton from "@/components/ui/ActionButton";

/**
 * The 404 page. It sits outside the (store) route group (Next renders it for
 * any unknown URL, and for `notFound()` calls), so it wraps itself in the
 * same shell to keep the header, footer and tab bar.
 */
export default function NotFound() {
  return (
    <PageShell>
      <div className="mx-auto min-h-[60svh] max-w-[60.0625rem] px-6 pt-6">
        <PageHeading title="404" />
        <Reveal variant="fade-up" duration={700} offset={0} className="mx-auto mt-8 flex max-w-[24rem] flex-col items-center text-center">
          <h3 className="text-2xl font-semibold">Page not found</h3>
          <p className="mt-2 text-sm font-light leading-6 text-[#BDC0C2]">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
            <ActionButton variant="light" href="/" className="w-full">
              Back to home
            </ActionButton>
            <ActionButton href="/#products" className="w-full">
              Shop headphones
            </ActionButton>
          </div>
        </Reveal>
      </div>
    </PageShell>
  );
}