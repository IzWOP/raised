import type { Content, Locale } from "./types";
import { en } from "./en";
import { es } from "./es";

export const locales: Locale[] = ["en", "es"];
export const defaultLocale: Locale = "en";

const dictionaries: Record<Locale, Content> = { en, es };

export function getContent(locale: Locale): Content {
  return dictionaries[locale] ?? en;
}

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "es";
}

export type { Content, Locale };
