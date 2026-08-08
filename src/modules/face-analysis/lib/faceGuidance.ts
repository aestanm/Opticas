/** Guía en vivo (por frame): ¿el rostro está muy cerca/lejos/descentrado dentro del óvalo? */
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { GuidanceResult, GuidanceStatus } from "../types";
import { getFaceOvalIndices } from "./landmarkGroups";

// Proporción de la altura del frame que debe ocupar el rostro para considerarse "bien posicionado".
const MIN_FACE_HEIGHT_RATIO = 0.5;
const MAX_FACE_HEIGHT_RATIO = 0.8;
// Desviación máxima del centro del rostro respecto al centro del frame (espacio normalizado 0-1).
const MAX_CENTER_OFFSET = 0.1;

export const DEFAULT_GUIDANCE_MESSAGES: Record<GuidanceStatus, string> = {
  "no-face": "No detectamos tu rostro. Ubícate frente a la cámara.",
  "too-close": "Aléjate un poco de la cámara.",
  "too-far": "Acércate un poco a la cámara.",
  "off-center": "Centra tu rostro dentro del óvalo.",
  good: "¡Perfecto! Ya puedes tomar la foto.",
};

function getPoint(landmarks: NormalizedLandmark[], index: number) {
  const point = landmarks[index];
  return point ? { x: point.x, y: point.y } : null;
}

export function computeGuidance(
  landmarks: NormalizedLandmark[] | null,
  messages: Record<GuidanceStatus, string> = DEFAULT_GUIDANCE_MESSAGES
): GuidanceResult {
  if (!landmarks || landmarks.length === 0) {
    return { status: "no-face", message: messages["no-face"] };
  }

  const ovalPoints = getFaceOvalIndices()
    .map((index) => getPoint(landmarks, index))
    .filter((point): point is { x: number; y: number } => point !== null);

  if (ovalPoints.length < 4) {
    return { status: "no-face", message: messages["no-face"] };
  }

  const xs = ovalPoints.map((p) => p.x);
  const ys = ovalPoints.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const faceHeight = maxY - minY;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const centerOffset = Math.hypot(centerX - 0.5, centerY - 0.5);

  if (faceHeight > MAX_FACE_HEIGHT_RATIO) {
    return { status: "too-close", message: messages["too-close"] };
  }
  if (faceHeight < MIN_FACE_HEIGHT_RATIO) {
    return { status: "too-far", message: messages["too-far"] };
  }
  if (centerOffset > MAX_CENTER_OFFSET) {
    return { status: "off-center", message: messages["off-center"] };
  }
  return { status: "good", message: messages.good };
}
