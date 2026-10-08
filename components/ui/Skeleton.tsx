/** A pulsing placeholder block for loading states. Size it with `className`. */
export default function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-[#181A1B] ${className}`} />;
}