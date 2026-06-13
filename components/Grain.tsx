"use client";

// SVG-turbulence film grain (prototype: opacity 0.028, grain 7s steps(8)).
const GRAIN_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='280' height='280' filter='url(%23n)'/%3E%3C/svg%3E";

export default function Grain() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: "-60%",
        width: "220%",
        height: "220%",
        zIndex: 60,
        pointerEvents: "none",
        opacity: 0.028,
        animation: "grain 7s steps(8) infinite",
        backgroundImage: `url("${GRAIN_URI}")`,
      }}
    />
  );
}
