import React from "react";
import { Inbox } from "lucide-react";

/**
 * EmptyState — friendly empty-list placeholder.
 *
 * Props:
 *   icon    Optional lucide component (default: Inbox)
 *   title   Short headline
 *   hint    Longer explanation
 *   action  Optional JSX (e.g. an AddButton)
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title,
  hint,
  action,
  className = "",
}) {
  return (
    <div
      className={`rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 text-center ${className}`}
    >
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-slate-200 text-slate-400 mb-3">
        <Icon className="w-5 h-5" />
      </div>
      {title && (
        <div className="font-display font-semibold text-sm text-slate-800">
          {title}
        </div>
      )}
      {hint && (
        <div className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          {hint}
        </div>
      )}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
