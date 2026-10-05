import { DEFAULT_GUIDANCE_MESSAGES } from "../lib/faceGuidance";
import type { FaceAnalysisCopy } from "../types";

export const DEFAULT_COPY: FaceAnalysisCopy = {
  activateCameraLabel: "Activar cámara",
  activatingCameraLabel: "Activando cámara…",
  captureLabel: "Tomar foto",
  captureHint: "O presiona la barra espaciadora",
  retakeLabel: "Repetir análisis",
  analyzingLabel: "Analizando tu rostro…",
  scanningCaptions: [
    "Detectando contorno del rostro…",
    "Midiendo distancia entre ojos…",
    "Calculando ancho de pómulos…",
    "Evaluando la mandíbula…",
    "Analizando proporciones…",
    "Preparando tu recomendación…",
  ],
  resultsDisclaimer: "Resultado orientativo, no un diagnóstico exacto. Las medidas en mm son estimaciones.",
  privacyNotice:
    "Tu foto se procesa localmente en tu navegador: no se guarda ni se envía a ningún servidor.",
  guidanceMessages: DEFAULT_GUIDANCE_MESSAGES,
  errors: {
    denied: "Debes permitir el acceso a la cámara para continuar.",
    noDevice: "No se encontró una cámara en este dispositivo.",
    inUse: "La cámara está siendo usada por otra aplicación.",
    unsupported: "Tu navegador no admite el acceso a la cámara.",
    generic: "No se pudo activar la cámara. Intenta de nuevo.",
    modelLoad: "No se pudo cargar el modelo de análisis facial.",
  },
  report: {
    title: "Tu análisis facial",
    dominantShapeTitle: "Forma de rostro",
    allShapesTitle: "Probabilidad por forma",
    recommendedFrameTitle: "Montura que te favorece",
    measurementsTitle: "Medidas de tu rostro",
    measurementsNote:
      "Medidas en mm estimadas a partir de una distancia interpupilar promedio de 63 mm.",
    tipsTitle: "Consejos",
    metrics: {
      interpupillary: "Distancia entre ojos",
      faceWidth: "Ancho del rostro",
      faceLength: "Largo del rostro",
      lengthToWidth: "Proporción largo / ancho",
      foreheadToCheek: "Frente vs. pómulos",
      jawToCheek: "Mandíbula vs. pómulos",
      eyeWidth: "Ancho de cada ojo",
      headTilt: "Inclinación de cabeza",
      jawShape: "Forma de mandíbula",
    },
    jawShapeLabels: { angular: "Angulosa", intermediate: "Intermedia", soft: "Suave" },
  },
};
