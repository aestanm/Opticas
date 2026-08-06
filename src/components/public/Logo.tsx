/**
 * Logo de Óptica Guillén
 * En fondos claros usa el archivo real del logo (public/images/logo.jpg).
 * En fondos oscuros (navy/teal) usa una recreación en SVG de su versión
 * en línea blanca, ya que el archivo real tiene fondo blanco no transparente.
 */

import Link from "next/link";
import { Sparkles } from "lucide-react";

interface LogoProps {
  variant?: "dark" | "light";
  /** Versión centrada, apilada, con eslogan — solo aplica a variant="light" */
  withTagline?: boolean;
  iconSize?: number;
  imgHeight?: number;
  className?: string;
}

function LogoIcon({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="10" cy="18" r="7.5" stroke="#FFFFFF" strokeWidth="2.5" />
      <path d="M17 16c1.8-2.2 5.2-2.2 7 0" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M33.05 15.43 A 7.5 7.5 0 1 1 33.05 20.57"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M33.05 18 H27" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="1.5" cy="18" r="1.4" fill="#FFFFFF" />
    </svg>
  );
}

export function Logo({ variant = "dark", withTagline = false, iconSize = 34, imgHeight = 40, className = "" }: LogoProps) {
  if (variant === "dark") {
    return (
      <Link href="/" className={`inline-flex items-center ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo.jpg"
          alt="Óptica Guillén"
          style={{ height: imgHeight }}
          className="w-auto object-contain mix-blend-multiply"
        />
      </Link>
    );
  }

  if (withTagline) {
    return (
      <Link href="/" className={`flex flex-col items-center ${className}`}>
        <LogoIcon size={iconSize * 1.6} />
        <span className="mt-2 flex flex-col items-center leading-none">
          <span className="text-xl font-bold tracking-wide text-white">ÓPTICA</span>
          <span className="text-2xl font-semibold italic -mt-1 text-brand-teal-light">Guillén</span>
        </span>
        <span className="mt-2 inline-flex items-center gap-1 text-xs text-slate-200">
          La respuesta a tu salud
          <span className="font-semibold text-brand-teal-light">visual</span>
          <Sparkles size={12} className="text-brand-teal-light" />
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={iconSize} />
      <span className="flex flex-col leading-none">
        <span className="text-sm font-bold tracking-wide text-white">ÓPTICA</span>
        <span className="text-lg font-semibold italic -mt-0.5 text-brand-teal-light">Guillén</span>
      </span>
    </Link>
  );
}
