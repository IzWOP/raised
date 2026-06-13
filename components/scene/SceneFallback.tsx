"use client";

// Lightweight static scene for mobile / no-WebGL (HANDOFF §5).
// A faint, ordered lattice frame — no per-frame work. Placeholder fidelity;
// the full CSS-animated packet version lands in the Phase 5 polish pass.
export default function SceneFallback() {
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
      </svg>
    </div>
  );
}
