"use client";

import { FrameRecommendationCard } from "./FrameRecommendationCard";
import type { FaceAnalysisCopy, FaceShape, ShapeRecommendation, ShapeScore } from "../types";

interface ShapeResultsProps {
  scores: ShapeScore[];
  recommendations: Record<FaceShape, ShapeRecommendation>;
  copy: FaceAnalysisCopy;
  onRetake: () => void;
}

// Formas que aplican al rostro: la más probable, más cualquier otra que quede razonablemente cerca
// (no forzamos un único ganador, pero tampoco mostramos las 6 si claramente no aplican).
function pickRelevantShapes(scores: ShapeScore[]): ShapeScore[] {
  const top = scores[0];
  if (!top) return [];
  return scores.filter((s, index) => index === 0 || s.score >= top.score * 0.7).slice(0, 3);
}

export function ShapeResults({ scores, recommendations, copy, onRetake }: ShapeResultsProps) {
  const relevantShapes = pickRelevantShapes(scores);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{copy.resultsTitle}</h3>
        <div className="mt-3 flex flex-col gap-2">
          {scores.map((s) => (
            <div key={s.shape} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-sm text-slate-600">{recommendations[s.shape].label}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-teal-600"
                  style={{ width: `${Math.round(s.score * 100)}%` }}
                />
              </div>
              <span className="w-10 shrink-0 text-right text-xs text-slate-500">
                {Math.round(s.score * 100)}%
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-400">{copy.resultsDisclaimer}</p>
      </div>

      <div className="flex flex-col gap-6">
        {relevantShapes.map((s) => {
          const recommendation = recommendations[s.shape];
          return (
            <div key={s.shape}>
              <p className="text-sm text-slate-700">{recommendation.explanation}</p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {recommendation.recommendedFrameTypes.map((frameType) => (
                  <FrameRecommendationCard key={`${s.shape}-${frameType.id}`} frameType={frameType} />
                ))}
              </div>
              {recommendation.avoidNotes && (
                <p className="mt-2 text-xs text-slate-400">{recommendation.avoidNotes}</p>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onRetake}
        className="self-start rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        {copy.retakeLabel}
      </button>
    </div>
  );
}
