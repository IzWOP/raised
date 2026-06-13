"use client";

import { useRef, useEffect } from "react";
import type { Content } from "@/lib/content/types";
import SectionHeader from "@/components/ui/SectionHeader";
import HUDLabel from "@/components/ui/HUDLabel";
import StatusDot from "@/components/ui/StatusDot";
import { useReveal } from "@/lib/useReveal";
import { usePinProgress } from "@/lib/usePinProgress";
import { clamp01 } from "@/lib/scene/store";

// ─── Pulse durations per card index (verbatim from prototype) ────────────────
const PULSE_DURS = [2, 1.6, 2.2, 1.8, 2.4];

// ─── Unique diagnostic SVGs — verbatim from prototype lines 560–622 ──────────
// Each path that self-draws carries data-draw="".

const DiagSvg0 = () => (
  <svg
    width="100%"
    height={90}
    viewBox="0 0 230 90"
    fill="none"
    aria-hidden="true"
    style={{ display: "block", marginBottom: 22 }}
  >
    <circle cx={18} cy={45} r={4} stroke="#5F5F5F" strokeWidth={1} />
    <path
      data-draw=""
      pathLength={100}
      d="M26 45 H100"
      stroke="#D9D9D9"
      strokeWidth={1}
      style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
    />
    <path
      data-draw=""
      pathLength={100}
      d="M100 45 L180 16 M100 45 L180 45 M100 45 L180 74"
      stroke="#D9D9D9"
      strokeWidth={1}
      style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
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
    style={{ display: "block", marginBottom: 22 }}
  >
    <path
      data-draw=""
      pathLength={100}
      d="M14 76 H56 V60 H98 V44 H140 V28 H182 V14 H216"
      stroke="#D9D9D9"
      strokeWidth={1}
      style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
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
    style={{ display: "block", marginBottom: 22 }}
  >
    <path
      data-draw=""
      pathLength={100}
      d="M14 64 L56 28 L98 64 L140 28 L182 64 L216 36"
      stroke="#D9D9D9"
      strokeWidth={1}
      style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
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
    style={{ display: "block", marginBottom: 22 }}
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
      style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
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
    style={{ display: "block", marginBottom: 22 }}
  >
    <rect x={14} y={28} width={56} height={34} rx={4} stroke="#5F5F5F" strokeWidth={1} />
    <rect x={160} y={28} width={56} height={34} rx={4} stroke="#5F5F5F" strokeWidth={1} />
    <path
      data-draw=""
      pathLength={100}
      d="M70 45 C100 45 100 20 115 20 C130 20 130 45 160 45"
      stroke="#D9D9D9"
      strokeWidth={1}
      style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
    />
    <path d="M152 41 L160 45 L152 49" stroke="#D9D9D9" strokeWidth={1} />
  </svg>
);

const DIAG_SVGS = [DiagSvg0, DiagSvg1, DiagSvg2, DiagSvg3, DiagSvg4];

// ─── Shared card style ───────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  width: 430,
  flexShrink: 0,
  background: "#141414",
  border: "1px solid #2A2A2A",
  borderRadius: 16,
  padding: "28px 30px 32px",
  boxShadow: "var(--shadow-inset)",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function BreakingSection({
  breaking,
}: {
  breaking: Content["breaking"];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Ref to the last card element so we can read its offsetLeft/offsetWidth
  const lastCardRef = useRef<HTMLDivElement>(null);
  // Refs to each card's SVG wrapper element so we can query [data-draw] paths
  const cardSvgRefs = useRef<(HTMLDivElement | null)[]>(
    Array(breaking.cards.length).fill(null),
  );

  // Read reduced-motion once on mount (spec: "decide once on mount").
  // Store in a ref (no setState) and imperatively patch the DOM — this avoids
  // both the setState-in-effect lint error and an extra render cycle.
  const reducedMotionRef = useRef(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mql.matches;

    if (mql.matches) {
      // Patch layout: section height → auto, strip sticky → relative, track wraps
      if (sectionRef.current) sectionRef.current.style.height = "auto";
      if (stickyRef.current) {
        stickyRef.current.style.position = "relative";
        stickyRef.current.style.height = "auto";
      }
      if (trackRef.current) {
        trackRef.current.style.flexWrap = "wrap";
        trackRef.current.style.width = "100%";
      }
      // Reveal all SVG paths immediately (dashoffset → 0)
      cardSvgRefs.current.forEach((wrapper) => {
        if (!wrapper) return;
        wrapper.querySelectorAll<SVGPathElement>("[data-draw]").forEach((p) => {
          p.style.strokeDashoffset = "0";
        });
      });
    }

    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useReveal(sectionRef);

  usePinProgress(sectionRef, (sp) => {
    if (reducedMotionRef.current) return;

    const track = trackRef.current;
    const last = lastCardRef.current;
    if (!track || !last) return;

    // Horizontal scrub: center the last card at sp=1
    const shift = Math.max(
      0,
      last.offsetLeft + last.offsetWidth / 2 - window.innerWidth / 2,
    );
    track.style.transform = `translate3d(${(-sp * shift).toFixed(1)}px, 0, 0)`;

    // SVG self-draw: stagger reveal per card
    const n = breaking.cards.length; // 5
    cardSvgRefs.current.forEach((wrapper, i) => {
      if (!wrapper) return;
      const start = (i / n) * 0.72;
      const off = 1 - clamp01((sp - start) / 0.2);
      const v = (100 * off).toFixed(1);
      wrapper.querySelectorAll<SVGPathElement>("[data-draw]").forEach((p) => {
        p.style.strokeDashoffset = v;
      });
    });
  });

  return (
    <section
      id="breaking"
      ref={sectionRef}
      data-scene="breaking"
      data-strip-outer=""
      data-screen-label="03 Where Growth Breaks"
      style={{
        position: "relative",
        height: "340vh",
      }}
    >
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Header */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 40px",
            width: "100%",
          }}
        >
          <SectionHeader
            eyebrow={breaking.eyebrow}
            h2={breaking.h2}
            h2Size={44}
            maxWidthH2={760}
            sub={breaking.sub}
            maxWidthSub={620}
          />
        </div>

        {/* Horizontal strip track */}
        <div
          ref={trackRef}
          data-strip-track=""
          style={{
            display: "flex",
            gap: 24,
            padding: "52px 40px 0",
            width: "max-content",
            willChange: "transform",
          }}
        >
          {breaking.cards.map((card, i) => {
            const SvgComp = DIAG_SVGS[i];
            const isLast = i === breaking.cards.length - 1;
            const statusColor = card.status === "warn" ? "#c9b072" : "#c08585";
            const statusLabel = card.status === "warn" ? "WARN" : "CRIT";

            return (
              <div
                key={i}
                data-diag-card=""
                ref={isLast ? lastCardRef : undefined}
                style={cardStyle}
              >
                {/* Top row: tag + status indicator */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 22,
                  }}
                >
                  <HUDLabel size={11} color="#5F5F5F">
                    {card.tag}
                  </HUDLabel>
                  <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <StatusDot
                      status={card.status}
                      pulse
                      pulseDur={PULSE_DURS[i]}
                    />
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
                </div>

                {/* SVG wrapper — we hold a ref here to query [data-draw] paths */}
                <div
                  ref={(el) => {
                    cardSvgRefs.current[i] = el;
                  }}
                >
                  {SvgComp && <SvgComp />}
                </div>

                {/* Card text */}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: "#FFFFFF",
                    margin: 0,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: "#8C8C8C",
                    margin: "12px 0 0",
                  }}
                >
                  {card.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
