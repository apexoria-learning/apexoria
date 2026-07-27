import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Menu, X } from "lucide-react";
import { CONTACT, LOGO_URL } from "../../data";

const LINKS = [
  { label: "Home", id: "home" },
  { label: "Courses", id: "featured-course" },
  { label: "Pricing", id: "pricing" },
  { label: "Batches", id: "batches" },
  { label: "Placement", id: "placement" },
  { label: "Success Stories", id: "success-stories" },
  { label: "FAQ", id: "faq" },
  { label: "Contact", id: "contact" },
];

export default function Navbar({ onEnroll }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the nav link whose section is currently in view.
  // rootMargin: -80px top clears the fixed h-20 navbar; -60% bottom makes a
  // section become "active" only once its top passes ~40% down the viewport.
  // MutationObserver picks up lazy-loaded sections (React.lazy in App.js) as
  // they mount, so the underline advances past "Home" once they enter the DOM.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    const observed = new Set();
    const observeAvailable = () => {
      LINKS.forEach((l) => {
        if (observed.has(l.id)) return;
        const el = document.getElementById(l.id);
        if (el) {
          observer.observe(el);
          observed.add(l.id);
        }
      });
    };

    observeAvailable();
    const mo = new MutationObserver(observeAvailable);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      observer.disconnect();
    };
  }, []);

  const go = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) {
      if (window.__lenis) {
        window.__lenis.scrollTo(el);
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <motion.header
      data-testid="navbar"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-navy/5" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between h-20">
        <a
          data-testid="nav-logo"
          href="#home"
          onClick={(e) => { e.preventDefault(); go("home"); }}
          className="flex items-center gap-2.5 group"
        >
          <img src={LOGO_URL} alt="Apexoria Learning logo" width={44} height={44} loading="eager" decoding="async" className="h-11 w-11 rounded-lg object-cover" />
          <span className={`font-display font-extrabold text-lg tracking-tight ${scrolled ? "text-navy" : "text-white"}`}>
            Apexoria <span className="text-brand-blue">Learning</span>
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-6">
          {LINKS.map((l) => {
            const isActive = activeId === l.id;
            return (
              <a
                key={l.id}
                href={`#${l.id}`}
                data-testid={`nav-link-${l.id}`}
                onClick={(e) => { e.preventDefault(); go(l.id); }}
                aria-current={isActive ? "true" : undefined}
                className={`relative text-sm font-semibold transition-colors hover:text-brand-blue after:absolute after:left-0 after:right-0 after:-bottom-1.5 after:h-0.5 after:rounded-full after:bg-brand-blue after:transition-transform after:origin-left ${
                  isActive ? "text-brand-blue after:scale-x-100" : `after:scale-x-0 ${scrolled ? "text-navy" : "text-white"}`
                }`}
              >
                {l.label}
              </a>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <a
            data-testid="nav-phone"
            href={`tel:${CONTACT.phoneRaw}`}
            className={`flex items-center gap-2 text-sm font-bold ${scrolled ? "text-navy" : "text-white"}`}
          >
            <Phone size={16} className="text-brand-blue" />
            {CONTACT.phone}
          </a>
          <button
            data-testid="nav-enroll-btn"
            onClick={onEnroll}
            className="bg-brand-orange text-white font-bold text-sm px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-brand-orange/30"
          >
            Enroll Now
          </button>
        </div>

        <button
          data-testid="nav-hamburger"
          onClick={() => setOpen((v) => !v)}
          className={`lg:hidden ${scrolled ? "text-navy" : "text-white"}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      <motion.div
        id="mobile-menu"
        data-testid="mobile-menu"
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={`lg:hidden bg-white overflow-hidden border-t border-slate-100 ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div className="px-5 py-4 flex flex-col gap-1">
          {LINKS.map((l) => {
            const isActive = activeId === l.id;
            return (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => { e.preventDefault(); go(l.id); }}
                aria-current={isActive ? "true" : undefined}
                className={`text-left py-3 font-semibold border-b border-slate-100 transition-colors ${
                  isActive ? "text-brand-blue border-l-2 border-l-brand-blue pl-2" : "text-navy/80"
                }`}
              >
                {l.label}
              </a>
            );
          })}
          <a href={`tel:${CONTACT.phoneRaw}`} className="flex items-center gap-2 py-3 font-bold text-navy">
            <Phone size={16} className="text-brand-blue" /> {CONTACT.phone}
          </a>
          <button
            onClick={() => { setOpen(false); onEnroll(); }}
            className="bg-brand-orange text-white font-bold py-3.5 rounded-full mt-2"
          >
            Enroll Now
          </button>
        </div>
      </motion.div>
    </motion.header>
  );
}
