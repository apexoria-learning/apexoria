// Visitor consent for non-essential (advertising) cookies.
//
// Stored in localStorage as { status, at, v } so we keep a timestamped
// record of the choice on the visitor's own device. Nothing is sent to a
// server. Components subscribe via onConsentChange(); the footer's
// "Cookie settings" link re-opens the banner via openConsentSettings().
//
// Scope today: the Meta Pixel only (see src/lib/metaPixel.js). GA4 still
// loads unconditionally from public/index.html — partner decision
// 2026-11-14, see .github/GOTCHAS.md.

export const CONSENT_STORAGE_KEY = "apex_consent_v1";
export const CONSENT_CHANGE_EVENT = "apex:consent-change";
export const CONSENT_OPEN_EVENT = "apex:consent-open";

export const CONSENT = Object.freeze({
  GRANTED: "granted",
  DENIED: "denied",
});

const VALID = new Set([CONSENT.GRANTED, CONSENT.DENIED]);

/** Returns "granted", "denied", or null when the visitor hasn't chosen yet. */
export function getConsent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return VALID.has(parsed?.status) ? parsed.status : null;
  } catch {
    return null;
  }
}

export function setConsent(status) {
  if (typeof window === "undefined" || !VALID.has(status)) return;
  try {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ status, at: new Date().toISOString(), v: 1 })
    );
  } catch {
    // Private mode / storage full — the choice still applies for this page view.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: status }));
}

/** Subscribe to consent changes. Returns an unsubscribe function. */
export function onConsentChange(callback) {
  if (typeof window === "undefined") return () => {};
  const handler = (e) => callback(e.detail);
  window.addEventListener(CONSENT_CHANGE_EVENT, handler);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, handler);
}

export function openConsentSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
}
