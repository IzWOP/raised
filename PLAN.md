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
Phases 0–5 (Tasks 1–10) ✅ code-complete, built via subagent-driven development with
two-stage review (spec + code quality) per task. `npm run build` clean (`/en` + `/es` SSG,
proxy middleware). Scene state machine wired (Phase 2 folded into the real sections —
`#problem`/`#systems`/`#proof`/`#process`/`#final` anchors live). i18n functionally verified
(redirects, geo, locale rendering, hreflang, cookie). Mobile responsive verified via computed
styles (grids stack, beats unpin, no horizontal overflow).

Known not-yet-done: Lighthouse not measured (needs a real browser / deploy preview);
scene motion + reveals + magnetic CTA not visually verified (preview MCP is a hidden tab —
no rAF/WebGL). Phase 6 (deploy) pending. Booking URL still a placeholder (`#audit`/`#final`).

### Review Loop result (section mode — reconcile build vs PLAN/HANDOFF/KICKOFF)
Done-condition: all 8 sections present + content-driven + correctly anchored; scene state
machine matches §1; §2 effects have production equivalents; tokens §4 exact; a11y/§5; i18n §8;
automated gates clean; zero P0/P1/P2.

- **Automated gate:** `tsc` clean · `eslint .` 0 problems · `next build` clean (`/en`+`/es` SSG, proxy) · no secrets/`any`/`console`.
- **Holistic audit (opus):** 0 P0, 0 P1. Verdict: ship-ready at code level.
- **P2 findings — all resolved:**
  - P2-1 ScrollTrigger not used (Lenis rAF + rect-driven params) → **ACCEPTED**: deliberate faithful-prototype port; the "match prototype 1:1" guardrail overrides §2's prescribed mechanism. Behavior is correct.
  - P2-2 unused `next-intl` → **removed** (7bdf48c).
  - P2-3 reduced-motion showed chaos not final lattice → **fixed** (5136515).
  - P2-4 mobile fallback lacked CSS-animated packets → **fixed** (5136515).
  - (Also fixed: 9 latent eslint errors in Phase-1 chrome files — 9a30816.)
- **P3:** clamp 18/12 and rail 1100px both MATCH the prototype (source of truth) → no change. §1 "8×6×4" prose is a doc typo; code correctly uses 8×5×4=160.
- **Known-unverified (environmental, NOT failures):** Lighthouse not measured (needs deploy preview / real browser); scene live motion not visually confirmed (preview MCP is a headless hidden tab — no rAF/WebGL). Recommend a real-browser pass before launch.

**Gate status: PASS (code level).** Remaining before launch: Phase 6 deploy, real booking URL, Lighthouse + real-browser motion pass.

---

## R3 — Lean restructure (mobile-length reduction)

Design-chat verdict: 8 sections → **6 blocks** to cut mobile length. Implemented via the
understand → build (impl/review/fix per component) → integrate → adversarial review pipeline.

**Structure change:** Hero (#hero, drop support line, mobile type −~30%) → **The Cost** (#problem,
counters-only 2×2 on mobile; story vignettes removed) → **Breaks → Fixes** (#systems, NEW
`BreaksFixesSection` — a 5-item accessible accordion merging the old `BreakingSection` +
`SystemsSection`, each item BREAK→FIX with the ported diagnostic SVGs + a CTA) → **Why Raised**
(#why / inner #proof, comparison trimmed to 4/side, receipts 7→5 + mobile scroll-snap carousel,
operator photo/monogram) → **Audit** (#audit, `process` folded in as a compact strip carrying
#process, FAQ top-2 default-open) → **Final CTA** (#final, unchanged). NEW global
`MobileCTABar` (sticky, mobile-only, `data-mobile-cta`).

**Scene:** `lib/scene/params.ts` UNCHANGED — it reads `#problem/#systems/#proof/#process/#final`
by id; the restructure keeps all five present (relocated `#systems` onto the merged section, kept
`#process` on the new strip). THE TURN now happens across the Breaks→Fixes block.

**Content layer:** `types.ts` reshaped — added `breaksFixes`/`BreakFixCard`, `ProcessStep`,
optional `operator.{name,role,photo}`; flattened `problem` (counters only); removed `breaking`,
`systems`, `Vignette`, `Phase`, `hero.support`, nested `problem.cost`, `process.{eyebrow,h2,sub,
phases,ongoing*}`. EN + ES both updated in lockstep (rail 8→6 ticks, nav anchors valid).

**Deleted:** `BreakingSection.tsx`, `SystemsSection.tsx`, `ProcessSection.tsx`, and
`lib/usePinProgress.ts` (orphaned after the pinned sections were removed).

### Review Loop result (R3)
- **Automated gate:** `tsc` clean · `eslint .` 0/0 · `next build` clean (`/en`+`/es` SSG, proxy) · runtime curl verified all 6 blocks render in EN+ES, all 5 scene ids present, sticky CTA in DOM, vignettes gone.
- **Adversarial pass (4 dims — scene/responsive, a11y, copy+i18n, regression):** all **SHIP**, 0 P0/0 P1.
- **P2 — both fixed:** (1) ProblemCost heading skip h2→h4 → **h3**; (2) orphaned `usePinProgress` → **deleted**.
- **Mid-integration fix:** count-up was frozen-at-0 (height-dependent pin hook on a short section) → rewritten as an IntersectionObserver + rAF count-up.
- **P3 fixed:** dead `[data-strip-*]`/`[data-pin-*]` CSS removed; sticky-bar/Hero-HUD collision resolved (`[data-hero-hud]` hidden on mobile); glitch-array index given `?? ` fallback.
- **P3 deferred (noted):** THE TURN `order` ramp is front-loaded relative to the now-tall merged section (functional, polish only — could widen `vh*1.5` denom); collapsed accordion panels stay in the a11y tree (consistent with the existing FAQ pattern); mobile receipts carousel isn't keyboard-scrollable (content still in DOM); `resetScramble` in `lib/scramble.ts` is a pre-existing dead export; `nav.cta` uses the short CTA label (intentional brevity).

**Gate status: PASS (code level).** Same pre-launch remainder as above (booking URL, ES native review, Lighthouse + real-browser motion pass).
