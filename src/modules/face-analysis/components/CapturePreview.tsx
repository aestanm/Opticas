"use client";

import type { LatestDetection } from "../hooks/useFaceDetectionLoop";
import type { FaceAnalysisCopy } from "../types";
import { ScanningOverlay } from "./ScanningOverlay";

interface CapturePreviewProps {
  photoDataUrl: string;
  detection: LatestDetection;
  copy: FaceAnalysisCopy;
  onRetake: () => void;
}

export function CapturePreview({ photoDataUrl, detection, copy, onRetake }: CapturePreviewProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* El espejado envuelve foto + overlay como una sola unidad: los landmarks vienen del frame
          sin espejar, así que ambos deben mirar el mismo flip para quedar alineados entre sí. */}
      <div className="relative mx-auto w-full max-w-sm [transform:scaleX(-1)]">
        {/* eslint-disable-next-line @next/next/no-img-element -- data: URL desde canvas, no un asset optimizable */}
        <img src={photoDataUrl} alt="" className="block h-auto w-full rounded-2xl" />
        <ScanningOverlay landmarks={detection.landmarks} captions={copy.scanningCaptions} />
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
