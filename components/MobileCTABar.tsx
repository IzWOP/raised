import type { CSSProperties } from "react";

// Persistent sticky CTA bar shown ONLY on mobile (<1024px).
// Visibility is gated by a global rule in app/globals.css:
//   @media (max-width:1023px){[data-mobile-cta]{display:block}}
// The inline display:"none" base keeps it hidden everywhere else (incl. SSR/desktop).
const barStyle: CSSProperties = {
  display: "none",
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 80,
  background: "rgba(10,10,10,0.92)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderTop: "1px solid #2A2A2A",
  padding: "12px 16px",
  paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
};

const ctaStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  minHeight: 52,
  background: "linear-gradient(180deg, #FFFFFF 0%, #D9D9D9 100%)",
  color: "#000000",
  fontFamily: "var(--font-display)",
  fontWeight: 600,
  fontSize: 15,
  textDecoration: "none",
  borderRadius: 8,
  boxShadow: "var(--shadow-glow)",
  whiteSpace: "nowrap",
};

export default function MobileCTABar({
  label,
  href = "#audit",
}: {
  label: string;
  href?: string;
}) {
  return (
    <div data-mobile-cta="" style={barStyle}>
      <a href={href} data-cursor="BOOK" style={ctaStyle}>
        {label}
      </a>
    </div>
  );
}
