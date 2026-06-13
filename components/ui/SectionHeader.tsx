/**
 * SectionHeader — hairline bar + mono eyebrow + Sora heading + optional sub-copy.
 *
 * All elements carry data-rv (and data-rv-delay) so the parent section's
 * useReveal hook animates them. This component does NOT call useReveal itself.
 *
 * Prototype reference: lines 444–449 (problem), 547–552 (cost), 633–638 (systems).
 */

interface SectionHeaderProps {
  eyebrow: string;
  h2: string;
  sub?: string;
  /** Heading tag — defaults to "h2" */
  as?: "h2" | "h3";
  /** font-size of the heading in px — defaults to 46 */
  h2Size?: number;
  /** max-width of the heading in px */
  maxWidthH2?: number;
  /** max-width of the sub paragraph in px */
  maxWidthSub?: number;
}

export default function SectionHeader({
  eyebrow,
  h2,
  sub,
  as: Tag = "h2",
  h2Size = 46,
  maxWidthH2,
  maxWidthSub,
}: SectionHeaderProps) {
  return (
    <>
      {/* Hairline bar + mono eyebrow */}
      <div
        data-rv=""
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span
          style={{
            display: "block",
            width: 28,
            height: 1,
            background: "rgba(255,255,255,0.25)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8C8C8C",
          }}
        >
          {eyebrow}
        </span>
      </div>

      {/* Heading */}
      <Tag
        data-rv=""
        data-rv-delay="80"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: h2Size,
          letterSpacing: "-0.025em",
          lineHeight: 1.08,
          color: "#FFFFFF",
          margin: "24px 0 0",
          ...(maxWidthH2 != null ? { maxWidth: maxWidthH2 } : {}),
        }}
      >
        {h2}
      </Tag>

      {/* Optional sub-copy */}
      {sub != null && (
        <p
          data-rv=""
          data-rv-delay="160"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 17,
            lineHeight: 1.6,
            color: "#8C8C8C",
            margin: "24px 0 0",
            ...(maxWidthSub != null ? { maxWidth: maxWidthSub } : {}),
          }}
        >
          {sub}
        </p>
      )}
    </>
  );
}
