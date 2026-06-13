"use client";

import Image from "next/image";
import type { NavContent } from "@/lib/content/types";
import type { Locale } from "@/lib/content/types";
import { scrambleNav } from "@/lib/scramble";
import CTAButton from "./ui/CTAButton";

export default function Nav({
  nav,
  locale = "en",
}: {
  nav: NavContent;
  locale?: Locale;
}) {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        height: 76,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0))",
      }}
    >
      <a
        href="#hero"
        data-cursor="VIEW"
        aria-label="Raised Agency — home"
        style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
      >
        <Image
          src="/brand/logo-A-lockup.png"
          alt="Raised Agency"
          width={49}
          height={34}
          priority
          style={{ display: "block", objectFit: "contain" }}
        />
      </a>

      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        {nav.links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            data-cursor="VIEW"
            onMouseEnter={(e) => scrambleNav(e.currentTarget)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8C8C8C",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            {l.label}
          </a>
        ))}

        {/* Locale toggle — visual only in Phase 1; routing wired in Phase 4 (i18n). */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.16em",
          }}
        >
          <button
            type="button"
            data-cursor="VIEW"
            style={{
              all: "unset",
              cursor: "pointer",
              padding: "4px 7px",
              borderRadius: 5,
              color: locale === "en" ? "#FFFFFF" : "#5F5F5F",
            }}
          >
            EN
          </button>
          <span style={{ color: "#2A2A2A" }}>/</span>
          <button
            type="button"
            data-cursor="VIEW"
            style={{
              all: "unset",
              cursor: "pointer",
              padding: "4px 7px",
              borderRadius: 5,
              color: locale === "es" ? "#FFFFFF" : "#5F5F5F",
            }}
          >
            ES
          </button>
        </div>

        <CTAButton label={nav.cta} href="#audit" variant="nav" />
      </div>
    </nav>
  );
}
