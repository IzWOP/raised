"use client";

import { useRef, useEffect } from "react";
import type { Content } from "@/lib/content/types";
import { useReveal } from "@/lib/useReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import HUDLabel from "@/components/ui/HUDLabel";
import StatusDot from "@/components/ui/StatusDot";
import CTAButton from "@/components/ui/CTAButton";
import Container from "@/components/ui/Container";
import FaqAccordion from "@/components/sections/FaqAccordion";

// ─── Constants ────────────────────────────────────────────────────────────────

const VERIFY_BASE_MS = 140;
const VERIFY_STAGGER_MS = 110;

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuditSection({
  audit,
  process,
}: {
  audit: Content["audit"];
  process: Content["process"];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  useReveal(sectionRef);

  // ── Checklist verify (port of initAudit) ──────────────────────────────────
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const okRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!items.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasIO = typeof IntersectionObserver !== "undefined";

    const verify = (i: number, delay: number) => {
      const id = setTimeout(() => {
        const dot = dotRefs.current[i];
        const label = labelRefs.current[i];
        const ok = okRefs.current[i];
        if (dot) {
          dot.style.background = "#7fae8a";
          dot.style.borderColor = "transparent";
          dot.style.boxShadow = "0 0 8px rgba(127,174,138,0.5)";
        }
        if (label) label.style.color = "#D9D9D9";
        if (ok) ok.style.opacity = "1";
      }, delay);
      timeoutsRef.current.push(id);
    };

    if (reduced || !hasIO) {
      items.forEach((_, i) => verify(i, 0));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target as HTMLDivElement;
          const i = items.indexOf(el);
          verify(i, VERIFY_BASE_MS + i * VERIFY_STAGGER_MS);
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -15% 0px" },
    );

    items.forEach((el) => io.observe(el));

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      io.disconnect();
    };
  }, []);

  // ── Shared styles ─────────────────────────────────────────────────────────
  const deliverableCardStyle: React.CSSProperties = {
    border: "1px solid #2A2A2A",
    borderRadius: 16,
    padding: "34px 38px 38px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#101010",
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), " +
      "linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
    backgroundSize: "24px 24px",
    boxShadow: "var(--shadow-inset)",
  };

  return (
    <section
      id="audit"
      ref={sectionRef}
      aria-label="Operations audit"
      data-scene="audit"
      data-screen-label="07 Operations Audit"
      style={{ position: "relative", padding: "170px 0" }}
    >
      <Container>
        {/* ── Section header ──────────────────────────────────────────────── */}
        <SectionHeader
          eyebrow={audit.eyebrow}
          h2={audit.h2}
          h2Size={44}
          sub={audit.copy}
          maxWidthSub={680}
        />

        {/* ── Process strip (scene reads #process → ORBIT) ──────────────────── */}
        <div id="process" data-rv="" style={{ margin: "52px 0 0" }}>
          <HUDLabel size={12} color="#8C8C8C">
            {process.label}
          </HUDLabel>
          <div
            data-grid=""
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${process.steps.length}, 1fr)`,
              gap: 1,
              marginTop: 20,
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              overflow: "hidden",
              background: "rgba(255,255,255,0.08)",
            }}
          >
            {process.steps.map((step, i) => (
              <div
                key={step.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  padding: "20px 22px",
                  backgroundColor: "#0B0B0B",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    color: "#5F5F5F",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#D9D9D9",
                  }}
                >
                  {step.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: "#8C8C8C",
                  }}
                >
                  {step.body}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main grid ───────────────────────────────────────────────────── */}
        <div
          data-grid=""
          style={{
            display: "grid",
            gridTemplateColumns: "7fr 5fr",
            gap: 24,
            marginTop: 60,
            alignItems: "stretch",
          }}
        >
          {/* ── LEFT: terminal checklist card ─────────────────────────────── */}
          <div
            data-rv=""
            style={{
              background: "#0B0B0B",
              border: "1px solid #2A2A2A",
              borderRadius: 16,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "var(--shadow-inset)",
            }}
          >
            {/* Card header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 22px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <StatusDot status="ok" pulse pulseDur={2.4} size={7} />
              <HUDLabel size={12} color="#8C8C8C" style={{ marginLeft: 10 }}>
                {audit.terminalTitle}
              </HUDLabel>
            </div>

            {/* Checklist body */}
            <div
              style={{
                padding: "4px 28px 10px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {audit.checklist.map((item, i) => {
                const isLast = i === audit.checklist.length - 1;
                return (
                  <div
                    key={item}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    style={{
                      flex: 1,
                      minHeight: 54,
                      display: "flex",
                      alignItems: "center",
                      gap: 18,
                      ...(!isLast
                        ? { borderBottom: "1px solid rgba(255,255,255,0.06)" }
                        : {}),
                    }}
                  >
                    {/* Status dot (animates on verify) */}
                    <span
                      ref={(el) => {
                        dotRefs.current[i] = el;
                      }}
                      style={{
                        display: "block",
                        width: 9,
                        height: 9,
                        border: "1px solid #2A2A2A",
                        borderRadius: "50%",
                        transition: "all 0.4s",
                        flexShrink: 0,
                      }}
                    />
                    {/* Label */}
                    <span
                      ref={(el) => {
                        labelRefs.current[i] = el;
                      }}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 16,
                        color: "#8C8C8C",
                        transition: "color 0.4s",
                        flex: 1,
                      }}
                    >
                      {item}
                    </span>
                    {/* OK checkmark */}
                    <span
                      ref={(el) => {
                        okRefs.current[i] = el;
                      }}
                      aria-hidden="true"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.18em",
                        color: "#7fae8a",
                        opacity: 0,
                        transition: "opacity 0.4s",
                      }}
                    >
                      ✓
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT column ─────────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* Deliverables label */}
            <div data-rv="">
              <HUDLabel size={12} color="#8C8C8C" style={{ padding: "15px 0 1px" }}>
                {audit.deliverablesLabel}
              </HUDLabel>
            </div>

            {/* Deliverable cards */}
            {audit.deliverables.map((deliverable, i) => (
              <div
                key={deliverable.tag}
                data-rv=""
                data-rv-delay={i === 0 ? "80" : "160"}
                style={deliverableCardStyle}
              >
                <HUDLabel size={11} color="#5F5F5F">
                  {deliverable.tag}
                </HUDLabel>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 26,
                    fontWeight: 600,
                    letterSpacing: "-0.015em",
                    color: "#FFFFFF",
                    margin: "16px 0 0",
                  }}
                >
                  {deliverable.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: "#8C8C8C",
                    margin: "12px 0 0",
                  }}
                >
                  {deliverable.body}
                </p>
              </div>
            ))}

            {/* CTA */}
            <div data-rv="" data-rv-delay="240">
              <CTAButton
                label={audit.cta}
                href="#final"
                variant="audit"
                withArrow
              />
            </div>

            {/* Pricing — renders nothing when empty or whitespace-only */}
            {audit.pricing?.trim() ? (
              <HUDLabel size={11} color="#5F5F5F">
                {audit.pricing}
              </HUDLabel>
            ) : null}
          </div>
        </div>

        {/* FAQ accordion */}
        <FaqAccordion
          h3={audit.faq.h3}
          items={audit.faq.items}
          defaultOpen={[0, 1]}
        />
      </Container>
    </section>
  );
}
