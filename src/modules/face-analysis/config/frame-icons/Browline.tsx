export function Browline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <path d="M8 12h34" strokeWidth="5" />
      <path d="M58 12h34" strokeWidth="5" />
      <circle cx="25" cy="21" r="12" strokeWidth="1.75" />
      <circle cx="75" cy="21" r="12" strokeWidth="1.75" />
      <path d="M37 20h26" strokeWidth="1.75" />
      <path d="M8 12 1 8" />
      <path d="M92 12l7-4" />
    </svg>
  );
}
