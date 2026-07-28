import React, { useEffect, useState } from "react";
import { useAdminAuth } from "./AdminAuth";
import {
  LogIn,
  ShieldAlert,
  Loader2,
  WifiOff,
  ExternalLink,
} from "lucide-react";

export default function LoginPage() {
  const { user, signIn, signOutNow, authError } = useAdminAuth();
  const [signing, setSigning] = useState(false);
  const [online, setOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine
  );

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const handleSignIn = async () => {
    setSigning(true);
    try {
      await signIn();
    } finally {
      // If sign-in redirects, we may never reach here; safe either way.
      setSigning(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <img
            src="/apexoria-logo.jpeg"
            alt="Apexoria Learning"
            className="h-14 w-14 mx-auto rounded-full ring-2 ring-slate-200"
          />
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Apexoria CMS
          </h1>
          <p className="text-sm text-slate-500">
            Sign in with your admin Google account to edit site content.
          </p>
        </div>

        {!online && (
          <div
            role="status"
            className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800"
          >
            <WifiOff className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              You’re offline. Sign-in needs an active internet connection.
            </span>
          </div>
        )}

        {authError && (
          <div className="flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {user ? (
          <div className="space-y-3">
            <div className="text-sm text-slate-600 text-center">
              Signed in as <span className="font-medium">{user.email}</span>
            </div>
            <button
              onClick={signOutNow}
              className="w-full rounded-xl border border-slate-300 py-2.5 text-sm font-medium hover:bg-slate-50 min-h-[44px]"
            >
              Sign out and try another account
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            disabled={signing || !online}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white py-3 text-sm font-medium hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {signing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {signing ? "Opening Google…" : "Continue with Google"}
          </button>
        )}

        <div className="space-y-2">
          <p className="text-[11px] text-center text-slate-400">
            Only pre-approved Apexoria team members can access this panel.
          </p>
          <a
            href="https://apexorialearning.in"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-700"
          >
            <ExternalLink className="w-3 h-3" /> View the live site
          </a>
        </div>
      </div>
    </div>
  );
}
