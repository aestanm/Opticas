/** Carga (una sola vez, cacheada) del runtime WASM y el modelo FaceLandmarker de MediaPipe. */
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import type { FaceAnalysisAssetPaths } from "../types";

const DEFAULT_WASM_BASE_PATH = "/models/face-landmarker/wasm";
const DEFAULT_MODEL_ASSET_PATH = "/models/face-landmarker/face_landmarker.task";

let cacheKey: string | null = null;
let landmarkerPromise: Promise<FaceLandmarker> | null = null;

async function createLandmarker(wasmBasePath: string, modelAssetPath: string): Promise<FaceLandmarker> {
  const filesetResolver = await FilesetResolver.forVisionTasks(wasmBasePath);
  try {
    return await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: { modelAssetPath, delegate: "GPU" },
      runningMode: "VIDEO",
      numFaces: 1,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
    });
  } catch {
    // Algunos navegadores/dispositivos no exponen un contexto WebGL utilizable; CPU es más lento pero universal.
    return FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: { modelAssetPath, delegate: "CPU" },
      runningMode: "VIDEO",
      numFaces: 1,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
    });
  }
}

export function loadFaceLandmarker(assets?: FaceAnalysisAssetPaths): Promise<FaceLandmarker> {
  const wasmBasePath = assets?.wasmBasePath ?? DEFAULT_WASM_BASE_PATH;
  const modelAssetPath = assets?.modelAssetPath ?? DEFAULT_MODEL_ASSET_PATH;
  const nextCacheKey = `${wasmBasePath}|${modelAssetPath}`;

  if (!landmarkerPromise || cacheKey !== nextCacheKey) {
    cacheKey = nextCacheKey;
    landmarkerPromise = createLandmarker(wasmBasePath, modelAssetPath);
  }
  return landmarkerPromise;
}
