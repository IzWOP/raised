"use client";

import { useEffect, useRef, useState } from "react";
import type { BootLine } from "@/lib/content/types";

// Boot overlay: 3 mono lines at 60/360/660ms, fade at 1050ms (≤1.2s hard cap).
// Skip on click/keydown. Gated to first visit per session in production.
export default function BootSequence({ lines }: { lines: BootLine[] }) {
  const [visible, setVisible] = useState(true);
  const [shown, setShown] = useState<number>(0);
  const [fading, setFading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("raised_booted") === "1";
    } catch {}
    if (reduced || seen) {
      setVisible(false);
      return;
    }

    const timers: number[] = [];
    const mark = () => {
      try {
        sessionStorage.setItem("raised_booted", "1");
      } catch {}
    };
    const hide = () => {
      setFading(true);
      mark();
      timers.push(window.setTimeout(() => setVisible(false), 450));
    };

    timers.push(window.setTimeout(() => setShown(1), 60));
    timers.push(window.setTimeout(() => setShown(2), 360));
    timers.push(window.setTimeout(() => setShown(3), 660));
    timers.push(window.setTimeout(hide, 1050));

    const skip = () => hide();
    window.addEventListener("click", skip);
    window.addEventListener("keydown", skip);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("click", skip);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        background: "#000000",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.4s ease",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#8C8C8C",
          display: "flex",
          flexDirection: "column",
          gap: 11,
          minWidth: 360,
        }}
      >
        {lines.map((l, i) => (
          <span
            key={i}
            style={{
              opacity: shown > i ? 1 : 0,
              transition: "opacity 0.18s",
              color: i === 2 ? "#D9D9D9" : undefined,
            }}
          >
            {l.label}
            {l.tail && (
              <>
                {" "}
                <span style={{ color: l.ok ? "#7fae8a" : "#D9D9D9" }}>{l.tail}</span>
              </>
            )}
            {l.caret && (
              <span style={{ animation: "blink 0.8s step-end infinite" }}>_</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
