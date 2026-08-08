export function CatEye({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <path d="M8 22c0-9 7-15 18-15 10 0 17 6 17 14 0 8-7 12-17 12S8 30 8 22Z" />
      <path d="M92 22c0-9-7-15-18-15-10 0-17 6-17 14 0 8 7 12 17 12s18-6 18-11Z" />
      <path d="M43 17h14" />
      <path d="M8 18 1 10" />
      <path d="M92 18l7-8" />
    </svg>
  );
}
