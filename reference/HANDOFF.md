# Raised Agency Website v2 — Production Handoff Spec

**Addressed to: Claude Code.**
Target stack: **Next.js (App Router) + React Three Fiber + GSAP ScrollTrigger + Lenis + custom GLSL + Tailwind.**
Design source of truth: `Raised Homepage.dc.html` (this repo). Rebuild 1:1 — same copy, same scroll choreography, same brand tokens. Where the prototype hand-rolls an effect, this spec names the production implementation.

---

## 1. Scene state machine

One persistent scene (`SceneCanvas`) mounted at layout level behind all content (`position: fixed; inset: 0; z-index: 0`). All parameters are **lerped** (`p += (target - p) * 0.07` per frame in the prototype; in production drive targets from ScrollTrigger progress and keep the same lerp inside `useFrame` for weight).

Geometry: 160 nodes (8×6×4 grid → lattice positions, spacing 132 units; chaos positions = random point in ellipsoid r=(750, 360, 570), biased to center with `pow(rand, 0.55)`). Chaos edges = 2-nearest-neighbor graph (deduped, ~250 edges). Lattice edges = grid neighbors (+x always; +y, +z on alternating parity, ~350 edges). 64 packets travel edge-to-edge. Camera: rotY = `t*0.045 + mouseX*0.07 + orbit*2.0 + order*0.4`; tilt = `0.16 + order*0.36 + mouseY*0.05` (chaos = shallow tilt, lattice = isometric).

| Scroll range (driver) | State | Animated parameters |
|---|---|---|
| Hero in view | **CHAOS** | order=0; node wobble `sin(t*sp+phase)*amp` (amp 12–36); chaos edge alpha 0.12; packet speed ×0.5; mouse parallax ±~3° |
| `ProblemCostSection` top crosses 85% vh, ramps over 0.9 vh | **DEGRADE** | degrade 0→1: per-edge flicker `alpha *= 1 - degrade*(noise<0.4 ? 0.92 : 0.25)` (noise = `sin(t*11 + i*7.31)`); packet stall `speed *= 1 - degrade*0.85*sin(t*3+phase)`; drop probability `degrade*0.01`/frame/packet → debris particle (gravity 0.18/frame², settles at viewport bottom, max 130, alpha 0.55 decaying); crit nodes (7%) flicker `#c08585` when `sin(t*7+phase*13) > 0.92` |
| Holds through `BreakingSection` (pinned strip) | **DEGRADED HOLD** | degrade stays 1 |
| `SystemsSection` top enters viewport, completes over **1.5 vh** | **THE TURN** | order 0→1 (smoothstep): node pos lerp chaos→lattice; wobble amp ×(1-order); chaos edges fade out, lattice edges fade in (alpha 0.17); packets re-route to lattice edges at order>0.55, speed ×(0.5+order*1.3); debris decay accelerated `+order*0.012`/frame; degrade forced to `degrade*(1-order)` |
| `ProofSection` → `FAQSection` | **CALM WIREFRAME** | dim 0→1: global luminance ×(1−dim*0.68); rotation continues slowly; during `ProcessSection`, orbit = section progress → +2.0 rad camera orbit |
| `FinalCTASection` top crosses 90% vh | **BREATHE** | dim releases; breathe 0→1: global luminance ×`1 + breathe*0.22*(0.5+0.5*sin(t*1.4))`; full lattice, ordered packets |

Colors in scene: edges/nodes `#D9D9D9`, packets `#FFFFFF`, debris `#8C8C8C`, crit flicker `#c08585` only. Nothing else.

## 2. Effect translation table

| Prototype (hand-rolled) | Production |
|---|---|
| Lerped scroll value in rAF (`current += (target-current)*0.08`) | **Lenis** (`lerp: 0.08`), synced to GSAP ticker |
| `position: sticky` pins (breaking 340vh, cost 240vh) | ScrollTrigger `pin: true, scrub: true` with matching `end: "+=240%"` / `"+=340%"` |
| Per-section progress from `getBoundingClientRect` in rAF | ScrollTrigger `scrub` timelines per section; scene params via `onUpdate(self => target = self.progress)` |
| 2D-canvas pseudo-3D projection | R3F: `<instancedMesh>` for nodes & packets, drei `<Line>`/`Line2` (or a single `LineSegments` with custom shader) for edges |
| Canvas edge flicker (sine hash per edge) | GLSL noise in the line material's fragment shader, `uDegrade` uniform |
| Debris (screen-space particles, gravity, floor at viewport bottom) | Instanced points; project floor plane to camera frustum bottom; same constants |
| Bento border current (conic-gradient div, opacity on hover) | CSS `@property --angle` conic-gradient mask, or fragment shader on a border plane. Keep 3.6s/rev, 38° bright arc, `rgba(217,217,217,0.7)` |
| Diagnostic SVG self-draw (`stroke-dashoffset` set per frame by distance-to-center) | Same SVGs; ScrollTrigger scrub on `strokeDashoffset` (DrawSVGPlugin or manual), driven by the horizontal-strip timeline |
| Odometer counters (rAF, easeOutCubic of pin progress) | GSAP `to({val}, {scrub})` on the cost pin timeline; `Intl.NumberFormat`; Geist Mono `font-variant-numeric: tabular-nums` |
| Hero H1 mask reveal (JS transition, translateY 112%→0, 120ms stagger) | GSAP timeline: SplitText lines in `overflow:hidden` wrappers, `yPercent: 112→0`, `stagger: 0.12`, ease `cubic-bezier(0.22,1,0.36,1)`, after boot sequence |
| Eyebrow typewriter (16ms/char, caret blink, caret hides +2.2s) | Same, GSAP TextPlugin or 16ms interval; respect reduced motion |
| Magnetic CTA (mousemove translate, clamp x±20/y±14, release with 0.55s ease) | `gsap.quickTo` x/y; same clamps and ease |
| Text scramble on nav hover (8 frames × 36ms, charset `—<>/[]{}=+*^?#_`) | Same util as a React hook; nav + CTAs only |
| Custom cursor (dot instant, ring lerp 0.18, expands 34→64px, label VIEW/BOOK, mono 9px) | Same; render in a portal; hide on `pointer: coarse` |
| Scroll rail (10 ticks, active = section top < 45% vh; active tick 28px white + label) | Same component; active via ScrollTriggers |
| Boot overlay (3 mono lines at 60/360/660ms, fade at 1050ms, click to skip) | Same; ≤1.2s hard cap; skip on click/keydown; `sessionStorage`-gate to first visit is allowed in production |
| Reveals via IntersectionObserver (y 26px, 0.85s, per-element delay) | ScrollTrigger batch or keep IO; identical values |
| Audit checklist verify (IO + 110ms stagger; dot→`#7fae8a` + glow, label brightens, OK appears) | Same, ScrollTrigger batch |
| FAQ accordion (max-height transition 0.55s, left progress line scaleY, one open at a time) | Same behavior; use grid-template-rows or height:auto FLIP; **semantic `<button aria-expanded>` + region** |
| Film grain (SVG turbulence tile, steps(8) translate, opacity 0.028) | Same data-URI tile, or grain in a fullscreen shader pass at 2–3% |

## 3. Component / file tree

```
app/
  layout.tsx            // fonts (next/font: Sora, Inter, Geist Mono), <SceneCanvas/>, <Cursor/>, <ScrollRail/>, <Grain/>, <BootSequence/>
  page.tsx              // section order (R2, 8 sections): Hero, ProblemCostSection, BreakingSection, SystemsSection,
                        // WhyRaisedSection (comparison + operator record), ProcessSection, AuditSection (incl. FAQ), FinalCTASection
content.ts              // ALL copy (object below). Zero hardcoded strings in components.
components/
  scene/SceneCanvas.tsx       // R3F Canvas, dpr={[1,2]}, frameloop managed, visibility pause
  scene/useSceneState.ts      // param store (order/degrade/dim/breathe/orbit) + lerp
  scene/Nodes.tsx Edges.tsx Packets.tsx Debris.tsx
  scene/shaders/edge.frag.glsl edge.vert.glsl
  ui/SectionHeader.tsx        // hairline + mono eyebrow + Sora H2 + sub
  ui/HUDLabel.tsx             // Geist Mono 12px / 0.18em / uppercase
  ui/CTAButton.tsx            // white r8 + silver glow ring + magnetic + scramble
  ui/StatusDot.tsx            // ok/warn/crit, pulse
  ui/Cursor.tsx ScrollRail.tsx Grain.tsx BootSequence.tsx
  sections/Hero.tsx ProblemCostSection.tsx BreakingSection.tsx SystemsSection.tsx
  sections/WhyRaisedSection.tsx   // R2: merged Differentiator (Comparison) + ProofSection — comparison columns first, then operator bio + receipts
  sections/ProcessSection.tsx
  sections/AuditSection.tsx       // R2: includes compact FAQ accordion below the deliverables grid
  sections/FinalCTASection.tsx
lib/useScrollProgress.ts scramble.ts
```

### content.ts (production copy source of truth — verbatim from prototype)

```ts
export const content = {
  nav: { links: ["Systems", "Process", "Proof", "FAQ"], cta: "Book an Audit" },
  boot: ["INITIALIZING SYSTEMS", "LOADING OPERATIONAL GRID — OK", "SYS.STATUS — OPERATIONAL"],
  hero: {
    eyebrow: "OPERATIONAL SYSTEMS — BUILT, AUTOMATED, MEASURED",
    h1: ["Your tools don't talk to each other.", "Your team pays for it daily."],
    sub: "Raised Agency builds the operational systems underneath growing service businesses and agencies — connected workflows, automation and scripts where work repeats, AI where work needs judgment, and tracking that proves all of it is actually working.",
    cta: "Book an Operations Audit",
    support: "Less manual work. Cleaner handoffs. Real visibility. Systems you can trust.",
    hud: "SYS.STATUS — OPERATIONAL",
  },
  problem: {
    eyebrow: "02 — SIGNAL DEGRADATION",
    h2: "Growth exposes broken systems.",
    copy: "Your team isn't the problem. The systems under them are. What worked at 3 people quietly falls apart at 10. Nobody decided it would — it just did. And the cracks always look the same:",
    gridHeading: "SOUND FAMILIAR?",
    vignettes: [
      { title: "The lead that sat for three days", body: "It came in. It hit the inbox. Nobody knew it was theirs. By the time someone followed up, the prospect had signed with whoever answered first." },
      { title: "The handoff that lives in a DM", body: "Sales closed it. Delivery found out in a Slack thread two days later. Kickoff started with \"wait, what did we promise them?\"" },
      { title: "The Friday report rebuild", body: "Every week, someone spends half a day exporting, pasting, and cleaning the same numbers — so leadership can look at data that's already stale." },
      { title: "The CRM nobody trusts", body: "Half the deals are out of date. Stages mean different things to different people. So everyone asks in Slack instead, and the CRM becomes a graveyard." },
    ],
    cost: {
      eyebrow: "RUNNING COST — LIVE",
      h3: "You're already paying for it.",
      copy: "Not in software. In time, in missed revenue, and in hires you make just to manage the chaos. Every new lead, client, teammate, and tool multiplies the places where work gets stuck. The bill shows up where it's easiest to ignore:",
      cards: [
        { label: "GLUE WORK / TEAM / WK", value: 14, suffix: " HRS", title: "Hours burned on glue work", body: "Copying between tools, chasing statuses, rebuilding reports. A part-time salary spread invisibly across your whole team." },
        { label: "FOLLOW-UPS MISSED / MO", value: 38, title: "Revenue that leaks quietly", body: "Slow responses and missed follow-ups don't show up in any report — which is exactly why they keep happening." },
        { label: "CHAOS ON PAYROLL / YR", value: 68, prefix: "$", suffix: "K", title: "Headcount as a band-aid", body: "When the system is broken, the fix becomes \"hire someone to manage it.\" Now chaos has a salary and benefits." },
        { label: "REPORTS REBUILT BY HAND / YR", value: 52, title: "Decisions made on vibes", body: "When reporting is manual and the CRM is messy, leadership runs on gut feel and whoever spoke last in Slack." },
      ],
      footnote: "REPRESENTATIVE OPERATING COSTS — YOURS GET MAPPED PRECISELY IN THE AUDIT",
    },
  },
  breaking: {
    eyebrow: "03 — DIAGNOSTIC SWEEP",
    h2: "It breaks in the same five places. Every time.",
    sub: "After enough time inside growing agencies and service businesses, the pattern is boring in the best way — predictable. Which means it's fixable.",
    cards: [
      { tag: "BRK.01 — INTAKE", status: "warn", title: "Lead Management", body: "Leads arrive, but nothing routes, scores, enriches, or assigns them. Speed-to-lead depends on who happens to check the inbox." },
      { tag: "BRK.02 — PIPELINE", status: "crit", title: "Sales & Pipeline Ops", body: "The pipeline in the CRM and the pipeline in reality are two different pipelines. Deals stall silently because nothing flags them." },
      { tag: "BRK.03 — WORKFLOW", status: "warn", title: "Internal Workflows", body: "Tasks, approvals, and updates run on memory and Slack. The process exists — it just lives in people's heads." },
      { tag: "BRK.04 — VISIBILITY", status: "crit", title: "Reporting & Visibility", body: "The data exists across five tools. Turning it into an answer takes a person, a spreadsheet, and an afternoon." },
      { tag: "BRK.05 — HANDOFF", status: "warn", title: "Sales-to-Delivery Handoff", body: "The deal closes, then onboarding starts from scratch: re-asking questions, re-finding context, re-setting expectations." },
    ],
  },
  systems: {
    eyebrow: "04 — THE TURN",
    interstitial: "REORGANIZING — SYSTEM ARCHITECTURE ONLINE",
    h2: "The systems we build.",
    sub: "We don't sell one-off automations. We design the workflow, clean the data, connect the tools, script the repeatable steps, add AI where judgment is needed — then instrument it so you can see it working.",
    cards: [
      { tag: "SYS.01", title: "Lead Management Systems", body: "Instant routing, scoring, enrichment, and owner assignment the moment a lead lands. AI drafts the lead summary and suggests the next step; your rep just executes. Nothing waits in an inbox." },
      { tag: "SYS.02", title: "Revenue Operations Systems", body: "Pipeline automation that keeps the CRM honest: stage triggers, stalled-deal alerts with AI-written context on why it stalled, proposal handoffs, and onboarding that kicks off itself the moment a deal closes." },
      { tag: "SYS.03", title: "Internal Operations Systems", body: "Recurring processes that run without a babysitter — tasks, approvals, status updates, and notifications fired by triggers instead of memory. Custom scripts where off-the-shelf tools fall short." },
      { tag: "SYS.04", title: "Reporting & Visibility Systems", body: "Dashboards pulling live from your actual tools — pipeline coverage, team capacity, client health — plus weekly AI-generated rollups in Slack. Built on real measurement infrastructure: GA4, BigQuery, Looker Studio. Stop asking \"where are we at?\"" },
      { tag: "SYS.05 — AI LAYER", title: "AI Where It Earns Its Place", body: "Not AI for the demo. AI for the judgment calls scripts can't make: summarizing messy threads into clean handoffs, flagging exceptions before they become fires, quality-checking data, drafting follow-ups for human review. Monitored, documented, and measured like everything else we ship." },
    ],
  },
  differentiator: {
    eyebrow: "05 — SIGNAL VS NOISE",
    h2: "Anyone can connect two tools. Almost nobody can prove it worked.",
    intro: "Automation freelancers ship Zaps. We ship systems with a measurement layer — because we come from CRO and analytics, where if you can't measure it, it didn't happen.",
    left: {
      heading: "THE TYPICAL AUTOMATION PROJECT",
      items: ["One-off Zaps stacked on Zaps", "AI bolted on for the invoice", "Nobody cleaned the process first", "No documentation", "No monitoring — you find out it broke when a client does", "No measurement, so \"it works\" is a feeling"],
      result: "More tools. More fragile workflows. Same chaos, now automated.",
    },
    right: {
      heading: "A RAISED SYSTEM",
      items: ["Process designed before anything gets built", "Workflow architecture across tools, people, and handoffs", "Scripts and automation for the repeatable, AI for the judgment calls", "CRM and data cleaned so the system runs on truth", "Monitored, documented, and owned", "Instrumented end to end — dashboards show it working"],
      result: "A business that runs smoother — and proof that it does.",
    },
  },
  proof: {
    eyebrow: "06 — OPERATOR RECORD",
    h2: "Built by an operator, not an account manager.",
    copy: "Raised is led by Isaac \"Izzy\" Vazquez — a CRO and analytics operator who spent years inside the messy middle of growing agencies: the tracking that lies, the CRMs nobody trusts, the reports rebuilt by hand every Friday, the automations everyone is afraid to touch. When you work with Raised, the person who scoped the system is the person who builds it. No handoff to a junior. No telephone game.",
    receipts: [
      "Multi-client analytics infrastructure serving a portfolio of brands from one system",
      "Cross-domain tracking and dual-container GTM cleanup for a healthcare SaaS",
      "Server-side tracking and Meta CAPI migrations for e-commerce and lead-gen clients",
      "A/B test analysis tooling built on GA4 segmentation",
      "Inbound pipeline automation and CRM workflow cleanup for agencies",
      "Reporting systems leadership actually opens — GA4, BigQuery, Looker Studio",
      "CRO experimentation background: every build tied back to revenue impact",
    ],
  },
  process: {
    eyebrow: "07 — METHOD",
    h2: "How we rebuild the system.",
    phases: [
      { tag: "PHASE 01 — DISCOVER", title: "Discover", body: "Map how work actually moves through your business. Not the org-chart version. The real one, Slack threads and all." },
      { tag: "PHASE 02 — DIAGNOSE", title: "Diagnose", body: "Find the bottlenecks, manual glue work, fragile automations, and dirty data. Score each by revenue impact, not by what's fun to automate." },
      { tag: "PHASE 03 — ARCHITECT", title: "Architect", body: "Design the future-state system: workflows, tool connections, automation logic, where scripts run, where AI assists, and how it all gets measured." },
      { tag: "PHASE 04 — BUILD", title: "Build", body: "Implement, test, document, deploy. Every system ships with monitoring and a dashboard — not a Loom video and a prayer." },
    ],
    ongoing: "After launch we watch it, tune it, and extend it as you grow. Systems aren't a project. They're infrastructure.",
  },
  audit: {
    eyebrow: "08 — ENTRY POINT",
    h2: "Start with the Operations Audit.",
    copy: "Before anything gets built, we map how work actually moves through your business — and show you exactly where the leverage is. You walk away with a plan you own. Build with us, build in-house, or sit on it. The roadmap is yours either way.",
    terminalTitle: "RAISED.OPS — AUDIT.SEQUENCE",
    checklist: ["WORKFLOW MAPPING", "TOOL & DATA REVIEW", "CRM AND PIPELINE REVIEW", "LEAD FLOW AND HANDOFFS", "MANUAL TASK INVENTORY", "AUTOMATION OPPORTUNITIES SCORED BY REVENUE IMPACT", "OPERATIONAL RISK REVIEW", "RECOMMENDED SYSTEMS ROADMAP"],
    deliverables: [
      { tag: "DELIVERABLE 01", title: "Growth Ops Roadmap", body: "What's broken, what it's costing you, and what to fix first." },
      { tag: "DELIVERABLE 02", title: "Systems Blueprint", body: "What to build, how it works, which tools it connects, where scripts and AI create leverage, and how we'll measure it." },
    ],
    cta: "Book an Operations Audit",
    // pricing: ""  ← reserved; add as a single edit later
  },
  faq: {
    eyebrow: "09 — QUERIES",
    h2: "Before you ask.",
    items: [
      { q: "Who is this for?", a: "Growing service businesses and agencies, roughly 5–50 people, with inbound leads, a CRM, too many tools, and a backend that's starting to crack under growth. If you're a solo operator or a local shop, we're probably overkill — for now." },
      { q: "Is this just Zapier with extra steps?", a: "No. Tools like Zapier, Make, and n8n might appear inside a build, next to custom scripts and direct API work. The difference is everything around them: process design first, clean data, documentation, monitoring, and measurement. A Zap is a wire. We build the circuit." },
      { q: "Where does AI actually fit?", a: "Where it earns its place. Scripts handle the repeatable steps; AI handles the judgment calls in between — summarizing threads into handoffs, drafting follow-ups, flagging stalled deals with context, catching exceptions. Always monitored, always measured, never AI for the demo." },
      { q: "What tools do you work with?", a: "Your stack, not ours. CRMs (HubSpot, Pipedrive, etc.), PM tools, Slack, spreadsheets, billing — plus the measurement layer most shops can't touch: GA4, GTM, BigQuery, Looker Studio. If your tools have an API, we can make them cooperate." },
      { q: "Can you fix our analytics and reporting too?", a: "That's home turf. Tracking cleanup, dashboard builds, and reporting automation come from years of hands-on CRO and analytics work — it's the reason our systems ship with measurement built in instead of bolted on." },
      { q: "What happens after the audit?", a: "You get the Roadmap and Blueprint regardless. Most clients move into a build engagement where we implement in priority order; some take the blueprint in-house. Either way, you're never buying blind." },
    ],
  },
  finalCta: {
    h2: "You don't need more tools. You need a system.",
    copy: "Your stack is fine. What's missing is the architecture underneath it — the workflows, automation, and visibility that make the tools act like one business instead of ten tabs. That's what we build. And we'll show you the proof on a dashboard.",
    cta: "Book an Operations Audit",
    subline: "AUDIT → ROADMAP → BUILD → MEASURE",
  },
  footer: { domain: "RAISEDAGENCY.COM", copyright: "© 2026 RAISED AGENCY" },
};
```

## 4. Brand tokens (Tailwind config)

```js
colors: {
  page: "#000000", secondary: "#0B0B0B", raised: "#141414", card: "#1A1A1A", border: "#2A2A2A",
  hairline: "rgba(255,255,255,0.08)",
  text: { hi: "#FFFFFF", base: "#D9D9D9", mid: "#8C8C8C", low: "#5F5F5F" },
  silver: { from: "#CFCFCF", to: "#D9D9D9" }, // FLAT/MATTE only — never chrome gradients in UI
  status: { ok: "#7fae8a", warn: "#c9b072", crit: "#c08585" }, // diagnostic visuals ONLY
}
boxShadow: {
  glow: "0 0 0 1px rgba(217,217,217,0.45), 0 0 28px rgba(217,217,217,0.28), 0 0 56px rgba(217,217,217,0.14)",
  inset: "0 1px 0 rgba(255,255,255,0.03) inset, 0 1px 2px rgba(0,0,0,0.6)",
}
borderRadius: { card: "16px", btn: "8px" }
fontFamily: { display: Sora(600/700), body: Inter, mono: GeistMono }
// Mono labels: 12px / uppercase / 0.18em tracking — brand signature, never deviate
// Display: lh 1.02–1.12, tracking -0.02 to -0.03em; H1 56 (72 hero on xl), H2 42–46, H3 30
transitionTimingFunction: { brand: "cubic-bezier(0.22,1,0.36,1)", out: "cubic-bezier(0.16,1,0.3,1)" }
```

## 5. Performance & a11y

- 60fps desktop / 30fps mobile floor. `dpr={[1, 2]}` cap. Instanced nodes/packets (≤160/64), single LineSegments draw call per edge set. Pause frameloop on `document.hidden` and when scene fully offscreen.
- **Mobile (<1024px):** replace WebGL scene with a static SVG lattice + CSS-animated packets (or a 2-layer canvas at dpr 1); disable horizontal pin (cards stack vertically), disable custom cursor and scroll rail; cost beat unpins to normal flow.
- **`prefers-reduced-motion`:** no boot sequence, no pinning, no scramble, no typewriter, no parallax; scene renders the final lattice as a static frame; all reveals become opacity-only ≤0.3s. (Prototype already implements this branch — mirror it.)
- LCP = hero H1 (real text, server-rendered; fonts via `next/font` with `display: swap`). Scene mounts after hydration behind content. Lighthouse ≥90 desktop / ≥80 mobile.
- Semantic HTML: one `<h1>`, sections with `<h2>`, FAQ as `<button aria-expanded>` + `role="region"`, keyboard navigable. Focus rings: `outline: 1px solid rgba(217,217,217,0.6); outline-offset: 3px` (silver, visible on black).
- Text is never drawn into canvas. All interactive targets ≥44px. `cursor: none` only on `pointer: fine` and never removes focus visibility.

## 6. Assumptions made

1. **Counters are representative, not claims** — values (14 hrs, 38 follow-ups, $68K, 52 reports) are illustrative; footnote says so. Swap freely in `content.ts`.
2. **No case-study section** — per spec; module slots in later between Proof and Process.
3. **Pricing line** — reserved key in `content.ts` (`audit.pricing`), renders nothing when empty.
4. **CTA destination** — all CTAs are anchors in the prototype; production should point to the booking route/Cal link (one prop on `CTAButton`).
5. **Nav logo** uses the A-mark lockup; footer uses the R monogram lockup (both from brand assets, silver-on-transparent PNGs in `/assets`).
6. **Eyebrow numbering** (`02 — SIGNAL DEGRADATION` etc.) added as HUD flavor consistent with the mono-label brand signature; rename freely in `content.ts`.
7. **Process section** uses a sticky left header + stacked phase beats instead of a camera-ring with per-phase pins — chosen for readability; the scene still performs a 115° orbit across the section. If the full ring treatment is wanted, pin each phase 100vh and quantize `orbit` to 0/0.33/0.66/1.
8. Boot sequence runs on every load in the prototype; production may gate it to first visit per session.

---

## 7. Revision R2 — 8-section restructure (matches current prototype)

Page order is now **8 sections**: Hero · Problem & Cost · Breaking · Systems · **Why Raised** · Process · **Audit (+FAQ)** · Final CTA. Hero, Problem+Cost, Breaking, Systems, Process are unchanged.

**content.ts key changes (no copy rewrites — keys move, values stay verbatim):**
```ts
// REMOVED top-level keys: differentiator, proof, faq
whyRaised: {
  eyebrow: "05 — SIGNAL VS NOISE",
  h2 / intro / left / right:  // ← verbatim from old `differentiator`
  operator: {
    eyebrow: "OPERATOR RECORD",   // number dropped — now a sub-block label
    h2 / copy / receipts:          // ← verbatim from old `proof`
  },
},
audit: {
  eyebrow: "07 — ENTRY POINT",     // renumbered
  ...,                              // unchanged
  faq: {
    eyebrow: "QUERIES",
    h3: "Before you ask.",          // demoted h2 → h3 (28px), compact rows (18px padding)
    items: [...],                   // ← verbatim from old `faq.items`
  },
},
process.eyebrow: "06 — METHOD",     // renumbered
systems.cards[i].fixes: {           // NEW — 1:1 callback to Breaking diagnostics
  // SYS.01 → { tag: "FIXES: 01 — INTAKE",       from: "warn" }
  // SYS.02 → { tag: "FIXES: 02 — PIPELINE OPS", from: "crit" }
  // SYS.03 → { tag: "FIXES: 03 — WORKFLOW",     from: "warn" }
  // SYS.04 → { tag: "FIXES: 04 — VISIBILITY",   from: "crit" }
  // SYS.05 → { tag: "FIXES: 05 — HANDOFF",      from: "warn" }
}
```

**Rendering notes:**
- `WhyRaisedSection`: comparison columns first; operator record follows as a sub-block (max-w 980, 150px top margin) with anchor `#proof`. Scene `dim` state now triggers at the operator sub-block, not a section top.
- Systems bento cards are flex columns; the fixes tag is pinned to the card bottom (`margin-top: auto`): ok status dot + mono tag left, `WARN/CRIT → OK` flip right (status colors only in this diagnostic element).
- FAQ keeps anchor `#faq` inside AuditSection; nav links: Systems / Process / **Why Raised (#why)** / FAQ. Scroll rail: 8 ticks (05 WHY RAISED, 06 PROCESS, 07 AUDIT, 08 START).

---

## 8. Revision R3 — internationalization (EN / ES)

The prototype ships a working **EN/ES toggle** in the nav, defaulting from the visitor's browser language and persisting their choice. Because the prototype is a single inline-styled file, it does i18n the pragmatic way: **English lives in the DOM (source of truth, paints instantly) and Spanish swaps in via an exact-string map** keyed by the English text. This is a deliberate prototype shortcut — **production must NOT do runtime DOM string-swapping.** Translate properly through the content layer instead.

**Prototype mechanism (reference only):**
- `i18nDict()` → `{ [english]: spanish }` for every visible string. `esByEn` + inverted `enByEs` give bijective round-trip.
- `applyLocale(locale)` walks leaf elements (`el.children.length === 0`) inside `nav`, `main`, `#rail`; if `textContent.trim()` matches the active map, it swaps. Then sets `document.documentElement.lang`, persists `localStorage['raised_locale']`, and clears the scramble caches (`dataset.orig`) on nav links + `[data-cta-label]` so they re-cache in the new language.
- `initI18n()` precedence: `localStorage` choice → `navigator.language` (`es*` → es) → `en`. Runs **before** `typeEyebrow()` so the eyebrow types in the resolved language.
- Toggle UI: `[data-lang-toggle]` with two `[data-lang]` buttons → `langToggle` handler; active button is white, inactive `#5F5F5F`.

**Production translation (the right way in Next.js):**
1. **Locale routing:** App Router `app/[locale]/...` with `locale ∈ {en, es}`. `middleware.ts` chooses the initial locale and rewrites/redirects:
   - precedence: **explicit cookie (`NEXT_LOCALE`) → geo → `Accept-Language` → `en`**.
   - **Country-based default (what the user asked for):** on Vercel use `request.geo.country` in middleware — map `['ES','MX','AR','CO','CL','PE','EC','GT','CU','BO','DO','HN','PY','SV','NI','CR','PA','UY','VE','PR']` (+ any you care about) → `es`. Self-hosted: read the `Accept-Language` header, or call a geo-IP edge function. Never geo-locate on the client (cost + LCP hit).
2. **Content layer:** lift the single `content.ts` into `content.en.ts` / `content.es.ts` (same shape, translated values), or adopt **`next-intl`** / `next-i18next` with `messages/en.json` + `messages/es.json` keyed by the content paths already defined in §3. Components read `t('hero.h1')` — zero hardcoded strings, zero DOM swapping. The Spanish strings already drafted in the prototype's `i18nDict()` are the starting `es.json` values (review before shipping).
3. **Toggle:** a `<LocaleSwitcher>` client component that sets the `NEXT_LOCALE` cookie and `router.push`es the same path under the other locale segment. Explicit choice always overrides geo on subsequent visits.
4. **SEO/a11y:** emit `<html lang={locale}>`, `<link rel="alternate" hreflang>` for `en`/`es`/`x-default`, and locale-prefixed canonical URLs. Spanish copy runs ~15–25% longer — the fluid clamps, `text-wrap: balance/pretty`, and flex/gap rhythm already absorb it; spot-check the hero H1, nav, and bento card heights in ES.
5. **Translatable inventory:** everything in §3's `content` object **plus** the HUD/mono flavor strings (eyebrows, rail labels `01 INICIO`…, `FIXES:`→`RESUELVE:`, `PHASE`→`FASE`, `AUDIT.SCOPE — VERIFYING`→`VERIFICANDO`, the `AUDIT → ROADMAP → BUILD → MEASURE` sub-line). Status tokens (`WARN`/`CRIT`/`OK`) and pure IDs (`SYS.01`, `R.01`, `BRK.02`) stay untranslated by design. The boot-sequence lines are left English in the prototype; translate them in production if desired.
