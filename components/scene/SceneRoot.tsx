"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { pointer, sceneFlags } from "@/lib/scene/store";
import SceneFallback from "./SceneFallback";

// R3F must be client-only.
const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

type Mode = "loading" | "webgl" | "fallback";

function detectWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export default function SceneRoot() {
  const [mode, setMode] = useState<Mode>("loading");
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sceneFlags.reduced = reduced;

    const decide = () => {
      const mobile = window.matchMedia("(max-width: 1023px)").matches;
      if (mobile || !detectWebGL()) {
        setMode("fallback");
      } else {
        setMode("webgl");
      }
    };
    decide();

    const mq = window.matchMedia("(max-width: 1023px)");
    const onChange = () => decide();
    mq.addEventListener("change", onChange);

    // mouse parallax (prototype: normalised -1..1)
    const onMouse = (e: MouseEvent) => {
      pointer.mx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // pause rendering when tab hidden (HANDOFF §5)
    const onVis = () => setFrameloop(document.hidden ? "never" : "always");
    document.addEventListener("visibilitychange", onVis);

    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  if (mode === "fallback") return <SceneFallback />;
  if (mode === "webgl") {
    // reduced motion → render a single static lattice frame
    return (
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <SceneCanvas frameloop={sceneFlags.reduced ? "demand" : frameloop} />
      </div>
    );
  }
  // loading: solid black so there's never a flash
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, background: "#000" }} />
  );
}
