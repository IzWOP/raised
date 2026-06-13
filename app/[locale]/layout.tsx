import type { Metadata } from "next";
import { Sora, Inter, Geist_Mono } from "next/font/google";
import "../globals.css";
import { getContent, isLocale, locales } from "@/lib/content";
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
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://raisedagency.com"),
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        es: "/es",
        "x-default": "/en",
      },
    },
  };
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
        <SiteChrome content={content} locale={locale} />
        <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
        <Footer footer={content.footer} />
      </body>
    </html>
  );
}
