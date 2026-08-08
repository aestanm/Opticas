"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CameraStatus } from "../types";

export interface UseCameraResult {
  videoRef: React.RefObject<HTMLVideoElement>;
  status: CameraStatus;
  isSupported: boolean;
  start: () => Promise<void>;
  stop: () => void;
}

export function useCamera(): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  // Optimista por defecto (coincide con el HTML renderizado en el servidor, donde `navigator` no
  // existe): la gran mayoría de visitantes sí tiene la API disponible, así que asumirlo evita un
  // parpadeo de "no compatible" en cada carga; si realmente no está disponible, el efecto lo corrige.
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(!!navigator.mediaDevices?.getUserMedia);
  }, []);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus("idle");
  }, []);

  const start = useCallback(async () => {
    if (!isSupported) {
      setStatus("unsupported");
      return;
    }
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("active");
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      if (name === "NotAllowedError") setStatus("denied");
      else if (name === "NotFoundError") setStatus("no-device");
      else if (name === "NotReadableError") setStatus("in-use");
      else setStatus("error");
    }
  }, [isSupported]);

  useEffect(() => stop, [stop]);

  return { videoRef, status, isSupported, start, stop };
}
