"use client";

import { useRef, useEffect, useState } from "react";
import type { Content } from "@/lib/content/types";
import SectionHeader from "@/components/ui/SectionHeader";
import HUDLabel from "@/components/ui/HUDLabel";
import Container from "@/components/ui/Container";
import { useReveal } from "@/lib/useReveal";
import { clamp01 } from "@/lib/scene/store";

// ── Per-item glitch animation constants (prototype lines 719–724) ─────────────
const GLITCH_DURATIONS = [6.2, 7.4, 5.6, 8.1, 6.8, 7];
const GLITCH_DELAYS    = [0,   1.1, 2.3, 0.6, 3.2, 1.8];

// ── Receipt reveal delays (prototype lines 758–764) ───────────────────────────
const RECEIPT_DELAYS = [0, 50, 100, 150, 200, 250, 300];

// ── Monogram initials — first letter of first + last word, punctuation stripped ─
// e.g. 'Isaac "Izzy" Vazquez' → "IV"; falls back to "R" when no usable name.
function deriveInitials(name?: string): string {
  if (!name) return "R";
  const words = name
    .split(/\s+/)
    .map((w) => w.replace(/[^A-Za-z0-9]/g, ""))
    .filter(Boolean);
  if (words.length === 0) return "R";
  const first = words[0][0] ?? "";
  const last = words.length > 1 ? words[words.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase() || "R";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WhyRaisedSection({
  whyRaised,
}: {
  whyRaised: Content["whyRaised"];
}) {
  const sectionRef   = useRef<HTMLElement>(null);
  const railRef      = useRef<HTMLSpanElement>(null);
  const receiptsRef  = useRef<HTMLDivElement>(null);

  // ── Receipts carousel active index — meaningful only in the mobile carousel.
  //    Derived from scrollLeft on scroll; DOM is only read inside the handler
  //    (SSR-safe). On desktop the track doesn't scroll, so this stays 0.
  const [activeReceipt, setActiveReceipt] = useState(0);

  const onReceiptsScroll = () => {
    const track = receiptsRef.current;
    if (!track) return;
    const first = track.firstElementChild as HTMLElement | null;
    // step = card width + flex gap; guard against zero-width during layout
    const itemWidth = first ? first.offsetWidth + 14 : track.clientWidth;
    if (itemWidth <= 0) return;
    const next = Math.round(track.scrollLeft / itemWidth);
    setActiveReceipt((prev) => (prev === next ? prev : next));
  };

  // ── Diff-rail scroll animation — port of updateDom lines 1227–1231 ──────────
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      rail.style.transform = "scaleY(1)";
      return;
    }

    const update = () => {
      const section = sectionRef.current;
      if (!section || !rail) return;
      const r = section.getBoundingClientRect();
      const p = clamp01((window.innerHeight * 0.85 - r.top) / (r.height * 0.85));
      rail.style.transform = `scaleY(${p.toFixed(3)})`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useReveal(sectionRef);

  return (
    <section
      id="why"
      ref={sectionRef}
      aria-label="Why Raised"
      data-scene="diff"
      data-screen-label="05 Why Raised"
      style={{ position: "relative", padding: "170px 0" }}
    >
      <Container>

        {/* Section header */}
        <SectionHeader
          eyebrow={whyRaised.eyebrow}
          h2={whyRaised.h2}
          h2Size={44}
          maxWidthH2={820}
          sub={whyRaised.intro}
          maxWidthSub={660}
        />

        {/* Comparison grid */}
        <div
          data-grid=""
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            marginTop: 70,
          }}
        >
          {/* ── LEFT column — glitching "typical" side ─────────────────────── */}
          <div
            data-rv=""
            style={{ position: "relative", paddingLeft: 44 }}
          >
            {/* Decorative wavy SVG — verbatim from prototype lines 714–716 */}
            <svg
              width="36"
              height="100%"
              viewBox="0 0 36 560"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                top: 8,
                height: "calc(100% - 16px)",
              }}
            >
              <path
                d="M18 0 C-8 60 44 90 10 140 C-14 180 40 210 14 270 C-6 320 38 350 12 410 C-10 460 36 500 18 560"
                stroke="rgba(255,255,255,0.13)"
                strokeWidth="1"
              />
            </svg>

            {/* Column heading */}
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#5F5F5F",
                marginBottom: 30,
              }}
            >
              {whyRaised.left.heading}
            </div>

            {/* Item list */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: 22 }}
            >
              {whyRaised.left.items.map((item, i) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "baseline",
                    animation: `glitch ${GLITCH_DURATIONS[i] ?? 6}s steps(1) infinite`,
                    animationDelay: `${GLITCH_DELAYS[i] ?? 0}s`,
                  }}
                >
                  {/* Diamond marker — hollow */}
                  <span
                    style={{
                      flexShrink: 0,
                      width: 9,
                      height: 9,
                      border: "1px solid #5F5F5F",
                      transform: "translateY(1px) rotate(45deg)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 15.5,
                      lineHeight: 1.55,
                      color: "#8C8C8C",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Result block */}
            <div
              style={{
                marginTop: 34,
                paddingTop: 22,
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <HUDLabel size={11} color="#5F5F5F">
                {whyRaised.resultLabel}
              </HUDLabel>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 15.5,
                  lineHeight: 1.6,
                  color: "#8C8C8C",
                  margin: "10px 0 0",
                }}
              >
                {whyRaised.left.result}
              </p>
            </div>
          </div>

          {/* ── RIGHT column — clean "Raised" side with diff-rail ───────────── */}
          <div
            data-rv=""
            data-rv-delay="120"
            style={{ position: "relative", paddingLeft: 44 }}
          >
            {/* Animated diff-rail (foreground) */}
            <span
              ref={railRef}
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 17,
                top: 8,
                bottom: 8,
                width: 1,
                background: "#D9D9D9",
                transform: "scaleY(0)",
                transformOrigin: "top",
              }}
            />
            {/* Static rail track (background) */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 17,
                top: 8,
                bottom: 8,
                width: 1,
                background: "rgba(255,255,255,0.1)",
              }}
            />

            {/* Column heading */}
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#D9D9D9",
                marginBottom: 30,
              }}
            >
              {whyRaised.right.heading}
            </div>

            {/* Item list */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: 22 }}
            >
              {whyRaised.right.items.map((item) => (
                <div
                  key={item}
                  style={{ display: "flex", gap: 14, alignItems: "baseline" }}
                >
                  {/* Diamond marker — filled */}
                  <span
                    style={{
                      flexShrink: 0,
                      width: 9,
                      height: 9,
                      background: "#D9D9D9",
                      transform: "translateY(1px) rotate(45deg)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 15.5,
                      lineHeight: 1.55,
                      color: "#D9D9D9",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Result block */}
            <div
              style={{
                marginTop: 34,
                paddingTop: 22,
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <HUDLabel size={11} color="#8C8C8C">
                {whyRaised.resultLabel}
              </HUDLabel>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 15.5,
                  lineHeight: 1.6,
                  color: "#FFFFFF",
                  margin: "10px 0 0",
                }}
              >
                {whyRaised.right.result}
              </p>
            </div>
          </div>
        </div>

        {/* ── Operator sub-block — id="proof" drives the DIM scene state ─────── */}
        <div
          id="proof"
          data-scene="proof"
          style={{ maxWidth: 980, margin: "170px 0 0" }}
        >
          <SectionHeader
            as="h3"
            eyebrow={whyRaised.operator.eyebrow}
            h2={whyRaised.operator.h2}
            h2Size={44}
            maxWidthH2={720}
            sub={whyRaised.operator.copy}
            maxWidthSub={720}
          />

          {/* ── Operator identity — photo (or monogram) + name + role ─────────── */}
          <div
            data-rv=""
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginTop: 44,
            }}
          >
            {whyRaised.operator.photo ? (
              // eslint-disable-next-line @next/next/no-img-element -- optional, swappable operator headshot (possibly remote); fixed 128px dims, avoids next/image remote-pattern config for a placeholder
              <img
                src={whyRaised.operator.photo}
                alt={whyRaised.operator.name ?? "Operator"}
                width={128}
                height={128}
                style={{
                  flexShrink: 0,
                  width: 128,
                  height: 128,
                  borderRadius: 16,
                  border: "1px solid #2A2A2A",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 120,
                  height: 120,
                  background: "#141414",
                  border: "1px solid #2A2A2A",
                  borderRadius: 16,
                  fontFamily: "var(--font-display)",
                  fontSize: 36,
                  color: "#D9D9D9",
                }}
              >
                {deriveInitials(whyRaised.operator.name)}
              </div>
            )}

            {(whyRaised.operator.name || whyRaised.operator.role) && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {whyRaised.operator.name && (
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 16,
                      color: "#FFFFFF",
                    }}
                  >
                    {whyRaised.operator.name}
                  </span>
                )}
                {whyRaised.operator.role && (
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#8C8C8C",
                    }}
                  >
                    {whyRaised.operator.role}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Operator receipts — flat list on desktop; scroll-snap carousel on
              mobile (global CSS keys off data-receipts for overflow + snap). */}
          <div
            ref={receiptsRef}
            data-receipts=""
            onScroll={onReceiptsScroll}
            style={{ marginTop: 40 }}
          >
            {whyRaised.operator.receipts.map((receipt, i) => (
              <div
                key={receipt.tag}
                data-rv=""
                data-rv-delay={String(RECEIPT_DELAYS[i] ?? 0)}
                style={{
                  display: "flex",
                  gap: 24,
                  alignItems: "baseline",
                  padding: "17px 0",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  scrollSnapAlign: "start",
                  ...(i === whyRaised.operator.receipts.length - 1
                    ? { borderBottom: "1px solid rgba(255,255,255,0.08)" }
                    : {}),
                }}
              >
                {/* Tag label */}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    color: "#5F5F5F",
                    flexShrink: 0,
                    width: 44,
                  }}
                >
                  {receipt.tag}
                </span>
                {/* Receipt text */}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "#D9D9D9",
                  }}
                >
                  {receipt.text}
                </span>
              </div>
            ))}
          </div>

          {/* Carousel position counter — only meaningful on mobile; global CSS
              keyed off data-receipts-counter hides it on desktop. */}
          <div
            data-receipts-counter=""
            aria-hidden="true"
            style={{
              marginTop: 14,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "#5F5F5F",
            }}
          >
            {`${activeReceipt + 1} / ${whyRaised.operator.receipts.length}`}
          </div>
        </div>

      </Container>
    </section>
  );
}
