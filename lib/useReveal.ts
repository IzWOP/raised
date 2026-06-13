import { useEffect } from "react";

/**
 * IntersectionObserver reveal hook — ported from the prototype's initReveals().
 *
 * For every [data-rv] descendant of rootRef that is BELOW the fold at mount time:
 *   - sets opacity:0, transform:translateY(26px), and a CSS transition
 *   - observes with IO (rootMargin '0px 0px -8% 0px')
 *   - on intersection: opacity:1, transform:translateY(0), then unobserves
 *
 * Elements already on-screen at mount are left untouched (prototype parity).
 * Delay (ms) comes from data-rv-delay attribute; defaults to 0.
 *
 * Reduced-motion / no-IO: every [data-rv] is made visible immediately.
 */
export function useReveal(rootRef: React.RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasIO = typeof IntersectionObserver !== "undefined";

    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-rv]"));

    // Reduced-motion or no IO support: make everything visible immediately
    if (reduced || !hasIO) {
      els.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    const vh = window.innerHeight;

    els.forEach((el) => {
      // Only hide elements that start below 92% of the viewport height
      if (el.getBoundingClientRect().top > vh * 0.92) {
        const delay = el.dataset.rvDelay ?? "0";
        el.style.opacity = "0";
        el.style.transform = "translateY(26px)";
        el.style.transition =
          `opacity 0.85s cubic-bezier(0.22,1,0.36,1) ${delay}ms, ` +
          `transform 0.85s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
        io.observe(el);
      }
      // Elements already on-screen: left as-is (no hide, no observe)
    });

    return () => {
      io.disconnect();
    };
  }, [rootRef]);
}
