import type { Content } from "./types";

export const en: Content = {
  meta: {
    title: "Raised Agency — Operational systems for growing service businesses",
    description:
      "Raised Agency builds the operational systems underneath growing service businesses and agencies — connected workflows, automation, AI where work needs judgment, and tracking that proves it works.",
  },

  nav: {
    links: [
      { label: "SYSTEMS", href: "#systems" },
      { label: "PROCESS", href: "#process" },
      { label: "WHY RAISED", href: "#why" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: "Book an Audit",
  },

  rail: [
    { label: "01 HERO", href: "#hero" },
    { label: "02 PROBLEM", href: "#problem" },
    { label: "03 BREAKPOINTS", href: "#breaking" },
    { label: "04 SYSTEMS", href: "#systems" },
    { label: "05 WHY RAISED", href: "#why" },
    { label: "06 PROCESS", href: "#process" },
    { label: "07 AUDIT", href: "#audit" },
    { label: "08 START", href: "#final" },
  ],

  boot: [
    { label: "INITIALIZING SYSTEMS", caret: true },
    { label: "LOADING OPERATIONAL GRID —", tail: "OK" },
    { label: "SYS.STATUS —", tail: "OPERATIONAL", ok: true },
  ],

  hud: { scroll: "SCROLL", status: "SYS.STATUS — OPERATIONAL" },

  hero: {
    eyebrow: "OPERATIONAL SYSTEMS — BUILT, AUTOMATED, MEASURED",
    h1: ["Your tools don't talk to each other.", "Your team pays for it daily."],
    sub: "Raised Agency builds the operational systems underneath growing service businesses and agencies — connected workflows, automation and scripts where work repeats, AI where work needs judgment, and tracking that proves all of it is actually working.",
    cta: "Book an Operations Audit",
    support:
      "Less manual work. Cleaner handoffs. Real visibility. Systems you can trust.",
  },

  problem: {
    eyebrow: "02 — SIGNAL DEGRADATION",
    h2: "Growth exposes broken systems.",
    copy: "Your team isn't the problem. The systems under them are. What worked at 3 people quietly falls apart at 10. Nobody decided it would — it just did. And the cracks always look the same:",
    gridHeading: "SOUND FAMILIAR?",
    vignettes: [
      {
        title: "The lead that sat for three days",
        body: "It came in. It hit the inbox. Nobody knew it was theirs. By the time someone followed up, the prospect had signed with whoever answered first.",
      },
      {
        title: "The handoff that lives in a DM",
        body: 'Sales closed it. Delivery found out in a Slack thread two days later. Kickoff started with "wait, what did we promise them?"',
      },
      {
        title: "The Friday report rebuild",
        body: "Every week, someone spends half a day exporting, pasting, and cleaning the same numbers — so leadership can look at data that's already stale.",
      },
      {
        title: "The CRM nobody trusts",
        body: "Half the deals are out of date. Stages mean different things to different people. So everyone asks in Slack instead, and the CRM becomes a graveyard.",
      },
    ],
    cost: {
      eyebrow: "RUNNING COST — LIVE",
      h3: "You're already paying for it.",
      copy: "Not in software. In time, in missed revenue, and in hires you make just to manage the chaos. Every new lead, client, teammate, and tool multiplies the places where work gets stuck. The bill shows up where it's easiest to ignore:",
      cards: [
        {
          label: "GLUE WORK / TEAM / WK",
          value: 14,
          suffix: " HRS",
          title: "Hours burned on glue work",
          body: "Copying between tools, chasing statuses, rebuilding reports. A part-time salary spread invisibly across your whole team.",
        },
        {
          label: "FOLLOW-UPS MISSED / MO",
          value: 38,
          title: "Revenue that leaks quietly",
          body: "Slow responses and missed follow-ups don't show up in any report — which is exactly why they keep happening.",
        },
        {
          label: "CHAOS ON PAYROLL / YR",
          value: 68,
          prefix: "$",
          suffix: "K",
          title: "Headcount as a band-aid",
          body: 'When the system is broken, the fix becomes "hire someone to manage it." Now chaos has a salary and benefits.',
        },
        {
          label: "REPORTS REBUILT BY HAND / YR",
          value: 52,
          title: "Decisions made on vibes",
          body: "When reporting is manual and the CRM is messy, leadership runs on gut feel and whoever spoke last in Slack.",
        },
      ],
      footnote:
        "REPRESENTATIVE OPERATING COSTS — YOURS GET MAPPED PRECISELY IN THE AUDIT",
    },
  },

  breaking: {
    eyebrow: "03 — DIAGNOSTIC SWEEP",
    h2: "It breaks in the same five places. Every time.",
    sub: "After enough time inside growing agencies and service businesses, the pattern is boring in the best way — predictable. Which means it's fixable.",
    cards: [
      {
        tag: "BRK.01 — INTAKE",
        status: "warn",
        title: "Lead Management",
        body: "Leads arrive, but nothing routes, scores, enriches, or assigns them. Speed-to-lead depends on who happens to check the inbox.",
      },
      {
        tag: "BRK.02 — PIPELINE",
        status: "crit",
        title: "Sales & Pipeline Ops",
        body: "The pipeline in the CRM and the pipeline in reality are two different pipelines. Deals stall silently because nothing flags them.",
      },
      {
        tag: "BRK.03 — WORKFLOW",
        status: "warn",
        title: "Internal Workflows",
        body: "Tasks, approvals, and updates run on memory and Slack. The process exists — it just lives in people's heads.",
      },
      {
        tag: "BRK.04 — VISIBILITY",
        status: "crit",
        title: "Reporting & Visibility",
        body: "The data exists across five tools. Turning it into an answer takes a person, a spreadsheet, and an afternoon.",
      },
      {
        tag: "BRK.05 — HANDOFF",
        status: "warn",
        title: "Sales-to-Delivery Handoff",
        body: "The deal closes, then onboarding starts from scratch: re-asking questions, re-finding context, re-setting expectations.",
      },
    ],
  },

  systems: {
    eyebrow: "04 — THE TURN",
    interstitial: "REORGANIZING — SYSTEM ARCHITECTURE ONLINE",
    h2: "The systems we build.",
    sub: "We don't sell one-off automations. We design the workflow, clean the data, connect the tools, script the repeatable steps, add AI where judgment is needed — then instrument it so you can see it working.",
    cards: [
      {
        tag: "SYS.01",
        title: "Lead Management Systems",
        body: "Instant routing, scoring, enrichment, and owner assignment the moment a lead lands. AI drafts the lead summary and suggests the next step; your rep just executes. Nothing waits in an inbox.",
        fixes: { tag: "FIXES: 01 — INTAKE", from: "warn" },
      },
      {
        tag: "SYS.02",
        title: "Revenue Operations Systems",
        body: "Pipeline automation that keeps the CRM honest: stage triggers, stalled-deal alerts with AI-written context on why it stalled, proposal handoffs, and onboarding that kicks off itself the moment a deal closes.",
        fixes: { tag: "FIXES: 02 — PIPELINE OPS", from: "crit" },
      },
      {
        tag: "SYS.03",
        title: "Internal Operations Systems",
        body: "Recurring processes that run without a babysitter — tasks, approvals, status updates, and notifications fired by triggers instead of memory. Custom scripts where off-the-shelf tools fall short.",
        fixes: { tag: "FIXES: 03 — WORKFLOW", from: "warn" },
      },
      {
        tag: "SYS.04",
        title: "Reporting & Visibility Systems",
        body: 'Dashboards pulling live from your actual tools — pipeline coverage, team capacity, client health — plus weekly AI-generated rollups in Slack. Built on real measurement infrastructure: GA4, BigQuery, Looker Studio. Stop asking "where are we at?"',
        fixes: { tag: "FIXES: 04 — VISIBILITY", from: "crit" },
      },
      {
        tag: "SYS.05 — AI LAYER",
        title: "AI Where It Earns Its Place",
        body: "Not AI for the demo. AI for the judgment calls scripts can't make: summarizing messy threads into clean handoffs, flagging exceptions before they become fires, quality-checking data, drafting follow-ups for human review. Monitored, documented, and measured like everything else we ship.",
        fixes: { tag: "FIXES: 05 — HANDOFF", from: "warn" },
      },
    ],
  },

  whyRaised: {
    eyebrow: "05 — WHY RAISED",
    h2: "Anyone can connect two tools. Almost nobody can prove it worked.",
    intro:
      "Automation freelancers ship Zaps. We ship systems with a measurement layer — because we come from CRO and analytics, where if you can't measure it, it didn't happen.",
    left: {
      heading: "THE TYPICAL AUTOMATION PROJECT",
      items: [
        "One-off Zaps stacked on Zaps",
        "AI bolted on for the invoice",
        "Nobody cleaned the process first",
        "No documentation",
        "No monitoring — you find out it broke when a client does",
        'No measurement, so "it works" is a feeling',
      ],
      result: "More tools. More fragile workflows. Same chaos, now automated.",
    },
    right: {
      heading: "A RAISED SYSTEM",
      items: [
        "Process designed before anything gets built",
        "Workflow architecture across tools, people, and handoffs",
        "Scripts and automation for the repeatable, AI for the judgment calls",
        "CRM and data cleaned so the system runs on truth",
        "Monitored, documented, and owned",
        "Instrumented end to end — dashboards show it working",
      ],
      result: "A business that runs smoother — and proof that it does.",
    },
    resultLabel: "RESULT",
    operator: {
      eyebrow: "OPERATOR RECORD",
      h2: "Built by an operator, not an account manager.",
      copy: 'Raised is led by Isaac "Izzy" Vazquez — a CRO and analytics operator who spent years inside the messy middle of growing agencies: the tracking that lies, the CRMs nobody trusts, the reports rebuilt by hand every Friday, the automations everyone is afraid to touch. When you work with Raised, the person who scoped the system is the person who builds it. No handoff to a junior. No telephone game.',
      receipts: [
        {
          tag: "R.01",
          text: "Multi-client analytics infrastructure serving a portfolio of brands from one system",
        },
        {
          tag: "R.02",
          text: "Cross-domain tracking and dual-container GTM cleanup for a healthcare SaaS",
        },
        {
          tag: "R.03",
          text: "Server-side tracking and Meta CAPI migrations for e-commerce and lead-gen clients",
        },
        {
          tag: "R.04",
          text: "A/B test analysis tooling built on GA4 segmentation",
        },
        {
          tag: "R.05",
          text: "Inbound pipeline automation and CRM workflow cleanup for agencies",
        },
        {
          tag: "R.06",
          text: "Reporting systems leadership actually opens — GA4, BigQuery, Looker Studio",
        },
        {
          tag: "R.07",
          text: "CRO experimentation background: every build tied back to revenue impact",
        },
      ],
    },
  },

  process: {
    eyebrow: "06 — METHOD",
    h2: "How we rebuild the system.",
    sub: "Four phases. Every one ends with something you can hold.",
    phases: [
      {
        tag: "PHASE 01 — DISCOVER",
        title: "Discover",
        body: "Map how work actually moves through your business. Not the org-chart version. The real one, Slack threads and all.",
      },
      {
        tag: "PHASE 02 — DIAGNOSE",
        title: "Diagnose",
        body: "Find the bottlenecks, manual glue work, fragile automations, and dirty data. Score each by revenue impact, not by what's fun to automate.",
      },
      {
        tag: "PHASE 03 — ARCHITECT",
        title: "Architect",
        body: "Design the future-state system: workflows, tool connections, automation logic, where scripts run, where AI assists, and how it all gets measured.",
      },
      {
        tag: "PHASE 04 — BUILD",
        title: "Build",
        body: "Implement, test, document, deploy. Every system ships with monitoring and a dashboard — not a Loom video and a prayer.",
      },
    ],
    ongoingLabel: "ONGOING",
    ongoing:
      "After launch we watch it, tune it, and extend it as you grow. Systems aren't a project. They're infrastructure.",
  },

  audit: {
    eyebrow: "07 — ENTRY POINT",
    h2: "Start with the Operations Audit.",
    copy: "Before anything gets built, we map how work actually moves through your business — and show you exactly where the leverage is. You walk away with a plan you own. Build with us, build in-house, or sit on it. The roadmap is yours either way.",
    terminalTitle: "AUDIT.SCOPE — VERIFYING",
    checklist: [
      "Workflow mapping",
      "Tool & data review",
      "CRM and pipeline review",
      "Lead flow and handoffs",
      "Manual task inventory",
      "Automation opportunities scored by revenue impact",
      "Operational risk review",
      "Recommended systems roadmap",
    ],
    deliverablesLabel: "DELIVERABLES — YOURS TO KEEP",
    deliverables: [
      {
        tag: "DOC.01",
        title: "Growth Ops Roadmap",
        body: "What's broken, what it's costing you, and what to fix first.",
      },
      {
        tag: "DOC.02",
        title: "Systems Blueprint",
        body: "What to build, how it works, which tools it connects, where scripts and AI create leverage, and how we'll measure it.",
      },
    ],
    cta: "Book an Operations Audit",
    pricing: "",
    faq: {
      h3: "Before you ask.",
      items: [
        {
          q: "Who is this for?",
          a: "Growing service businesses and agencies, roughly 5–50 people, with inbound leads, a CRM, too many tools, and a backend that's starting to crack under growth. If you're a solo operator or a local shop, we're probably overkill — for now.",
        },
        {
          q: "Is this just Zapier with extra steps?",
          a: "No. Tools like Zapier, Make, and n8n might appear inside a build, next to custom scripts and direct API work. The difference is everything around them: process design first, clean data, documentation, monitoring, and measurement. A Zap is a wire. We build the circuit.",
        },
        {
          q: "Where does AI actually fit?",
          a: "Where it earns its place. Scripts handle the repeatable steps; AI handles the judgment calls in between — summarizing threads into handoffs, drafting follow-ups, flagging stalled deals with context, catching exceptions. Always monitored, always measured, never AI for the demo.",
        },
        {
          q: "What tools do you work with?",
          a: "Your stack, not ours. CRMs (HubSpot, Pipedrive, etc.), PM tools, Slack, spreadsheets, billing — plus the measurement layer most shops can't touch: GA4, GTM, BigQuery, Looker Studio. If your tools have an API, we can make them cooperate.",
        },
        {
          q: "Can you fix our analytics and reporting too?",
          a: "That's home turf. Tracking cleanup, dashboard builds, and reporting automation come from years of hands-on CRO and analytics work — it's the reason our systems ship with measurement built in instead of bolted on.",
        },
        {
          q: "What happens after the audit?",
          a: "You get the Roadmap and Blueprint regardless. Most clients move into a build engagement where we implement in priority order; some take the blueprint in-house. Either way, you're never buying blind.",
        },
      ],
    },
  },

  clients: {
    eyebrow: "WORKED WITH",
    h2: "Some of the teams I've built systems with.",
    sub: "A cross-section of the agencies, SaaS, and service businesses behind the work.",
    names: [
      "Acme",
      "Globex",
      "Initech",
      "Umbrella Corp",
      "Hooli",
      "Soylent",
      "Stark Industries",
      "Wayne Enterprises",
      "Massive Dynamic",
      "Cyberdyne",
      "Pied Piper",
      "Wonka Industries",
    ],
  },

  finalCta: {
    h2: "You don't need more tools. You need a system.",
    copy: "Your stack is fine. What's missing is the architecture underneath it — the workflows, automation, and visibility that make the tools act like one business instead of ten tabs. That's what we build. And we'll show you the proof on a dashboard.",
    cta: "Book an Operations Audit",
    subline: "AUDIT → ROADMAP → BUILD → MEASURE",
  },

  footer: {
    domain: "RAISEDAGENCY.COM",
    copyright: "© 2026 RAISED AGENCY",
  },
};
