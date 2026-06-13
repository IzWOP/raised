# Raised Agency v2 — Build Plan

Source of truth: `HANDOFF.md` (spec) + decoded prototype (`Raised Homepage (Standalone).html`).
Stack: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · React Three Fiber + drei · GSAP · Lenis · next-intl.

**Working agreement:** build in phases. Each phase ends at a 🔶 **CHECKPOINT** where I stop and you review before I continue. No big-bang one-shot.

Decisions locked:
- Scene = **R3F render layer driven by the prototype's exact screen-space projection** (1:1 motion, GPU-rendered).
- CTAs = **single configurable content field** (placeholder anchor for now; real booking URL is a one-line edit later).

---

## Phase 0 — Foundation  ✅ DONE
- [x] Scaffold Next 16 + TS + Tailwind v4 + ESLint
- [x] Install R3F, drei, three, gsap, lenis, next-intl
- [x] Brand logos extracted → `public/brand/` (A-lockup, R-lockup)
- [x] Design tokens + prototype keyframes → `app/globals.css` (HANDOFF §4)
- [x] Bilingual content layer (`lib/content/{types,en,es,index}.ts`) — zero hardcoded strings
- [x] Wire `next/font` (Sora / Inter / Geist Mono) in `layout.tsx`

---

## Phase 1 — Scene engine + Hero  ← the hard part, reviewed first
Goal: persistent R3F scene in its **CHAOS** state behind a pixel-faithful Hero.
- `lib/scene/store.ts` — mutable per-frame param store ✅ (started)
- `lib/scene/geometry.ts` — deterministic nodes/edges/packets (prototype `initScene`)
- `components/scene/Field.tsx` — instanced points + LineSegments, per-frame projection
- `components/scene/SceneCanvas.tsx` — R3F Canvas (ortho, dpr [1,2], visibility pause)
- `components/scene/SceneRoot.tsx` — client gate: webgl / reduced-motion / mobile fallback
- `components/SmoothScroll.tsx` — Lenis (lerp 0.08)
- `components/ui/CTAButton.tsx` — white + glow ring + magnetic (gsap.quickTo) + scramble
- `components/ui/Cursor.tsx`, `Nav.tsx`, `ScrollRail.tsx`, `Grain.tsx`, `BootSequence.tsx`
- `components/sections/Hero.tsx` — mask-reveal H1, eyebrow typewriter, HUD frame
- `app/page.tsx` + `layout.tsx` wired
- **Done-criteria:** Hero renders SSR (LCP = H1), scene runs 60fps in chaos, mouse parallax, boot + reveals + magnetic CTA all work; `npm run build` clean.
- 🔶 **CHECKPOINT 1** — review scene fidelity + Hero motion before building anything else.

---

## Phase 2 — Scroll state machine
Goal: wire `order / degrade / dim / breathe / orbit` to scroll ranges (HANDOFF §1).
- `lib/scene/useSceneParams` — port prototype `updateParams()` (rect-driven, lerped)
- Stub section shells with correct ids/heights so the machine has targets
- Verify: CHAOS → DEGRADE → THE TURN (chaos→lattice on Systems) → CALM → BREATHE
- **Done-criteria:** scrubbing the page drives all 5 params; THE TURN lands on Systems.
- 🔶 **CHECKPOINT 2** — confirm choreography matches the prototype.

---

## Phase 3 — Sections (content + markup), in TWO batches
Each section reads from the content layer; reveals via IntersectionObserver/ScrollTrigger.
- **Batch A (heavy motion):** ProblemCostSection (vignette grid + sticky cost pin +
  odometer counters) · BreakingSection (pinned horizontal diagnostic strip + SVG
  self-draw) · SystemsSection (bento + conic-gradient border + fix-tag status flip)
  → 🔶 **CHECKPOINT 3A**
- **Batch B:** WhyRaisedSection (comparison columns + diff-rail + operator record) ·
  ProcessSection (sticky header + phase beats + orbit) · AuditSection (checklist verify +
  deliverables + FAQ accordion, a11y) · FinalCTASection + Footer
  → 🔶 **CHECKPOINT 3B**

---

## Phase 4 — Internationalization (EN / ES)
- `app/[locale]/...` restructure, `middleware.ts` (cookie → geo → Accept-Language → en)
- `<LocaleSwitcher>` (sets `NEXT_LOCALE`, routes), `<html lang>`, hreflang/canonical
- **Done-criteria:** `/en` + `/es` render; ES-region IP defaults to `/es`; toggle persists.
- 🔶 **CHECKPOINT 4**

---

## Phase 5 — Polish, a11y, perf
- `prefers-reduced-motion` (static lattice, no pin/scramble/typewriter)
- Mobile (<1024px) static SVG/canvas fallback scene; disable pin/cursor/rail
- Focus rings, semantic landmarks, FAQ keyboard nav, ≥44px targets
- Lighthouse ≥90 desktop / ≥80 mobile; pause frameloop offscreen
- 🔶 **CHECKPOINT 5**

## Phase 6 — Deploy (Vercel) — when you're ready
- Booking URL swapped in, env, domain, preview → prod.

---

### Current position
Phase 0 ✅ and Phase 1 ✅ code-complete. `npm run build` + `tsc` clean.
At 🔶 **CHECKPOINT 1** — live review in a real browser (preview MCP can't show rAF motion/WebGL).
Awaiting sign-off to start **Phase 2** (scroll state machine).
