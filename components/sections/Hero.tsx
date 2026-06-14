"use client";

import { useEffect, useRef } from "react";
import type { Content } from "@/lib/content/types";
import CTAButton from "../ui/CTAButton";

export default function Hero({
  hero,
  hud,
}: {
  hero: Content["hero"];
  hud: Content["hud"];
}) {
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);

  // Eyebrow typewriter only. The H1 / sub / CTA reveals are pure CSS
  // (see .hero-line / .hero-fade in globals.css) so the headline is ALWAYS
  // visible even if JS never runs or GSAP fails — its base state is visible and
  // the entrance is an additive animation.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const eb = eyebrowRef.current;
    const caret = caretRef.current;

    if (reduced) {
      if (eb) eb.textContent = hero.eyebrow;
      if (caret) caret.style.display = "none";
      return;
    }

    let typeTimer: number | undefined;
    let hideTimer: number | undefined;
    let startTimer: number | undefined;
    if (eb) {
      const full = hero.eyebrow;
      eb.textContent = "";
      startTimer = window.setTimeout(() => {
        let i = 0;
        typeTimer = window.setInterval(() => {
          i++;
          eb.textContent = full.slice(0, i);
          if (i >= full.length) {
            clearInterval(typeTimer);
            hideTimer = window.setTimeout(() => {
              if (caret) caret.style.display = "none";
            }, 2200);
          }
        }, 16);
      }, 1080);
    }

    return () => {
      clearInterval(typeTimer);
      clearTimeout(hideTimer);
      clearTimeout(startTimer);
    };
  }, [hero.eyebrow]);

  const corner = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    width: 26,
    height: 26,
    ...pos,
  });

  return (
    <section
      id="hero"
      aria-label="Hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 40px 100px",
      }}
    >
      {/* corner brackets */}
      <div style={corner({ top: 96, left: 36, borderLeft: "1px solid rgba(255,255,255,0.22)", borderTop: "1px solid rgba(255,255,255,0.22)" })} />
      <div style={corner({ top: 96, right: 36, borderRight: "1px solid rgba(255,255,255,0.22)", borderTop: "1px solid rgba(255,255,255,0.22)" })} />
      <div style={corner({ bottom: 36, left: 36, borderLeft: "1px solid rgba(255,255,255,0.22)", borderBottom: "1px solid rgba(255,255,255,0.22)" })} />
      <div style={corner({ bottom: 36, right: 36, borderRight: "1px solid rgba(255,255,255,0.22)", borderBottom: "1px solid rgba(255,255,255,0.22)" })} />

      {/* bottom-left HUD status */}
      <div data-hero-hud="" style={{ position: "absolute", bottom: 48, left: 76, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ display: "block", width: 6, height: 6, borderRadius: "50%", background: "#7fae8a", animation: "pulse 2.4s ease-in-out infinite" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#5F5F5F" }}>
          {hud.status}
        </span>
      </div>

      {/* bottom-right scroll cue */}
      <div data-hero-hud="" style={{ position: "absolute", bottom: 48, right: 76, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#5F5F5F" }}>
          {hud.scroll}
        </span>
        <span style={{ display: "block", width: 1, height: 28, background: "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0))", animation: "pulse 2s ease-in-out infinite" }} />
      </div>

      <div style={{ maxWidth: 1000, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8C8C8C", minHeight: 18 }}>
          <span ref={eyebrowRef}>{hero.eyebrow}</span>
          <span ref={caretRef} style={{ color: "#D9D9D9", animation: "blink 0.9s step-end infinite" }}>_</span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(44px, 4.9vw, 72px)",
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            color: "#FFFFFF",
            margin: "30px 0 0",
            textWrap: "balance",
          }}
        >
          {hero.h1.map((line, i) => (
            <span key={i} style={{ display: "block", overflow: "hidden", paddingBottom: "0.08em" }}>
              <span
                className="hero-line"
                style={{ display: "block", animationDelay: `${1.18 + i * 0.12}s` }}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="hero-fade"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 18,
            lineHeight: 1.55,
            color: "#8C8C8C",
            maxWidth: 680,
            margin: "28px 0 0",
            animationDelay: "1.55s",
          }}
        >
          {hero.sub}
        </p>

        <div className="hero-fade" style={{ marginTop: 40, animationDelay: "1.72s" }}>
          <CTAButton label={hero.cta} href="#audit" variant="hero" />
        </div>
      </div>
    </section>
  );
}
