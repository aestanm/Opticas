export function ModuleErrorState({
  message,
  retryLabel,
  onRetry,
}: {
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-6 py-8 text-center">
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full border border-red-200 px-4 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          {retryLabel ?? "Reintentar"}
        </button>
      )}
    </div>
  );
}
