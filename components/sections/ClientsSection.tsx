"use client";

import { useRef } from "react";
import type { Content } from "@/lib/content/types";
import SectionHeader from "@/components/ui/SectionHeader";
import HUDLabel from "@/components/ui/HUDLabel";
import Container from "@/components/ui/Container";
import { useReveal } from "@/lib/useReveal";

// PREVIEW: two candidate treatments rendered together so we can pick one and
// kill the other. Names here are PLACEHOLDERS (fictional) — swap in the real
// roster (or logo files) before this ships to production.

function MarqueeItem({ name }: { name: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 30,
        padding: "0 30px",
        whiteSpace: "nowrap",
        fontFamily: "var(--font-mono)",
        fontSize: 15,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "#8C8C8C",
      }}
    >
      {name}
      <span aria-hidden="true" style={{ color: "#3A3A3A" }}>
        ◇
      </span>
    </span>
  );
}

export default function ClientsSection({
  clients,
}: {
  clients: Content["clients"];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  useReveal(sectionRef);

  // Split into two rows that drift in opposite directions; each row is
  // duplicated so the -50% translate loops seamlessly.
  const mid = Math.ceil(clients.names.length / 2);
  const rowA = clients.names.slice(0, mid);
  const rowB = clients.names.slice(mid);
  const rowALoop = [...rowA, ...rowA];
  const rowBLoop = [...rowB, ...rowB];

  return (
    <section
      id="clients"
      ref={sectionRef}
      aria-label="Worked with"
      data-scene="clients"
      data-screen-label="Worked with"
      style={{ position: "relative", padding: "120px 0" }}
    >
      <Container>
        <SectionHeader
          eyebrow={clients.eyebrow}
          h2={clients.h2}
          h2Size={44}
          maxWidthH2={760}
          sub={clients.sub}
          maxWidthSub={620}
        />

        {/* ── OPTION A — NAME LIST ─────────────────────────────────────────── */}
        <div data-rv="" style={{ marginTop: 56 }}>
          <HUDLabel size={11} color="#5F5F5F">
            OPTION A — NAME LIST
          </HUDLabel>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 1,
              marginTop: 18,
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              overflow: "hidden",
              background: "rgba(255,255,255,0.08)",
            }}
          >
            {clients.names.map((name) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 84,
                  padding: "18px 16px",
                  background: "#0B0B0B",
                  fontFamily: "var(--font-display)",
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: "#D9D9D9",
                  textAlign: "center",
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>

        {/* ── OPTION B — MARQUEE ───────────────────────────────────────────── */}
        <div data-rv="" data-rv-delay="120" style={{ marginTop: 64 }}>
          <HUDLabel size={11} color="#5F5F5F">
            OPTION B — MARQUEE
          </HUDLabel>
          <div
            style={{
              marginTop: 18,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              padding: "30px 0",
              overflow: "hidden",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
              maskImage:
                "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
            }}
          >
            <div
              data-marquee-track
              aria-hidden="true"
              style={{
                display: "flex",
                width: "max-content",
                animation: "marqueeL 34s linear infinite",
              }}
            >
              {rowALoop.map((name, i) => (
                <MarqueeItem key={`a${i}`} name={name} />
              ))}
            </div>
            <div
              data-marquee-track
              aria-hidden="true"
              style={{
                display: "flex",
                width: "max-content",
                animation: "marqueeR 40s linear infinite",
              }}
            >
              {rowBLoop.map((name, i) => (
                <MarqueeItem key={`b${i}`} name={name} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
