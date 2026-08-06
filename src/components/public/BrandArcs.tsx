/**
 * Arcos decorativos redondeados, al estilo de las piezas de marca de Óptica Guillén
 * (usar dentro de un contenedor con `relative overflow-hidden`)
 */

interface BrandArcsProps {
  color?: string;
}

export function BrandArcs({ color = "#5EEAD4" }: BrandArcsProps) {
  return (
    <>
      <svg
        className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 opacity-40"
        viewBox="0 0 160 160"
        fill="none"
        aria-hidden="true"
      >
        <path d="M10 90 A 80 80 0 0 1 90 10" stroke={color} strokeWidth="16" strokeLinecap="round" />
      </svg>
      <svg
        className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 opacity-40"
        viewBox="0 0 160 160"
        fill="none"
        aria-hidden="true"
      >
        <path d="M70 150 A 80 80 0 0 0 150 70" stroke={color} strokeWidth="16" strokeLinecap="round" />
      </svg>
    </>
  );
}
