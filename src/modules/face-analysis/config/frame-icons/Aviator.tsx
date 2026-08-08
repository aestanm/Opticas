export function Aviator({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <path d="M9 16c2-7 9-9 17-9s16 3 17 10c1 8-6 16-17 16S7 24 9 16Z" />
      <path d="M91 16c-2-7-9-9-17-9s-16 3-17 10c-1 8 6 16 17 16s18-8 17-17Z" />
      <path d="M43 14h14" />
      <path d="M9 12 2 6" />
      <path d="M91 12l7-6" />
    </svg>
  );
}
