import React from "react";
import { useAdminAuth } from "./AdminAuth";
import { LogIn, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const { user, signIn, signOutNow, authError } = useAdminAuth();

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
              className="w-full rounded-xl border border-slate-300 py-2.5 text-sm font-medium hover:bg-slate-50"
            >
              Sign out and try another account
            </button>
          </div>
        ) : (
          <button
            onClick={signIn}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white py-3 text-sm font-medium hover:bg-slate-800 transition"
          >
            <LogIn className="w-4 h-4" />
            Continue with Google
          </button>
        )}

        <p className="text-[11px] text-center text-slate-400">
          Only pre-approved Apexoria team members can access this panel.
        </p>
      </div>
    </div>
  );
}
