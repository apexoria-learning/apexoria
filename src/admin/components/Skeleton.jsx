import React from "react";

/** Simple pulse skeleton block. */
export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/70 ${className}`}
      aria-hidden="true"
    />
  );
}

/** Full-page card-style skeleton used while section content hydrates. */
export function PageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-2/3" />
      </div>
    </div>
  );
}
