"use client";

import { useEffect, useState } from "react";

// Lightweight static scene for mobile / no-WebGL (HANDOFF §5).
// Static lattice always visible; SMIL-animated packets layered on top when
// motion is allowed (gated in JS — SMIL ignores the CSS animation-duration:0ms
// override that covers CSS animations under prefers-reduced-motion).

// Packets: each travels along one lattice edge, staggered timing.
interface PacketDef {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dur: number; // seconds
  begin: number; // seconds, stagger offset
}

function buildScene() {
  const cols = 9;
  const rows = 6;
  const pts: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      pts.push({
        x: 8 + (c / (cols - 1)) * 84,
        y: 14 + (r / (rows - 1)) * 72,
      });
    }
  }
  const idx = (c: number, r: number) => r * cols + c;
  const lines: { a: number; b: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c < cols - 1) lines.push({ a: idx(c, r), b: idx(c + 1, r) });
      if (r < rows - 1 && (c + r) % 2 === 0)
        lines.push({ a: idx(c, r), b: idx(c, r + 1) });
    }
  }

  // Pick 6 horizontal-ish edges spread across rows so motion reads clearly.
  // We target specific (col, row) → (col+1, row) horizontal edges.
  const packetSeeds: [number, number, number][] = [
    // [col, row, durSeconds]
    [1, 0, 3.2],
    [4, 1, 2.8],
    [6, 2, 3.6],
    [2, 3, 2.5],
    [5, 4, 3.0],
    [0, 5, 4.0],
    [3, 2, 3.4],
  ];
  const packets: PacketDef[] = packetSeeds.map(([c, r, dur], i) => ({
    x1: pts[idx(c, r)].x,
    y1: pts[idx(c, r)].y,
    x2: pts[idx(Math.min(c + 1, cols - 1), r)].x,
    y2: pts[idx(Math.min(c + 1, cols - 1), r)].y,
    dur,
    begin: i * 0.55, // stagger so they don't move in lockstep
  }));

  return { pts, lines, packets };
}

const scene = buildScene();

export default function SceneFallback() {
  const { pts, lines, packets } = scene;

  // Gate SMIL packet animation behind a JS reduced-motion check.
  // SMIL ignores the CSS `animation-duration: 0ms !important` override, so we
  // must suppress it in JS. Lazy initializer reads the real preference on the
  // client (returns false during SSR where window is unavailable).
  const [showPackets, setShowPackets] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) =>
      setShowPackets(!e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 0, background: "#000" }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block" }}
      >
        {/* Static lattice — always visible */}
        {lines.map((l, i) => (
          <line
            key={i}
            x1={pts[l.a].x}
            y1={pts[l.a].y}
            x2={pts[l.b].x}
            y2={pts[l.b].y}
            stroke="#D9D9D9"
            strokeWidth={0.08}
            opacity={0.12}
          />
        ))}
        {pts.map((p, i) => (
          <rect
            key={i}
            x={p.x - 0.18}
            y={p.y - 0.18}
            width={0.36}
            height={0.36}
            fill="#D9D9D9"
            opacity={0.35}
          />
        ))}

        {/* CSS/SMIL-animated packets — only when motion is allowed */}
        {showPackets &&
          packets.map((pk, i) => (
            <rect
              key={`pk-${i}`}
              width={0.3}
              height={0.3}
              fill="#FFFFFF"
              opacity={0.9}
            >
              <animate
                attributeName="x"
                from={pk.x1 - 0.15}
                to={pk.x2 - 0.15}
                dur={`${pk.dur}s`}
                begin={`${pk.begin}s`}
                repeatCount="indefinite"
                calcMode="linear"
              />
              <animate
                attributeName="y"
                from={pk.y1 - 0.15}
                to={pk.y2 - 0.15}
                dur={`${pk.dur}s`}
                begin={`${pk.begin}s`}
                repeatCount="indefinite"
                calcMode="linear"
              />
            </rect>
          ))}
      </svg>
    </div>
  );
}
