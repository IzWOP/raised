"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Content } from "@/lib/content/types";
import HUDLabel from "@/components/ui/HUDLabel";
import StatusDot from "@/components/ui/StatusDot";
import type { Status } from "@/lib/content/types";

type Phase = "idle" | "submitting" | "success" | "error";

// Dot color mirrors the terminal's state: awaiting → transmitting → received / retry.
const DOT: Record<Phase, { status: Status; pulse: boolean }> = {
  idle: { status: "ok", pulse: true },
  submitting: { status: "warn", pulse: true },
  success: { status: "ok", pulse: false },
  error: { status: "crit", pulse: false },
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "#5F5F5F",
  marginBottom: 9,
};

export default function AuditIntake({
  intake,
  locale,
}: {
  intake: Content["finalCta"]["intake"];
  locale: string;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const uid = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const fid = (name: string) => `${uid}-${name}`;

  // No-JS fallback: the native form POST redirects back with ?audit=received|error.
  useEffect(() => {
    const result = new URLSearchParams(window.location.search).get("audit");
    if (result !== "received" && result !== "error") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing initial phase from window.location (the no-JS redirect result), which cannot be read during SSR
    setPhase(result === "received" ? "success" : "error");
  }, []);

  // Move focus to the confirmation heading so it's announced and reachable.
  useEffect(() => {
    if (phase === "success") headingRef.current?.focus();
  }, [phase]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (phase === "submitting") return;
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setPhase("submitting");
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setPhase("success");
    } catch {
      setPhase("error");
    }
  }

  const f = intake.fields;
  const submitting = phase === "submitting";

  const field = (
    name: string,
    fieldLabel: string,
    input: React.ReactNode,
  ) => (
    <div>
      <label htmlFor={fid(name)} style={labelStyle}>
        {fieldLabel}
      </label>
      {input}
    </div>
  );

  return (
    <div
      data-rv=""
      data-rv-delay="200"
      style={{
        width: "100%",
        maxWidth: 560,
        margin: "48px auto 0",
        textAlign: "left",
        background: "#0B0B0B",
        border: "1px solid #2A2A2A",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "var(--shadow-inset)",
      }}
    >
      {/* Terminal header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "14px 22px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <StatusDot
          status={DOT[phase].status}
          pulse={DOT[phase].pulse}
          pulseDur={2.4}
          size={7}
        />
        <HUDLabel size={12} color="#8C8C8C" style={{ marginLeft: 10 }}>
          {intake.terminalTitle}
        </HUDLabel>
      </div>

      <div style={{ padding: "28px 30px 32px" }}>
        {phase === "success" ? (
          <div role="status" aria-live="polite">
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#8C8C8C",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 26,
              }}
            >
              {intake.success.lines.map((line, i) => (
                <span
                  key={line}
                  className="intake-boot-line"
                  style={{
                    animationDelay: `${i * 0.16}s`,
                    color:
                      i === intake.success.lines.length - 1
                        ? "#7fae8a"
                        : undefined,
                  }}
                >
                  {line}
                </span>
              ))}
            </div>
            <h3
              ref={headingRef}
              tabIndex={-1}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: "-0.015em",
                color: "#FFFFFF",
                margin: 0,
                outline: "none",
              }}
            >
              {intake.success.heading}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 16,
                lineHeight: 1.6,
                color: "#8C8C8C",
                margin: "14px 0 0",
                maxWidth: 440,
              }}
            >
              {intake.success.body}
            </p>
          </div>
        ) : (
          <form
            action="/api/audit"
            method="post"
            onSubmit={onSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            <input type="hidden" name="locale" value={locale} />

            {/* Short fields — two columns, collapse to one on mobile */}
            <div
              data-grid=""
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 18,
              }}
            >
              {field(
                "name",
                f.name.label,
                <input
                  id={fid("name")}
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder={f.name.placeholder}
                  className="intake-field"
                />,
              )}
              {field(
                "company",
                f.company.label,
                <input
                  id={fid("company")}
                  name="company"
                  type="text"
                  required
                  autoComplete="organization"
                  placeholder={f.company.placeholder}
                  className="intake-field"
                />,
              )}
              {field(
                "email",
                f.email.label,
                <input
                  id={fid("email")}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={f.email.placeholder}
                  className="intake-field"
                />,
              )}
              {field(
                "teamSize",
                f.teamSize.label,
                <select
                  id={fid("teamSize")}
                  name="teamSize"
                  defaultValue=""
                  className="intake-field"
                >
                  <option value="" disabled>
                    {f.teamSize.placeholder}
                  </option>
                  {f.teamSize.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>,
              )}
            </div>

            {field(
              "stack",
              f.stack.label,
              <input
                id={fid("stack")}
                name="stack"
                type="text"
                autoComplete="off"
                placeholder={f.stack.placeholder}
                className="intake-field"
              />,
            )}

            {field(
              "bottleneck",
              f.bottleneck.label,
              <textarea
                id={fid("bottleneck")}
                name="bottleneck"
                required
                rows={3}
                placeholder={f.bottleneck.placeholder}
                className="intake-field"
              />,
            )}

            <button
              type="submit"
              disabled={submitting}
              data-cursor="BOOK"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                width: "100%",
                marginTop: 6,
                background: "#FFFFFF",
                color: "#000000",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: 16,
                border: "none",
                borderRadius: 8,
                padding: "17px 32px",
                cursor: submitting ? "wait" : "pointer",
                boxShadow: "var(--shadow-glow)",
                opacity: submitting ? 0.85 : 1,
                animation: submitting
                  ? undefined
                  : "breathe 3.6s ease-in-out infinite",
                transition: "opacity 0.3s var(--ease-out)",
              }}
            >
              {submitting && (
                <span
                  aria-hidden="true"
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: "50%",
                    border: "2px solid rgba(0,0,0,0.25)",
                    borderTopColor: "#000000",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
              )}
              {submitting ? intake.submitting : intake.submit}
            </button>

            {phase === "error" && (
              <p
                role="alert"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: "#c08585",
                  margin: 0,
                }}
              >
                {intake.error}
              </p>
            )}

            <HUDLabel
              size={11}
              color="#5F5F5F"
              style={{ letterSpacing: "0.1em", textAlign: "center", marginTop: 2 }}
            >
              {intake.consent}
            </HUDLabel>
          </form>
        )}
      </div>
    </div>
  );
}
