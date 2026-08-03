import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToHashHandler — fixes cross-route hash navigation (e.g., /courses → /#pricing).
 * 
 * React Router client-side navigation does NOT trigger browser auto-scroll to hash anchors
 * (that only happens on hard page load). This component listens for hash changes and scrolls
 * programmatically. Prefers Lenis if available (smooth momentum scroll), falls back to native.
 * 
 * Retries once (250ms delay) to handle lazy-loaded sections that may not be in the DOM yet
 * when the hash first arrives. Mirrors the retry pattern in App.js handleEnroll.
 * 
 * Mount once inside the Router tree in App.js (before Navbar). No visual output.
 */
export default function ScrollToHashHandler() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.slice(1);
    let cancelled = false;
    let attempts = 0;
    // Poll for up to ~3s (60 * 50ms). Lazy-loaded routes (e.g. /courses)
    // may not have their target section in the DOM when the effect first
    // fires — we need to keep looking until the chunk mounts.
    const MAX_ATTEMPTS = 60;
    const POLL_MS = 50;

    const NAV_HEIGHT_PX = 96;

    const scrollToTarget = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const targetY = Math.max(
        0,
        el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT_PX,
      );
      if (window.__lenis) {
        window.__lenis.scrollTo(targetY);
      } else {
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    };

    const tryScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) {
        // First pass — scroll to where the element currently is.
        scrollToTarget();
        // Corrective pass — content above the target (lazy images, chunks
        // loading into Suspense boundaries) can push the target further
        // down after the first scroll. Re-measure and re-scroll after a
        // brief settle window so we land accurately.
        setTimeout(() => {
          if (!cancelled) scrollToTarget();
        }, 500);
        return;
      }
      if (++attempts < MAX_ATTEMPTS) {
        setTimeout(tryScroll, POLL_MS);
      }
    };

    // Let the target route render before attempting scroll
    requestAnimationFrame(tryScroll);

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.hash, location.key]);

  return null;
}
