import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  NavLink,
  useLocation,
} from "react-router-dom";
import { AdminContentProvider, useContent } from "./AdminContext";
import { useAdminAuth } from "./AdminAuth";
import { NAV, CLUSTERS, DEFAULT_ROUTE } from "./sections";
import CommitDialog from "./components/CommitDialog";
import ConfirmDialog from "./components/ConfirmDialog";
import { PageSkeleton } from "./components/Skeleton";
import {
  Menu,
  X,
  LogOut,
  RefreshCw,
  Save,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const PAGE_COMPONENTS = {
  contact: ContactPage,
  founder: FounderPage,
  images: ImagesPage,
  batches: BatchesPage,
  pricing: PricingPage,
  curriculum: CurriculumPage,
  downloads: DownloadsPage,
  testimonials: TestimonialsPage,
  faq: FaqPage,
  misc: MiscPage,
};

const CLUSTER_COLLAPSE_KEY = "apexoria.cms.clusterCollapse";

/* ------------------------------------------------------------- Sidebar */

function Sidebar({ onNavigate, closeMobile }) {
  const { dirtyKeys } = useContent();
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CLUSTER_COLLAPSE_KEY) || "{}");
    } catch {
      return {};
    }
  });

  const toggleCluster = (key) => {
    setCollapsed((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(CLUSTER_COLLAPSE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const isDirty = useCallback(
    (item) => item.dataKeys.some((k) => dirtyKeys.has(k)),
    [dirtyKeys]
  );

  return (
    <nav className="flex-1 overflow-y-auto py-3">
      {CLUSTERS.map((cluster) => {
        const items = NAV.filter((n) => n.cluster === cluster.key);
        const clusterDirty = items.some(isDirty);
        const isCollapsed = collapsed[cluster.key];
        return (
          <div key={cluster.key} className="mb-2">
            <button
              type="button"
              onClick={() => toggleCluster(cluster.key)}
              className="w-full flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-700"
            >
              {isCollapsed ? (
                <ChevronRight className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
              <span className="flex-1 text-left">{cluster.label}</span>
              {clusterDirty && (
                <span
                  className="h-1.5 w-1.5 rounded-full bg-amber-500"
                  title="Unsaved changes in this group"
                />
              )}
            </button>
            {!isCollapsed &&
              items.map((item) => {
                const Icon = item.icon;
                const dirty = isDirty(item);
                return (
                  <NavLink
                    key={item.route}
                    to={item.route}
                    onClick={() => {
                      onNavigate?.(item.route);
                      closeMobile?.();
                    }}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-slate-900 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate flex-1">{item.label}</span>
                    {dirty && (
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-amber-500"
                        title="Unsaved changes"
                      />
                    )}
                  </NavLink>
                );
              })}
          </div>
        );
      })}
    </nav>
  );
}

/* --------------------------------------------------------- Route wrap */

function SectionPage({ route }) {
  const Component = PAGE_COMPONENTS[route];
  if (!Component) return <Navigate to={DEFAULT_ROUTE} replace />;
  return <Component />;
}

/* --------------------------------------------------------- Main shell */

function Shell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commitOpen, setCommitOpen] = useState(false);
  const [reloadConfirmOpen, setReloadConfirmOpen] = useState(false);

  const { user, signOutNow } = useAdminAuth();
  const {
    loading,
    dirty,
    dirtySectionLabels,
    validationErrors,
    saving,
    content,
    save,
    reload,
    loadError,
  } = useContent();

  const location = useLocation();

  const activeRoute = location.pathname.split("/").filter(Boolean)[1] || DEFAULT_ROUTE;
  const activeNav = NAV.find((n) => n.route === activeRoute) || NAV[0];

  // --- Save handler ---
  const openCommit = useCallback(() => {
    if (!dirty || saving || loading) return;
    setCommitOpen(true);
  }, [dirty, saving, loading]);

  const handleConfirmSave = async (msg) => {
    try {
      await save(msg);
      setCommitOpen(false);
    } catch {
      /* toast already fired; keep dialog open so user can see the error */
    }
  };

  const defaultCommitMessage = useMemo(() => {
    if (!dirtySectionLabels.length) return `chore(cms): content update`;
    if (dirtySectionLabels.length === 1) {
      return `chore(cms): update ${dirtySectionLabels[0]}`;
    }
    return `chore(cms): update ${dirtySectionLabels.length} sections`;
  }, [dirtySectionLabels]);

  // --- Keyboard shortcuts ---
  useEffect(() => {
    const onKey = (e) => {
      const isSave = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s";
      if (isSave) {
        e.preventDefault();
        openCommit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openCommit]);

  // --- beforeunload guard ---
  useEffect(() => {
    if (!dirty) return undefined;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // --- Router blocker for internal navigation while dirty ---
  // Not needed: AdminContentProvider lives ABOVE Routes, so dirty state
  // survives internal /admin/* navigation. beforeunload covers reload/close.

  // --- Reload with confirm ---
  const handleReload = () => {
    if (dirty) setReloadConfirmOpen(true);
    else reload();
  };
  const handleConfirmReload = () => {
    setReloadConfirmOpen(false);
    reload();
  };

  // --- Cluster label lookup ---
  const clusterLabel =
    CLUSTERS.find((c) => c.key === activeNav.cluster)?.label || "";

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-white">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-3">
          <img
            src="/apexoria-logo.jpeg"
            alt=""
            className="h-9 w-9 rounded-full ring-1 ring-slate-200"
          />
          <div className="leading-tight">
            <div className="font-display font-semibold text-sm">Apexoria CMS</div>
            <div className="text-[11px] text-slate-500">Content Manager</div>
          </div>
        </div>
        <Sidebar />
        <div className="border-t border-slate-200 p-4 space-y-2">
          <a
            href="https://apexorialearning.in"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 text-xs text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 py-2"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View live site
          </a>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="/apexoria-logo.jpeg"
                  alt=""
                  className="h-8 w-8 rounded-full"
                />
                <span className="font-display font-semibold text-sm">
                  Apexoria CMS
                </span>
              </div>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar closeMobile={() => setMobileOpen(false)} />
            <div className="border-t p-4 space-y-2">
              <button
                onClick={signOutNow}
                className="w-full flex items-center justify-center gap-2 text-xs rounded-lg border py-2"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            className="lg:hidden p-1.5 -ml-1.5"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 flex items-center gap-1">
              {clusterLabel}
              {clusterLabel && <ChevronRight className="w-3 h-3" />}
              <span>Editing</span>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-semibold truncate flex items-center gap-2">
              {activeNav.label}
              {dirty && (
                <span
                  className="inline-flex h-2 w-2 rounded-full bg-amber-500"
                  aria-label="Unsaved changes"
                  title="Unsaved changes"
                />
              )}
            </h2>
          </div>

          {validationErrors.length > 0 && (
            <div
              className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-1 text-[11px] font-medium text-rose-700"
              title={`${validationErrors.length} validation error(s)`}
            >
              <AlertTriangle className="w-3 h-3" />
              {validationErrors.length} problem{validationErrors.length === 1 ? "" : "s"}
            </div>
          )}

          <button
            onClick={handleReload}
            disabled={loading || saving}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            title="Discard unsaved changes and reload from GitHub"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reload
          </button>
          <button
            onClick={openCommit}
            disabled={!dirty || saving || loading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
            aria-keyshortcuts="Control+S"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold uppercase"
                title={user?.email}
                aria-label="Account menu"
              >
                {(user?.email || "?").slice(0, 1)}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="truncate">
                {user?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  href="https://apexorialearning.in"
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-2" /> View live site
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOutNow}>
                <LogOut className="w-3.5 h-3.5 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading && <PageSkeleton />}
          {loadError && !loading && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700 mb-4 flex flex-wrap items-center gap-3">
              <span className="flex-1">{loadError}</span>
              <button
                onClick={reload}
                className="rounded-md border border-rose-300 px-3 py-1.5 text-xs font-medium hover:bg-rose-100"
              >
                Retry
              </button>
              <a
                href={`https://github.com/apexoria-learning/apexoria/blob/main/src/data.js`}
                target="_blank"
                rel="noreferrer"
                className="text-xs underline"
              >
                Open on GitHub ↗
              </a>
            </div>
          )}
          {!loading && content && (
            <Routes>
              <Route index element={<Navigate to={DEFAULT_ROUTE} replace />} />
              {NAV.map((n) => (
                <Route
                  key={n.route}
                  path={n.route}
                  element={<SectionPage route={n.route} />}
                />
              ))}
              <Route path="*" element={<Navigate to={DEFAULT_ROUTE} replace />} />
            </Routes>
          )}
        </div>
      </main>

      {/* Commit dialog */}
      <CommitDialog
        open={commitOpen}
        onOpenChange={setCommitOpen}
        dirtySections={dirtySectionLabels}
        defaultMessage={defaultCommitMessage}
        validationErrors={validationErrors}
        saving={saving}
        onConfirm={handleConfirmSave}
      />

      {/* Reload confirm */}
      <ConfirmDialog
        open={reloadConfirmOpen}
        onOpenChange={setReloadConfirmOpen}
        title="Discard unsaved changes?"
        description="Reloading fetches the latest committed content from GitHub. Any edits since the last save will be lost."
        confirmLabel="Discard & reload"
        destructive
        onConfirm={handleConfirmReload}
      />
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
