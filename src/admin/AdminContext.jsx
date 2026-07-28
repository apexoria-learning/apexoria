import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { parseDataSource } from "@/lib/dataParser";
import { serializeContent } from "@/lib/dataSerializer";
import { useAdminAuth } from "./AdminAuth";
import { validateContent } from "./validation";
import { dirtyLabels } from "./sections";
import { toast } from "sonner";

const ContentCtx = createContext(null);

const RAW_URL =
  "https://raw.githubusercontent.com/apexoria-learning/apexoria/main/src/data.js";

export function AdminContentProvider({ children }) {
  const { user } = useAdminAuth();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  // Field-level dirty tracking: a Set of data.js keys that have been touched.
  const [dirtyKeys, setDirtyKeys] = useState(() => new Set());
  // Latest commit metadata from the server (for deploy status UI).
  const [lastCommit, setLastCommit] = useState(null);

  // Track "clean" content snapshot so a set-then-revert doesn't stay dirty.
  const cleanRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch(`${RAW_URL}?t=${Date.now()}`);
      if (!res.ok) throw new Error(`GitHub raw fetch failed (${res.status})`);
      const src = await res.text();
      const parsed = parseDataSource(src);
      setContent(parsed);
      cleanRef.current = JSON.parse(JSON.stringify(parsed));
      setDirtyKeys(new Set());
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
    setContent((prev) => {
      const next = { ...prev, [key]: value };
      // Reconcile dirtyKeys against the clean snapshot.
      setDirtyKeys((prevDirty) => {
        const nextDirty = new Set(prevDirty);
        const cleanVal = cleanRef.current?.[key];
        const sameAsClean =
          JSON.stringify(cleanVal) === JSON.stringify(value);
        if (sameAsClean) nextDirty.delete(key);
        else nextDirty.add(key);
        return nextDirty;
      });
      return next;
    });
  }, []);

  const dirty = dirtyKeys.size > 0;

  const dirtySectionLabels = useMemo(
    () => dirtyLabels(dirtyKeys),
    [dirtyKeys]
  );

  const validationErrors = useMemo(
    () => (content ? validateContent(content) : []),
    [content]
  );

  const save = useCallback(
    async (commitMessage) => {
      if (!content || !user) return;
      // Refuse to save if there are validation errors.
      if (validationErrors.length > 0) {
        toast.error("Fix validation errors before saving.");
        throw new Error("validation");
      }
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
            message:
              commitMessage || `chore(cms): content update by ${user.email}`,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Commit failed (${res.status})`);

        setLastCommit(data.commit || null);
        cleanRef.current = JSON.parse(JSON.stringify(content));
        setDirtyKeys(new Set());

        // Rich success toast with commit link if we have one.
        const shortSha = data.commit?.sha ? data.commit.sha.slice(0, 7) : null;
        if (shortSha && data.commit?.url) {
          toast.success("Saved! Vercel will redeploy in ~45s.", {
            description: `Commit ${shortSha}`,
            action: {
              label: "View commit ↗",
              onClick: () => window.open(data.commit.url, "_blank", "noopener"),
            },
            duration: 10_000,
          });
        } else {
          toast.success("Saved! Vercel will redeploy in ~45s.");
        }
        return data;
      } catch (e) {
        if (e.message !== "validation") {
          toast.error(e.message || "Save failed");
        }
        throw e;
      } finally {
        setSaving(false);
      }
    },
    [content, user, validationErrors]
  );

  const value = useMemo(
    () => ({
      content,
      loading,
      saving,
      dirty,
      dirtyKeys,
      dirtySectionLabels,
      validationErrors,
      loadError,
      lastCommit,
      update,
      save,
      reload: load,
    }),
    [
      content,
      loading,
      saving,
      dirty,
      dirtyKeys,
      dirtySectionLabels,
      validationErrors,
      loadError,
      lastCommit,
      update,
      save,
      load,
    ]
  );

  return <ContentCtx.Provider value={value}>{children}</ContentCtx.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentCtx);
  if (!ctx) throw new Error("useContent must be used inside AdminContentProvider");
  return ctx;
}
