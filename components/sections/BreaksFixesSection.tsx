"use client";

import { useRef, useState } from "react";
import type { Content } from "@/lib/content/types";
import SectionHeader from "@/components/ui/SectionHeader";
import HUDLabel from "@/components/ui/HUDLabel";
import StatusDot, { STATUS_COLOR, STATUS_LABEL } from "@/components/ui/StatusDot";
import CTAButton from "@/components/ui/CTAButton";
import Container from "@/components/ui/Container";
import { useReveal } from "@/lib/useReveal";

// ─── Unique diagnostic SVGs — ported verbatim from BreakingSection ───────────
// Each path that "self-draws" carries data-draw="". The horizontal scrub that
// formerly animated the dashoffset is gone (no pin/scrub here), so each path is
// drawn statically to its full length (strokeDashoffset 0) — the SVG simply
// appears with the panel as it expands.

const DiagSvg0 = () => (
  <svg
    width="100%"
    height={90}
    viewBox="0 0 230 90"
    fill="none"
    aria-hidden="true"
    style={{ display: "block", maxWidth: "100%", marginBottom: 22 }}
  >
    <circle cx={18} cy={45} r={4} stroke="#5F5F5F" strokeWidth={1} />
    <path
      data-draw=""
      pathLength={100}
      d="M26 45 H100"
      stroke="#D9D9D9"
      strokeWidth={1}
      style={{ strokeDasharray: 100, strokeDashoffset: 0 }}
    />
    <path
      data-draw=""
      pathLength={100}
      d="M100 45 L180 16 M100 45 L180 45 M100 45 L180 74"
      stroke="#D9D9D9"
      strokeWidth={1}
      style={{ strokeDasharray: 100, strokeDashoffset: 0 }}
    />
    <rect x={184} y={10} width={12} height={12} rx={2} stroke="#5F5F5F" strokeWidth={1} />
    <rect x={184} y={39} width={12} height={12} rx={2} stroke="#5F5F5F" strokeWidth={1} />
    <rect x={184} y={68} width={12} height={12} rx={2} stroke="#5F5F5F" strokeWidth={1} />
  </svg>
);

const DiagSvg1 = () => (
  <svg
    width="100%"
    height={90}
    viewBox="0 0 230 90"
    fill="none"
    aria-hidden="true"
    style={{ display: "block", maxWidth: "100%", marginBottom: 22 }}
  >
    <path
      data-draw=""
      pathLength={100}
      d="M14 76 H56 V60 H98 V44 H140 V28 H182 V14 H216"
      stroke="#D9D9D9"
      strokeWidth={1}
      style={{ strokeDasharray: 100, strokeDashoffset: 0 }}
    />
    <circle
      cx={119}
      cy={44}
      r={4}
      fill="#c08585"
      style={{ animation: "pulse 1.6s ease-in-out infinite" }}
    />
    <path
      d="M119 52 V70"
      stroke="#5F5F5F"
      strokeWidth={1}
      strokeDasharray="2 3"
    />
  </svg>
);

const DiagSvg2 = () => (
  <svg
    width="100%"
    height={90}
    viewBox="0 0 230 90"
    fill="none"
    aria-hidden="true"
    style={{ display: "block", maxWidth: "100%", marginBottom: 22 }}
  >
    <path
      data-draw=""
      pathLength={100}
      d="M14 64 L56 28 L98 64 L140 28 L182 64 L216 36"
      stroke="#D9D9D9"
      strokeWidth={1}
      style={{ strokeDasharray: 100, strokeDashoffset: 0 }}
    />
    <rect x={50} y={22} width={12} height={12} rx={2} stroke="#5F5F5F" strokeWidth={1} />
    <rect x={134} y={22} width={12} height={12} rx={2} stroke="#5F5F5F" strokeWidth={1} />
    <rect x={92} y={58} width={12} height={12} rx={2} stroke="#5F5F5F" strokeWidth={1} />
    <rect x={176} y={58} width={12} height={12} rx={2} stroke="#5F5F5F" strokeWidth={1} />
  </svg>
);

const DiagSvg3 = () => (
  <svg
    width="100%"
    height={90}
    viewBox="0 0 230 90"
    fill="none"
    aria-hidden="true"
    style={{ display: "block", maxWidth: "100%", marginBottom: 22 }}
  >
    <path
      d="M14 78 H216 M14 78 V12"
      stroke="#2A2A2A"
      strokeWidth={1}
    />
    <path
      data-draw=""
      pathLength={100}
      d="M14 66 L62 42 L110 54 L158 22 L216 32"
      stroke="#D9D9D9"
      strokeWidth={1}
      style={{ strokeDasharray: 100, strokeDashoffset: 0 }}
    />
    <path
      d="M158 22 V78"
      stroke="#5F5F5F"
      strokeWidth={1}
      strokeDasharray="2 3"
    />
  </svg>
);

const DiagSvg4 = () => (
  <svg
    width="100%"
    height={90}
    viewBox="0 0 230 90"
    fill="none"
    aria-hidden="true"
    style={{ display: "block", maxWidth: "100%", marginBottom: 22 }}
  >
    <rect x={14} y={28} width={56} height={34} rx={4} stroke="#5F5F5F" strokeWidth={1} />
    <rect x={160} y={28} width={56} height={34} rx={4} stroke="#5F5F5F" strokeWidth={1} />
    <path
      data-draw=""
      pathLength={100}
      d="M70 45 C100 45 100 20 115 20 C130 20 130 45 160 45"
      stroke="#D9D9D9"
      strokeWidth={1}
      style={{ strokeDasharray: 100, strokeDashoffset: 0 }}
    />
    <path d="M152 41 L160 45 L152 49" stroke="#D9D9D9" strokeWidth={1} />
  </svg>
);

const DIAG_SVGS = [DiagSvg0, DiagSvg1, DiagSvg2, DiagSvg3, DiagSvg4];

// ─── Shared text styles ──────────────────────────────────────────────────────
const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 15,
  lineHeight: 1.6,
  color: "#8C8C8C",
  margin: 0,
};

// ─── Component ───────────────────────────────────────────────────────────────
// Block 3 — Breaks → Fixes (merged diagnostic sweep + systems). A vertical
// accordion of 5 items, each opening to reveal the diagnostic (the BREAK)
// alongside the system that resolves it (the FIX → OK). No pin/scrub.

export default function BreaksFixesSection({
  breaksFixes,
}: {
  breaksFixes: Content["breaksFixes"];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  // Multiple items may be open independently; index 0 defaults open.
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  useReveal(sectionRef);

  return (
    <section
      id="systems"
      ref={sectionRef}
      aria-label="Where growth breaks, and how we fix it"
      data-scene="systems"
      data-screen-label="03 Breaks → Fixes"
      style={{ position: "relative", padding: "120px 0" }}
    >
      <Container>
        <SectionHeader
          eyebrow={breaksFixes.eyebrow}
          h2={breaksFixes.h2}
          h2Size={46}
          maxWidthH2={760}
          sub={breaksFixes.sub}
          maxWidthSub={660}
        />

        {/* Accordion list */}
        <div
          data-rv=""
          data-rv-delay="120"
          style={{ maxWidth: 980, margin: "56px auto 0" }}
        >
          {breaksFixes.cards.map((card, i) => {
            const isOpen = open.has(i);
            const isLast = i === breaksFixes.cards.length - 1;
            const SvgComp = DIAG_SVGS[i];
            const statusColor = STATUS_COLOR[card.status];
            const statusLabel = STATUS_LABEL[card.status];

            return (
              <div
                key={card.tag}
                style={{
                  position: "relative",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  ...(isLast
                    ? { borderBottom: "1px solid rgba(255,255,255,0.08)" }
                    : {}),
                  paddingLeft: 20,
                }}
              >
                {/* Progress line (decorative) — fills while open */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 1,
                    background: "#D9D9D9",
                    transformOrigin: "top",
                    transition: "transform 0.5s var(--ease-brand)",
                    transform: `scaleY(${isOpen ? 1 : 0})`,
                  }}
                />

                {/* Header row — semantic, keyboard-native button */}
                <button
                  id={`bf-q-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`bf-panel-${i}`}
                  data-cursor="VIEW"
                  onClick={() => toggle(i)}
                  style={{
                    all: "unset" as React.CSSProperties["all"],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 24,
                    width: "100%",
                    padding: "24px 0",
                    boxSizing: "border-box",
                    cursor: "pointer",
                  }}
                >
                  {/* Left: tag + break title */}
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      minWidth: 0,
                    }}
                  >
                    <HUDLabel size={11} color="#5F5F5F">
                      {card.tag}
                    </HUDLabel>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 20,
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        color: "#FFFFFF",
                      }}
                    >
                      {card.breakTitle}
                    </span>
                  </span>

                  {/* Right: status indicator + rotating glyph */}
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 18,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 7 }}
                    >
                      <StatusDot status={card.status} />
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          letterSpacing: "0.18em",
                          color: statusColor,
                        }}
                      >
                        {statusLabel}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 16,
                        color: "#8C8C8C",
                        transition: "transform 0.4s var(--ease-brand)",
                        transform: `rotate(${isOpen ? 45 : 0}deg)`,
                      }}
                    >
                      +
                    </span>
                  </span>
                </button>

                {/* Panel — grid-template-rows 0fr→1fr for a11y-safe height animation.
                    Under prefers-reduced-motion the global rule neutralizes the
                    transition, so an open panel renders instantly. */}
                <div
                  role="region"
                  aria-labelledby={`bf-q-${i}`}
                  id={`bf-panel-${i}`}
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.55s var(--ease-brand)",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    {/* Two columns: BREAK (left) / FIX (right).
                        data-grid auto-stacks to one column below 1024px. */}
                    <div
                      data-grid=""
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 40,
                        padding: "0 0 30px",
                      }}
                    >
                      {/* LEFT — the BREAK */}
                      <div
                        style={{
                          borderRight: "1px solid rgba(255,255,255,0.08)",
                          paddingRight: 40,
                        }}
                      >
                        <HUDLabel
                          size={10}
                          color="#5F5F5F"
                          style={{ display: "block", marginBottom: 18 }}
                        >
                          The break
                        </HUDLabel>
                        {SvgComp && <SvgComp />}
                        <p style={bodyStyle}>{card.breakBody}</p>
                      </div>

                      {/* RIGHT — the FIX */}
                      <div>
                        <HUDLabel
                          size={10}
                          color="#5F5F5F"
                          style={{ display: "block", marginBottom: 18 }}
                        >
                          The fix
                        </HUDLabel>

                        {/* Status transition: WARN/CRIT → OK */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            letterSpacing: "0.18em",
                            marginBottom: 18,
                          }}
                        >
                          <span style={{ color: statusColor }}>
                            {statusLabel}
                          </span>
                          <span style={{ color: "#5F5F5F" }}>→</span>
                          <span style={{ color: "#7fae8a" }}>OK</span>
                          <StatusDot status="ok" style={{ marginLeft: 2 }} />
                        </div>

                        <p style={bodyStyle}>{card.fixBody}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* "Maximum, I'm sold" CTA */}
        <div
          data-rv=""
          data-rv-delay="80"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 48,
          }}
        >
          <CTAButton
            label={breaksFixes.cta}
            href="#audit"
            variant="audit"
            withArrow
          />
        </div>
      </Container>
    </section>
  );
}
