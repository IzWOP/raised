// Content layer — the single source of truth for all copy (HANDOFF §3, R2 restructure).
// Components read from a Content object; they contain ZERO hardcoded strings.
// EN and ES both implement this exact shape so they stay in lockstep.

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

export interface Vignette {
  title: string;
  body: string;
}

export interface CostCard {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  title: string;
  body: string;
}

export interface DiagCard {
  tag: string;
  status: Status;
  title: string;
  body: string;
}

export interface SystemCard {
  tag: string;
  title: string;
  body: string;
  fixes: { tag: string; from: Status };
}

export interface CompareColumn {
  heading: string;
  items: string[];
  result: string;
}

export interface Phase {
  tag: string;
  title: string;
  body: string;
}

export interface Deliverable {
  tag: string;
  title: string;
  body: string;
}

export interface Receipt {
  tag: string;
  text: string;
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

  hero: {
    eyebrow: string;
    h1: string[];
    sub: string;
    cta: string;
    support: string;
  };

  problem: {
    eyebrow: string;
    h2: string;
    copy: string;
    gridHeading: string;
    vignettes: Vignette[];
    cost: {
      eyebrow: string;
      h3: string;
      copy: string;
      cards: CostCard[];
      footnote: string;
    };
  };

  breaking: {
    eyebrow: string;
    h2: string;
    sub: string;
    cards: DiagCard[];
  };

  systems: {
    eyebrow: string;
    interstitial: string;
    h2: string;
    sub: string;
    cards: SystemCard[];
  };

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
      receipts: Receipt[];
    };
  };

  process: {
    eyebrow: string;
    h2: string;
    sub: string;
    phases: Phase[];
    ongoingLabel: string;
    ongoing: string;
  };

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
