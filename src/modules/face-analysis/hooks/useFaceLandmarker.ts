"use client";

import { useEffect, useState } from "react";
import type { FaceLandmarker } from "@mediapipe/tasks-vision";
import { loadFaceLandmarker } from "../lib/landmarker";
import type { FaceAnalysisAssetPaths, FaceLandmarkerStatus } from "../types";

export interface UseFaceLandmarkerResult {
  landmarker: FaceLandmarker | null;
  status: FaceLandmarkerStatus;
}

export function useFaceLandmarker(assets?: FaceAnalysisAssetPaths, enabled = true): UseFaceLandmarkerResult {
  const [landmarker, setLandmarker] = useState<FaceLandmarker | null>(null);
  const [status, setStatus] = useState<FaceLandmarkerStatus>("idle");
  const wasmBasePath = assets?.wasmBasePath;
  const modelAssetPath = assets?.modelAssetPath;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setStatus("loading");
    loadFaceLandmarker({ wasmBasePath, modelAssetPath })
      .then((instance) => {
        if (cancelled) return;
        setLandmarker(instance);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [wasmBasePath, modelAssetPath, enabled]);

  return { landmarker, status };
}
