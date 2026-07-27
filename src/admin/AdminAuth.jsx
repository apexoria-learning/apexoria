import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

const AuthCtx = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthError("");
      if (!u) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      try {
        const email = (u.email || "").toLowerCase();
        const snap = await getDoc(doc(db, "admins", email));
        setIsAdmin(snap.exists());
        if (!snap.exists()) {
          setAuthError(
            `${email} is not on the admin allowlist. Ask an existing admin to add you.`
          );
        }
      } catch (e) {
        setIsAdmin(false);
        setAuthError(e.message || "Failed to verify admin access.");
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const signIn = async () => {
    setAuthError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      setAuthError(e.message || "Sign-in failed.");
    }
  };

  const signOutNow = async () => {
    await signOut(auth);
  };

  return (
    <AuthCtx.Provider value={{ user, isAdmin, loading, signIn, signOutNow, authError }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
