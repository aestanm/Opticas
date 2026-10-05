/**
 * Medidas geométricas del rostro a partir de los landmarks capturados. Alimenta tanto al
 * clasificador de forma (ratios adimensionales) como al reporte (valores en píxeles, que se
 * convierten a mm estimados en la capa de presentación).
 */
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { getEyeGeometry, pointsAt } from "./eyeGeometry";
import { angleAtVertex, centroid, rotateAround, type Point2D } from "./geometry";
import { getFaceOvalIndices, getLeftEyeIndices, getRightEyeIndices } from "./landmarkGroups";

export interface ShapeFeatures {
  /** Largo del rostro relativo al ancho de pómulos. */
  ratioLengthToCheek: number;
  /** Ancho de frente relativo al ancho de pómulos. */
  ratioForeheadToCheek: number;
  /** Ancho de mandíbula relativo al ancho de pómulos. */
  ratioJawToCheek: number;
  /** 0 = mandíbula angulosa/marcada, 1 = mandíbula suave/redondeada. */
  jawSoftness: number;
}

export interface FaceMeasurements {
  features: ShapeFeatures;
  interpupillaryPx: number;
  faceLengthPx: number;
  cheekWidthPx: number;
  foreheadWidthPx: number;
  jawWidthPx: number;
  /** Promedio del ancho horizontal de ambos ojos. */
  eyeWidthPx: number;
  /** Inclinación de la cabeza (grados) respecto a la horizontal, según la línea entre ojos. */
  headTiltDeg: number;
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

function extentX(points: Point2D[]): number {
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

/** `width`/`height` son las dimensiones reales en píxeles de la imagen capturada. */
export function measureFace(
  landmarks: NormalizedLandmark[] | null,
  width: number,
  height: number
): FaceMeasurements | null {
  if (!landmarks || width <= 0 || height <= 0) return null;

  const ovalPoints = pointsAt(landmarks, getFaceOvalIndices(), width, height);
  const eyeGeometry = getEyeGeometry(landmarks, width, height);
  if (ovalPoints.length < 8 || !eyeGeometry) return null;

  const { rollAngle, interpupillaryDistance } = eyeGeometry;
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

  const foreheadWidth = extentX(foreheadBand);
  const cheekWidth = extentX(cheekBand);
  const jawWidth = extentX(jawBand);
  if (cheekWidth <= 0) return null;

  const chin = rotatedOval.reduce((a, b) => (b.y > a.y ? b : a));
  const { left: cheekLeft, right: cheekRight } = extremesX(cheekBand);
  const { left: jawLeft, right: jawRight } = extremesX(jawBand);
  const angleRight = angleAtVertex(jawRight, cheekRight, chin);
  const angleLeft = angleAtVertex(jawLeft, cheekLeft, chin);
  const jawSoftness = clamp01((angleRight + angleLeft) / 2 / Math.PI);

  const leftEyeWidth = extentX(pointsAt(landmarks, getLeftEyeIndices(), width, height));
  const rightEyeWidth = extentX(pointsAt(landmarks, getRightEyeIndices(), width, height));

  return {
    features: {
      ratioLengthToCheek: length / cheekWidth,
      ratioForeheadToCheek: foreheadWidth / cheekWidth,
      ratioJawToCheek: jawWidth / cheekWidth,
      jawSoftness,
    },
    interpupillaryPx: interpupillaryDistance,
    faceLengthPx: length,
    cheekWidthPx: cheekWidth,
    foreheadWidthPx: foreheadWidth,
    jawWidthPx: jawWidth,
    eyeWidthPx: (leftEyeWidth + rightEyeWidth) / 2,
    headTiltDeg: (rollAngle * 180) / Math.PI,
  };
}
