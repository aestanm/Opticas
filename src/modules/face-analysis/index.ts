/**
 * Módulo de análisis facial y recomendación de tipos de montura.
 * Módulo sin dependencia de backend: no importa nada de `@/lib`, `@/components` ni `@/services`.
 * Toda la personalización (copy, recomendaciones, rutas de assets) se inyecta vía props.
 */

export { FaceAnalysisExperience } from "./components/FaceAnalysisExperience";

export { DEFAULT_RECOMMENDATIONS } from "./config/default-recommendations";
export { DEFAULT_COPY } from "./config/default-copy";

export type {
  FaceShape,
  ShapeScore,
  ShapeRecommendation,
  FrameTypeExample,
  FaceAnalysisCopy,
  FaceAnalysisAssetPaths,
  FaceAnalysisExperienceProps,
} from "./types";
