"use client";

import type { FaceMeasurements } from "../lib/faceMeasurements";
import { FrameRecommendationCard } from "./FrameRecommendationCard";
import type { FaceAnalysisCopy, FaceShape, ShapeRecommendation, ShapeScore } from "../types";

// Calibración para convertir píxeles a mm estimados: distancia interpupilar promedio de un adulto.
const CALIBRATION_IPD_MM = 63;

interface FaceReportProps {
  photoDataUrl: string;
  scores: ShapeScore[];
  relevantShapes: ShapeScore[];
  recommendations: Record<FaceShape, ShapeRecommendation>;
  measurements: FaceMeasurements | null;
  copy: FaceAnalysisCopy;
  onRetake: () => void;
  children?: React.ReactNode;
}

interface MetricRow {
  key: keyof FaceAnalysisCopy["report"]["metrics"];
  value: string;
  bar?: number;
}

function buildMetricRows(measurements: FaceMeasurements, copy: FaceAnalysisCopy): MetricRow[] {
  const { features, interpupillaryPx, faceLengthPx, cheekWidthPx, foreheadWidthPx, jawWidthPx, eyeWidthPx, headTiltDeg } =
    measurements;
  const mmPerPx = CALIBRATION_IPD_MM / interpupillaryPx;
  const jawLabels = copy.report.jawShapeLabels;
  const jawLabel =
    features.jawSoftness < 0.4 ? jawLabels.angular : features.jawSoftness > 0.7 ? jawLabels.soft : jawLabels.intermediate;

  return [
    { key: "interpupillary", value: `${CALIBRATION_IPD_MM} mm` },
    { key: "faceWidth", value: `${Math.round(cheekWidthPx * mmPerPx)} mm` },
    { key: "faceLength", value: `${Math.round(faceLengthPx * mmPerPx)} mm` },
    { key: "lengthToWidth", value: features.ratioLengthToCheek.toFixed(2) },
    {
      key: "foreheadToCheek",
      value: `${Math.round((foreheadWidthPx / cheekWidthPx) * 100)}%`,
      bar: Math.min(100, (foreheadWidthPx / cheekWidthPx) * 100),
    },
    {
      key: "jawToCheek",
      value: `${Math.round((jawWidthPx / cheekWidthPx) * 100)}%`,
      bar: Math.min(100, (jawWidthPx / cheekWidthPx) * 100),
    },
    { key: "eyeWidth", value: `${Math.round(eyeWidthPx * mmPerPx)} mm` },
    { key: "headTilt", value: `${headTiltDeg.toFixed(1)}°` },
    { key: "jawShape", value: jawLabel, bar: features.jawSoftness * 100 },
  ];
}

export function FaceReport({
  photoDataUrl,
  scores,
  relevantShapes,
  recommendations,
  measurements,
  copy,
  onRetake,
  children,
}: FaceReportProps) {
  const dominant = relevantShapes[0];
  const dominantRecommendation = dominant ? recommendations[dominant.shape] : null;
  const metricRows = measurements ? buildMetricRows(measurements, copy) : [];

  return (
    <div className="flex flex-col gap-8">
      <h3 className="text-xl font-bold text-slate-900">{copy.report.title}</h3>

      <div className="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-start">
        {/* eslint-disable-next-line @next/next/no-img-element -- data: URL desde canvas */}
        <img src={photoDataUrl} alt="" className="block w-full rounded-2xl [transform:scaleX(-1)]" />
        {dominantRecommendation && dominant && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {copy.report.dominantShapeTitle}
            </p>
            <p className="text-3xl font-bold text-teal-700">
              {dominantRecommendation.label}{" "}
              <span className="text-base font-medium text-slate-500">{Math.round(dominant.score * 100)}%</span>
            </p>
            <p className="text-sm text-slate-700">{dominantRecommendation.description}</p>
            <p className="text-sm text-slate-600">{dominantRecommendation.explanation}</p>
          </div>
        )}
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-slate-800">{copy.report.allShapesTitle}</p>
        <div className="flex flex-col gap-2">
          {scores.map((s) => (
            <div key={s.shape} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-sm text-slate-600">{recommendations[s.shape].label}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-teal-600" style={{ width: `${Math.round(s.score * 100)}%` }} />
              </div>
              <span className="w-10 shrink-0 text-right text-xs text-slate-500">{Math.round(s.score * 100)}%</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-400">{copy.resultsDisclaimer}</p>
      </div>

      {dominantRecommendation && (
        <div>
          <p className="mb-3 text-sm font-semibold text-slate-800">{copy.report.recommendedFrameTitle}</p>
          <div className="grid grid-cols-3 gap-3">
            {dominantRecommendation.recommendedFrameTypes.map((frameType) => (
              <FrameRecommendationCard key={frameType.id} frameType={frameType} />
            ))}
          </div>
          {dominantRecommendation.avoidNotes && (
            <p className="mt-3 text-xs text-slate-500">{dominantRecommendation.avoidNotes}</p>
          )}
        </div>
      )}

      {metricRows.length > 0 && (
        <div>
          <p className="mb-1 text-sm font-semibold text-slate-800">{copy.report.measurementsTitle}</p>
          <p className="mb-3 text-xs text-slate-400">{copy.report.measurementsNote}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {metricRows.map((row) => (
              <div key={row.key} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-xs text-slate-500">{copy.report.metrics[row.key]}</span>
                  <span className="text-sm font-semibold text-slate-900">{row.value}</span>
                </div>
                {row.bar !== undefined && (
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-teal-500" style={{ width: `${row.bar}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-3 text-sm font-semibold text-slate-800">{copy.report.tipsTitle}</p>
        <div className="flex flex-col gap-4">
          {relevantShapes.map((s) => {
            const recommendation = recommendations[s.shape];
            return (
              <div key={s.shape}>
                <p className="text-xs font-semibold text-teal-700">{recommendation.label}</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {recommendation.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onRetake}
        className="self-start rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        {copy.retakeLabel}
      </button>

      {children}
    </div>
  );
}
