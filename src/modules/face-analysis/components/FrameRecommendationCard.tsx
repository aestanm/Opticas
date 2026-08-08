import type { FrameTypeExample } from "../types";

export function FrameRecommendationCard({ frameType }: { frameType: FrameTypeExample }) {
  const Icon = frameType.Icon;
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-white p-4 text-center shadow-sm">
      <Icon className="h-8 w-16 text-teal-700" />
      <p className="text-sm font-semibold text-slate-800">{frameType.name}</p>
      <p className="text-xs text-slate-500">{frameType.description}</p>
    </div>
  );
}
