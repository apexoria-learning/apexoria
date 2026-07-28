import React from "react";
import { FileText, ExternalLink, Trash2 } from "lucide-react";
import FileUpload from "./FileUpload";

/**
 * PdfField — filename chip + open + replace + remove for a PDF URL.
 *
 * Props:
 *   value        Current PDF URL.
 *   onChange     (nextUrl: string) => void.
 *   folder       Firebase Storage folder (passed to FileUpload).
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
      <FileUpload
        folder={folder}
        accept="application/pdf"
        value={value}
        onUploaded={(url) => onChange(url)}
        label={value ? "Replace PDF" : "Upload PDF"}
        hideCurrentLink
      />
      {hint && <div className="text-[11px] text-slate-500">{hint}</div>}
    </div>
  );
}
