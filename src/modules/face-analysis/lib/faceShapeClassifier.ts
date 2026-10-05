/**
 * Clasificación heurística de forma de rostro a partir de los landmarks capturados.
 * No es un algoritmo validado clínicamente — es un heurístico de estilismo estándar
 * (proporciones frente/pómulos/mandíbula + curvatura de la mandíbula) pensado para dar
 * una recomendación orientativa, no un diagnóstico. Por eso el resultado siempre reparte
 * un score entre las 6 formas en vez de forzar un único ganador.
 */
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { FaceShape, ShapeScore } from "../types";
import { FACE_SHAPES } from "../types";
import { measureFace, type ShapeFeatures } from "./faceMeasurements";

const PROTOTYPES: Record<FaceShape, ShapeFeatures> = {
  ovalado: { ratioLengthToCheek: 1.5, ratioForeheadToCheek: 0.9, ratioJawToCheek: 0.8, jawSoftness: 0.6 },
  redondo: { ratioLengthToCheek: 1.0, ratioForeheadToCheek: 0.95, ratioJawToCheek: 0.9, jawSoftness: 0.85 },
  cuadrado: { ratioLengthToCheek: 1.0, ratioForeheadToCheek: 0.95, ratioJawToCheek: 0.95, jawSoftness: 0.25 },
  corazon: { ratioLengthToCheek: 1.3, ratioForeheadToCheek: 1.05, ratioJawToCheek: 0.75, jawSoftness: 0.5 },
  alargado: { ratioLengthToCheek: 1.8, ratioForeheadToCheek: 0.9, ratioJawToCheek: 0.85, jawSoftness: 0.5 },
  diamante: { ratioLengthToCheek: 1.35, ratioForeheadToCheek: 0.75, ratioJawToCheek: 0.75, jawSoftness: 0.5 },
};

const FEATURE_SIGMAS: ShapeFeatures = {
  ratioLengthToCheek: 0.28,
  ratioForeheadToCheek: 0.18,
  ratioJawToCheek: 0.18,
  jawSoftness: 0.32,
};

const UNIFORM_SCORES: ShapeScore[] = FACE_SHAPES.map((shape) => ({ shape, score: 1 / FACE_SHAPES.length }));

function similarity(features: ShapeFeatures, prototype: ShapeFeatures): number {
  const keys = Object.keys(prototype) as (keyof ShapeFeatures)[];
  const distanceSq = keys.reduce((sum, key) => {
    const diff = (features[key] - prototype[key]) / FEATURE_SIGMAS[key];
    return sum + diff * diff;
  }, 0);
  return Math.exp(-distanceSq);
}

/** Puntúa las 6 formas de rostro a partir de un único set de landmarks (una foto ya capturada). */
export function classifyFaceShape(
  landmarks: NormalizedLandmark[] | null,
  imageWidth: number,
  imageHeight: number
): ShapeScore[] {
  const measurements = measureFace(landmarks, imageWidth, imageHeight);
  if (!measurements) return UNIFORM_SCORES;

  const features = measurements.features;
  const rawScores = FACE_SHAPES.map((shape) => ({
    shape,
    score: similarity(features, PROTOTYPES[shape]),
  }));

  const total = rawScores.reduce((sum, s) => sum + s.score, 0);
  if (total <= 0) return UNIFORM_SCORES;

  return rawScores
    .map(({ shape, score }) => ({ shape, score: score / total }))
    .sort((a, b) => b.score - a.score);
}
