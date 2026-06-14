"use client";

import { useRef, useEffect } from "react";
import type { Content } from "@/lib/content/types";
import SectionHeader from "@/components/ui/SectionHeader";
import HUDLabel from "@/components/ui/HUDLabel";
import Container from "@/components/ui/Container";
import { useReveal } from "@/lib/useReveal";

// ─── Card reveal delays (prototype order) ────────────────────────────────────
const counterDelays = [0, 70, 140, 210];

// Count-up duration (ms). Triggered once when the grid scrolls into view.
const COUNT_DURATION = 1100;

// ─── Card style ──────────────────────────────────────────────────────────────
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
  const gridRef = useRef<HTMLDivElement>(null);

  // Refs for counter <span> elements — updated imperatively (no re-render).
  const counterRefs = useRef<(HTMLSpanElement | null)[]>(
    Array(problem.cards.length).fill(null),
  );

  useReveal(sectionRef);

  // Count-up: a one-shot animation fired by an IntersectionObserver when the
  // grid enters view. This is height-independent (the section is shorter than
  // the viewport, so a scroll-pin progress hook would never fire).
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const setText = (i: number, value: number) => {
      const el = counterRefs.current[i];
      if (!el) return;
      const card = problem.cards[i];
      const prefix = card.prefix ?? "";
      const suffix = card.suffix ?? "";
      // A suffix starting with a space is rendered as a separate sibling span,
      // so we only write the number (+ prefix) into the counted span here.
      const hasSiblingUnit = suffix.startsWith(" ");
      el.textContent = hasSiblingUnit
        ? `${prefix}${value.toLocaleString()}`
        : `${prefix}${value.toLocaleString()}${suffix}`;
    };

    let raf = 0;
    const runCountUp = () => {
      if (reduced) {
        problem.cards.forEach((card, i) => setText(i, card.value));
        return;
      }
      let start = 0;
      const tick = (ts: number) => {
        if (!start) start = ts;
        const t = Math.min(1, (ts - start) / COUNT_DURATION);
        const e = 1 - Math.pow(1 - t, 3); // easeOutCubic
        problem.cards.forEach((card, i) => setText(i, Math.round(card.value * e)));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      runCountUp();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            runCountUp();
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(grid);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [problem.cards]);

  return (
    <section
      id="problem"
      ref={sectionRef}
      aria-label="The cost"
      data-scene="problem"
      data-screen-label="02 The Cost"
      style={{ position: "relative", padding: "190px 0 0" }}
    >
      {/* ── The Cost ──────────────────────────────────────────────────────── */}
      <Container>
        <SectionHeader
          eyebrow={problem.eyebrow}
          h2={problem.h2}
          h2Size={46}
          maxWidthH2={700}
          sub={problem.copy}
          maxWidthSub={620}
        />

        {/* Counter cards grid */}
        <div
          ref={gridRef}
          data-cost-grid=""
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            marginTop: 54,
          }}
        >
          {problem.cards.map((card, i) => {
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

                {/* title — h3 (under the section h2; avoids a heading-level skip) */}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#D9D9D9",
                    margin: "20px 0 0",
                  }}
                >
                  {card.title}
                </h3>

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
            {problem.footnote}
          </HUDLabel>
        </div>
      </Container>
    </section>
  );
}
