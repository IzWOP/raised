# Raised Agency v2 — Claude Code kickoff (for you, personally)

This is the exact path to get **Claude Code** rebuilding the prototype as the real production site. The prototype (`Raised Homepage.dc.html`) is the design source of truth; `HANDOFF.md` is the full spec. Hand Claude Code BOTH files.

---

## Step 0 — what to give it
Put these in the repo root before you start:
- `HANDOFF.md` (the spec — scene state machine, effect table, file tree, content object, tokens, a11y, the R2 restructure, and the R3 i18n section)
- `Raised Homepage (Standalone).html` (the self-contained prototype, so it can open and *watch* the real motion — text description isn't enough for the scroll choreography)
- the two brand logos from `/assets` (`logo-A-lockup.png`, `logo-R-lockup.png`)

## Step 1 — install Claude Code
```bash
npm install -g @anthropic-ai/claude-code
cd ~/your-projects
mkdir raised-web && cd raised-web
claude
```
(First run will prompt you to authenticate.)

## Step 2 — the opening prompt (paste this verbatim)
> Read `HANDOFF.md` and open `Raised Homepage (Standalone).html` in a browser to study the scroll-driven 3D scene and section choreography — that file is the design source of truth, match it 1:1. Scaffold a **Next.js (App Router) + TypeScript + Tailwind** project, then add **React Three Fiber + drei, GSAP + ScrollTrigger, and Lenis**. Build the persistent `SceneCanvas` at the layout level and the 8 sections in `HANDOFF.md` §3 order. Implement the scene state machine in §1 and the effect-translation table in §2 exactly. Do **not** hardcode copy — put everything in the content layer per §3. Stop after the Hero + `SceneCanvas` are working so I can review before you build the rest.

## Step 3 — make it build in the right order
Don't let it one-shot the whole site. Drive it section by section so you can sanity-check the hard parts early:
1. **Project scaffold + tokens** — Tailwind config from `HANDOFF.md` §4 (colors, glow/inset shadows, radii, Sora/Inter/Geist Mono via `next/font`, the two easings).
2. **SceneCanvas + Hero** — instanced nodes/edges/packets, the chaos state, mouse parallax, hero mask-reveal + eyebrow typewriter, the CTA (magnetic + glow + scramble). Review the framerate here.
3. **Scroll system** — Lenis + GSAP ScrollTrigger; wire `order/degrade/dim/breathe/orbit` to scroll ranges (§1). Confirm THE TURN (chaos → lattice) lands on the Systems section.
4. **Sections 2–8** in order, each reading from the content layer.
5. **i18n** (§8) — `app/[locale]`, `middleware.ts` with geo/Accept-Language → locale, `next-intl` with `messages/en.json` + `messages/es.json`. Seed `es.json` from the Spanish already in the prototype's `i18nDict()` (then have a native speaker review).
6. **Polish + a11y pass** (§5) — `prefers-reduced-motion`, mobile fallback scene, focus rings, Lighthouse.

## Step 4 — guardrails to repeat as needed
- "Match the prototype's motion and spacing — open the standalone HTML and compare."
- "No hardcoded strings. Everything through `messages/*.json` keyed to the content paths in HANDOFF §3."
- "Keep the brand tokens exact — flat/matte silver, glow only on hover/CTAs, status colors only in diagnostic visuals."
- "Don't DOM-swap translations like the prototype does — that was a prototype shortcut. Use locale routing + the content layer."

## Step 5 — definition of done
- 8 sections, scroll scene matches the prototype, 60fps desktop / mobile fallback works.
- `/en` and `/es` both render; visiting from a Spanish-region IP defaults to `/es`; the nav toggle flips locale and persists via the `NEXT_LOCALE` cookie.
- `prefers-reduced-motion` kills pinning/scramble/scene motion; FAQ keyboard-navigable; Lighthouse ≥90 desktop / ≥80 mobile.

---

### Notes
- The prototype's Spanish is a **solid first draft in operator voice** — get it reviewed by a native speaker before launch (it's already wired as the `es` strings, so review = edit `es.json`, nothing structural).
- For country detection specifically: it's a **server** concern. On Vercel it's `request.geo.country` in `middleware.ts` (free). Anywhere else, read `Accept-Language` or add a geo-IP edge call. The prototype's browser-language default is the client-side stand-in.
- A pricing line is intentionally absent (reserved `audit.pricing` key) — add it as one content edit when ready.
