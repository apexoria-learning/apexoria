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
//   5. Meta Pixel (fbq)                         — mapped events only, and only
//      after the visitor accepts the consent banner (src/lib/metaPixel.js)
//
// GTM is loaded at runtime only when REACT_APP_GTM_ID is set (see
// initAnalytics below). If the env var is missing the site behaves exactly
// as before — no extra network requests, no GTM sniffer scripts.
//
// Usage:
//   import { trackEvent } from '@/lib/analytics';
//   trackEvent('lead_form_submit', { course: 'Salesforce Complete' });

import { track as vercelTrack } from "@vercel/analytics";
import { trackMetaEvent } from "./metaPixel";

const GTM_ID = process.env.REACT_APP_GTM_ID;

// Named events that also go to the Meta Pixel (consent-gated inside
// trackMetaEvent). Only Meta standard events, and never form values —
// course name is the only parameter we pass.
const WHATSAPP_CONTACT = () => ["Contact"];
const META_EVENT_MAP = {
  lead_form_submit_success: (p) => ["Lead", p.course ? { content_category: p.course } : undefined],
  whatsapp_click: WHATSAPP_CONTACT,
  mobile_bar_whatsapp_click: WHATSAPP_CONTACT,
  interview_prep_whatsapp_click: WHATSAPP_CONTACT,
  pricing_special_offer_whatsapp_click: WHATSAPP_CONTACT,
};

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
    const toMeta = META_EVENT_MAP[name];
    if (toMeta) {
      trackMetaEvent(...toMeta(params || {}));
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
