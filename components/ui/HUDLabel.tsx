/**
 * HUDLabel — mono label signature: 12px / uppercase / 0.18em letter-spacing.
 * Used for diagnostic tags, eyebrow overrides, and HUD status text.
 */

interface HUDLabelProps {
  children: React.ReactNode;
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function HUDLabel({
  children,
  size = 12,
  color = "#8C8C8C",
  className,
  style,
}: HUDLabelProps) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: size,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
