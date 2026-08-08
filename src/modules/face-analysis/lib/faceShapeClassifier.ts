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
import { angleAtVertex, centroid, rotateAround, type Point2D } from "./geometry";
import { getFaceOvalIndices, getLeftEyeIndices, getRightEyeIndices } from "./landmarkGroups";

interface ShapeFeatures {
  /** Largo del rostro relativo al ancho de pómulos. */
  ratioLengthToCheek: number;
  /** Ancho de frente relativo al ancho de pómulos. */
  ratioForeheadToCheek: number;
  /** Ancho de mandíbula relativo al ancho de pómulos. */
  ratioJawToCheek: number;
  /** 0 = mandíbula angulosa/marcada, 1 = mandíbula suave/redondeada. */
  jawSoftness: number;
}

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

function getPoint(landmarks: NormalizedLandmark[], index: number, width: number, height: number): Point2D | null {
  const point = landmarks[index];
  return point ? { x: point.x * width, y: point.y * height } : null;
}

function pointsAt(landmarks: NormalizedLandmark[], indices: number[], width: number, height: number): Point2D[] {
  const points: Point2D[] = [];
  for (const index of indices) {
    const point = getPoint(landmarks, index, width, height);
    if (point) points.push(point);
  }
  return points;
}

function pointsNearRelativeY(
  points: Point2D[],
  minY: number,
  length: number,
  targetT: number,
  minCount = 2
): Point2D[] {
  if (length <= 0) return points;
  let halfWindow = 0.06;
  let selected: Point2D[] = [];
  while (halfWindow <= 0.3) {
    selected = points.filter((p) => Math.abs((p.y - minY) / length - targetT) <= halfWindow);
    if (selected.length >= minCount) break;
    halfWindow += 0.04;
  }
  return selected.length > 0 ? selected : points;
}

function widthOf(points: Point2D[]): number {
  if (points.length === 0) return 0;
  const xs = points.map((p) => p.x);
  return Math.max(...xs) - Math.min(...xs);
}

function extremesX(points: Point2D[]): { left: Point2D; right: Point2D } {
  let left = points[0]!;
  let right = points[0]!;
  for (const p of points) {
    if (p.x < left.x) left = p;
    if (p.x > right.x) right = p;
  }
  return { left, right };
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function extractFeatures(landmarks: NormalizedLandmark[], width: number, height: number): ShapeFeatures | null {
  const ovalPoints = pointsAt(landmarks, getFaceOvalIndices(), width, height);
  const leftEyePoints = pointsAt(landmarks, getLeftEyeIndices(), width, height);
  const rightEyePoints = pointsAt(landmarks, getRightEyeIndices(), width, height);
  if (ovalPoints.length < 8 || leftEyePoints.length === 0 || rightEyePoints.length === 0) {
    return null;
  }

  const leftEyeCenter = centroid(leftEyePoints);
  const rightEyeCenter = centroid(rightEyePoints);
  const rollAngle = Math.atan2(rightEyeCenter.y - leftEyeCenter.y, rightEyeCenter.x - leftEyeCenter.x);
  const ovalCentroid = centroid(ovalPoints);
  const rotatedOval = ovalPoints.map((p) => rotateAround(p, ovalCentroid, -rollAngle));

  const ys = rotatedOval.map((p) => p.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const length = maxY - minY;
  if (length <= 0) return null;

  const foreheadBand = pointsNearRelativeY(rotatedOval, minY, length, 0.15);
  const cheekBand = pointsNearRelativeY(rotatedOval, minY, length, 0.48);
  const jawBand = pointsNearRelativeY(rotatedOval, minY, length, 0.82);

  const foreheadWidth = widthOf(foreheadBand);
  const cheekWidth = widthOf(cheekBand);
  const jawWidth = widthOf(jawBand);
  if (cheekWidth <= 0) return null;

  const chin = rotatedOval.reduce((a, b) => (b.y > a.y ? b : a));
  const { left: cheekLeft, right: cheekRight } = extremesX(cheekBand);
  const { left: jawLeft, right: jawRight } = extremesX(jawBand);
  const angleRight = angleAtVertex(jawRight, cheekRight, chin);
  const angleLeft = angleAtVertex(jawLeft, cheekLeft, chin);
  const jawSoftness = clamp01((angleRight + angleLeft) / 2 / Math.PI);

  return {
    ratioLengthToCheek: length / cheekWidth,
    ratioForeheadToCheek: foreheadWidth / cheekWidth,
    ratioJawToCheek: jawWidth / cheekWidth,
    jawSoftness,
  };
}

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
  if (!landmarks || imageWidth <= 0 || imageHeight <= 0) return UNIFORM_SCORES;

  const features = extractFeatures(landmarks, imageWidth, imageHeight);
  if (!features) return UNIFORM_SCORES;

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
