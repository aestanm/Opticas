"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseCaptureCountdownArgs {
  seconds?: number;
  /** Solo mientras es `true` se escucha la barra espaciadora y puede correr una cuenta regresiva. */
  active: boolean;
  onComplete: () => void;
}

interface UseCaptureCountdownResult {
  remaining: number | null;
  start: () => void;
}

export function useCaptureCountdown({
  seconds = 3,
  active,
  onComplete,
}: UseCaptureCountdownArgs): UseCaptureCountdownResult {
  const [remaining, setRemaining] = useState<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const start = useCallback(() => {
    if (!active) return;
    // Ignora reintentos mientras ya está corriendo — el botón sigue siempre clickeable, solo no reinicia.
    setRemaining((current) => (current !== null ? current : seconds));
  }, [active, seconds]);

  useEffect(() => {
    if (remaining === null) return;
    if (remaining <= 0) {
      setRemaining(null);
      onCompleteRef.current();
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setRemaining((current) => (current !== null ? current - 1 : null));
    }, 1000);
    return () => window.clearTimeout(timeoutId);
  }, [remaining]);

  // Si deja de estar activo a mitad de cuenta (error de cámara, cambio de paso), se cancela.
  useEffect(() => {
    if (!active) setRemaining(null);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code !== "Space" && event.key !== " ") return;
      event.preventDefault();
      start();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, start]);

  return { remaining, start };
}
