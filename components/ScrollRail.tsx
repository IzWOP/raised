"use client";

import { useEffect, useState } from "react";
import type { RailTick } from "@/lib/content/types";

// Vertical progress rail (prototype): active = section top < 45% vh.
// Active tick → 28px white line + visible label. Hidden < 1100px.
export default function ScrollRail({ ticks }: { ticks: RailTick[] }) {
  const [active, setActive] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onResize = () => setShow(window.innerWidth >= 1100);
    onResize();

    const onScroll = () => {
      const vh = window.innerHeight;
      let a = 0;
      for (let i = 0; i < ticks.length; i++) {
        const el = document.querySelector(ticks[i].href);
        if (el && el.getBoundingClientRect().top <= vh * 0.45) a = i;
      }
      setActive(a);
    };
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [ticks]);

  if (!show) return null;

  return (
    <div
      id="rail"
      style={{
        position: "fixed",
        right: 24,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {ticks.map((t, i) => {
        const on = i === active;
        return (
          <a
            key={t.href}
            href={t.href}
            data-cursor="VIEW"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 10,
              padding: "4px 0",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.18em",
                color: "#8C8C8C",
                opacity: on ? 1 : 0,
                transition: "opacity 0.3s",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </span>
            <span
              style={{
                display: "block",
                width: on ? 28 : 14,
                height: 1,
                background: on ? "#FFFFFF" : "rgba(255,255,255,0.25)",
                transition: "width 0.3s, background 0.3s",
              }}
            />
          </a>
        );
      })}
    </div>
  );
}
