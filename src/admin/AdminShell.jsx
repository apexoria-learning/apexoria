import React, { useState } from "react";
import { AdminContentProvider, useContent } from "./AdminContext";
import { useAdminAuth } from "./AdminAuth";
import {
  Phone,
  User2,
  Calendar,
  Tag,
  BookOpen,
  MessageSquareQuote,
  HelpCircle,
  FileDown,
  Image as ImageIcon,
  Sparkles,
  Menu,
  X,
  LogOut,
  RefreshCw,
  Save,
  ExternalLink,
} from "lucide-react";
import ContactPage from "./pages/ContactPage";
import FounderPage from "./pages/FounderPage";
import BatchesPage from "./pages/BatchesPage";
import PricingPage from "./pages/PricingPage";
import CurriculumPage from "./pages/CurriculumPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import FaqPage from "./pages/FaqPage";
import DownloadsPage from "./pages/DownloadsPage";
import ImagesPage from "./pages/ImagesPage";
import MiscPage from "./pages/MiscPage";

const NAV = [
  { key: "contact", label: "Contact & Socials", icon: Phone, Component: ContactPage },
  { key: "founder", label: "Founder", icon: User2, Component: FounderPage },
  { key: "batches", label: "Batches", icon: Calendar, Component: BatchesPage },
  { key: "pricing", label: "Pricing & Offers", icon: Tag, Component: PricingPage },
  { key: "curriculum", label: "Curriculum", icon: BookOpen, Component: CurriculumPage },
  { key: "testimonials", label: "Testimonials", icon: MessageSquareQuote, Component: TestimonialsPage },
  { key: "faq", label: "FAQ", icon: HelpCircle, Component: FaqPage },
  { key: "downloads", label: "Downloads", icon: FileDown, Component: DownloadsPage },
  { key: "images", label: "Images", icon: ImageIcon, Component: ImagesPage },
  { key: "misc", label: "Stats · Value Props · Extras", icon: Sparkles, Component: MiscPage },
];

function Shell() {
  const [active, setActive] = useState("contact");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOutNow } = useAdminAuth();
  const { loading, dirty, saving, content, save, reload, loadError } = useContent();

  const activeNav = NAV.find((n) => n.key === active) || NAV[0];
  const ActiveComponent = activeNav.Component;

  const handleSave = async () => {
    const msg = window.prompt(
      "Commit message (optional):",
      `chore(cms): update ${activeNav.label}`
    );
    if (msg === null) return; // user cancelled
    try {
      await save(msg || undefined);
    } catch { /* toast already fired */ }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-white">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-3">
          <img src="/apexoria-logo.jpeg" alt="" className="h-9 w-9 rounded-full ring-1 ring-slate-200" />
          <div className="leading-tight">
            <div className="font-display font-semibold text-sm">Apexoria CMS</div>
            <div className="text-[11px] text-slate-500">Content Manager</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            const activeCls = active === item.key
              ? "bg-slate-900 text-white"
              : "text-slate-700 hover:bg-slate-100";
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition ${activeCls}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-4 space-y-2">
          <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
          <a
            href="https://apexorialearning.in"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 text-xs text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 py-2"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View live site
          </a>
          <button
            onClick={signOutNow}
            className="w-full flex items-center justify-center gap-2 text-xs text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 py-2"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/apexoria-logo.jpeg" alt="" className="h-8 w-8 rounded-full" />
                <span className="font-display font-semibold text-sm">Apexoria CMS</span>
              </div>
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3">
              {NAV.map((item) => {
                const Icon = item.icon;
                const activeCls = active === item.key
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100";
                return (
                  <button
                    key={item.key}
                    onClick={() => { setActive(item.key); setMobileOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium ${activeCls}`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <div className="border-t p-4 space-y-2">
              <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
              <button onClick={signOutNow} className="w-full flex items-center justify-center gap-2 text-xs rounded-lg border py-2">
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center gap-3">
          <button className="lg:hidden p-1.5 -ml-1.5" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-slate-500">Editing</div>
            <h2 className="font-display text-lg sm:text-xl font-semibold truncate">{activeNav.label}</h2>
          </div>
          <button
            onClick={reload}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            title="Discard unsaved changes and reload from GitHub"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reload
          </button>
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading && (
            <div className="text-center text-sm text-slate-500 py-16">Loading current content from GitHub…</div>
          )}
          {loadError && !loading && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700 mb-4">
              {loadError}
              <button onClick={reload} className="ml-2 underline">retry</button>
            </div>
          )}
          {!loading && content && <ActiveComponent />}
        </div>
      </main>
    </div>
  );
}

export default function AdminShell() {
  return (
    <AdminContentProvider>
      <Shell />
    </AdminContentProvider>
  );
}
