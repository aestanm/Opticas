"use client";

import { useEffect, useRef, useState } from "react";
import type { FaceLandmarker, NormalizedLandmark } from "@mediapipe/tasks-vision";
import { computeGuidance, DEFAULT_GUIDANCE_MESSAGES } from "../lib/faceGuidance";
import type { GuidanceResult, GuidanceStatus } from "../types";

export interface LatestDetection {
  landmarks: NormalizedLandmark[] | null;
  videoWidth: number;
  videoHeight: number;
}

export interface UseFaceDetectionLoopArgs {
  videoRef: React.RefObject<HTMLVideoElement>;
  landmarker: FaceLandmarker | null;
  active: boolean;
  guidanceMessages?: Record<GuidanceStatus, string>;
}

export interface UseFaceDetectionLoopResult {
  guidance: GuidanceResult;
  /** Última detección procesada; se lee de forma imperativa al capturar la foto. */
  latestRef: React.MutableRefObject<LatestDetection>;
}

export function useFaceDetectionLoop({
  videoRef,
  landmarker,
  active,
  guidanceMessages = DEFAULT_GUIDANCE_MESSAGES,
}: UseFaceDetectionLoopArgs): UseFaceDetectionLoopResult {
  const [guidance, setGuidance] = useState<GuidanceResult>({
    status: "no-face",
    message: guidanceMessages["no-face"],
  });
  const latestRef = useRef<LatestDetection>({ landmarks: null, videoWidth: 0, videoHeight: 0 });
  const lastVideoTimeRef = useRef(-1);

  useEffect(() => {
    if (!active || !landmarker) return;
    let frameId: number;

    const tick = () => {
      const video = videoRef.current;
      if (video && video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;
        const result = landmarker.detectForVideo(video, performance.now());
        const face = result.faceLandmarks[0] ?? null;
        latestRef.current = { landmarks: face, videoWidth: video.videoWidth, videoHeight: video.videoHeight };
        setGuidance(computeGuidance(face, guidanceMessages));
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [active, landmarker, videoRef, guidanceMessages]);

  return { guidance, latestRef };
}
