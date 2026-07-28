import React, { useState, useRef, useCallback } from "react";
import { auth } from "@/lib/firebase";
import { Upload, Loader2, CheckCircle2, ExternalLink, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

// Vercel Hobby caps inbound request body at ~4.5 MB. Base64 encoding adds ~33%,
// so we hard-block anything above 3 MB decoded. Keep in sync with
// MAX_DECODED_BYTES in api/cms/upload-asset.mjs.
const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;   // 3 MB (hard block)
const IMAGE_WARN_BYTES = 2 * 1024 * 1024;   // 2 MB
const PDF_WARN_BYTES = 2.5 * 1024 * 1024;   // 2.5 MB (nudge below 3 MB cap)

const COMPRESSOR_HELP =
  "Try a free compressor like ilovepdf.com (PDFs) or squoosh.app (images).";

/**
 * Uploads a file to GitHub via /api/cms/upload-asset (Vercel Serverless Function)
 * and returns a site-relative URL via onUploaded. Files land in
 * `public/uploads/{folder}/{ts}-{name}` and become live after Vercel's
 * auto-redeploy (~1 min).
 *
 * Supports click-to-select and drag-and-drop, with per-upload progress.
 *
 * Props:
 *   folder            Storage sub-folder under public/uploads/.
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

      // Hard-block anything the API cannot accept on Vercel Hobby.
      if (file.size > MAX_UPLOAD_BYTES) {
        toast.error(
          `File is ${(file.size / 1024 / 1024).toFixed(1)} MB. Maximum is 3 MB. ${COMPRESSOR_HELP}`
        );
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
      // Soft warnings (non-blocking) — encourage compression.
      if (file.type.startsWith("image/") && file.size > IMAGE_WARN_BYTES) {
        toast.warning(
          `Large image (${(file.size / 1024 / 1024).toFixed(1)} MB). Consider compressing under 2 MB.`
        );
      } else if (file.type === "application/pdf" && file.size > PDF_WARN_BYTES) {
        toast.warning(
          `Large PDF (${(file.size / 1024 / 1024).toFixed(1)} MB). Consider compressing under 2 MB.`
        );
      }

      // Confirm we have an authenticated admin session before touching the API.
      const user = auth.currentUser;
      if (!user) {
        toast.error("You are signed out. Sign back in and try again.");
        return;
      }
      let idToken;
      try {
        idToken = await user.getIdToken();
      } catch (err) {
        toast.error(`Could not refresh session: ${err.message || err}`);
        return;
      }

      setUploading(true);
      setProgress(0);

      try {
        const contentBase64 = await fileToBase64(file);

        const result = await postWithProgress({
          url: "/api/cms/upload-asset",
          idToken,
          body: {
            folder,
            filename: file.name,
            contentType: file.type || "application/octet-stream",
            contentBase64,
          },
          onProgress: (pct) => setProgress(pct),
        });

        if (!result.ok || !result.data?.url) {
          throw new Error(result.data?.error || `Upload failed (${result.status}).`);
        }

        setProgress(100);
        const { url, path, size, commit } = result.data;
        onUploaded(url, {
          name: file.name,
          size: size ?? file.size,
          path,
          commitSha: commit?.sha,
        });
        toast.success(
          `Uploaded: ${file.name} — will appear on the live site after redeploy (~1 min).`
        );
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
          <UploadCloud className="w-3 h-3" /> or drop a file here (max 3 MB)
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

// ---- helpers --------------------------------------------------------------

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Unexpected FileReader result"));
        return;
      }
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Posts JSON to `url` via XHR so we can surface real upload progress
 * (fetch has no browser-side upload progress event).
 */
function postWithProgress({ url, idToken, body, onProgress }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer ${idToken}`);

    xhr.upload.onprogress = (evt) => {
      if (!evt.lengthComputable) return;
      const pct = Math.round((evt.loaded / evt.total) * 100);
      onProgress(pct);
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.onabort = () => reject(new Error("Upload aborted"));
    xhr.onload = () => {
      let data;
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch {
        data = { error: "Server returned invalid JSON." };
      }
      resolve({
        ok: xhr.status >= 200 && xhr.status < 300,
        status: xhr.status,
        data,
      });
    };

    xhr.send(JSON.stringify(body));
  });
}
