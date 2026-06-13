"use client";

import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing initial state from browser capability check (pointer:fine) that cannot run during SSR
    setEnabled(true);
    document.body.dataset.cursorActive = "1";

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let hover = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      }
      const target = (e.target as HTMLElement)?.closest?.(
        "[data-cursor]",
      ) as HTMLElement | null;
      const nextHover = !!target;
      if (nextHover !== hover) {
        hover = nextHover;
        if (ringRef.current) {
          ringRef.current.style.width = hover ? "64px" : "34px";
          ringRef.current.style.height = hover ? "64px" : "34px";
          ringRef.current.style.borderColor = hover
            ? "rgba(217,217,217,0.9)"
            : "rgba(217,217,217,0.4)";
        }
      }
      if (labelRef.current) {
        labelRef.current.textContent = target?.dataset.cursor ?? "";
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      delete document.body.dataset.cursorActive;
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#FFFFFF",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: "1px solid rgba(217,217,217,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "width 0.3s var(--ease-out), height 0.3s var(--ease-out), border-color 0.3s",
        }}
      >
        <span
          ref={labelRef}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.18em",
            color: "#D9D9D9",
            textTransform: "uppercase",
          }}
        />
      </div>
    </div>
  );
}
