/**
 * Utilidades de landmark→píxel + geometría de ojos, compartidas entre el clasificador de forma
 * de rostro y el posicionamiento del overlay de monturas (ambos necesitan el mismo centro de
 * ojos / distancia interpupilar / ángulo de inclinación de cabeza).
 */
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { centroid, distance, type Point2D } from "./geometry";
import { getLeftEyeIndices, getRightEyeIndices } from "./landmarkGroups";

export function getPoint(
  landmarks: NormalizedLandmark[],
  index: number,
  width: number,
  height: number
): Point2D | null {
  const point = landmarks[index];
  return point ? { x: point.x * width, y: point.y * height } : null;
}

export function pointsAt(
  landmarks: NormalizedLandmark[],
  indices: number[],
  width: number,
  height: number
): Point2D[] {
  const points: Point2D[] = [];
  for (const index of indices) {
    const point = getPoint(landmarks, index, width, height);
    if (point) points.push(point);
  }
  return points;
}

export interface EyeGeometry {
  leftEyeCenter: Point2D;
  rightEyeCenter: Point2D;
  midpoint: Point2D;
  interpupillaryDistance: number;
  /** Ángulo (radianes) de la línea entre ojos respecto a la horizontal — inclinación de cabeza. */
  rollAngle: number;
}

/** `width`/`height` deben ser las dimensiones reales en píxeles de la imagen (no normalizadas). */
export function getEyeGeometry(
  landmarks: NormalizedLandmark[],
  width: number,
  height: number
): EyeGeometry | null {
  const leftEyePoints = pointsAt(landmarks, getLeftEyeIndices(), width, height);
  const rightEyePoints = pointsAt(landmarks, getRightEyeIndices(), width, height);
  if (leftEyePoints.length === 0 || rightEyePoints.length === 0) return null;

  const leftEyeCenter = centroid(leftEyePoints);
  const rightEyeCenter = centroid(rightEyePoints);
  return {
    leftEyeCenter,
    rightEyeCenter,
    midpoint: centroid([leftEyeCenter, rightEyeCenter]),
    interpupillaryDistance: distance(leftEyeCenter, rightEyeCenter),
    rollAngle: Math.atan2(rightEyeCenter.y - leftEyeCenter.y, rightEyeCenter.x - leftEyeCenter.x),
  };
}
