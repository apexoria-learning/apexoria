import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Save, Loader2 } from "lucide-react";

/**
 * CommitDialog — collects a commit message (replaces window.prompt).
 *
 * Props:
 *   open, onOpenChange   Controlled open state.
 *   dirtySections        Array of section labels that have unsaved changes.
 *   defaultMessage       Default commit message text.
 *   validationErrors     Optional array of { section, message } to surface as blockers.
 *   saving               When true, disables the confirm button and shows a spinner.
 *   onConfirm            (message) => void.
 */
export default function CommitDialog({
  open,
  onOpenChange,
  dirtySections = [],
  defaultMessage,
  validationErrors = [],
  saving = false,
  onConfirm,
}) {
  const [message, setMessage] = useState(defaultMessage || "");

  // Reset message whenever the dialog is opened.
  useEffect(() => {
    if (open) setMessage(defaultMessage || "");
  }, [open, defaultMessage]);

  const hasErrors = validationErrors.length > 0;

  const summary = useMemo(() => {
    if (!dirtySections.length) return "No changes staged.";
    if (dirtySections.length === 1) return `1 section changed: ${dirtySections[0]}`;
    return `${dirtySections.length} sections changed: ${dirtySections.join(", ")}`;
  }, [dirtySections]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasErrors || saving) return;
    onConfirm(message.trim() || defaultMessage);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Save changes to production</DialogTitle>
          <DialogDescription>{summary}</DialogDescription>
        </DialogHeader>

        {hasErrors && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 space-y-1.5">
            <div className="flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-4 h-4" />
              Fix these problems before saving
            </div>
            <ul className="list-disc pl-5 space-y-0.5 text-xs text-rose-700">
              {validationErrors.map((err, i) => (
                <li key={i}>
                  <span className="font-medium">{err.section}:</span> {err.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <div className="text-xs font-medium text-slate-700 mb-1">
              Commit message
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={defaultMessage}
              autoFocus
              disabled={hasErrors || saving}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none disabled:bg-slate-50 disabled:text-slate-500"
            />
            <div className="text-[11px] text-slate-500 mt-1">
              Committed to <span className="font-mono">apexoria-learning/apexoria@main</span>.
              Vercel redeploys automatically.
            </div>
          </label>

          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={hasErrors || saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {saving ? "Saving…" : "Save & deploy"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
