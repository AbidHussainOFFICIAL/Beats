import type { SVGProps } from "react";

/**
 * Icons for the store screens (bag, checkout, tab bar, delivery). Unlike the
 * landing-page icons in ./index.tsx these all carry a viewBox, so they scale
 * cleanly with CSS sizing (e.g. `className="h-5 w-5"`). They use
 * `currentColor`, so text color classes tint them.
 */
function StrokeIcon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <StrokeIcon {...props}>
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" />
    </StrokeIcon>
  );
}

export function HeadphonesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <StrokeIcon {...props}>
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
      <path d="M4 15h2.5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4Z" />
      <path d="M20 15h-2.5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1H19a1 1 0 0 0 1-1v-4Z" />
    </StrokeIcon>
  );
}

/** The same bag shape as the landing page's BagIcon, but with a viewBox so it scales (the original is a fixed 20×22). */
export function BagOutlineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <StrokeIcon viewBox="0 0 20 22" strokeWidth={2} {...props}>
      <path d="M1.977 8.84A2 2 0 0 1 3.971 7H16.03a2 2 0 0 1 1.994 1.84l.803 10A2 2 0 0 1 16.833 21H3.167a2 2 0 0 1-1.993-2.16l.803-10v0Z" />
      <path d="M14 10V5a4 4 0 1 0-8 0v5" />
    </StrokeIcon>
  );
}

export function MinusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <StrokeIcon {...props}>
      <path d="M5 12h14" />
    </StrokeIcon>
  );
}

export function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <StrokeIcon {...props}>
      <path d="M12 5v14M5 12h14" />
    </StrokeIcon>
  );
}

export function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <StrokeIcon {...props}>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3" />
    </StrokeIcon>
  );
}

export function TruckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <StrokeIcon {...props}>
      <path d="M3 6.5h11v10H3v-10Z" />
      <path d="M14 10h3.8l3.2 3.2v3.3H14V10Z" />
      <circle cx="7.5" cy="18" r="1.75" />
      <circle cx="17.5" cy="18" r="1.75" />
    </StrokeIcon>
  );
}

export function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <StrokeIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.8 2.8L16 9.5" />
    </StrokeIcon>
  );
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <StrokeIcon {...props}>
      <path d="m9 6 6 6-6 6" />
    </StrokeIcon>
  );
}

export function InfoCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <StrokeIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8v.01" />
    </StrokeIcon>
  );
}