// Content layer — the single source of truth for all copy (HANDOFF §3, R2 restructure).
// Components read from a Content object; they contain ZERO hardcoded strings.
// EN and ES both implement this exact shape so they stay in lockstep.
//
// LEAN RESTRUCTURE (8 sections → 6 blocks): the old `breaking` + `systems` keys
// merged into `breaksFixes`; `problem.vignettes` and the nested `problem.cost`
// collapsed into a flat counter section; `process` reshaped from full phases into
// a compact strip rendered inside the Audit block; `hero.support` removed.

export type Locale = "en" | "es";

/** Diagnostic status — used ONLY in diagnostic visuals (HANDOFF §4). */
export type Status = "ok" | "warn" | "crit";

export interface BootLine {
  label: string;
  /** trailing highlighted token, e.g. "OK" / "OPERATIONAL" */
  tail?: string;
  /** show blinking caret after the label */
  caret?: boolean;
  /** render the tail in status-ok green */
  ok?: boolean;
}

export interface NavContent {
  links: { label: string; href: string }[];
  cta: string;
}

export interface RailTick {
  label: string;
  href: string;
}

/** Block 2 — The Cost: an animated counter card. */
export interface CostCard {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  title: string;
  body: string;
}

/**
 * Block 3 — Breaks → Fixes: one card per breakpoint. The card presents the
 * BREAK (status warn/crit + diagnostic) and flips/expands to the FIX (→ ok).
 */
export interface BreakFixCard {
  tag: string; // "01 — INTAKE"
  status: Status; // break severity: "warn" | "crit"
  breakTitle: string; // "Lead Management"
  breakBody: string; // the diagnostic
  fixBody: string; // the system that fixes it (resolves to OK)
}

/** Block 4 — Why Raised: one side of the typical-vs-Raised comparison. */
export interface CompareColumn {
  heading: string;
  items: string[];
  result: string;
}

export interface Receipt {
  tag: string;
  text: string;
}

/** Block 5 — the compact process strip folded into the Audit section. */
export interface ProcessStep {
  label: string; // "DISCOVER"
  body: string; // one-liner
}

export interface Deliverable {
  tag: string;
  title: string;
  body: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Content {
  meta: {
    title: string;
    description: string;
  };
  nav: NavContent;
  rail: RailTick[];
  boot: BootLine[];
  hud: { scroll: string; status: string };

  /** Block 1 — Hero. */
  hero: {
    eyebrow: string;
    h1: string[];
    sub: string;
    cta: string;
  };

  /** Block 2 — The Cost (counters only; story vignettes removed). */
  problem: {
    eyebrow: string;
    h2: string;
    copy: string;
    cards: CostCard[];
    footnote: string;
  };

  /** Block 3 — Breaks → Fixes (merged diagnostic sweep + systems). */
  breaksFixes: {
    eyebrow: string;
    h2: string;
    sub: string;
    cta: string;
    cards: BreakFixCard[];
  };

  /** Block 4 — Why Raised. */
  whyRaised: {
    eyebrow: string;
    h2: string;
    intro: string;
    left: CompareColumn;
    right: CompareColumn;
    resultLabel: string;
    operator: {
      eyebrow: string;
      h2: string;
      copy: string;
      name?: string;
      role?: string;
      /** Path to a headshot; falls back to a monogram placeholder when empty. */
      photo?: string;
      receipts: Receipt[];
    };
  };

  /** Block 5a — the process strip (rendered inside the Audit section). */
  process: {
    label: string;
    steps: ProcessStep[];
  };

  /** Block 5b — the Operations Audit. */
  audit: {
    eyebrow: string;
    h2: string;
    copy: string;
    terminalTitle: string;
    checklist: string[];
    deliverablesLabel: string;
    deliverables: Deliverable[];
    cta: string;
    /** reserved — renders nothing when empty (HANDOFF assumption #3) */
    pricing?: string;
    faq: {
      h3: string;
      items: FaqItem[];
    };
  };

  /** Block 6 — Final CTA. `subline` doubles as the footer ribbon. */
  finalCta: {
    h2: string;
    copy: string;
    cta: string;
    subline: string;
  };

  footer: {
    domain: string;
    copyright: string;
  };
}
