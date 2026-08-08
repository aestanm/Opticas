/**
 * Tipos públicos del módulo de análisis facial.
 * Módulo sin dependencias de backend: no debe importar nada de `@/lib`, `@/components` ni `@/services`.
 */
import type { ComponentType, ReactNode } from "react";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export type FaceShape =
  | "ovalado"
  | "redondo"
  | "cuadrado"
  | "corazon"
  | "alargado"
  | "diamante";

export const FACE_SHAPES: FaceShape[] = [
  "ovalado",
  "redondo",
  "cuadrado",
  "corazon",
  "alargado",
  "diamante",
];

export interface ShapeScore {
  shape: FaceShape;
  /** 0-1, la suma de todos los scores del resultado es 1. */
  score: number;
}

export type GuidanceStatus = "no-face" | "too-close" | "too-far" | "off-center" | "good";

export interface GuidanceResult {
  status: GuidanceStatus;
  message: string;
}

export type CameraStatus =
  | "idle"
  | "requesting"
  | "active"
  | "denied"
  | "no-device"
  | "in-use"
  | "unsupported"
  | "error";

export type FaceLandmarkerStatus = "idle" | "loading" | "ready" | "error";

export type CaptureStep = "camera" | "preview" | "results";

export interface FaceAnalysisAssetPaths {
  wasmBasePath?: string;
  modelAssetPath?: string;
}

export interface FrameTypeExample {
  id: string;
  name: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
}

export interface ShapeRecommendation {
  shape: FaceShape;
  label: string;
  explanation: string;
  recommendedFrameTypes: FrameTypeExample[];
  avoidNotes?: string;
}

export interface FaceAnalysisCopy {
  activateCameraLabel: string;
  activatingCameraLabel: string;
  captureLabel: string;
  retakeLabel: string;
  analyzingLabel: string;
  resultsTitle: string;
  resultsDisclaimer: string;
  privacyNotice: string;
  guidanceMessages: Record<GuidanceStatus, string>;
  errors: {
    denied: string;
    noDevice: string;
    inUse: string;
    unsupported: string;
    generic: string;
    modelLoad: string;
  };
}

export interface FaceAnalysisExperienceProps {
  copy?: Partial<FaceAnalysisCopy>;
  recommendations?: Partial<Record<FaceShape, ShapeRecommendation>>;
  assets?: FaceAnalysisAssetPaths;
  className?: string;
  /** Contenido renderizado debajo de los resultados (ej. un CTA del sitio anfitrión). */
  children?: ReactNode;
}

export type { NormalizedLandmark };
