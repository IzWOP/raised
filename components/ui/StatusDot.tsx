/**
 * StatusDot — a small circular indicator for diagnostic status.
 * Colors: ok #7fae8a, warn #c9b072, crit #c08585 (BUILD_NOTES §tokens).
 * Pulse uses the `pulse` keyframe already defined in globals.css.
 */

import type { Status } from "@/lib/content/types";

export const STATUS_COLOR: Record<Status, string> = {
  ok: "#7fae8a",
  warn: "#c9b072",
  crit: "#c08585",
};

export const STATUS_LABEL: Record<Status, string> = {
  ok: "OK",
  warn: "WARN",
  crit: "CRIT",
};

interface StatusDotProps {
  status: Status;
  size?: number;
  pulse?: boolean;
  pulseDur?: number;
  style?: React.CSSProperties;
}

export default function StatusDot({
  status,
  size = 6,
  pulse = false,
  pulseDur = 2,
  style,
}: StatusDotProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: STATUS_COLOR[status],
        flexShrink: 0,
        ...(pulse
          ? { animation: `pulse ${pulseDur}s ease-in-out infinite` }
          : {}),
        ...style,
      }}
    />
  );
}
