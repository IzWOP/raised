# Build conventions (read this before implementing)

You are building the production Raised Agency site. The **design source of truth** is the
decoded prototype at `reference/prototype.decoded.html` — open it and match it 1:1 (exact
copy, spacing, colors, motion). The spec is `reference/HANDOFF.md`. The phase plan is
`PLAN.md` at repo root.

## Stack
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · React Three
Fiber 9 + drei · GSAP 3 · Lenis. No test framework is installed — this is a visual/motion
site. **Verify your work with `npx tsc --noEmit` and `npx eslint <files-you-touched>`.**
Do NOT run `next build` (a dev server is running and shares `.next`).

## Hard conventions (match existing code — see `components/sections/Hero.tsx`)
1. **Zero hardcoded strings.** All copy comes from the content layer. Import types from
   `@/lib/content/types` and receive content via props (the page passes it down). Never
   inline user-facing text.
2. **Sections are client components** (`"use client"`) when they animate; presentational
   pieces can stay server. Most sections animate → client.
3. **Inline `style={{...}}` objects** that match the prototype's exact px/color values are
   the established pattern (see Hero.tsx, CTAButton.tsx). Use them. Pull colors/easings
   from CSS vars where convenient (`var(--font-mono)`, `var(--ease-brand)`, etc.) but exact
   hex from the prototype is fine too. Tailwind utility classes are OK for trivial layout
   but the prototype's precise values win.
4. **Reduced motion:** every animation must no-op (or become an instant opacity reveal)
   under `prefers-reduced-motion: reduce`. Use the shared `useReveal` hook which already
   handles this.
5. **Accessibility:** one `<h1>` total (Hero owns it) — sections use `<h2>`/`<h3>`. Diagnostic
   status colors (`--color-status-*`) ONLY in diagnostic visuals. Focus rings are global.
   Interactive targets ≥44px. FAQ uses semantic `<button aria-expanded>` + region.

## Design tokens (in `app/globals.css`)
Colors: `--color-page #000`, `--color-secondary #0B0B0B`, `--color-raised #141414`,
`--color-card #1A1A1A`, `--color-border #2A2A2A`, hairline `rgba(255,255,255,0.08)`.
Text: hi `#FFFFFF`, base `#D9D9D9`, mid `#8C8C8C`, low `#5F5F5F`.
Status (diagnostic only): ok `#7fae8a`, warn `#c9b072`, crit `#c08585`.
Fonts: `var(--font-display)` Sora, `var(--font-body)` Inter, `var(--font-mono)` Geist Mono.
Mono label signature: 12px / uppercase / 0.18em letter-spacing.
Easings: `var(--ease-brand)` cubic-bezier(.22,1,.36,1), `var(--ease-out)` cubic-bezier(.16,1,.3,1).
Shadows: `var(--shadow-glow)`, `var(--shadow-inset)`.
**Keyframes already defined** (use by name): riseIn, fadeUp, spin, blink, pulse, grain,
vFall, vSnap, vSpin, vDecay, glitch, breathe.

## The persistent 3D scene (already built — don't touch it, just feed it anchors)
A fixed R3F field sits behind everything (`components/scene/*`). It reads section positions
from the DOM every frame to drive its state (`lib/scene/params.ts`). For the choreography to
work, your sections MUST use these exact element ids:
- `#problem` → ramps the DEGRADE state
- `#systems` → drives THE TURN (chaos→lattice)
- `#proof`   → drives the CALM/DIM state (this is the operator sub-block inside Why Raised)
- `#process` → drives camera ORBIT
- `#final`   → drives BREATHE
Also keep `#breaking`, `#why`, `#audit`, `#faq`, `#hero` ids (nav + scroll-rail anchors).
The scroll rail expects 8 anchors (see `lib/content/en.ts` `rail`).

## Shared primitives (use these; don't reinvent)
- `useReveal()` (`lib/useReveal.ts`) — IntersectionObserver reveal: y 26px→0, opacity 0→1,
  0.85s var(--ease-brand), per-element delay via `data-rv-delay`. Reduced-motion safe.
- `usePinProgress(ref)` (`lib/usePinProgress.ts`) — returns a 0..1 ref for a sticky-pinned
  tall section (ported from the prototype's `pin()`), read it in rAF.
- `<SectionHeader eyebrow h2 sub>` (`components/ui/SectionHeader.tsx`) — hairline + mono
  eyebrow + Sora H2 + optional sub.
- `<HUDLabel>` (`components/ui/HUDLabel.tsx`), `<StatusDot status>` (`components/ui/StatusDot.tsx`).
- `<CTAButton label href variant withArrow>` (`components/ui/CTAButton.tsx`) — variants
  `hero|nav|audit|final`. CTAs point to placeholder anchors for now (e.g. `#final`).

## Prototype line map (in `reference/prototype.decoded.html`)
- Hero: 413–440 · Problem grid: 442–501 · Cost pin: 503–542 · Breaking strip: 544–628
- Systems bento: 630–702 · Why Raised + Proof: 704–768 · Process: 770–815
- Audit + FAQ: 817–926 · Final + Footer: 928–946
- Scene engine / scroll math / interactions: 951–1736 (already ported; reference for values)

## Page assembly
`app/page.tsx` renders sections in order inside the layout's `<main>`. Add your section in
the correct position (Hero · Problem · Breaking · Systems · WhyRaised · Process · Audit · Final).
Each section gets its slice of content, e.g. `<ProblemCostSection problem={content.problem} />`.
