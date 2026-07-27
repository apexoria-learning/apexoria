import React from "react";
import { AdminAuthProvider, useAdminAuth } from "./AdminAuth";
import LoginPage from "./LoginPage";
import AdminShell from "./AdminShell";
import { Toaster } from "@/components/ui/sonner";

function Gate() {
  const { user, isAdmin, loading } = useAdminAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 text-sm font-body">Loading…</div>
      </div>
    );
  }
  if (!user || !isAdmin) return <LoginPage />;
  return <AdminShell />;
}

export default function AdminApp() {
  return (
    <div className="admin-root font-body min-h-screen bg-slate-50 text-slate-900">
      <AdminAuthProvider>
        <Gate />
        <Toaster position="top-center" richColors />
      </AdminAuthProvider>
    </div>
  );
}
