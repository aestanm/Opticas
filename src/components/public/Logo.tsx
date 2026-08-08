/**
 * Logo de Óptica Guillén — a partir del archivo real (public/images/gallery/IMG_2819.JPG),
 * procesado para tener fondo transparente:
 * - logo.png: versión a color (navy/teal), para fondos claros
 * - logo-white.png: versión en blanco, para fondos oscuros (navy/teal)
 */

import Link from "next/link";

interface LogoProps {
  variant?: "dark" | "light";
  imgHeight?: number;
  className?: string;
}

export function Logo({ variant = "dark", imgHeight = 48, className = "" }: LogoProps) {
  const src = variant === "light" ? "/images/logo-white.png" : "/images/logo.png";

  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Óptica Guillén"
        style={{ height: imgHeight }}
        className="w-auto object-contain"
      />
    </Link>
  );
}
