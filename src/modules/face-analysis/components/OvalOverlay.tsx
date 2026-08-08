import type { GuidanceStatus } from "../types";

const STATUS_COLOR: Record<GuidanceStatus, string> = {
  "no-face": "#94a3b8",
  "too-close": "#f59e0b",
  "too-far": "#f59e0b",
  "off-center": "#f59e0b",
  good: "#0d9488",
};

export function OvalOverlay({ status }: { status: GuidanceStatus }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <ellipse
        cx="50"
        cy="48"
        rx="28"
        ry="38"
        fill="none"
        stroke={STATUS_COLOR[status]}
        strokeWidth="2.5"
        strokeDasharray={status === "good" ? undefined : "5 4"}
        className="transition-[stroke] duration-300"
      />
    </svg>
  );
}
