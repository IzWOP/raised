"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Content } from "@/lib/content/types";
import CTAButton from "../ui/CTAButton";

export default function Hero({
  hero,
  hud,
}: {
  hero: Content["hero"];
  hud: Content["hud"];
}) {
  const root = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scope = root.current;
    if (!scope) return;

    const heroEls = Array.from(
      scope.querySelectorAll<HTMLElement>("[data-hero]"),
    );
    const lines = Array.from(scope.querySelectorAll<HTMLElement>("[data-hero-line]"));

    if (reduced) {
      heroEls.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      lines.forEach((el) => (el.style.transform = "none"));
      if (caretRef.current) caretRef.current.style.display = "none";
      return;
    }

    const ctx = gsap.context(() => {
      // mask-reveal H1 lines (translateY 112% → 0)
      lines.forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: 112 },
          {
            yPercent: 0,
            duration: 0.95,
            ease: "power3.out",
            delay: 1.18 + i * 0.12,
          },
        );
      });
      // fade-up the rest
      heroEls.forEach((el) => {
        const delay = Number(el.dataset.hero) / 1000 || 0;
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: "power3.out",
          delay,
        });
      });
    }, scope);

    // eyebrow typewriter (16ms/char, starts at 1080ms, caret hides +2.2s)
    const eb = eyebrowRef.current;
    const caret = caretRef.current;
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
      ctx.revert();
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
      ref={root}
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
      <div style={{ position: "absolute", bottom: 48, left: 76, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ display: "block", width: 6, height: 6, borderRadius: "50%", background: "#7fae8a", animation: "pulse 2.4s ease-in-out infinite" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#5F5F5F" }}>
          {hud.status}
        </span>
      </div>

      {/* bottom-right scroll cue */}
      <div style={{ position: "absolute", bottom: 48, right: 76, display: "flex", alignItems: "center", gap: 10 }}>
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
              <span data-hero-line style={{ display: "block", transform: "translateY(112%)" }}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p
          data-hero="1550"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 18,
            lineHeight: 1.55,
            color: "#8C8C8C",
            maxWidth: 680,
            margin: "28px 0 0",
            opacity: 0,
            transform: "translateY(22px)",
          }}
        >
          {hero.sub}
        </p>

        <div data-hero="1720" style={{ marginTop: 40, opacity: 0, transform: "translateY(22px)" }}>
          <CTAButton label={hero.cta} href="#audit" variant="hero" />
        </div>

        <p
          data-hero="1900"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "#5F5F5F",
            margin: "26px 0 0",
            opacity: 0,
            transform: "translateY(22px)",
          }}
        >
          {hero.support}
        </p>
      </div>
    </section>
  );
}
