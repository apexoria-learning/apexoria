import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CONSENT, CONSENT_OPEN_EVENT, getConsent, setConsent } from "@/lib/consent";
import {
  isMetaPixelEnabled,
  isMetaPixelLoaded,
  loadMetaPixel,
  revokeMetaPixel,
  trackMetaPageView,
} from "@/lib/metaPixel";
import { CONSENT_BANNER } from "@/constants/testIds";

/**
 * Cookie-consent banner + Meta Pixel lifecycle. Mounted once, above <Routes>.
 *
 * Renders nothing (and loads nothing) unless REACT_APP_META_PIXEL_ID is set,
 * so the site is unchanged until the pixel is configured in Vercel.
 * Never active on /admin (CMS).
 */
export default function ConsentBanner() {
  const { pathname } = useLocation();
  const enabled = isMetaPixelEnabled();
  const isAdmin = pathname.startsWith("/admin");
  const [open, setOpen] = useState(() => enabled && getConsent() === null);

  // First load (if consent was given on an earlier visit) + SPA route PageViews.
  useEffect(() => {
    if (!enabled || isAdmin) return;
    if (isMetaPixelLoaded()) trackMetaPageView(pathname);
    else loadMetaPixel(pathname);
  }, [enabled, isAdmin, pathname]);

  useEffect(() => {
    if (!enabled) return undefined;
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, [enabled]);

  const choose = useCallback(
    (status) => {
      setConsent(status);
      setOpen(false);
      if (status === CONSENT.GRANTED) loadMetaPixel(pathname);
      else revokeMetaPixel();
    },
    [pathname]
  );

  if (!enabled || isAdmin || !open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-banner-title"
      aria-describedby="consent-banner-desc"
      data-testid={CONSENT_BANNER.root}
      className="fixed z-[70] inset-x-3 bottom-3 lg:inset-x-auto lg:left-6 lg:bottom-6 lg:max-w-md rounded-2xl bg-navy text-white border border-white/10 shadow-2xl p-5"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <p id="consent-banner-title" className="font-display font-bold text-base">
        Cookies for our ads
      </p>
      <p id="consent-banner-desc" className="mt-2 text-sm text-white/75 leading-relaxed">
        With your OK, we use Meta (Facebook and Instagram) cookies to see which of our ads bring
        people here. We never send your form details to Meta. You can change this anytime from
        &ldquo;Cookie settings&rdquo; at the bottom of the page.{" "}
        <Link
          to="/privacy"
          data-testid={CONSENT_BANNER.privacyLink}
          className="underline underline-offset-2 hover:text-brand-gold transition-colors"
        >
          Privacy Policy
        </Link>
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          data-testid={CONSENT_BANNER.reject}
          onClick={() => choose(CONSENT.DENIED)}
          className="rounded-full border border-white/40 px-4 py-2.5 text-sm font-semibold hover:bg-white/10 transition-colors"
        >
          Reject
        </button>
        <button
          type="button"
          data-testid={CONSENT_BANNER.accept}
          onClick={() => choose(CONSENT.GRANTED)}
          className="rounded-full bg-white text-navy px-4 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
