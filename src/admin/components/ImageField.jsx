import React, { useState } from "react";
import { Copy, Trash2, Check } from "lucide-react";
import FileUpload from "./FileUpload";
import ImageThumb from "./ImageThumb";

/**
 * ImageField — unified thumbnail + upload/replace/remove control.
 *
 * Replaces the old "text input + FileUpload widget both shown" pattern.
 *
 * Props:
 *   value       Current image URL (empty string = no image).
 *   onChange    (nextUrl: string) => void.
 *   folder      Firebase Storage folder for uploads (passed to FileUpload).
 *   accept      MIME accept string (default "image/*").
 *   aspect      Tailwind aspect-* class (default aspect-square).
 *   width       Tailwind width class for the thumb (default w-28).
 *   hint        Optional hint text under the field.
 *   allowRemove When true, shows a remove button (default true).
 */
export default function ImageField({
  value,
  onChange,
  folder = "uploads",
  accept = "image/*",
  aspect = "aspect-square",
  width = "w-28",
  hint,
  allowRemove = true,
}) {
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* silent */
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-4">
        <ImageThumb src={value} aspect={aspect} width={width} />
        <div className="flex-1 min-w-0 space-y-2">
          <FileUpload
            folder={folder}
            accept={accept}
            value={value}
            onUploaded={(url) => onChange(url)}
            label={value ? "Replace image" : "Upload image"}
            hideCurrentLink
          />
          {value && (
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
              <button
                type="button"
                onClick={copyUrl}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"
                title="Copy image URL"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy URL
                  </>
                )}
              </button>
              {allowRemove && (
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-rose-600"
                  title="Remove image"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              )}
              <span className="truncate max-w-[16rem]" title={value}>
                {value.replace(/^https?:\/\//, "")}
              </span>
            </div>
          )}
        </div>
      </div>
      {hint && <div className="text-[11px] text-slate-500">{hint}</div>}
    </div>
  );
}
