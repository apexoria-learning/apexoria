import { Phone, Mail, Instagram, Linkedin, Facebook } from "lucide-react";
import { CONTACT, LOGO_URL } from "../../data";

export default function Footer({ onEnroll }) {
  const year = new Date().getFullYear();
  const links = [
    { label: "Courses", id: "featured-course" },
    { label: "Curriculum", id: "curriculum" },
    { label: "About", id: "why" },
    { label: "Contact", id: "contact" },
  ];
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

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
            <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-wider text-brand-bluesoft">Quick Links</h4>
            <ul className="space-y-3 text-sm text-white/70">
              {links.map((l) => (
                <li key={l.id}>
                  <button onClick={() => go(l.id)} className="hover:text-brand-gold transition-colors">{l.label}</button>
                </li>
              ))}
              <li><button className="hover:text-brand-gold transition-colors">Privacy Policy</button></li>
              <li><button className="hover:text-brand-gold transition-colors">Terms</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-wider text-brand-bluesoft">Contact</h4>
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
            <div className="flex items-center gap-3 mt-5">
              <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-colors">
                <Instagram size={18} />
              </a>
              <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (placeholder)" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue transition-colors">
                <Linkedin size={18} />
              </a>
              <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook (placeholder)" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue transition-colors">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-wider text-brand-bluesoft">Ready to start?</h4>
            <p className="text-white/60 text-sm mb-4">Limited seats each batch. Book your counselling call today.</p>
            <button
              data-testid="footer-enroll-btn"
              onClick={onEnroll}
              className="bg-brand-orange text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform"
            >
              Enroll Now
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-white/50 text-xs">
          <p>© {year} Apexoria Learning. All rights reserved.</p>
          <p>Instagram: {CONTACT.instagramHandle} · LinkedIn &amp; Facebook links are placeholders.</p>
        </div>
      </div>
    </footer>
  );
}
