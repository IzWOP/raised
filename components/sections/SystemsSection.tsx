"use client";

import { useRef, useEffect } from "react";
import type { Content } from "@/lib/content/types";
import SectionHeader from "@/components/ui/SectionHeader";
import HUDLabel from "@/components/ui/HUDLabel";
import { useReveal } from "@/lib/useReveal";

// ─── Per-card layout constants (prototype lines 640–699) ─────────────────────
interface CardSpec {
  span: number;
  minHeight: number;
  h3Size: number;
  pSize: number;
  padding: string;
  delay: number;
}

const CARD_SPECS: CardSpec[] = [
  { span: 3, minHeight: 230, h3Size: 23, pSize: 15,   padding: "32px 34px 36px", delay: 0   },
  { span: 3, minHeight: 230, h3Size: 23, pSize: 15,   padding: "32px 34px 36px", delay: 80  },
  { span: 2, minHeight: 250, h3Size: 20, pSize: 14.5, padding: "30px 30px 34px", delay: 0   },
  { span: 2, minHeight: 250, h3Size: 20, pSize: 14.5, padding: "30px 30px 34px", delay: 70  },
  { span: 2, minHeight: 250, h3Size: 20, pSize: 14.5, padding: "30px 30px 34px", delay: 140 },
];

// ─── Status color helpers ─────────────────────────────────────────────────────
const STATUS_COLOR: Record<"warn" | "crit", string> = {
  warn: "#c9b072",
  crit: "#c08585",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function SystemsSection({
  systems,
}: {
  systems: Content["systems"];
}) {
  const sectionRef = useRef<HTMLElement>(null);

  // One ref per card overlay div (conic-gradient "current" layer)
  const overlayRefs = useRef<(HTMLDivElement | null)[]>(
    Array(systems.cards.length).fill(null),
  );

  // One ref per fix-dot span
  const dotRefs = useRef<(HTMLSpanElement | null)[]>(
    Array(systems.cards.length).fill(null),
  );

  // ── Fix-dot flip — port of initFixes() ────────────────────────────────────
  useEffect(() => {
    const dots = dotRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!dots.length) return;

    const flip = (d: HTMLSpanElement, delay: number) => {
      const id = window.setTimeout(() => {
        d.style.background = "#7fae8a";
        d.style.boxShadow = "0 0 8px rgba(127,174,138,0.5)";
      }, delay);
      return id;
    };

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hasIO = typeof IntersectionObserver !== "undefined";

    const timeouts: number[] = [];

    if (reduced || !hasIO) {
      dots.forEach((d) => timeouts.push(flip(d, 0)));
      return () => timeouts.forEach(clearTimeout);
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          timeouts.push(flip(en.target as HTMLSpanElement, 600));
          io.unobserve(en.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    dots.forEach((d) => io.observe(d));

    return () => {
      io.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, []);

  useReveal(sectionRef);

  return (
    <section
      id="systems"
      ref={sectionRef}
      data-scene="systems"
      data-screen-label="04 Systems We Build"
      style={{ position: "relative", padding: "46vh 0 170px" }}
    >
      {/* Interstitial floating label */}
      <div
        data-rv=""
        style={{
          position: "absolute",
          top: "18vh",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#5F5F5F",
        }}
      >
        {systems.interstitial}
      </div>

      {/* Inner container */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        <SectionHeader
          eyebrow={systems.eyebrow}
          h2={systems.h2}
          h2Size={46}
          sub={systems.sub}
          maxWidthSub={660}
        />

        {/* Bento grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 20,
            marginTop: 60,
          }}
        >
          {systems.cards.map((card, i) => {
            const spec = CARD_SPECS[i];
            const fromColor =
              STATUS_COLOR[card.fixes.from as "warn" | "crit"] ?? "#c9b072";
            const fromLabel = card.fixes.from === "crit" ? "CRIT" : "WARN";

            return (
              <div
                key={card.tag}
                data-rv=""
                {...(spec.delay ? { "data-rv-delay": String(spec.delay) } : {})}
                onMouseEnter={() => {
                  const el = overlayRefs.current[i];
                  if (el) el.style.opacity = "1";
                }}
                onMouseLeave={() => {
                  const el = overlayRefs.current[i];
                  if (el) el.style.opacity = "0";
                }}
                style={{
                  gridColumn: `span ${spec.span}`,
                  position: "relative",
                  borderRadius: 16,
                  padding: 1,
                  background: "#2A2A2A",
                  overflow: "hidden",
                }}
              >
                {/* Conic-gradient "current" overlay — toggled on hover */}
                <div
                  ref={(el) => {
                    overlayRefs.current[i] = el;
                  }}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: "-60%",
                    background:
                      "conic-gradient(from 0deg, transparent 0deg, rgba(217,217,217,0.7) 38deg, transparent 76deg)",
                    animation: "spin 3.6s linear infinite",
                    opacity: 0,
                    transition: "opacity 0.5s",
                  }}
                />

                {/* Inner card */}
                <div
                  style={{
                    position: "relative",
                    background: "#141414",
                    borderRadius: 15,
                    padding: spec.padding,
                    minHeight: spec.minHeight,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Tag label */}
                  <HUDLabel size={11} color="#5F5F5F">
                    {card.tag}
                  </HUDLabel>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: spec.h3Size,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      color: "#FFFFFF",
                      margin: "16px 0 0",
                    }}
                  >
                    {card.title}
                  </h3>

                  {/* Body */}
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: spec.pSize,
                      lineHeight: 1.6,
                      color: "#8C8C8C",
                      margin: "14px 0 0",
                    }}
                  >
                    {card.body}
                  </p>

                  {/* Fix-tag row */}
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: 22,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    {/* Left: dot + fixes tag */}
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span
                        ref={(el) => {
                          dotRefs.current[i] = el;
                        }}
                        style={{
                          display: "block",
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: fromColor,
                          transition:
                            "background 0.8s ease, box-shadow 0.8s ease",
                          flexShrink: 0,
                        }}
                      />
                      <HUDLabel size={10} color="#5F5F5F">
                        {card.fixes.tag}
                      </HUDLabel>
                    </span>

                    {/* Right: WARN/CRIT → OK status text */}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                      }}
                    >
                      <span style={{ color: fromColor }}>{fromLabel}</span>
                      <span style={{ color: "#5F5F5F" }}> → </span>
                      <span style={{ color: "#7fae8a" }}>OK</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
