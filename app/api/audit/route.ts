import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isLocale, defaultLocale } from "@/lib/content";

// This handler reads the request body, so it must run per-request (never prerendered).
export const dynamic = "force-dynamic";

interface Payload {
  name?: string;
  company?: string;
  email?: string;
  teamSize?: string;
  stack?: string;
  bottleneck?: string;
  locale?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Generous ceilings for legitimate humans; walls for bots pumping payloads
// through to the webhook destination.
const MAX_LEN: Record<keyof Payload, number> = {
  name: 200,
  company: 200,
  email: 320,
  teamSize: 100,
  stack: 2000,
  bottleneck: 5000,
  locale: 10,
};

function firstOverlongField(p: Payload): string | null {
  for (const [field, max] of Object.entries(MAX_LEN)) {
    const value = p[field as keyof Payload];
    if (typeof value === "string" && value.length > max) return field;
  }
  return null;
}

// Per-IP rate limit. In-memory, so it resets on cold start and is per-instance —
// not airtight, but it blunts naive spam loops at zero infra cost.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) return true;
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10_000) hits.clear(); // memory backstop
  return false;
}

/** Returns the name of the first invalid required field, or null when valid. */
function firstInvalidField(p: Payload): string | null {
  if (!p.name?.trim()) return "name";
  if (!p.company?.trim()) return "company";
  if (!p.email?.trim() || !EMAIL_RE.test(p.email.trim())) return "email";
  if (!p.bottleneck?.trim()) return "bottleneck";
  return null;
}

function safeLocale(value: string | undefined): string {
  return value && isLocale(value) ? value : defaultLocale;
}

/**
 * Forward the intake to wherever the operator wants it. Set AUDIT_WEBHOOK_URL to a
 * Slack / CRM / Zapier / n8n incoming webhook and every request POSTs there as JSON.
 * With no destination configured we log server-side so a request is never silently
 * dropped in a preview — swap in the env var to wire it live (a one-line change).
 */
async function forward(p: Payload): Promise<void> {
  const url = process.env.AUDIT_WEBHOOK_URL;
  const record = {
    source: "raisedagency.com/audit-intake",
    submittedAt: new Date().toISOString(),
    name: p.name?.trim(),
    company: p.company?.trim(),
    email: p.email?.trim(),
    teamSize: p.teamSize?.trim() || null,
    stack: p.stack?.trim() || null,
    bottleneck: p.bottleneck?.trim(),
    locale: safeLocale(p.locale),
  };

  if (!url) {
    console.info("[audit-intake] received (AUDIT_WEBHOOK_URL not set):", {
      company: record.company,
      email: record.email,
      teamSize: record.teamSize,
    });
    return;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error(`webhook responded ${res.status}`);
}

function str(value: FormDataEntryValue | null): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  // No-JS fallback: a native <form> submit arrives url-encoded and expects a redirect.
  const isFormPost =
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data");

  let payload: Payload;
  if (isFormPost) {
    const form = await request.formData();
    payload = {
      name: str(form.get("name")),
      company: str(form.get("company")),
      email: str(form.get("email")),
      teamSize: str(form.get("teamSize")),
      stack: str(form.get("stack")),
      bottleneck: str(form.get("bottleneck")),
      locale: str(form.get("locale")),
    };
  } else {
    try {
      payload = (await request.json()) as Payload;
    } catch {
      return NextResponse.json(
        { ok: false, error: "invalid_body" },
        { status: 400 },
      );
    }
  }

  const locale = safeLocale(payload.locale);
  const back = (status: "received" | "error") =>
    NextResponse.redirect(
      new URL(`/${locale}?audit=${status}#final`, request.url),
      303,
    );

  const overlong = firstOverlongField(payload);
  if (overlong) {
    return isFormPost
      ? back("error")
      : NextResponse.json(
          { ok: false, error: "too_long", field: overlong },
          { status: 400 },
        );
  }

  const invalid = firstInvalidField(payload);
  if (invalid) {
    return isFormPost
      ? back("error")
      : NextResponse.json(
          { ok: false, error: "validation", field: invalid },
          { status: 400 },
        );
  }

  try {
    await forward(payload);
  } catch (err) {
    console.error("[audit-intake] forward failed:", err);
    return isFormPost
      ? back("error")
      : NextResponse.json(
          { ok: false, error: "forward_failed" },
          { status: 502 },
        );
  }

  return isFormPost ? back("received") : NextResponse.json({ ok: true });
}
