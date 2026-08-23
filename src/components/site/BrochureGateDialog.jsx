import { useEffect, useRef, useState } from "react";
import { Loader2, Download, Lock } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { trackEvent } from "@/lib/analytics";

// Small lead-gate dialog reused by:
//   - FinalCTA's "Download Brochure" button
//   - Footer's LWC / Apex / QA notes buttons
//
// Contract: caller controls `open` / `onOpenChange` and passes the file's
// public URL + a Source label that MUST exactly match a dropdown option in
// the "Apexoria Learning Magnet Form" (see CMS_SETUP.md for the 4 valid
// values). On successful submit we POST Name + Phone + Source no-cors to
// the form's formResponse endpoint, then HEAD-check the file:
//   - HEAD 200 → open in a new tab (the actual download).
//   - HEAD 404 or network error → close dialog, show a graceful toast.
//
// Fail-open policy: if any REACT_APP_GF_DL_* env var is missing at build
// time, we skip the POST and still deliver the file. Better UX than a
// hard blocker if Vercel env drift happens.

const EMPTY = { full_name: "", phone: "", company_website: "" };

// Same phone regex as LeadFormFields.jsx (Indian mobile, optional +91).
const PHONE_RE = /^(?:\+?91)?[6-9]\d{9}$/;

// Separate cooldown key from the main lead form so a user who just
// submitted the counselling form isn't blocked from downloading notes.
const COOLDOWN_KEY = "apex_download_last";
const COOLDOWN_MS = 12000;

function hasEnvConfig() {
  return Boolean(
    process.env.REACT_APP_GF_DL_ACTION &&
      process.env.REACT_APP_GF_DL_ENTRY_NAME &&
      process.env.REACT_APP_GF_DL_ENTRY_PHONE &&
      process.env.REACT_APP_GF_DL_ENTRY_SOURCE
  );
}

async function deliverFile(fileUrl, fileTitle) {
  try {
    const res = await fetch(fileUrl, { method: "HEAD" });
    if (res.ok) {
      trackEvent("download_success", { source: fileTitle, file: fileUrl });
      window.open(fileUrl, "_blank", "noopener,noreferrer");
      return true;
    }
  } catch {
    // Fall through to the graceful toast below.
  }
  trackEvent("download_missing", { source: fileTitle, file: fileUrl });
  toast.info(
    `${fileTitle} will be available shortly. Please reach out on WhatsApp for a copy.`
  );
  return false;
}

export default function BrochureGateDialog({
  open,
  onOpenChange,
  sourceLabel,
  fileUrl,
  fileTitle,
}) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const openedAt = useRef(0);

  // Reset form + capture the mount timestamp every time the dialog opens.
  // openedAt drives the 2s time-trap (identical guard to LeadFormFields).
  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setErrors({});
      openedAt.current = Date.now();
    }
  }, [open]);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = "Please enter your name";
    const phone = form.phone.replace(/[\s-]/g, "");
    if (!PHONE_RE.test(phone)) e.phone = "Enter a valid Indian mobile number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const finish = async () => {
    onOpenChange(false);
    // Small delay so the close animation runs before we open the new tab —
    // otherwise the popup blocker on some browsers treats the sequence as
    // background activity and swallows the tab.
    await new Promise((r) => setTimeout(r, 150));
    await deliverFile(fileUrl, fileTitle);
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (loading) return;

    // Honeypot — silently pretend success if the trap field was filled.
    if (form.company_website) {
      trackEvent("download_gate_honeypot", { source: sourceLabel });
      await finish();
      return;
    }

    // 2s time-trap — bots often auto-fill in < 200ms.
    if (Date.now() - openedAt.current < 2000) {
      trackEvent("download_gate_time_trap", { source: sourceLabel });
      await finish();
      return;
    }

    // localStorage cooldown so a single visitor can't spam the form.
    const last = parseInt(localStorage.getItem(COOLDOWN_KEY) || "0", 10);
    if (Date.now() - last < COOLDOWN_MS) {
      toast.error("Please wait a few seconds before requesting another download.");
      return;
    }

    if (!validate()) return;
    setLoading(true);

    // Fail-open: no env config -> skip POST, still deliver the file so the
    // learner isn't punished for our config drift.
    if (!hasEnvConfig()) {
      // eslint-disable-next-line no-console
      console.warn(
        "[BrochureGateDialog] REACT_APP_GF_DL_* env vars missing — skipping lead POST."
      );
      trackEvent("download_gate_env_missing", { source: sourceLabel });
      await finish();
      setLoading(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append(process.env.REACT_APP_GF_DL_ENTRY_NAME, form.full_name);
      fd.append(process.env.REACT_APP_GF_DL_ENTRY_PHONE, form.phone);
      fd.append(process.env.REACT_APP_GF_DL_ENTRY_SOURCE, sourceLabel);

      await fetch(process.env.REACT_APP_GF_DL_ACTION, {
        method: "POST",
        mode: "no-cors",
        body: fd,
      });

      localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      trackEvent("download_gate_submit", { source: sourceLabel });
      await finish();
    } catch {
      // POST failed — still deliver the file (fail-open).
      trackEvent("download_gate_submit_error", { source: sourceLabel });
      await finish();
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (k) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue transition ${
      errors[k] ? "border-red-400" : "border-slate-200"
    }`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="brochure-gate-dialog"
        className="max-w-md bg-white rounded-2xl p-0 overflow-hidden"
      >
        <div className="bg-navy grain px-6 py-5 text-white">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <Lock size={20} className="text-brand-gold" />
              Get {fileTitle}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Enter your details and we&apos;ll unlock the download instantly.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          onSubmit={submit}
          data-testid="brochure-gate-form"
          noValidate
          className="px-6 pt-5 pb-6 space-y-4"
        >
          {/* Honeypot */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.company_website}
            onChange={(e) => set("company_website", e.target.value)}
            className="hidden"
            aria-hidden="true"
          />

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">
              Full Name *
            </label>
            <input
              data-testid="brochure-gate-name"
              className={inputCls("full_name")}
              placeholder="Your full name"
              value={form.full_name}
              onChange={(e) => set("full_name", e.target.value)}
            />
            {errors.full_name && (
              <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">
              Phone Number *
            </label>
            <input
              data-testid="brochure-gate-phone"
              className={inputCls("phone")}
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          <button
            data-testid="brochure-gate-submit"
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white font-bold py-3.5 rounded-full hover:scale-[1.02] active:scale-95 transition-transform shadow-lg shadow-brand-orange/30 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Preparing your file…
              </>
            ) : (
              <>
                <Download size={18} /> Download Now
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-500 text-center leading-snug">
            By downloading, you agree to receive follow-up messages from Apexoria.
            No spam — unsubscribe any time.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
