export function Rimless({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path d="M10 8h30v24H10z" strokeDasharray="3 3" />
      <path d="M60 8h30v24H60z" strokeDasharray="3 3" />
      <path d="M40 18h20" strokeWidth="2.5" />
      <path d="M10 14 2 10" strokeWidth="2.5" />
      <path d="M90 14l8-4" strokeWidth="2.5" />
      <circle cx="16" cy="10" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="84" cy="10" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
