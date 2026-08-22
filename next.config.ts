import type { NextConfig } from "next";

const securityHeaders = [
  // Force HTTPS for two years, subdomains included (site is https-only already)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  // Never render this site inside someone else's iframe (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site uses no camera/mic/geolocation — say so explicitly
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
