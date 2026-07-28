import React from "react";
import { FileText, ExternalLink, Trash2, Upload, Clock } from "lucide-react";
import FileUpload from "./FileUpload";

/**
 * Global switch. Flip to `true` when the GitHub-backed PDF upload flow
 * is ready for production (Vercel body-size limits, redeploy latency,
 * per-course brochure UX, etc. all settled).
 *
 * While `false`, PdfField shows a disabled "Upload coming soon" chip
 * instead of the FileUpload dropzone. The URL/filename display and the
 * "Open" / "Remove" actions still work, so authors can point to PDFs
 * committed by hand.
 */
const PDF_UPLOAD_ENABLED = false;

/**
 * PdfField — filename chip + open + replace + remove for a PDF URL.
 *
 * Props:
 *   value        Current PDF URL.
 *   onChange     (nextUrl: string) => void.
 *   folder       Storage sub-folder (passed to FileUpload when enabled).
 *   filename     Optional display filename (falls back to URL basename).
 *   hint         Optional hint text.
 *   allowRemove  When true, shows a remove button (default true).
 */
export default function PdfField({
  value,
  onChange,
  folder = "uploads",
  filename,
  hint,
  allowRemove = true,
}) {
  const displayName =
    filename ||
    (value ? decodeURIComponent(value.split("/").pop().split("?")[0]) : "");

  return (
    <div className="space-y-2">
      {value ? (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <FileText className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="text-xs font-medium text-slate-700 truncate flex-1" title={displayName}>
            {displayName}
          </span>
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900"
            title="Open in new tab"
          >
            <ExternalLink className="w-3 h-3" /> Open
          </a>
          {allowRemove && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-rose-600"
              title="Remove PDF"
            >
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          )}
        </div>
      ) : (
        <div className="text-xs text-slate-500 italic">No PDF uploaded yet.</div>
      )}
      {PDF_UPLOAD_ENABLED ? (
        <FileUpload
          folder={folder}
          accept="application/pdf"
          value={value}
          onUploaded={(url) => onChange(url)}
          label={value ? "Replace PDF" : "Upload PDF"}
          hideCurrentLink
        />
      ) : (
        <div
          className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 opacity-80"
          title="PDF upload is being rebuilt on the new storage backend."
        >
          <span
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 cursor-not-allowed"
            aria-disabled="true"
          >
            <Upload className="w-3.5 h-3.5" />
            {value ? "Replace PDF" : "Upload PDF"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
            <Clock className="w-3 h-3" /> Coming soon
          </span>
          <span className="text-[11px] text-slate-500">
            Ping the dev team to swap the PDF for now.
          </span>
        </div>
      )}
      {hint && <div className="text-[11px] text-slate-500">{hint}</div>}
    </div>
  );
}
