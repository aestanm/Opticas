import { DEFAULT_GUIDANCE_MESSAGES } from "../lib/faceGuidance";
import type { FaceAnalysisCopy } from "../types";

export const DEFAULT_COPY: FaceAnalysisCopy = {
  activateCameraLabel: "Activar cámara",
  activatingCameraLabel: "Activando cámara…",
  captureLabel: "Tomar foto",
  retakeLabel: "Repetir",
  analyzingLabel: "Analizando tu rostro…",
  resultsTitle: "Tu forma de rostro",
  resultsDisclaimer: "Resultado orientativo, no un diagnóstico exacto.",
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
};
