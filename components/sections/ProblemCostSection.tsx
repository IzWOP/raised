"use client";

import { useRef, useEffect } from "react";
import type { Content } from "@/lib/content/types";
import SectionHeader from "@/components/ui/SectionHeader";
import HUDLabel from "@/components/ui/HUDLabel";
import Container from "@/components/ui/Container";
import { useReveal } from "@/lib/useReveal";
import { usePinProgress } from "@/lib/usePinProgress";

// ─── Decorative SVGs (aria-hidden, verbatim from prototype lines 453–496) ────

const vFallSvg = (
  <svg
    width="100%"
    height="56"
    viewBox="0 0 220 56"
    fill="none"
    aria-hidden="true"
    style={{ display: "block", marginBottom: 20 }}
  >
    <path d="M10 38 H88" stroke="#2A2A2A" strokeWidth="1.5" />
    <path d="M132 38 H210" stroke="#2A2A2A" strokeWidth="1.5" />
    <circle
      cx="110"
      cy="12"
      r="4"
      fill="#D9D9D9"
      style={{ animation: "vFall 3.4s cubic-bezier(0.22,1,0.36,1) infinite" }}
    />
    <path d="M88 38 L94 44 M132 38 L126 44" stroke="#5F5F5F" strokeWidth="1" />
  </svg>
);

const vSnapSvg = (
  <svg
    width="100%"
    height="56"
    viewBox="0 0 220 56"
    fill="none"
    aria-hidden="true"
    style={{ display: "block", marginBottom: 20 }}
  >
    <path d="M10 28 H106" stroke="#8C8C8C" strokeWidth="1.5" />
    <circle cx="10" cy="28" r="3" fill="#8C8C8C" />
    <g
      style={{
        transformOrigin: "108px 28px",
        animation: "vSnap 3.6s cubic-bezier(0.22,1,0.36,1) infinite",
      }}
    >
      <path
        d="M110 28 H206"
        stroke="#5F5F5F"
        strokeWidth="1.5"
        strokeDasharray="3 5"
      />
      <circle cx="206" cy="28" r="3" fill="#5F5F5F" />
    </g>
  </svg>
);

const vSpinSvg = (
  <svg
    width="100%"
    height="56"
    viewBox="0 0 220 56"
    fill="none"
    aria-hidden="true"
    style={{ display: "block", marginBottom: 20 }}
  >
    <g
      style={{
        transformOrigin: "110px 28px",
        animation: "vSpin 7s linear infinite",
      }}
    >
      <circle
        cx="110"
        cy="28"
        r="20"
        stroke="#8C8C8C"
        strokeWidth="1.5"
        strokeDasharray="88 38"
      />
      <path
        d="M124 11 L130 14 L123 18"
        stroke="#8C8C8C"
        strokeWidth="1.5"
        fill="none"
      />
    </g>
    <path d="M30 22 H62 M30 30 H56 M30 38 H60" stroke="#2A2A2A" strokeWidth="1.5" />
    <path
      d="M158 22 H190 M164 30 H190 M160 38 H190"
      stroke="#2A2A2A"
      strokeWidth="1.5"
    />
  </svg>
);

const vDecaySvg = (
  <svg
    width="100%"
    height="56"
    viewBox="0 0 220 56"
    fill="none"
    aria-hidden="true"
    style={{ display: "block", marginBottom: 20 }}
  >
    <rect
      x="58"
      y="8"
      width="22"
      height="12"
      rx="2"
      fill="#8C8C8C"
      style={{ animation: "vDecay 3.1s ease-in-out infinite" }}
    />
    <rect
      x="86"
      y="8"
      width="22"
      height="12"
      rx="2"
      fill="#8C8C8C"
      style={{
        animation: "vDecay 4.2s ease-in-out infinite",
        animationDelay: "0.6s",
      }}
    />
    <rect
      x="114"
      y="8"
      width="22"
      height="12"
      rx="2"
      fill="#8C8C8C"
      style={{
        animation: "vDecay 3.7s ease-in-out infinite",
        animationDelay: "1.4s",
      }}
    />
    <rect x="142" y="8" width="22" height="12" rx="2" fill="#2A2A2A" />
    <rect x="58" y="26" width="22" height="12" rx="2" fill="#2A2A2A" />
    <rect
      x="86"
      y="26"
      width="22"
      height="12"
      rx="2"
      fill="#8C8C8C"
      style={{
        animation: "vDecay 5s ease-in-out infinite",
        animationDelay: "0.9s",
      }}
    />
    <rect x="114" y="26" width="22" height="12" rx="2" fill="#2A2A2A" />
    <rect
      x="142"
      y="26"
      width="22"
      height="12"
      rx="2"
      fill="#8C8C8C"
      style={{
        animation: "vDecay 4.5s ease-in-out infinite",
        animationDelay: "2s",
      }}
    />
  </svg>
);

const vignetteIcons = [vFallSvg, vSnapSvg, vSpinSvg, vDecaySvg];

// ─── Card reveal delays (prototype order) ────────────────────────────────────
const vignetteDelays = [0, 90, 60, 150];
const counterDelays = [0, 70, 140, 210];

// ─── Card style shared ───────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: "rgba(26,26,26,0.78)",
  backdropFilter: "blur(12px)",
  border: "1px solid #2A2A2A",
  borderRadius: 16,
  padding: "30px 32px 34px",
  boxShadow: "var(--shadow-inset)",
};

const costCardStyle: React.CSSProperties = {
  background: "#141414",
  border: "1px solid #2A2A2A",
  borderRadius: 16,
  padding: "26px 26px 30px",
  boxShadow: "var(--shadow-inset)",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProblemCostSection({
  problem,
}: {
  problem: Content["problem"];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const costRef = useRef<HTMLDivElement>(null);

  // Refs for counter <span> elements — updated imperatively (no re-render)
  const counterRefs = useRef<(HTMLSpanElement | null)[]>(Array(problem.cost.cards.length).fill(null));
  const lastValues = useRef<string[]>(Array(problem.cost.cards.length).fill(""));

  // I1 — reduced-motion read once and kept in sync via change listener
  const reducedMotionRef = useRef(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mql.matches;
    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useReveal(sectionRef);

  usePinProgress(costRef, (cp) => {
    const reduced = reducedMotionRef.current;
    const e = reduced ? 1 : 1 - Math.pow(1 - cp, 3); // easeOutCubic

    problem.cost.cards.forEach((card, i) => {
      const el = counterRefs.current[i];
      if (!el) return;

      const animated = Math.round(card.value * e);
      // Suffix starting with a space is rendered as a separate sibling span,
      // so we only update the number portion here.
      const prefix = card.prefix ?? "";
      const suffix = card.suffix ?? "";
      const hasSiblingUnit = suffix.startsWith(" ");

      const text = hasSiblingUnit
        ? `${prefix}${animated.toLocaleString()}`
        : `${prefix}${animated.toLocaleString()}${suffix}`;

      if (text !== lastValues.current[i]) {
        lastValues.current[i] = text;
        el.textContent = text;
      }
    });
  });

  return (
    <section
      id="problem"
      ref={sectionRef}
      aria-label="The problem"
      data-scene="problem"
      data-screen-label="02 Problem and Cost"
      style={{ position: "relative", padding: "190px 0 0" }}
    >
      {/* ── A. Problem block ──────────────────────────────────────────────── */}
      <Container>
        <SectionHeader
          eyebrow={problem.eyebrow}
          h2={problem.h2}
          h2Size={46}
          maxWidthH2={700}
          sub={problem.copy}
          maxWidthSub={620}
        />

        {/* Grid heading label */}
        <div
          data-rv=""
          data-rv-delay="240"
          style={{ margin: "72px 0 22px" }}
        >
          <HUDLabel size={12} color="#5F5F5F">
            {problem.gridHeading}
          </HUDLabel>
        </div>

        {/* Vignette cards grid */}
        <div
          data-grid=""
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          {problem.vignettes.map((v, i) => (
            <div
              key={i}
              data-rv=""
              {...(vignetteDelays[i] ? { "data-rv-delay": String(vignetteDelays[i]) } : {})}
              style={cardStyle}
            >
              {vignetteIcons[i] ?? null}
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: "#FFFFFF",
                  margin: 0,
                }}
              >
                {v.title}
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
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </Container>

      {/* ── B. Cost block — sticky pin ────────────────────────────────────── */}
      <div
        ref={costRef}
        data-scene="cost"
        data-pin-outer=""
        style={{ position: "relative", height: "240vh", marginTop: 120 }}
      >
        <div
          data-pin-sticky=""
          style={{
            position: "sticky",
            top: 0,
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            data-container=""
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "60px 40px",
              width: "100%",
            }}
          >
            {/* I2 — cost header via SectionHeader primitive */}
            <SectionHeader
              as="h3"
              eyebrow={problem.cost.eyebrow}
              h2={problem.cost.h3}
              h2Size={38}
              sub={problem.cost.copy}
              maxWidthSub={640}
            />

            {/* Counter cards grid */}
            <div
              data-grid=""
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 20,
                marginTop: 54,
              }}
            >
              {problem.cost.cards.map((card, i) => {
                const suffix = card.suffix ?? "";
                const hasSiblingUnit = suffix.startsWith(" ");
                const prefix = card.prefix ?? "";
                // Initial display text
                const initialText = hasSiblingUnit
                  ? `${prefix}0`
                  : `${prefix}0${suffix}`;

                return (
                  <div
                    key={i}
                    data-rv=""
                    {...(counterDelays[i] ? { "data-rv-delay": String(counterDelays[i]) } : {})}
                    style={costCardStyle}
                  >
                    {/* label */}
                    <HUDLabel size={11} color="#5F5F5F">
                      {card.label}
                    </HUDLabel>

                    {/* number */}
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 44,
                        fontWeight: 500,
                        color: "#FFFFFF",
                        marginTop: 14,
                        lineHeight: 1,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      <span
                        ref={(el) => {
                          counterRefs.current[i] = el;
                        }}
                      >
                        {initialText}
                      </span>
                      {hasSiblingUnit && (
                        <span
                          style={{ fontSize: 17, color: "#8C8C8C" }}
                        >
                          {suffix}
                        </span>
                      )}
                    </div>

                    {/* title */}
                    <h4
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#D9D9D9",
                        margin: "20px 0 0",
                      }}
                    >
                      {card.title}
                    </h4>

                    {/* body */}
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "#8C8C8C",
                        margin: "10px 0 0",
                      }}
                    >
                      {card.body}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* footnote */}
            <div
              data-rv=""
              data-rv-delay="260"
              style={{ marginTop: 26 }}
            >
              <HUDLabel size={10} color="#5F5F5F">
                {problem.cost.footnote}
              </HUDLabel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
