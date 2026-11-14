// Meta (Facebook / Instagram) Pixel — consent-gated.
//
// Two gates, both required before fbevents.js is ever requested:
//   1. REACT_APP_META_PIXEL_ID is set at build time (Vercel env var).
//      Unset = this whole module is inert and the consent banner never shows.
//   2. The visitor clicked "Accept" in the consent banner (src/lib/consent.js).
//
// Data minimisation: autoConfig is disabled so Meta does not scrape button
// text / page metadata, and we never pass form values (name, phone, email)
// to fbq. "Automatic Advanced Matching" must also stay OFF in Events Manager.

import { CONSENT, getConsent } from "./consent";

const FBEVENTS_SRC = "https://connect.facebook.net/en_US/fbevents.js";
const PIXEL_ID_RE = /^\d{10,20}$/;

let loaded = false;
let lastPagePath = null;

export function getMetaPixelId() {
  const id = (process.env.REACT_APP_META_PIXEL_ID || "").trim();
  return PIXEL_ID_RE.test(id) ? id : "";
}

export function isMetaPixelEnabled() {
  return Boolean(getMetaPixelId());
}

export function isMetaPixelLoaded() {
  return loaded;
}

// Meta's standard base-code stub, written out readably. Queues fbq() calls
// until fbevents.js arrives.
function installFbqStub() {
  if (window.fbq) return;
  const fbq = function (...args) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = FBEVENTS_SRC;
  document.head.appendChild(script);
}

/**
 * Loads the pixel and fires the first PageView. No-op unless the pixel id is
 * configured AND consent is granted. Returns true when the pixel is active.
 */
export function loadMetaPixel(currentPath) {
  if (typeof window === "undefined") return false;
  const id = getMetaPixelId();
  if (!id || getConsent() !== CONSENT.GRANTED) return false;

  if (loaded) {
    window.fbq("consent", "grant");
    return true;
  }

  installFbqStub();
  window.fbq("consent", "grant");
  window.fbq("set", "autoConfig", false, id);
  window.fbq("init", id);
  window.fbq("track", "PageView");
  loaded = true;
  lastPagePath = currentPath ?? window.location.pathname;
  return true;
}

/** SPA route changes: fire PageView once per distinct path. */
export function trackMetaPageView(path) {
  if (!loaded || getConsent() !== CONSENT.GRANTED) return;
  if (path === lastPagePath) return;
  lastPagePath = path;
  window.fbq("track", "PageView");
}

/** Standard events only (Lead, Contact, …). Silently no-ops without consent. */
export function trackMetaEvent(eventName, params) {
  if (!loaded || getConsent() !== CONSENT.GRANTED || !eventName) return;
  try {
    if (params && Object.keys(params).length) window.fbq("track", eventName, params);
    else window.fbq("track", eventName);
  } catch {
    // Analytics must never break the UI.
  }
}

function expireCookie(name) {
  const host = window.location.hostname;
  const parts = host.split(".");
  const domains = ["", host, `.${host}`];
  if (parts.length > 2) domains.push(`.${parts.slice(-2).join(".")}`);
  domains.forEach((d) => {
    document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
  });
}

/** Visitor withdrew consent: stop sending and clear Meta's first-party cookies. */
export function revokeMetaPixel() {
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "function") window.fbq("consent", "revoke");
  expireCookie("_fbp");
  expireCookie("_fbc");
}

// Test-only reset hook.
export function __resetMetaPixelForTests() {
  loaded = false;
  lastPagePath = null;
}
