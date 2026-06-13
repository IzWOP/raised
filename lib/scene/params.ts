// Scroll → scene-param state machine. 1:1 port of the prototype's updateParams()
// (HANDOFF §1). Reads section positions from the DOM and lerps the shared params.
// While a section is absent (e.g. Hero-only), top() returns +∞ → that param holds
// at 0, i.e. pure CHAOS — exactly what we want for the Phase 1 checkpoint.

import { sceneParams, pointer, sceneFlags, clamp01 } from "./store";

const BIG = 1e9;

function topOf(id: string): number {
  if (typeof document === "undefined") return BIG;
  const el = document.getElementById(id);
  return el ? el.getBoundingClientRect().top : BIG;
}

export function updateSceneParams(vh: number) {
  const orderT = clamp01((vh - topOf("systems")) / (vh * 1.5));
  const degradeT =
    clamp01((vh * 0.85 - topOf("problem")) / (vh * 0.9)) * (1 - orderT);
  const finalT = clamp01((vh * 0.9 - topOf("final")) / (vh * 0.7));
  const dimT = clamp01((vh * 0.8 - topOf("proof")) / (vh * 0.7)) * (1 - finalT);

  let orbitT = 0;
  if (typeof document !== "undefined") {
    const proc = document.getElementById("process");
    if (proc) {
      const r = proc.getBoundingClientRect();
      orbitT = clamp01((vh - r.top) / (r.height + vh));
    }
  }

  const k = sceneFlags.reduced ? 1 : 0.07;
  const P = sceneParams;
  P.order += (orderT - P.order) * k;
  P.degrade += (degradeT - P.degrade) * k;
  P.dim += (dimT - P.dim) * k;
  P.breathe += (finalT - P.breathe) * k;
  P.orbit += (orbitT - P.orbit) * k;
}

/** smooth the raw mouse position (prototype lerp 0.06) */
export function updatePointer() {
  pointer.smx += (pointer.mx - pointer.smx) * 0.06;
  pointer.smy += (pointer.my - pointer.smy) * 0.06;
}
