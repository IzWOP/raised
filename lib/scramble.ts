// Text-scramble utilities ported from the prototype.
// Two flavours: nav hover (interval, 8 frames) and CTA reveal (rAF, ~380ms).

const NAV_CHARS = "—<>/[]{}=+*^?#_";
const CTA_CHARS = "!<>-_/[]{}=+*^?#";

interface Scrambleable extends HTMLElement {
  _scr?: number | null;
  _orig?: string;
}

/** nav-link hover scramble: 8 frames × 36ms (prototype scrambleEnter). */
export function scrambleNav(el: Scrambleable) {
  if (el._scr != null) return;
  const orig = el._orig ?? (el._orig = el.textContent ?? "");
  let f = 0;
  el._scr = window.setInterval(() => {
    f++;
    el.textContent = orig
      .split("")
      .map((c, i) =>
        i < (f / 8) * orig.length
          ? c
          : c === " "
            ? " "
            : NAV_CHARS[(Math.random() * NAV_CHARS.length) | 0],
      )
      .join("");
    if (f >= 8) {
      clearInterval(el._scr!);
      el._scr = null;
      el.textContent = orig;
    }
  }, 36);
}

/** CTA label reveal scramble over `dur` ms (prototype ctaEnter). */
export function scrambleReveal(el: Scrambleable, dur = 380) {
  if (el._scr != null) return;
  const orig = el._orig ?? (el._orig = el.textContent ?? "");
  const start = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / dur);
    const reveal = Math.floor(p * orig.length);
    let out = "";
    for (let i = 0; i < orig.length; i++) {
      const c = orig[i];
      out += i < reveal || c === " " ? c : CTA_CHARS[(Math.random() * CTA_CHARS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) {
      el._scr = requestAnimationFrame(tick);
    } else {
      el.textContent = orig;
      el._scr = null;
    }
  };
  el._scr = requestAnimationFrame(tick);
}

/** clear any in-flight scramble + cached original (used on locale change). */
export function resetScramble(el: Scrambleable) {
  if (el._scr != null) {
    clearInterval(el._scr);
    cancelAnimationFrame(el._scr);
    el._scr = null;
  }
  delete el._orig;
}
