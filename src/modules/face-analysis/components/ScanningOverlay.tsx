"use client";

import { useEffect, useState } from "react";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { getFaceOvalIndices, getLeftEyeIndices, getRightEyeIndices } from "../lib/landmarkGroups";

// N captions × este intervalo ≈ ANALYSIS_DELAY_MS en FaceAnalysisExperience.tsx — mantenerlos en sync
// si se ajusta cualquiera de los dos, para que el ciclo de texto no se corte a mitad de frase.
const CAPTION_INTERVAL_MS = 650;

type Point = { x: number; y: number };

function collectPoints(landmarks: NormalizedLandmark[], indices: number[]): Point[] {
  const points: Point[] = [];
  for (const index of indices) {
    const point = landmarks[index];
    if (point) points.push({ x: point.x * 100, y: point.y * 100 });
  }
  return points;
}

function centerOf(points: Point[]): Point | null {
  if (points.length === 0) return null;
  const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
  return { x: sum.x / points.length, y: sum.y / points.length };
}

export function ScanningOverlay({
  landmarks,
  captions,
}: {
  landmarks: NormalizedLandmark[] | null;
  captions: string[];
}) {
  const [captionIndex, setCaptionIndex] = useState(0);

  useEffect(() => {
    if (captions.length === 0) return;
    const intervalId = window.setInterval(() => {
      setCaptionIndex((i) => (i + 1) % captions.length);
    }, CAPTION_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [captions.length]);

  // Si el rostro se perdió justo al capturar, se degrada a solo barrido + texto (sin puntos ni línea).
  const dots = landmarks
    ? collectPoints(landmarks, [...getFaceOvalIndices(), ...getLeftEyeIndices(), ...getRightEyeIndices()])
    : [];
  const leftEye = landmarks ? centerOf(collectPoints(landmarks, getLeftEyeIndices())) : null;
  const rightEye = landmarks ? centerOf(collectPoints(landmarks, getRightEyeIndices())) : null;

  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl bg-black/35">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {dots.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="0.6"
            fill="#5eead4"
            className="animate-pulse"
            style={{ animationDelay: `${(i % 12) * 60}ms` }}
          />
        ))}
        {leftEye && rightEye && (
          <line
            x1={leftEye.x}
            y1={leftEye.y}
            x2={rightEye.x}
            y2={rightEye.y}
            stroke="#5eead4"
            strokeWidth="0.35"
            strokeDasharray="1"
            pathLength={1}
            className="scanning-overlay-ipd"
          />
        )}
      </svg>
      <div className="scanning-overlay-sweep absolute inset-x-0 h-10" />
      {captions.length > 0 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center px-4">
          <span className="rounded-full bg-black/60 px-3 py-1 text-center text-xs font-medium text-white">
            {captions[captionIndex]}
          </span>
        </div>
      )}
      <style>{`
        .scanning-overlay-sweep {
          background: linear-gradient(to bottom, transparent, rgba(94,234,212,0.35), transparent);
          animation: scanning-overlay-sweep-move 1.8s ease-in-out infinite;
        }
        .scanning-overlay-ipd {
          stroke-dashoffset: 1;
          animation: scanning-overlay-ipd-draw 1.2s ease-out 1.4s forwards;
        }
        @keyframes scanning-overlay-sweep-move {
          0% { top: -10%; }
          100% { top: 100%; }
        }
        @keyframes scanning-overlay-ipd-draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
