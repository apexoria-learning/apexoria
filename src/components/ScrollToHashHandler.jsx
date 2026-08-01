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
    let retryHandle = null;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        // Prefer Lenis for momentum scroll; fallback to native smooth scroll
        if (window.__lenis) {
          window.__lenis.scrollTo(el);
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      } else if (retryHandle === null) {
        // Element not found — retry once (belt-and-suspenders for lazy sections)
        retryHandle = setTimeout(tryScroll, 250);
      }
    };

    // Let the target route render before attempting scroll
    requestAnimationFrame(tryScroll);

    return () => {
      if (retryHandle !== null) clearTimeout(retryHandle);
    };
  }, [location.pathname, location.hash]);

  return null;
}
