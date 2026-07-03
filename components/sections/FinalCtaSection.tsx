"use client";

import { useRef } from "react";
import type { Content, Locale } from "@/lib/content/types";
import HUDLabel from "@/components/ui/HUDLabel";
import AuditIntake from "@/components/sections/AuditIntake";
import { useReveal } from "@/lib/useReveal";

// ─── Component ────────────────────────────────────────────────────────────────

export default function FinalCtaSection({
  finalCta,
  locale,
}: {
  finalCta: Content["finalCta"];
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useReveal(sectionRef);

  return (
    <section
      id="final"
      ref={sectionRef}
      aria-label="Get started"
      data-scene="final"
      data-screen-label="08 Final CTA"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "160px 40px 0",
      }}
    >
      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* H2 */}
        <h2
          data-rv=""
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 4vw, 58px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.08,
            color: "#FFFFFF",
            margin: 0,
            textWrap: "balance",
          }}
        >
          {finalCta.h2}
        </h2>

        {/* Copy */}
        <p
          data-rv=""
          data-rv-delay="100"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 17,
            lineHeight: 1.65,
            color: "#8C8C8C",
            maxWidth: 640,
            margin: "28px 0 0",
          }}
        >
          {finalCta.copy}
        </p>

        {/* Intake terminal — the conversion endpoint */}
        <AuditIntake intake={finalCta.intake} locale={locale} />

        {/* Subline */}
        <div data-rv="" data-rv-delay="280">
          <HUDLabel size={12} color="#5F5F5F" style={{ marginTop: 40 }}>
            {finalCta.subline}
          </HUDLabel>
        </div>
      </div>

    </section>
  );
}
