import React, { useState, useRef, useCallback } from "react";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { Upload, Loader2, CheckCircle2, ExternalLink, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const IMAGE_WARN_BYTES = 2 * 1024 * 1024;   // 2 MB
const PDF_WARN_BYTES = 10 * 1024 * 1024;    // 10 MB

/**
 * Uploads a file to Firebase Storage and returns the public URL via onUploaded.
 * Supports click-to-select and drag-and-drop, with per-upload progress.
 *
 * Props:
 *   folder            Storage folder prefix.
 *   accept            <input accept="…">.
 *   value             Current URL (used to swap label to "Replace").
 *   onUploaded        (url, meta) => void.
 *   label             Button label (default "Upload file").
 *   hideCurrentLink   Hide the built-in "Current file" link and raw URL
 *                     (use when a wrapper renders its own preview).
 */
export default function FileUpload({
  folder = "uploads",
  accept = "*/*",
  value,
  onUploaded,
  label = "Upload file",
  hideCurrentLink = false,
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const uploadFile = useCallback(
    async (file) => {
      if (!file) return;
      // Size heuristics — warn but don't block.
      if (file.type.startsWith("image/") && file.size > IMAGE_WARN_BYTES) {
        toast.warning(
          `Large image (${(file.size / 1024 / 1024).toFixed(1)} MB). Consider compressing under 2 MB.`
        );
      } else if (file.type === "application/pdf" && file.size > PDF_WARN_BYTES) {
        toast.warning(
          `Large PDF (${(file.size / 1024 / 1024).toFixed(1)} MB). Consider compressing under 10 MB.`
        );
      }

      setUploading(true);
      setProgress(0);

      try {
        const safeName = file.name.replace(/[^\w.\-]+/g, "_");
        const path = `${folder}/${Date.now()}-${safeName}`;
        const ref = storageRef(storage, path);
        const task = uploadBytesResumable(ref, file, { contentType: file.type });

        await new Promise((resolve, reject) => {
          task.on(
            "state_changed",
            (snap) => {
              const pct =
                snap.totalBytes > 0
                  ? Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
                  : 0;
              setProgress(pct);
            },
            (err) => reject(err),
            () => resolve()
          );
        });

        const url = await getDownloadURL(task.snapshot.ref);
        onUploaded(url, { name: file.name, size: file.size, path });
        setProgress(100);
        toast.success(`Uploaded: ${file.name}`);
      } catch (err) {
        toast.error(err.message || "Upload failed");
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [folder, onUploaded]
  );

  const handleInputChange = (e) => uploadFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex flex-wrap items-center gap-2 rounded-lg border border-dashed px-3 py-2 transition ${
          dragOver
            ? "border-slate-900 bg-slate-50"
            : "border-slate-300 bg-white"
        }`}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          {uploading ? `Uploading… ${progress}%` : label}
        </button>
        <span className="text-[11px] text-slate-500 inline-flex items-center gap-1">
          <UploadCloud className="w-3 h-3" /> or drop a file here
        </span>
        {!hideCurrentLink && value && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 underline decoration-slate-300"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Current file <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {uploading && <Progress value={progress} className="h-1.5" />}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {!hideCurrentLink && value && (
        <div className="text-[11px] text-slate-400 break-all">URL: {value}</div>
      )}
    </div>
  );
}
