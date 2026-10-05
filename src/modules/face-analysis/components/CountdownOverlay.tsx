export function CountdownOverlay({ remaining }: { remaining: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30">
      <span
        key={remaining}
        className="animate-[countdown-pop_1s_ease-out] text-7xl font-bold text-white drop-shadow-lg"
      >
        {remaining}
      </span>
      <style>{`
        @keyframes countdown-pop {
          0% { transform: scale(1.6); opacity: 0; }
          25% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
