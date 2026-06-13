"use client";

import { useRef } from "react";
import Image from "next/image";
import type { Content } from "@/lib/content/types";
import HUDLabel from "@/components/ui/HUDLabel";
import CTAButton from "@/components/ui/CTAButton";
import { useReveal } from "@/lib/useReveal";

// ─── Component ────────────────────────────────────────────────────────────────

export default function FinalCtaSection({
  finalCta,
  footer,
}: {
  finalCta: Content["finalCta"];
  footer: Content["footer"];
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useReveal(sectionRef);

  return (
    <section
      id="final"
      ref={sectionRef}
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
          } as React.CSSProperties}
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

        {/* CTA wrapper */}
        <div data-rv="" data-rv-delay="200" style={{ marginTop: 44 }}>
          <CTAButton label={finalCta.cta} href="#audit" variant="final" />
        </div>

        {/* Subline */}
        <div data-rv="" data-rv-delay="280">
          <HUDLabel size={12} color="#5F5F5F" style={{ marginTop: 34 }}>
            {finalCta.subline}
          </HUDLabel>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer style={{ marginTop: "auto", padding: "120px 0 44px" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "36px 40px 0",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Image
            src="/brand/logo-R-lockup.png"
            alt="Raised Agency"
            width={76}
            height={52}
            style={{ display: "block", objectFit: "contain" }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <HUDLabel size={11} color="#5F5F5F">
              {footer.domain}
            </HUDLabel>
            <HUDLabel size={11} color="#5F5F5F">
              {footer.copyright}
            </HUDLabel>
          </div>
        </div>
      </footer>
    </section>
  );
}
