"use client";

import { useState } from "react";

// ─── Component ────────────────────────────────────────────────────────────────
// Accessible FAQ accordion — Task 7b.
// Renders inside AuditSection whose useReveal(sectionRef) already covers
// all data-rv descendants; do NOT call useReveal here.

export default function FaqAccordion({
  h3,
  items,
}: {
  h3: string;
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div id="faq" data-scene="faq" style={{ margin: "160px 0 0" }}>
      {/* Heading */}
      <h3
        data-rv=""
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 38,
          fontWeight: 700,
          letterSpacing: "-0.025em",
          lineHeight: 1.1,
          color: "#FFFFFF",
          margin: "0 0 44px",
        }}
      >
        {h3}
      </h3>

      {/* Accordion list */}
      <div data-rv="" data-rv-delay="120" style={{ maxWidth: 980 }}>
        {items.map((item, i) => {
          const isOpen = open === i;
          const isLast = i === items.length - 1;

          return (
            <div
              key={item.q}
              style={{
                position: "relative",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                ...(isLast
                  ? { borderBottom: "1px solid rgba(255,255,255,0.08)" }
                  : {}),
                paddingLeft: 20,
              }}
            >
              {/* Progress line (decorative) */}
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

              {/* Question button — semantic, keyboard-native */}
              <button
                id={`faq-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                data-cursor="VIEW"
                onClick={() => setOpen(isOpen ? null : i)}
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
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: "#FFFFFF",
                  }}
                >
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 16,
                    color: "#8C8C8C",
                    flexShrink: 0,
                    transition: "transform 0.4s var(--ease-brand)",
                    transform: `rotate(${isOpen ? 45 : 0}deg)`,
                  }}
                >
                  +
                </span>
              </button>

              {/* Answer panel — grid-template-rows 0fr→1fr for a11y-safe height animation */}
              <div
                role="region"
                aria-labelledby={`faq-q-${i}`}
                id={`faq-panel-${i}`}
                style={{
                  display: "grid",
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                  transition: "grid-template-rows 0.55s var(--ease-brand)",
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 15.5,
                      lineHeight: 1.65,
                      color: "#8C8C8C",
                      margin: 0,
                      padding: "0 60px 26px 0",
                    }}
                  >
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
