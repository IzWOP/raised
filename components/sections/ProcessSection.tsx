"use client";

import { useRef } from "react";
import type { Content } from "@/lib/content/types";
import HUDLabel from "@/components/ui/HUDLabel";
import { useReveal } from "@/lib/useReveal";

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProcessSection({
  process,
}: {
  process: Content["process"];
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useReveal(sectionRef);

  return (
    <section
      id="process"
      ref={sectionRef}
      aria-label="Our process"
      data-scene="process"
      data-screen-label="06 Process"
      style={{ position: "relative", padding: "170px 0 60px" }}
    >
      {/* ── Two-column grid ───────────────────────────────────────────────── */}
      <div
        data-grid=""
        data-container=""
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "380px 1fr",
          gap: 80,
        }}
      >
        {/* ── LEFT: sticky header ─────────────────────────────────────────── */}
        <div>
          <div style={{ position: "sticky", top: 140 }}>
            {/* Eyebrow row */}
            <div
              data-rv=""
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              <span
                style={{
                  display: "block",
                  width: 28,
                  height: 1,
                  background: "rgba(255,255,255,0.25)",
                }}
              />
              <HUDLabel size={12} color="#8C8C8C">
                {process.eyebrow}
              </HUDLabel>
            </div>

            {/* H2 */}
            <h2
              data-rv=""
              data-rv-delay="80"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 42,
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                color: "#FFFFFF",
                margin: "22px 0 0",
              }}
            >
              {process.h2}
            </h2>

            {/* Sub */}
            <p
              data-rv=""
              data-rv-delay="160"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                lineHeight: 1.6,
                color: "#5F5F5F",
                margin: "24px 0 0",
              }}
            >
              {process.sub}
            </p>
          </div>
        </div>

        {/* ── RIGHT: phase beats ──────────────────────────────────────────── */}
        <div>
          {process.phases.map((phase, i) => {
            const isLast = i === process.phases.length - 1;
            return (
              <div
                key={phase.tag}
                data-rv=""
                style={{
                  position: "relative",
                  padding: "60px 0 70px",
                  ...(!isLast
                    ? { borderBottom: "1px solid rgba(255,255,255,0.08)" }
                    : {}),
                }}
              >
                {/* Ghost numeral */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 34,
                    right: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: 120,
                    fontWeight: 700,
                    lineHeight: 1,
                    color: "rgba(255,255,255,0.045)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Mono tag */}
                <HUDLabel size={11} color="#5F5F5F">
                  {phase.tag}
                </HUDLabel>

                {/* Phase title */}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 28,
                    fontWeight: 600,
                    letterSpacing: "-0.015em",
                    color: "#FFFFFF",
                    margin: "18px 0 0",
                  }}
                >
                  {phase.title}
                </h3>

                {/* Phase body */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: "#8C8C8C",
                    margin: "14px 0 0",
                    maxWidth: 520,
                  }}
                >
                  {phase.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Ongoing row ─────────────────────────────────────────────────────── */}
      <div
        data-container=""
        style={{
          maxWidth: 1200,
          margin: "30px auto 0",
          padding: "34px 40px 0",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          data-rv=""
          style={{
            display: "flex",
            gap: 24,
            alignItems: "baseline",
            maxWidth: 860,
          }}
        >
          <HUDLabel size={11} color="#5F5F5F" style={{ flexShrink: 0 }}>
            {process.ongoingLabel}
          </HUDLabel>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15.5,
              lineHeight: 1.6,
              color: "#8C8C8C",
              margin: 0,
            }}
          >
            {process.ongoing}
          </p>
        </div>
      </div>
    </section>
  );
}
