export function Round({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <circle cx="26" cy="20" r="15" />
      <circle cx="74" cy="20" r="15" />
      <path d="M41 18h18" />
      <path d="M11 16 2 12" />
      <path d="M89 16l9-4" />
    </svg>
  );
}
