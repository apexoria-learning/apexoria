import React, { useState, useRef } from "react";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { Upload, Loader2, CheckCircle2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

/**
 * Uploads a file to Firebase Storage and returns the public URL via onUploaded.
 * The URL is what the CMS stores in data.js.
 */
export default function FileUpload({ folder = "uploads", accept = "*/*", value, onUploaded, label = "Upload file" }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `${folder}/${Date.now()}-${safeName}`;
      const ref = storageRef(storage, path);
      // Simple upload (files here are small: PDFs / photos)
      const snap = await uploadBytes(ref, file, { contentType: file.type });
      const url = await getDownloadURL(snap.ref);
      onUploaded(url, { name: file.name, size: file.size, path });
      setProgress(100);
      toast.success(`Uploaded: ${file.name}`);
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {uploading ? `Uploading… ${progress}%` : label}
        </button>
        {value && (
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
      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />
      {value && (
        <div className="text-[11px] text-slate-400 break-all">URL: {value}</div>
      )}
    </div>
  );
}
