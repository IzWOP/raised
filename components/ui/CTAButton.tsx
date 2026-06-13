"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { scrambleReveal } from "@/lib/scramble";

type Variant = "hero" | "nav" | "audit" | "final";

const base: React.CSSProperties = {
  display: "inline-block",
  background: "#FFFFFF",
  color: "#000000",
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  textDecoration: "none",
  whiteSpace: "nowrap",
  borderRadius: "8px",
  willChange: "transform",
};

const variantStyle: Record<Variant, React.CSSProperties> = {
  hero: {
    fontSize: "16px",
    padding: "17px 34px",
    boxShadow: "var(--shadow-glow)",
  },
  nav: {
    fontSize: "13px",
    padding: "10px 20px",
    boxShadow: "var(--shadow-inset)",
    transition: "box-shadow 0.4s var(--ease-out)",
  },
  audit: {
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "16px",
    padding: "17px 32px",
    boxShadow: "var(--shadow-glow)",
  },
  final: {
    fontSize: "16px",
    padding: "18px 36px",
    animation: "breathe 3.6s ease-in-out infinite",
  },
};

export default function CTAButton({
  label,
  href = "#",
  variant = "hero",
  withArrow = false,
}: {
  label: string;
  href?: string;
  variant?: Variant;
  withArrow?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    xTo.current = gsap.quickTo(ref.current, "x", { duration: 0.3, ease: "power3.out" });
    yTo.current = gsap.quickTo(ref.current, "y", { duration: 0.3, ease: "power3.out" });
  }, []);

  const clamp = (v: number, m: number) => Math.min(m, Math.max(-m, v));

  const onMove = (e: React.MouseEvent) => {
    if (reduced.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = clamp((e.clientX - r.left - r.width / 2) * 0.25, 18);
    const dy = clamp((e.clientY - r.top - r.height / 2) * 0.25, 12);
    xTo.current?.(dx);
    yTo.current?.(dy);
  };
  const onLeave = () => {
    if (!ref.current) return;
    xTo.current?.(0);
    yTo.current?.(0);
    if (variant === "nav") ref.current.style.boxShadow = "var(--shadow-inset)";
  };
  const onEnter = () => {
    if (reduced.current) return;
    if (labelRef.current) scrambleReveal(labelRef.current);
    if (variant === "nav" && ref.current)
      ref.current.style.boxShadow = "var(--shadow-glow)";
  };

  return (
    <a
      ref={ref}
      href={href}
      data-cursor="BOOK"
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ ...base, ...variantStyle[variant] }}
    >
      <span ref={labelRef} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
        {label}
      </span>
      {withArrow && <span aria-hidden="true">→</span>}
    </a>
  );
}
