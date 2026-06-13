"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/content/types";

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();

  function switchLocale(loc: Locale) {
    document.cookie = `NEXT_LOCALE=${loc};path=/;max-age=31536000;samesite=lax`;
    router.push(`/${loc}`);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 3,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.16em",
      }}
    >
      <button
        type="button"
        data-cursor="VIEW"
        onClick={() => switchLocale("en")}
        aria-label="Switch to English"
        aria-pressed={locale === "en"}
        style={{
          all: "unset",
          cursor: "pointer",
          padding: "4px 7px",
          borderRadius: 5,
          color: locale === "en" ? "#FFFFFF" : "#5F5F5F",
        }}
      >
        EN
      </button>
      <span aria-hidden="true" style={{ color: "#2A2A2A" }}>/</span>
      <button
        type="button"
        data-cursor="VIEW"
        onClick={() => switchLocale("es")}
        aria-label="Cambiar a Español"
        aria-pressed={locale === "es"}
        style={{
          all: "unset",
          cursor: "pointer",
          padding: "4px 7px",
          borderRadius: 5,
          color: locale === "es" ? "#FFFFFF" : "#5F5F5F",
        }}
      >
        ES
      </button>
    </div>
  );
}
