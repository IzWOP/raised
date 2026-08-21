import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ES_COUNTRIES = new Set([
  "ES", "MX", "AR", "CO", "CL", "PE", "EC", "GT", "CU", "BO",
  "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY", "VE", "PR",
]);

function detectLocale(request: NextRequest): "en" | "es" {
  // 1. Cookie
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie === "en" || cookie === "es") return cookie;

  // 2. Geo via Vercel header (Next 16 removed request.geo)
  const country = request.headers.get("x-vercel-ip-country");
  if (country && ES_COUNTRIES.has(country)) return "es";

  // 3. Accept-Language
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  if (acceptLanguage.toLowerCase().includes("es")) return "es";

  return "en";
}

// Locale-tag variants we recognize but don't serve directly.
// Maps the first path segment (lowercased) to the real locale.
function aliasLocale(segment: string): "en" | "es" | null {
  if (segment === "mx") return "es";
  const match = /^(en|es)-[a-z]{2,4}$/.exec(segment);
  return match ? (match[1] as "en" | "es") : null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Already localized — pass through
  if (/^\/(en|es)(\/|$)/.test(pathname)) {
    return NextResponse.next();
  }

  // Variant locale tags (/es-mx, /es-MX, /en-US, /mx) → permanent
  // redirect to the real locale, preserving any remaining path.
  const [, firstSegment = "", ...rest] = pathname.split("/");
  const alias = aliasLocale(firstSegment.toLowerCase());
  if (alias) {
    const url = request.nextUrl.clone();
    url.pathname = `/${alias}${rest.length ? `/${rest.join("/")}` : ""}`;
    return NextResponse.redirect(url, 308);
  }

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 31536000, // 1 year
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)" ],
};
