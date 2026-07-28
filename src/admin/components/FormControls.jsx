import React, { useMemo, useState } from "react";
import * as LucideIcons from "lucide-react";
import { AlertCircle, Star, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/* ---------------------------------------------------------------- Field */

export function Field({ label, hint, error, children, required }) {
  return (
    <label className="block">
      <div className="flex items-center gap-1 text-xs font-medium text-slate-700 mb-1">
        {label}
        {required && <span className="text-rose-600">*</span>}
      </div>
      {children}
      {error ? (
        <div className="flex items-start gap-1 text-[11px] text-rose-600 mt-1">
          <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : hint ? (
        <div className="text-[11px] text-slate-500 mt-1">{hint}</div>
      ) : null}
    </label>
  );
}

/* ------------------------------------------------------------ TextInput */

const inputBaseCls =
  "w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition disabled:bg-slate-50 disabled:text-slate-500";
const inputOkCls =
  "border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900";
const inputErrCls =
  "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500";

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  disabled,
  autoComplete,
  ...rest
}) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autoComplete}
      className={`${inputBaseCls} ${error ? inputErrCls : inputOkCls}`}
      {...rest}
    />
  );
}

export function UrlInput(props) {
  return <TextInput {...props} type="url" autoComplete="url" />;
}
export function EmailInput(props) {
  return <TextInput {...props} type="email" autoComplete="email" />;
}
export function PhoneInput(props) {
  return <TextInput {...props} type="tel" autoComplete="tel" />;
}

/* ------------------------------------------------------------ TextArea */

/**
 * Autosizing textarea. Uses CSS field-sizing: content on supporting
 * browsers (Chromium 123+/Safari 17.4+). Otherwise respects rows.
 */
export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
  maxLength,
  showCount = false,
  error,
  ...rest
}) {
  const count = (value ?? "").length;
  return (
    <div className="space-y-1">
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        style={{ fieldSizing: "content" }}
        className={`${inputBaseCls} ${error ? inputErrCls : inputOkCls} resize-y min-h-[4.5rem]`}
        {...rest}
      />
      {showCount && (
        <div className="text-[10px] text-slate-400 text-right">
          {count}
          {maxLength ? ` / ${maxLength}` : ""} chars
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------- NumberInput */

export function NumberInput({
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
  error,
}) {
  return (
    <input
      type="number"
      value={value ?? ""}
      min={min}
      max={max}
      step={step}
      onChange={(e) =>
        onChange(e.target.value === "" ? "" : Number(e.target.value))
      }
      placeholder={placeholder}
      className={`${inputBaseCls} ${error ? inputErrCls : inputOkCls}`}
    />
  );
}

/* --------------------------------------------------------- SelectInput */

/**
 * Radix Select wrapper.
 *
 * Props:
 *   value      Current value.
 *   onChange   (nextValue) => void.
 *   options    Array of { value, label } or plain strings.
 *   placeholder
 */
export function SelectInput({ value, onChange, options, placeholder, error }) {
  const normalized = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  return (
    <Select value={value || ""} onValueChange={onChange}>
      <SelectTrigger
        className={`${inputBaseCls} ${error ? inputErrCls : inputOkCls} h-auto py-2`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {normalized.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* ----------------------------------------------------------- ColorInput */

export function ColorInput({ value, onChange, error }) {
  const safe = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value || "")
    ? value
    : "#334155";
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={safe}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-10 rounded-md border border-slate-300 cursor-pointer bg-white p-0.5"
        aria-label="Pick color"
      />
      <TextInput
        value={value ?? ""}
        onChange={onChange}
        placeholder="#334155"
        error={error}
      />
    </div>
  );
}

/* ----------------------------------------------------------- StarRating */

/**
 * 1..max clickable stars. Supports half-steps via step=0.5.
 * Value is stored as a number.
 */
export function StarRating({ value, onChange, max = 5, step = 1 }) {
  const numeric = Number(value) || 0;
  const handleClick = (i, e) => {
    if (step >= 1) {
      onChange(i);
      return;
    }
    // Half-step: click on left half → i - 0.5, right half → i
    const rect = e.currentTarget.getBoundingClientRect();
    const half = e.clientX - rect.left < rect.width / 2 ? i - 0.5 : i;
    onChange(half);
  };
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, k) => {
        const i = k + 1;
        const filled = numeric >= i;
        const halfFilled = numeric >= i - 0.5 && numeric < i;
        return (
          <button
            key={i}
            type="button"
            onClick={(e) => handleClick(i, e)}
            className="p-0.5 text-amber-400 hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded"
            aria-label={`${i} stars`}
          >
            <Star
              className="w-5 h-5"
              fill={filled || halfFilled ? "currentColor" : "none"}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
      <span className="ml-2 text-xs text-slate-500 tabular-nums">
        {numeric.toFixed(step >= 1 ? 0 : 1)} / {max}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------ IconPicker */

/**
 * Searchable lucide-react icon picker.
 *
 * Value is the icon name string (e.g. "Sparkles"). Renders a preview
 * of the current icon and opens a popover with fuzzy search.
 */
const ALL_ICON_NAMES = Object.keys(LucideIcons).filter(
  (k) => /^[A-Z]/.test(k) && k !== "createLucideIcon" && k !== "Icon" && k !== "LucideIcon"
);

export function IconPicker({ value, onChange, error }) {
  const [q, setQ] = useState("");
  const CurrentIcon = LucideIcons[value] || null;

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return ALL_ICON_NAMES.slice(0, 48);
    return ALL_ICON_NAMES
      .filter((n) => n.toLowerCase().includes(query))
      .slice(0, 96);
  }, [q]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`${inputBaseCls} ${error ? inputErrCls : inputOkCls} flex items-center gap-2 text-left`}
        >
          {CurrentIcon ? (
            <CurrentIcon className="w-4 h-4 text-slate-700" />
          ) : (
            <span className="w-4 h-4 rounded bg-slate-100" />
          )}
          <span className="flex-1 truncate">
            {value || <span className="text-slate-400">Pick an icon…</span>}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="start">
        <div className="flex items-center gap-2 px-2 py-1.5 border-b">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search icons…"
            className="flex-1 text-sm outline-none bg-transparent"
            autoFocus
          />
        </div>
        <div className="grid grid-cols-8 gap-1 mt-2 max-h-64 overflow-y-auto p-1">
          {results.map((name) => {
            const Icon = LucideIcons[name];
            const selected = name === value;
            return (
              <button
                key={name}
                type="button"
                onClick={() => onChange(name)}
                title={name}
                className={`flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                  selected ? "bg-slate-900 text-white hover:bg-slate-800" : "text-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
          {results.length === 0 && (
            <div className="col-span-8 text-xs text-slate-500 text-center py-4">
              No icons match “{q}”.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ------------------------------------------------------------- DateField */

/**
 * ISO date input using the native <input type="date"> control.
 * Value is a display string like "27 Jul 2026" — we round-trip through
 * ISO (YYYY-MM-DD) for the picker.
 */
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function displayToIso(display) {
  if (!display) return "";
  // Match "27 Jul 2026" style
  const m = display.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (m) {
    const [, d, mon, y] = m;
    const monIdx = MONTHS.findIndex((x) => x.toLowerCase() === mon.toLowerCase());
    if (monIdx === -1) return "";
    return `${y}-${String(monIdx + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  // Already ISO?
  if (/^\d{4}-\d{2}-\d{2}$/.test(display)) return display;
  return "";
}

export function isoToDisplay(iso) {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  const [, y, mo, d] = m;
  return `${Number(d)} ${MONTHS[Number(mo) - 1]} ${y}`;
}

export function DateField({ value, onChange, error }) {
  const iso = displayToIso(value);
  return (
    <input
      type="date"
      value={iso}
      onChange={(e) => onChange(isoToDisplay(e.target.value))}
      className={`${inputBaseCls} ${error ? inputErrCls : inputOkCls}`}
    />
  );
}

/* --------------------------------------------------------------- Card */

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl bg-white border border-slate-200 p-4 sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

/* --------------------------------------------------------- SectionTitle */

export function SectionTitle({ children, action, description }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display font-semibold text-slate-900">{children}</h3>
        {action}
      </div>
      {description && (
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ IconBtn */

export function IconBtn({ onClick, title, danger, disabled, children, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md border border-slate-300 h-8 w-8 text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed ${danger ? "hover:text-rose-600 hover:border-rose-300" : ""}`}
    >
      {children}
    </button>
  );
}

/* ----------------------------------------------------------- AddButton */

export function AddButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-400"
    >
      + {children}
    </button>
  );
}
