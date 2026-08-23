import { useEffect, useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { WHATSAPP_LINK } from "../../data";
import { trackEvent } from "@/lib/analytics";

/**
 * Sticky bottom action bar shown only on mobile/tablet widths (< lg).
 *
 * Rendered permanently in the DOM so its 60px reserved height doesn't
 * cause a CLS spike when it fades in — we only toggle opacity/pointer
 * events once the user has scrolled past ~400px (approximately the fold
 * on a phone hero). Keeps the primary conversion path one tap away as
 * soon as the hero CTA scrolls out of view.
 *
 * `onEnroll` is passed down from <App /> and is the same handler bound
 * to every other "Book a Free Demo Class" button on the page.
 */
export default function MobileCTABar({ onEnroll }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      data-testid="mobile-cta-bar"
      aria-hidden={!visible}
      className={`lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(15,23,42,0.08)] transition-opacity duration-200 ${
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch gap-2 px-3 py-2" style={{ minHeight: "60px" }}>
        <button
          type="button"
          data-testid="mobile-cta-demo"
          onClick={() => {
            trackEvent("mobile_bar_demo_click");
            onEnroll();
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-orange text-white font-bold text-sm px-3 shadow-md active:scale-95 transition-transform"
        >
          <Sparkles size={16} /> Book Free Demo
        </button>
        <a
          data-testid="mobile-cta-whatsapp"
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("mobile_bar_whatsapp_click")}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#25D366] text-white font-bold text-sm px-3 shadow-md active:scale-95 transition-transform"
        >
          <MessageCircle size={16} /> WhatsApp
        </a>
      </div>
    </div>
  );
}
