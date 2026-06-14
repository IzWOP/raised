import type { Content } from "./types";

export const en: Content = {
  meta: {
    title: "Raised Agency — Operational systems for growing service businesses",
    description:
      "Raised Agency builds the operational layer underneath growing service businesses and agencies — connected workflows, automation, AI where work needs judgment, and tracking that proves it works.",
  },

  nav: {
    links: [
      { label: "SYSTEMS", href: "#systems" },
      { label: "WHY RAISED", href: "#why" },
      { label: "AUDIT", href: "#audit" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: "Book an Audit",
  },

  rail: [
    { label: "01 HERO", href: "#hero" },
    { label: "02 COST", href: "#problem" },
    { label: "03 SYSTEMS", href: "#systems" },
    { label: "04 WHY RAISED", href: "#why" },
    { label: "05 AUDIT", href: "#audit" },
    { label: "06 START", href: "#final" },
  ],

  boot: [
    { label: "INITIALIZING SYSTEMS", caret: true },
    { label: "LOADING OPERATIONAL GRID —", tail: "OK" },
    { label: "SYS.STATUS —", tail: "OPERATIONAL", ok: true },
  ],

  hud: { scroll: "SCROLL", status: "SYS.STATUS — OPERATIONAL" },

  hero: {
    eyebrow: "OPERATIONAL SYSTEMS. BUILT, AUTOMATED, MEASURED.",
    h1: ["Your tools don't talk to each other.", "Your team pays for it daily."],
    sub: "Raised builds the operational layer underneath growing service businesses. Connected workflows, automation where work repeats, AI where work needs judgment, and tracking that proves all of it is actually working.",
    cta: "Book an Operations Audit",
  },

  problem: {
    eyebrow: "02 — RUNNING COST",
    h2: "You're already paying for it.",
    copy: "Not in software. In time, in missed revenue, and in the hire you made just to manage the chaos. Every new lead, client, and tool multiplies the places work gets stuck. A lead sits three days. A handoff lives in a DM. The bill shows up where it's easiest to ignore.",
    cards: [
      {
        label: "HRS / TEAM / WK",
        value: 14,
        title: "Hours burned on glue work.",
        body: "Copying between tools, chasing statuses, rebuilding reports.",
      },
      {
        label: "FOLLOW-UPS MISSED / MO",
        value: 38,
        title: "Revenue that leaks quietly.",
        body: "Slow responses never show up in a report, which is why they keep happening.",
      },
      {
        label: "ON PAYROLL / YR",
        value: 68,
        prefix: "$",
        suffix: "K",
        title: "Headcount as a band-aid.",
        body: 'When the system breaks, the fix becomes "hire someone to manage it."',
      },
      {
        label: "REPORTS REBUILT / YR",
        value: 52,
        title: "Decisions made on vibes.",
        body: "Manual reporting plus a messy CRM means leadership runs on gut feel.",
      },
    ],
    footnote:
      "REPRESENTATIVE OPERATING COSTS. YOURS GET MAPPED PRECISELY IN THE AUDIT.",
  },

  breaksFixes: {
    eyebrow: "03 — DIAGNOSTIC SWEEP",
    h2: "It breaks in the same five places. Every time.",
    sub: "After enough time inside growing service businesses, the pattern is boring in the best way. Predictable. Which means fixable. Here is where it breaks, and the system we build to fix it.",
    cta: "Book an Operations Audit",
    cards: [
      {
        tag: "01 — INTAKE",
        status: "warn",
        breakTitle: "Lead Management",
        breakBody:
          "Leads arrive, but nothing routes, scores, enriches, or assigns them. Speed-to-lead depends on who happens to check the inbox.",
        fixBody:
          "Instant routing, scoring, enrichment, and owner assignment the moment a lead lands. AI drafts the summary and the next step. Your rep just executes. Nothing waits in an inbox.",
      },
      {
        tag: "02 — PIPELINE",
        status: "crit",
        breakTitle: "Sales & Pipeline Ops",
        breakBody:
          "The pipeline in the CRM and the pipeline in reality are two different pipelines. Deals stall silently because nothing flags them.",
        fixBody:
          "Pipeline automation that keeps the CRM honest. Stage triggers, stalled-deal alerts with AI-written context on why it stalled, and onboarding that kicks off itself the moment a deal closes.",
      },
      {
        tag: "03 — WORKFLOW",
        status: "warn",
        breakTitle: "Internal Workflows",
        breakBody:
          "Tasks, approvals, and updates run on memory and Slack. The process exists. It just lives in people's heads.",
        fixBody:
          "Recurring processes that run without a babysitter. Tasks, approvals, status updates, and notifications fired by triggers instead of memory. Custom scripts where off-the-shelf tools fall short.",
      },
      {
        tag: "04 — VISIBILITY",
        status: "crit",
        breakTitle: "Reporting & Visibility",
        breakBody:
          "The data exists across five tools. Turning it into an answer takes a person, a spreadsheet, and an afternoon.",
        fixBody:
          'Dashboards pulling live from your actual tools. Pipeline coverage, team capacity, client health, plus weekly AI rollups in Slack. Built on real measurement infrastructure: GA4, BigQuery, Looker Studio. Stop asking "where are we at?"',
      },
      {
        tag: "05 — HANDOFF",
        status: "warn",
        breakTitle: "Sales-to-Delivery",
        breakBody:
          "The deal closes, then onboarding starts from scratch. Re-asking questions, re-finding context, re-setting expectations.",
        fixBody:
          "One clean handoff with no telephone game. And the AI layer that sits across all of it: summarizing messy threads into clean handoffs, flagging exceptions before they become fires, quality-checking data, drafting follow-ups for human review. Not AI for the demo. AI for the judgment calls scripts can't make.",
      },
    ],
  },

  whyRaised: {
    eyebrow: "04 — WHY RAISED",
    h2: "Anyone can connect two tools. Almost nobody can prove it worked.",
    intro:
      "Automation freelancers ship Zaps. We ship systems with a measurement layer, because we come from CRO and analytics, where if you can't measure it, it didn't happen.",
    left: {
      heading: "THE TYPICAL AUTOMATION PROJECT",
      items: [
        "One-off Zaps stacked on Zaps",
        "Nobody cleaned the process first",
        "No monitoring. You find out it broke when a client does.",
        'No measurement, so "it works" is a feeling',
      ],
      result: "More tools. More fragile workflows. Same chaos, now automated.",
    },
    right: {
      heading: "A RAISED SYSTEM",
      items: [
        "Process designed before anything gets built",
        "Scripts for the repeatable, AI for the judgment calls",
        "Monitored, documented, and owned",
        "Instrumented end to end. Dashboards show it working.",
      ],
      result: "A business that runs smoother, and proof that it does.",
    },
    resultLabel: "RESULT",
    operator: {
      eyebrow: "OPERATOR RECORD",
      h2: "Built by an operator, not an account manager.",
      name: 'Isaac "Izzy" Vazquez',
      role: "CRO & Analytics Operator",
      photo: "",
      copy: 'Raised is led by Isaac "Izzy" Vazquez, a CRO and analytics operator who spent years inside the messy middle of growing agencies: the tracking that lies, the CRMs nobody trusts, the reports rebuilt by hand every Friday. The person who scopes your system is the person who builds it. No handoff to a junior. No telephone game.',
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
          text: "Reporting systems leadership across GA4, BigQuery, and Looker Studio",
        },
        {
          tag: "R.05",
          text: "CRO experimentation background. Every build tied back to revenue impact.",
        },
      ],
    },
  },

  process: {
    label: "THE PROCESS — WHAT HAPPENS AFTER YOU BOOK",
    steps: [
      {
        label: "DISCOVER",
        body: "Map how work actually moves. The real version, Slack threads and all.",
      },
      {
        label: "DIAGNOSE",
        body: "Find the bottlenecks and dirty data. Score each by revenue impact, not by what's fun to automate.",
      },
      {
        label: "ARCHITECT",
        body: "Design the future-state system. Workflows, connections, automation logic, where AI assists, how it's measured.",
      },
      {
        label: "BUILD",
        body: "Implement, test, document, deploy. Every system ships with monitoring and a dashboard, not a Loom video and a prayer.",
      },
      {
        label: "ONGOING",
        body: "We watch it, tune it, and extend it as you grow. Systems aren't a project. They're infrastructure.",
      },
    ],
  },

  audit: {
    eyebrow: "05 — ENTRY POINT",
    h2: "Start with the Operations Audit.",
    copy: "Before anything gets built, we map how work moves through your business and show you exactly where the leverage is. You walk away with a plan you own. Build with us, build in-house, or sit on it. The roadmap is yours either way.",
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
          a: "Founders and ops leaders at agencies and service businesses, roughly 5 to 50 people, where growth has outpaced the systems underneath it.",
        },
        {
          q: "Is this just Zapier with extra steps?",
          a: "No. We design the process first, build scripts where Zaps fall short, add AI for judgment calls, and instrument all of it so you can prove it works.",
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

  finalCta: {
    h2: "You don't need more tools. You need a system.",
    copy: "Your stack is fine. What's missing is the architecture underneath it: the workflows, automation, and visibility that make the tools act like one business instead of ten tabs. That's what we build. And we'll show you the proof on a dashboard.",
    cta: "Book an Operations Audit",
    subline: "AUDIT → ROADMAP → BUILD → MEASURE",
  },

  footer: {
    domain: "RAISEDAGENCY.COM",
    copyright: "© 2026 RAISED AGENCY",
  },
};
