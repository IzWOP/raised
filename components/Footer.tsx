import Image from "next/image";
import type { Content } from "@/lib/content/types";
import HUDLabel from "@/components/ui/HUDLabel";

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer({ footer }: { footer: Content["footer"] }) {
  return (
    <footer style={{ padding: "120px 0 44px" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "36px 40px 0",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Image
          src="/brand/logo-R-lockup.png"
          alt="Raised Agency"
          width={76}
          height={52}
          style={{ display: "block", objectFit: "contain" }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <HUDLabel size={11} color="#5F5F5F">
            {footer.domain}
          </HUDLabel>
          <HUDLabel size={11} color="#5F5F5F">
            {footer.copyright}
          </HUDLabel>
        </div>
      </div>
    </footer>
  );
}
