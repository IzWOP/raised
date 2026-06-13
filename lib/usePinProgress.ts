import { useEffect, useRef } from "react";
import { clamp01 } from "@/lib/scene/store";

/**
 * Sticky-pin progress hook — ported from the prototype's pin(el).
 *
 * Computes progress = clamp01(-rect.top / (rect.height - window.innerHeight))
 * for a tall outer container whose inner child is position:sticky.
 *
 * Calls onProgress(p) on mount, on scroll (passive), and on resize.
 * Cleans up listeners on unmount.
 */
export function usePinProgress(
  ref: React.RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
): void {
  const onProgressRef = useRef(onProgress);
  useEffect(() => {
    onProgressRef.current = onProgress;
  });

  useEffect(() => {
    const compute = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const denom = r.height - window.innerHeight;
      if (denom <= 0) return;
      const p = clamp01(-r.top / denom);
      onProgressRef.current(p);
    };

    compute();

    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute, { passive: true });

    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [ref]);
}
