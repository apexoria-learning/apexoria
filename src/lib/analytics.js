// Lightweight analytics fan-out.
//
// The site already ships with a PostHog autocapture snippet in
// public/index.html AND @vercel/analytics rendered from App.js, so most
// pageview / click data is captured for free. This helper adds NAMED
// events on top for the conversions we care about (lead form submits,
// WhatsApp clicks, brochure downloads, CTA clicks), and forwards every
// event to whichever analytics stack is present:
//
//   1. window.posthog.capture(name, params)     — always fires (PostHog is preinstalled)
//   2. Vercel Analytics track(name, params)     — always fires (dynamic import)
//   3. window.dataLayer.push({ event, ...})     — fires if GTM is loaded
//   4. window.gtag('event', name, params)       — fires if GA4/gtag is loaded
//
// GTM is loaded at runtime only when REACT_APP_GTM_ID is set (see
// initAnalytics below). If the env var is missing the site behaves exactly
// as before — no extra network requests, no GTM sniffer scripts.
//
// Usage:
//   import { trackEvent } from '@/lib/analytics';
//   trackEvent('lead_form_submit', { course: 'Salesforce Complete' });

import { track as vercelTrack } from "@vercel/analytics";

const GTM_ID = process.env.REACT_APP_GTM_ID;

/**
 * Fire a named analytics event across every stack that's loaded.
 * Silently no-ops if nothing is present. Safe to call in any environment
 * (SSR, tests, prerender) — it guards `window` access.
 */
export function trackEvent(name, params = {}) {
  if (typeof window === "undefined" || !name) return;
  try {
    if (typeof window.posthog?.capture === "function") {
      window.posthog.capture(name, params);
    }
    if (typeof vercelTrack === "function") {
      vercelTrack(name, params);
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...params });
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  } catch {
    // Swallow — analytics must never break the UI.
  }
}

/**
 * Runtime GTM bootstrap. Called once from App.js. Injects the standard
 * GTM <script> tag and primes window.dataLayer only when
 * REACT_APP_GTM_ID is set at build time. Idempotent.
 */
export function initAnalytics() {
  if (typeof window === "undefined") return;
  if (!GTM_ID) return;
  if (window.__apexGtmInstalled) return;
  window.__apexGtmInstalled = true;

  // GTM standard install (https://developers.google.com/tag-platform/tag-manager/web)
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
  document.head.appendChild(script);
}
