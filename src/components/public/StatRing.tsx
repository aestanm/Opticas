/**
 * Anillo de porcentaje (dona), al estilo de los posts de estadísticas de Óptica Guillén
 */

interface StatRingProps {
  percentage: number;
  label: string;
  color?: string;
  trackColor?: string;
}

export function StatRing({
  percentage,
  label,
  color = "#14B8AC",
  trackColor = "#E2E8F0",
}: StatRingProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[140px] w-[140px]">
        <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
          <circle cx="70" cy="70" r={radius} stroke={trackColor} strokeWidth="14" fill="none" />
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke={color}
            strokeWidth="14"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-3xl font-bold text-brand-navy">{percentage}%</p>
        </div>
      </div>
      <p className="mt-4 max-w-[12rem] text-center text-sm text-slate-600">{label}</p>
    </div>
  );
}
