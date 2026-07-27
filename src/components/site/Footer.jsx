import { Phone, Mail, Download, Heart, FileText } from "lucide-react";
import { toast } from "sonner";
import { CONTACT, LOGO_URL, RESOURCES } from "../../data";

export default function Footer() {
  const year = new Date().getFullYear();
  const links = [
    { label: "Courses", id: "featured-course" },
    { label: "Curriculum", id: "curriculum" },
    { label: "About", id: "why" },
    { label: "Contact", id: "contact" },
  ];
  const go = (id) => {
    const el = document.getElementById(id);
    if (el) {
      if (window.__lenis) {
        window.__lenis.scrollTo(el);
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleResourceDownload = async (path, label) => {
    try {
      const res = await fetch(path, { method: "HEAD" });
      if (res.ok) {
        window.open(path, "_blank", "noopener,noreferrer");
      } else {
        toast.info(`${label} will be available shortly. Please reach out on WhatsApp for a copy.`);
      }
    } catch {
      toast.info(`${label} will be available shortly. Please reach out on WhatsApp for a copy.`);
    }
  };

  return (
    <footer data-testid="footer" className="bg-navy grain relative text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 pb-14 border-b border-white/10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src={LOGO_URL} alt="Apexoria Learning" className="h-11 w-11 rounded-lg" />
              <span className="font-display font-extrabold text-lg">Apexoria</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Reaching the summit of Salesforce mastery — job-ready training with real placement support.
            </p>
          </div>

          <div>
            <h3 className="font-display font-bold mb-4 text-sm uppercase tracking-wider text-brand-bluesoft">Quick Links</h3>
            <ul className="space-y-3 text-sm text-white/70">
              {links.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={(e) => { e.preventDefault(); go(l.id); }} className="hover:text-brand-gold transition-colors">{l.label}</a>
                </li>
              ))}
              <li><button className="hover:text-brand-gold transition-colors">Privacy Policy</button></li>
              <li><button className="hover:text-brand-gold transition-colors">Terms</button></li>
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
                    onClick={() => handleResourceDownload(r.file, r.label)}
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
    </footer>
  );
}
