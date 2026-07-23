"use client";

import { useRef } from "react";
import type { Content } from "@/lib/content/types";
import SectionHeader from "@/components/ui/SectionHeader";
import Container from "@/components/ui/Container";
import { useReveal } from "@/lib/useReveal";

type ClientItem = Content["clients"]["items"][number];

function MarqueeItem({ item, isDupe }: { item: ClientItem; isDupe?: boolean }) {
  return (
    <span
      data-marquee-dupe={isDupe ? "" : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 30,
        padding: "0 30px",
        whiteSpace: "nowrap",
      }}
    >
      {item.logo ? (
        /* decorative marquee logo; next/image adds no value in an aria-hidden track */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.logo}
          alt=""
          style={{
            height: 28,
            width: "auto",
            opacity: 0.65,
            filter: "grayscale(1) brightness(1.4)",
          }}
        />
      ) : (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 15,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#8C8C8C",
          }}
        >
          {item.name}
        </span>
      )}
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
  // duplicated so the -50% translate loops seamlessly (the dupe copy is
  // hidden under prefers-reduced-motion, where the track wraps statically).
  const mid = Math.ceil(clients.items.length / 2);
  const rows = [clients.items.slice(0, mid), clients.items.slice(mid)];
  const animations = ["marqueeL 34s linear infinite", "marqueeR 40s linear infinite"];

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

        {/* The moving tracks are aria-hidden; this static list is the
            screen-reader source of truth for the roster. */}
        <ul className="sr-only">
          {clients.items.map((item) => (
            <li key={item.name}>{item.name}</li>
          ))}
        </ul>

        <div data-rv="" style={{ marginTop: 56 }}>
          <div
            style={{
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
            {rows.map((row, r) => (
              <div
                key={r}
                data-marquee-track
                aria-hidden="true"
                style={{
                  display: "flex",
                  width: "max-content",
                  animation: animations[r],
                }}
              >
                {[false, true].map((isDupe) =>
                  row.map((item, i) => (
                    <MarqueeItem
                      key={`${isDupe ? "d" : "o"}${i}`}
                      item={item}
                      isDupe={isDupe}
                    />
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
