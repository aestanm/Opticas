"use client";

import { useCallback, useRef, useState } from "react";
import { DEFAULT_COPY } from "../config/default-copy";
import { DEFAULT_RECOMMENDATIONS } from "../config/default-recommendations";
import { useCamera } from "../hooks/useCamera";
import { useFaceDetectionLoop } from "../hooks/useFaceDetectionLoop";
import { useFaceLandmarker } from "../hooks/useFaceLandmarker";
import { classifyFaceShape } from "../lib/faceShapeClassifier";
import type { CaptureStep, FaceAnalysisExperienceProps, ShapeScore } from "../types";
import { CameraCapture } from "./CameraCapture";
import { CapturePreview } from "./CapturePreview";
import { ShapeResults } from "./ShapeResults";
import { ModuleErrorState } from "./states/ModuleErrorState";

// Beat de "procesando" antes de mostrar resultados: la clasificación es instantánea (matemática
// local sobre los landmarks ya detectados), pero una transición inmediata se siente poco confiable
// para algo que se presenta como un análisis.
const ANALYSIS_DELAY_MS = 600;

export function FaceAnalysisExperience({
  copy: copyOverrides,
  recommendations: recommendationOverrides,
  assets,
  className,
  children,
}: FaceAnalysisExperienceProps) {
  const copy = {
    ...DEFAULT_COPY,
    ...copyOverrides,
    guidanceMessages: { ...DEFAULT_COPY.guidanceMessages, ...copyOverrides?.guidanceMessages },
    errors: { ...DEFAULT_COPY.errors, ...copyOverrides?.errors },
  };
  const recommendations = { ...DEFAULT_RECOMMENDATIONS, ...recommendationOverrides };

  const [step, setStep] = useState<CaptureStep>("camera");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [scores, setScores] = useState<ShapeScore[] | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const camera = useCamera();
  const shouldLoadModel = camera.status !== "idle";
  const { landmarker, status: landmarkerStatus } = useFaceLandmarker(assets, shouldLoadModel);
  const { guidance, latestRef } = useFaceDetectionLoop({
    videoRef: camera.videoRef,
    landmarker,
    active: camera.status === "active" && step === "camera",
    guidanceMessages: copy.guidanceMessages,
  });

  const handleCapture = useCallback(() => {
    const video = camera.videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    const detection = latestRef.current;

    setPhotoDataUrl(dataUrl);
    setStep("preview");
    camera.stop();

    window.setTimeout(() => {
      setScores(classifyFaceShape(detection.landmarks, detection.videoWidth, detection.videoHeight));
      setStep("results");
    }, ANALYSIS_DELAY_MS);
  }, [camera, latestRef]);

  const handleRetake = useCallback(() => {
    setPhotoDataUrl(null);
    setScores(null);
    setStep("camera");
  }, []);

  return (
    <div className={className}>
      <canvas ref={canvasRef} className="hidden" />
      {landmarkerStatus === "error" ? (
        <ModuleErrorState message={copy.errors.modelLoad} />
      ) : (
        <>
          {step === "camera" && (
            <CameraCapture
              videoRef={camera.videoRef}
              cameraStatus={camera.status}
              landmarkerStatus={landmarkerStatus}
              guidance={guidance}
              isSupported={camera.isSupported}
              copy={copy}
              onActivate={camera.start}
              onCapture={handleCapture}
            />
          )}
          {step === "preview" && photoDataUrl && (
            <CapturePreview photoDataUrl={photoDataUrl} copy={copy} isAnalyzing onRetake={handleRetake} />
          )}
          {step === "results" && scores && (
            <>
              <ShapeResults scores={scores} recommendations={recommendations} copy={copy} onRetake={handleRetake} />
              {children}
            </>
          )}
        </>
      )}
    </div>
  );
}
