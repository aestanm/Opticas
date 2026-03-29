/**
 * Componente Card reutilizable
 * Contenedor base para organizar contenido
 */

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function Card({
  children,
  className = "",
  title,
  description,
}: CardProps) {
  return (
    <div
      className={`
        rounded-lg border border-border bg-card text-card-foreground
        shadow-sm p-6
        ${className}
      `}
    >
      {title && (
        <>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
          )}
        </>
      )}
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return <div className={`mb-6 ${className}`}>{children}</div>;
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = "" }: CardBodyProps) {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div className={`flex items-center justify-between mt-6 pt-4 border-t border-border ${className}`}>
      {children}
    </div>
  );
}
