import {
  CONSENT,
  CONSENT_CHANGE_EVENT,
  CONSENT_STORAGE_KEY,
  getConsent,
  onConsentChange,
  setConsent,
} from "../consent";

describe("consent store", () => {
  beforeEach(() => window.localStorage.clear());

  test("returns null before the visitor chooses", () => {
    expect(getConsent()).toBeNull();
  });

  test("persists a timestamped choice and notifies listeners", () => {
    const seen = [];
    const off = onConsentChange((s) => seen.push(s));
    setConsent(CONSENT.GRANTED);
    off();
    setConsent(CONSENT.DENIED);

    expect(seen).toEqual([CONSENT.GRANTED]);
    expect(getConsent()).toBe(CONSENT.DENIED);
    const stored = JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY));
    expect(stored.v).toBe(1);
    expect(Number.isNaN(Date.parse(stored.at))).toBe(false);
  });

  test("ignores invalid values and corrupt storage", () => {
    const spy = jest.fn();
    window.addEventListener(CONSENT_CHANGE_EVENT, spy);
    setConsent("maybe");
    window.removeEventListener(CONSENT_CHANGE_EVENT, spy);
    expect(spy).not.toHaveBeenCalled();
    expect(getConsent()).toBeNull();

    window.localStorage.setItem(CONSENT_STORAGE_KEY, "{not json");
    expect(getConsent()).toBeNull();
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ status: "yes" }));
    expect(getConsent()).toBeNull();
  });
});
