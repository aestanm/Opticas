/**
 * Componente para mostrar estados de carga
 */

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin">
        <svg
          className="h-8 w-8 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    </div>
  );
}

interface ErrorMessageProps {
  message?: string;
}

export function ErrorMessage({ message = "Algo salió mal" }: ErrorMessageProps) {
  return (
    <div className="rounded-md bg-destructive/10 p-4 text-destructive">
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

interface SuccessMessageProps {
  message?: string;
}

export function SuccessMessage({
  message = "Operación exitosa",
}: SuccessMessageProps) {
  return (
    <div className="rounded-md bg-green-50 p-4 text-green-700">
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

export function EmptyState({
  title = "Sin datos",
  description = "No hay información para mostrar",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <svg
        className="h-12 w-12 text-muted-foreground mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
