import React, { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

/**
 * Persistent yellow banner shown at the top of the shell whenever the
 * browser reports it is offline. Uses `navigator.onLine` + `online` / `offline`
 * events. Renders nothing when online.
 *
 * The CMS depends on GitHub + Firebase network calls to load and save
 * content, so we surface offline state early to avoid confusing errors.
 */
export default function OfflineBanner() {
  const [online, setOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine
  );

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-amber-100 border-b border-amber-300 text-amber-900 px-4 py-1.5 text-xs sm:text-sm flex items-center justify-center gap-2"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate">
        You’re offline. Loading and saving are paused until your connection returns.
      </span>
    </div>
  );
}
