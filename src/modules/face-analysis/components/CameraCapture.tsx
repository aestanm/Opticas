"use client";

import { CountdownOverlay } from "./CountdownOverlay";
import { OvalOverlay } from "./OvalOverlay";
import { ModuleErrorState } from "./states/ModuleErrorState";
import type { CameraStatus, FaceAnalysisCopy, FaceLandmarkerStatus, GuidanceResult } from "../types";

interface CameraCaptureProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  cameraStatus: CameraStatus;
  landmarkerStatus: FaceLandmarkerStatus;
  guidance: GuidanceResult;
  isSupported: boolean;
  copy: FaceAnalysisCopy;
  countdown: number | null;
  onActivate: () => void;
  onStartCapture: () => void;
}

const CAMERA_ERROR_STATUSES: CameraStatus[] = ["denied", "no-device", "in-use", "error"];

export function CameraCapture({
  videoRef,
  cameraStatus,
  landmarkerStatus,
  guidance,
  isSupported,
  copy,
  countdown,
  onActivate,
  onStartCapture,
}: CameraCaptureProps) {
  if (!isSupported) {
    return <ModuleErrorState message={copy.errors.unsupported} />;
  }

  const isActive = cameraStatus === "active";
  const isRequesting = cameraStatus === "requesting";
  const hasError = CAMERA_ERROR_STATUSES.includes(cameraStatus);

  let errorMessage: string | null = null;
  if (cameraStatus === "denied") errorMessage = copy.errors.denied;
  else if (cameraStatus === "no-device") errorMessage = copy.errors.noDevice;
  else if (cameraStatus === "in-use") errorMessage = copy.errors.inUse;
  else if (cameraStatus === "error") errorMessage = copy.errors.generic;

  const statusMessage =
    isActive && landmarkerStatus === "loading" ? copy.analyzingLabel : guidance.message;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl bg-slate-900">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="h-full w-full object-cover [transform:scaleX(-1)]"
        />
        {isActive && <OvalOverlay status={landmarkerStatus === "ready" ? guidance.status : "no-face"} />}
        {isActive && countdown !== null && <CountdownOverlay remaining={countdown} />}
        {isActive && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center px-4">
            <span className="rounded-full bg-black/60 px-3 py-1 text-center text-xs font-medium text-white">
              {statusMessage}
            </span>
          </div>
        )}
        {!isActive && (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-300">
            {isRequesting ? copy.activatingCameraLabel : copy.privacyNotice}
          </div>
        )}
      </div>

      {hasError && errorMessage && (
        <ModuleErrorState message={errorMessage} retryLabel={copy.activateCameraLabel} onRetry={onActivate} />
      )}

      {!isActive && !hasError && (
        <button
          type="button"
          onClick={onActivate}
          disabled={isRequesting}
          className="rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
        >
          {isRequesting ? copy.activatingCameraLabel : copy.activateCameraLabel}
        </button>
      )}

      {isActive && (
        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={onStartCapture}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold text-white transition ${
              guidance.status === "good" ? "bg-teal-600 hover:bg-teal-700" : "bg-slate-500 hover:bg-slate-600"
            }`}
          >
            {copy.captureLabel}
          </button>
          <span className="text-xs text-slate-400">{copy.captureHint}</span>
        </div>
      )}
    </div>
  );
}
