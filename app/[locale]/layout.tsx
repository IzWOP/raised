import type { Metadata } from "next";
import { Sora, Inter, Geist_Mono } from "next/font/google";
import "../globals.css";
import { getContent, isLocale, locales } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import SiteChrome from "@/components/SiteChrome";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = getContent(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        es: "/es",
        "es-MX": "/es",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      siteName: "Raised Agency",
      title: content.meta.title,
      description: content.meta.description,
      url: `/${locale}`,
      locale: locale === "es" ? "es_MX" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_MX"],
      images: [{ url: "/brand/logo-R-lockup.png", width: 999, height: 680 }],
    },
    twitter: {
      card: "summary_large_image",
      title: content.meta.title,
      description: content.meta.description,
      images: ["/brand/logo-R-lockup.png"],
    },
  };
}

function jsonLd(locale: "en" | "es", content: ReturnType<typeof getContent>) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: "Raised Agency",
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/brand/logo-R-lockup.png`,
    description: content.meta.description,
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Mexico" },
    ],
    knowsLanguage: ["en", "es"],
    serviceType: [
      "Business process automation",
      "Workflow and systems integration",
      "AI implementation",
      "Analytics and measurement",
    ],
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/${locale}#faq`,
    inLanguage: locale,
    mainEntity: content.audit.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return [organization, faq];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  return (
    <html
      lang={locale}
      className={`${sora.variable} ${inter.variable} ${geistMono.variable}`}
    >
      <body>
        {jsonLd(locale, content).map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <SiteChrome content={content} locale={locale} />
        <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
        <Footer footer={content.footer} />
      </body>
    </html>
  );
}
