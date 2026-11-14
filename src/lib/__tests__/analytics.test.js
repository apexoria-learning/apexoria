import { trackEvent } from "../analytics";
import { CONSENT, setConsent } from "../consent";
import { __resetMetaPixelForTests, loadMetaPixel } from "../metaPixel";

jest.mock("@vercel/analytics", () => ({ track: jest.fn() }));

const metaTracks = () =>
  window.fbq.queue.map((a) => Array.from(a)).filter((c) => c[0] === "track" && c[1] !== "PageView");

beforeEach(() => {
  __resetMetaPixelForTests();
  window.localStorage.clear();
  delete window.fbq;
  delete window._fbq;
  process.env.REACT_APP_META_PIXEL_ID = "123456789012345";
  setConsent(CONSENT.GRANTED);
  loadMetaPixel("/");
});

afterAll(() => {
  delete process.env.REACT_APP_META_PIXEL_ID;
});

test("lead form success -> Meta Lead with course only (no form values)", () => {
  trackEvent("lead_form_submit_success", {
    course: "Salesforce Complete Course",
    batch: "Weekend",
    intent: "demo",
  });
  expect(metaTracks()).toEqual([
    ["track", "Lead", { content_category: "Salesforce Complete Course" }],
  ]);
});

test.each([
  "whatsapp_click",
  "mobile_bar_whatsapp_click",
  "interview_prep_whatsapp_click",
  "pricing_special_offer_whatsapp_click",
])("%s -> Meta Contact", (name) => {
  trackEvent(name, { location: "hero" });
  expect(metaTracks()).toEqual([["track", "Contact"]]);
});

test("unmapped events never reach Meta", () => {
  trackEvent("cta_click", { location: "hero" });
  trackEvent("faq_open", { index: 1 });
  expect(metaTracks()).toEqual([]);
});

test("nothing reaches Meta without consent", () => {
  setConsent(CONSENT.DENIED);
  trackEvent("lead_form_submit_success", { course: "X" });
  expect(metaTracks()).toEqual([]);
});
