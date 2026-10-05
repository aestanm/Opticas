"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { DEFAULT_COPY } from "../config/default-copy";
import { DEFAULT_RECOMMENDATIONS } from "../config/default-recommendations";
import { useCamera } from "../hooks/useCamera";
import { useCaptureCountdown } from "../hooks/useCaptureCountdown";
import { useFaceDetectionLoop, type LatestDetection } from "../hooks/useFaceDetectionLoop";
import { useFaceLandmarker } from "../hooks/useFaceLandmarker";
import { classifyFaceShape } from "../lib/faceShapeClassifier";
import { measureFace } from "../lib/faceMeasurements";
import { pickRelevantShapes } from "../lib/pickRelevantShapes";
import type { CaptureStep, FaceAnalysisExperienceProps, ShapeScore } from "../types";
import { CameraCapture } from "./CameraCapture";
import { CapturePreview } from "./CapturePreview";
import { FaceReport } from "./FaceReport";
import { ModuleErrorState } from "./states/ModuleErrorState";

const COUNTDOWN_SECONDS = 3;
// 6 captions de escaneo × ~650ms cada una (ver ScanningOverlay.tsx) ≈ este valor. La clasificación
// en sí es instantánea; este delay es de ritmo, para que la animación no se corte a mitad de frase.
const ANALYSIS_DELAY_MS = 3900;

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
    report: {
      ...DEFAULT_COPY.report,
      ...copyOverrides?.report,
      metrics: { ...DEFAULT_COPY.report.metrics, ...copyOverrides?.report?.metrics },
      jawShapeLabels: { ...DEFAULT_COPY.report.jawShapeLabels, ...copyOverrides?.report?.jawShapeLabels },
    },
  };
  const recommendations = { ...DEFAULT_RECOMMENDATIONS, ...recommendationOverrides };

  const [step, setStep] = useState<CaptureStep>("camera");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [detection, setDetection] = useState<LatestDetection | null>(null);
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
    const capturedDetection = latestRef.current;

    setPhotoDataUrl(dataUrl);
    setDetection(capturedDetection);
    setStep("preview");
    camera.stop();

    window.setTimeout(() => {
      setScores(classifyFaceShape(capturedDetection.landmarks, capturedDetection.videoWidth, capturedDetection.videoHeight));
      setStep("results");
    }, ANALYSIS_DELAY_MS);
  }, [camera, latestRef]);

  const countdown = useCaptureCountdown({
    seconds: COUNTDOWN_SECONDS,
    active: camera.status === "active" && step === "camera",
    onComplete: handleCapture,
  });

  const handleRetake = useCallback(() => {
    setPhotoDataUrl(null);
    setDetection(null);
    setScores(null);
    setStep("camera");
  }, []);

  const relevantShapes = useMemo(() => (scores ? pickRelevantShapes(scores) : []), [scores]);
  const measurements = useMemo(
    () => (detection ? measureFace(detection.landmarks, detection.videoWidth, detection.videoHeight) : null),
    [detection]
  );

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
              countdown={countdown.remaining}
              onActivate={camera.start}
              onStartCapture={countdown.start}
            />
          )}
          {step === "preview" && photoDataUrl && detection && (
            <CapturePreview photoDataUrl={photoDataUrl} detection={detection} copy={copy} onRetake={handleRetake} />
          )}
          {step === "results" && scores && photoDataUrl && (
            <FaceReport
              photoDataUrl={photoDataUrl}
              scores={scores}
              relevantShapes={relevantShapes}
              recommendations={recommendations}
              measurements={measurements}
              copy={copy}
              onRetake={handleRetake}
            >
              {children}
            </FaceReport>
          )}
        </>
      )}
    </div>
  );
}
