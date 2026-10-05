import type { ShapeScore } from "../types";

/**
 * Formas que aplican al rostro: la más probable, más cualquier otra que quede razonablemente cerca
 * (no forzamos un único ganador, pero tampoco mostramos las 6 si claramente no aplican).
 */
export function pickRelevantShapes(scores: ShapeScore[]): ShapeScore[] {
  const top = scores[0];
  if (!top) return [];
  return scores.filter((s, index) => index === 0 || s.score >= top.score * 0.7).slice(0, 3);
}
