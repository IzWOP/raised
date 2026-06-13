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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Already localized — pass through
  if (/^\/(en|es)(\/|$)/.test(pathname)) {
    return NextResponse.next();
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
