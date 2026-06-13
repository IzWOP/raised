# Raised Agency — Website

Production marketing site for Raised Agency. A single, scroll-driven page with a persistent
WebGL "operational grid" behind the content: a node field that begins as **chaos**, *degrades*
as the page describes broken systems, snaps into an ordered **lattice** at "the systems we
build" (THE TURN), calms through the proof/process sections, and **breathes** at the final CTA.

Bilingual (EN / ES) with locale routing and geo-based default.

---

## Stack

| Concern | Choice |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | **Tailwind CSS v4** (`@theme` tokens) + inline styles for prototype-exact values |
| 3D scene | **React Three Fiber 9** + **three** (instanced points / `LineSegments`) |
| Motion | **GSAP** (magnetic CTA), **Lenis** (smooth scroll), CSS keyframes |
| i18n | `app/[locale]` routing + a typed content layer (`lib/content`), geo middleware (`proxy.ts`) |
| Fonts | `next/font` — Sora (display), Inter (body), Geist Mono (labels) |

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000  → redirects to /en
npm run build    # production build
npm start        # serve the production build
npx tsc --noEmit # typecheck
npx eslint .     # lint
```

> **Heads-up for AI/headless previews:** the scene and entrance animations are
> `requestAnimationFrame`-driven and need a real, foreground, GPU browser. Headless/background
> tabs throttle rAF (and have no WebGL), so the scene falls back to a static SVG lattice and
> motion appears frozen — that's the environment, not a bug. Also, the dev server caches CSS in
> `.next`; after editing `app/globals.css`, `rm -rf .next` for a clean reload.

---

## Project structure

```
app/
  [locale]/layout.tsx     # root layout: fonts, <html lang>, SiteChrome, <main>, generateMetadata (hreflang)
  [locale]/page.tsx       # renders the 8 sections from getContent(locale)
  globals.css             # Tailwind v4 @theme tokens, keyframes, mobile + reduced-motion rules
proxy.ts                  # locale middleware: cookie → geo (x-vercel-ip-country) → Accept-Language → en
lib/
  content/                # the content layer — types.ts, en.ts, es.ts, index.ts (ZERO hardcoded copy)
  scene/                  # geometry.ts (deterministic node field), params.ts (scroll→state), store.ts
  useReveal.ts            # IntersectionObserver reveal hook
  usePinProgress.ts       # sticky-pin scroll progress
  scramble.ts             # nav / CTA text scramble
components/
  scene/                  # SceneRoot (gate), SceneCanvas (R3F), Field (the render loop), SceneFallback
  sections/               # Hero, ProblemCost, Breaking, Systems, WhyRaised, Process, Audit (+FaqAccordion), FinalCta
  ui/                     # CTAButton, Cursor, SectionHeader, HUDLabel, StatusDot, Container
  Nav, ScrollRail, Grain, BootSequence, SmoothScroll, Footer, SiteChrome, LocaleSwitcher
reference/                # HANDOFF.md (spec), KICKOFF.md (brief), prototype.decoded.html (source of truth), BUILD_NOTES.md
```

## The scene (how it works)

A single persistent R3F canvas (`components/scene/`) sits fixed behind all content. The geometry
(160 nodes in an 8×5×4 grid, 2-nearest-neighbour chaos edges, parity lattice edges, 64 packets) is
built once, deterministically, in `lib/scene/geometry.ts`. Every frame, `components/scene/Field.tsx`
reads scroll-driven parameters (`order / degrade / dim / breathe / orbit`) from
`lib/scene/params.ts` — which lerps them from the live positions of the section elements
(`#problem`, `#systems`, `#proof`, `#process`, `#final`) — and updates the GPU buffers using the
prototype's exact screen-space projection. On mobile / no-WebGL / reduced-motion it swaps to
`SceneFallback` (a static SVG lattice).

**Tuning the field size/position:** edit `PROJ_FOCAL` / `PROJ_DIST` at the top of
`components/scene/Field.tsx`. Larger focal &/or smaller distance → the field reads bigger / closer.

## Content & i18n

All copy lives in `lib/content/{en,es}.ts` (same `Content` shape, type-enforced). Components read
their slice via props — **no hardcoded user-facing strings**. Locale is a route segment
(`/en`, `/es`); `proxy.ts` chooses the initial locale (explicit `NEXT_LOCALE` cookie → geo country
→ `Accept-Language` → `en`) and the nav `LocaleSwitcher` persists the choice. `<link rel="alternate"
hreflang>` + canonical are emitted per locale.

## Accessibility

One `<h1>`; sections use `<h2>`/`<h3>`; the FAQ is a semantic `<button aria-expanded>` + `role="region"`
accordion; silver focus rings; the custom cursor is `pointer: fine` only. `prefers-reduced-motion`
disables the boot sequence, scramble, typewriter, parallax, pins and renders the scene as a static
lattice; the Hero `<h1>` is **visible by default** (CSS-only entrance) so it never depends on JS.

---

## Deployment (Vercel)

Auto-detected as Next.js — no config needed. Useful env var:

- `NEXT_PUBLIC_SITE_URL` — absolute base for canonical/hreflang (defaults to `https://raisedagency.com`).

## Configuration TODO before launch

- **Booking URL:** CTAs currently point to in-page anchors (`#audit` / `#final`). Wire the real
  Cal.com / Calendly link — it's a single prop on `CTAButton`.
- **Pricing:** `audit.pricing` in the content layer is intentionally empty (renders nothing); fill when ready.
- **Spanish:** seeded from the prototype in operator voice — have a native speaker review `lib/content/es.ts`.
- **Lighthouse:** target ≥90 desktop / ≥80 mobile — run against a deploy preview.
