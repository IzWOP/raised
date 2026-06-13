// Shared, mutable scene state read/written every animation frame.
// Deliberately NOT React state: these update at 60fps and must not trigger
// re-renders. The R3F <Field> reads & lerps these inside useFrame, exactly
// like the prototype's single rAF loop (HANDOFF §1).

export interface SceneParams {
  order: number; // 0 = chaos, 1 = ordered lattice (THE TURN)
  degrade: number; // 0..1 signal degradation
  dim: number; // 0..1 calm-wireframe luminance dip
  breathe: number; // 0..1 final breathe
  orbit: number; // 0..1 → process-section camera orbit
}

export const sceneParams: SceneParams = {
  order: 0,
  degrade: 0,
  dim: 0,
  breathe: 0,
  orbit: 0,
};

export const pointer = {
  mx: 0,
  my: 0,
  smx: 0,
  smy: 0,
};

export const sceneFlags = {
  reduced: false,
  /** raised while menus/overlays want the scene effectively frozen */
  paused: false,
};

/** smoothstep-friendly clamp used throughout the state machine */
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
