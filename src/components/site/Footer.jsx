import { useState } from "react";
import { Phone, Mail, Download, Heart, FileText } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CONTACT, LOGO_URL, RESOURCES } from "../../data";
import BrochureGateDialog from "./BrochureGateDialog";
import { trackEvent } from "@/lib/analytics";

// Map a Resource label ("LWC Notes", "Apex Notes", "QA Notes") to the
// exact Source dropdown value used by the "Apexoria Learning Magnet
// Form" (see CMS_SETUP.md). Anything not matching the "X Notes" pattern
// falls back to `Notes - <label>` — Google Forms will silently drop the
// row if the string isn't a valid dropdown option, but we still let the
// user download the file (fail-open behaviour inherited from the dialog).
function toSourceLabel(label) {
  const m = /^(.+)\s+Notes$/i.exec(label || "");
  return `Notes - ${m ? m[1] : label}`;
}

export default function Footer() {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const [gate, setGate] = useState({ open: false, sourceLabel: "", fileUrl: "", fileTitle: "" });
  const links = [
    { label: "Courses", href: "/courses" },
    { label: "About", id: "why" },
    { label: "Contact", id: "contact" },
  ];
  const go = (id) => {
    // If we're not on the home route, hop back to "/" and let the hash
    // do the scroll on mount. The below-fold sections lazy-load, so the
    // browser's native hash resolution races the lazy chunks — Navbar's
    // MutationObserver-based scroll-spy handles that on the target page.
    if (!isHomePage) {
      navigate(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      if (window.__lenis) {
        window.__lenis.scrollTo(el);
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const openResourceGate = (path, label) => {
    const sourceLabel = toSourceLabel(label);
    trackEvent("brochure_gate_open", { location: "footer_resource", source: sourceLabel });
    setGate({ open: true, sourceLabel, fileUrl: path, fileTitle: label });
  };

  return (
    <footer data-testid="footer" className="bg-navy grain relative text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 pb-14 border-b border-white/10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src={LOGO_URL} alt="Apexoria Learning" width={44} height={44} loading="lazy" decoding="async" className="h-11 w-11 rounded-lg" />
              <span className="font-display font-extrabold text-lg">Apexoria</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Reaching the summit of Salesforce mastery — job-ready training with real placement support.
            </p>
          </div>

          <div>
            <h3 className="font-display font-bold mb-4 text-sm uppercase tracking-wider text-brand-bluesoft">Quick Links</h3>
            <ul className="space-y-3 text-sm text-white/70">
              {links.map((l) => {
                if (l.href) {
                  // Route link (react-router-dom)
                  return (
                    <li key={l.href}>
                      <Link to={l.href} className="hover:text-brand-gold transition-colors">{l.label}</Link>
                    </li>
                  );
                }
                // Anchor link — cross-route if off-homepage
                return (
                  <li key={l.id}>
                    {isHomePage ? (
                      <a href={`#${l.id}`} onClick={(e) => { e.preventDefault(); go(l.id); }} className="hover:text-brand-gold transition-colors">{l.label}</a>
                    ) : (
                      <Link to={`/#${l.id}`} className="hover:text-brand-gold transition-colors">{l.label}</Link>
                    )}
                  </li>
                );
              })}
              <li><Link to="/privacy" data-testid="footer-privacy-link" className="hover:text-brand-gold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" data-testid="footer-terms-link" className="hover:text-brand-gold transition-colors">Terms</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold mb-4 text-sm uppercase tracking-wider text-brand-bluesoft">Contact</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a href={`tel:${CONTACT.phoneRaw}`} className="flex items-center gap-2 hover:text-brand-gold transition-colors">
                  <Phone size={15} className="text-brand-blue" /> {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-brand-blue" /> {CONTACT.email}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold mb-4 text-sm uppercase tracking-wider text-brand-bluesoft">Resources</h3>
            <p className="text-white/60 text-sm mb-4">
              Free study notes to help you prep for Salesforce Development & QA roles.
            </p>
            <ul className="space-y-2.5">
              {RESOURCES.map((r) => (
                <li key={r.file}>
                  <button
                    data-testid={`footer-resource-${r.file.split("/").pop().replace(/\.pdf$/, "")}`}
                    onClick={() => openResourceGate(r.file, r.label)}
                    className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-brand-gold transition-colors"
                  >
                    <FileText size={16} className="text-brand-blue" /> {r.label}
                    <Download size={14} className="opacity-60" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-white/50 text-xs">
          <p>© {year} Apexoria Learning. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart size={13} className="fill-brand-orange text-brand-orange" /> by Salesforce enthusiasts
          </p>
        </div>
      </div>

      <BrochureGateDialog
        open={gate.open}
        onOpenChange={(open) => setGate((g) => ({ ...g, open }))}
        sourceLabel={gate.sourceLabel}
        fileUrl={gate.fileUrl}
        fileTitle={gate.fileTitle}
      />
    </footer>
  );
}
