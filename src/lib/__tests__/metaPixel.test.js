import { CONSENT, setConsent } from "../consent";
import {
  __resetMetaPixelForTests,
  isMetaPixelEnabled,
  isMetaPixelLoaded,
  loadMetaPixel,
  revokeMetaPixel,
  trackMetaEvent,
  trackMetaPageView,
} from "../metaPixel";

const PIXEL_ID = "123456789012345";
const fbScripts = () =>
  Array.from(document.querySelectorAll("script")).filter((s) => s.src.includes("connect.facebook.net"));
const queued = () => (window.fbq ? window.fbq.queue.map((args) => Array.from(args)) : []);

beforeEach(() => {
  __resetMetaPixelForTests();
  window.localStorage.clear();
  delete window.fbq;
  delete window._fbq;
  fbScripts().forEach((s) => s.remove());
  delete process.env.REACT_APP_META_PIXEL_ID;
});

describe("gate 1: pixel id", () => {
  test("inert when REACT_APP_META_PIXEL_ID is unset", () => {
    setConsent(CONSENT.GRANTED);
    expect(isMetaPixelEnabled()).toBe(false);
    expect(loadMetaPixel("/")).toBe(false);
    expect(window.fbq).toBeUndefined();
    expect(fbScripts()).toHaveLength(0);
  });

  test("inert when the id is malformed", () => {
    process.env.REACT_APP_META_PIXEL_ID = "fb-<script>";
    expect(isMetaPixelEnabled()).toBe(false);
  });
});

describe("gate 2: consent", () => {
  beforeEach(() => {
    process.env.REACT_APP_META_PIXEL_ID = PIXEL_ID;
  });

  test.each([[null], [CONSENT.DENIED]])("does not load when consent is %s", (status) => {
    if (status) setConsent(status);
    expect(loadMetaPixel("/")).toBe(false);
    expect(window.fbq).toBeUndefined();
    expect(fbScripts()).toHaveLength(0);
  });

  test("loads once after Accept, with autoConfig off and one PageView", () => {
    setConsent(CONSENT.GRANTED);
    expect(loadMetaPixel("/")).toBe(true);
    expect(loadMetaPixel("/")).toBe(true);

    expect(isMetaPixelLoaded()).toBe(true);
    expect(fbScripts()).toHaveLength(1);
    expect(fbScripts()[0].src).toBe("https://connect.facebook.net/en_US/fbevents.js");
    const calls = queued();
    expect(calls).toContainEqual(["set", "autoConfig", false, PIXEL_ID]);
    expect(calls).toContainEqual(["init", PIXEL_ID]);
    expect(calls.filter((c) => c[1] === "PageView")).toHaveLength(1);
  });

  test("fires PageView only on a new SPA path", () => {
    setConsent(CONSENT.GRANTED);
    loadMetaPixel("/");
    trackMetaPageView("/");
    trackMetaPageView("/courses");
    trackMetaPageView("/courses");
    expect(queued().filter((c) => c[1] === "PageView")).toHaveLength(2);
  });

  test("stops tracking and clears cookies after Reject", () => {
    setConsent(CONSENT.GRANTED);
    loadMetaPixel("/");
    document.cookie = "_fbp=fb.1.111.222; path=/";

    setConsent(CONSENT.DENIED);
    revokeMetaPixel();
    trackMetaEvent("Lead");
    trackMetaPageView("/privacy");

    const calls = queued();
    expect(calls).toContainEqual(["consent", "revoke"]);
    expect(calls.some((c) => c[1] === "Lead")).toBe(false);
    expect(document.cookie).not.toContain("_fbp");
  });
});
