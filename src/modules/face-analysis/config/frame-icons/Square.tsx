export function Square({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <rect x="9" y="7" width="34" height="26" rx="4" />
      <rect x="57" y="7" width="34" height="26" rx="4" />
      <path d="M43 18h14" />
      <path d="M9 14 1 11" />
      <path d="M91 14l8-3" />
    </svg>
  );
}
