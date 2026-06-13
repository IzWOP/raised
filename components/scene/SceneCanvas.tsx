"use client";

import { Canvas } from "@react-three/fiber";
import Field from "./Field";

export default function SceneCanvas({
  frameloop,
}: {
  frameloop: "always" | "demand" | "never";
}) {
  return (
    <Canvas
      orthographic
      frameloop={frameloop}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 100], near: 0.1, far: 1000, zoom: 1 }}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%" }}
    >
      <Field />
    </Canvas>
  );
}
