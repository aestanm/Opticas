"use client";

import type { FaceAnalysisCopy } from "../types";

interface CapturePreviewProps {
  photoDataUrl: string;
  copy: FaceAnalysisCopy;
  isAnalyzing: boolean;
  onRetake: () => void;
}

export function CapturePreview({ photoDataUrl, copy, isAnalyzing, onRetake }: CapturePreviewProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element -- data: URL desde canvas, no un asset optimizable */}
        <img src={photoDataUrl} alt="" className="h-full w-full object-cover [transform:scaleX(-1)]" />
        {isAnalyzing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white">
            {copy.analyzingLabel}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onRetake}
        className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        {copy.retakeLabel}
      </button>
    </div>
  );
}
