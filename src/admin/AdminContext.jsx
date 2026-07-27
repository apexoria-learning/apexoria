import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { parseDataSource } from "@/lib/dataParser";
import { serializeContent } from "@/lib/dataSerializer";
import { useAdminAuth } from "./AdminAuth";
import { toast } from "sonner";

const ContentCtx = createContext(null);

const RAW_URL =
  "https://raw.githubusercontent.com/apexoria-learning/apexoria/main/src/data.js";

export function AdminContentProvider({ children }) {
  const { user } = useAdminAuth();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      // Cache-bust so we always see the latest committed version.
      const res = await fetch(`${RAW_URL}?t=${Date.now()}`);
      if (!res.ok) throw new Error(`GitHub raw fetch failed (${res.status})`);
      const src = await res.text();
      const parsed = parseDataSource(src);
      setContent(parsed);
      setDirty(false);
    } catch (e) {
      setLoadError(e.message);
      toast.error(`Failed to load content: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const update = useCallback((key, value) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }, []);

  const save = useCallback(async (commitMessage) => {
    if (!content || !user) return;
    setSaving(true);
    try {
      const source = serializeContent(content);
      const token = await user.getIdToken();
      const res = await fetch("/api/cms/commit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          path: "src/data.js",
          content: source,
          message: commitMessage || `chore(cms): content update by ${user.email}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Commit failed (${res.status})`);
      toast.success("Saved! Vercel will redeploy in ~45s.");
      setDirty(false);
      return data;
    } catch (e) {
      toast.error(e.message || "Save failed");
      throw e;
    } finally {
      setSaving(false);
    }
  }, [content, user]);

  return (
    <ContentCtx.Provider value={{ content, loading, saving, dirty, loadError, update, save, reload: load }}>
      {children}
    </ContentCtx.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentCtx);
  if (!ctx) throw new Error("useContent must be used inside AdminContentProvider");
  return ctx;
}
