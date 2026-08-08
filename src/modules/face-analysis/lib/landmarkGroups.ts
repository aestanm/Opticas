/**
 * Índices de landmarks derivados en runtime desde las constantes de conectores que expone
 * `FaceLandmarker` (FACE_LANDMARKS_FACE_OVAL / LEFT_EYE / RIGHT_EYE), en vez de asumir de
 * memoria números de índice fijos del mesh de 468 puntos — un índice mal puesto produciría
 * una medición sutilmente incorrecta sin ningún error de tipo que lo atrape.
 */
import { FaceLandmarker } from "@mediapipe/tasks-vision";

function uniqueIndices(connections: ReadonlyArray<{ start: number; end: number }>): number[] {
  const indices = new Set<number>();
  for (const connection of connections) {
    indices.add(connection.start);
    indices.add(connection.end);
  }
  return Array.from(indices);
}

let faceOvalIndices: number[] | null = null;
let leftEyeIndices: number[] | null = null;
let rightEyeIndices: number[] | null = null;

export function getFaceOvalIndices(): number[] {
  faceOvalIndices ??= uniqueIndices(FaceLandmarker.FACE_LANDMARKS_FACE_OVAL);
  return faceOvalIndices;
}

export function getLeftEyeIndices(): number[] {
  leftEyeIndices ??= uniqueIndices(FaceLandmarker.FACE_LANDMARKS_LEFT_EYE);
  return leftEyeIndices;
}

export function getRightEyeIndices(): number[] {
  rightEyeIndices ??= uniqueIndices(FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE);
  return rightEyeIndices;
}
