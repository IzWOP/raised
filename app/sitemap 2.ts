import type { MetadataRoute } from "next";
import { locales } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const languages = {
  en: `${SITE_URL}/en`,
  es: `${SITE_URL}/es`,
  "x-default": `${SITE_URL}/en`,
};

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: { languages },
  }));
}
