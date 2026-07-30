import React, { useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Minus,
} from "lucide-react";

/**
 * Reusable Markdown editor for CMS admin pages.
 *
 * Left column: <textarea> with a sticky toolbar of markdown-insert buttons.
 * Right column: live react-markdown preview (GFM enabled).
 *
 * Props
 *   value            Current markdown string.
 *   onChange         (nextMd) => void.
 *   placeholder      Textarea placeholder.
 *   minRows          Minimum textarea rows (default 20).
 *
 * The insert buttons use `document.execCommand('insertText')` where
 * available so browser undo/redo stays intact; otherwise fall back to
 * splicing `value` directly.
 */
export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Start writing in Markdown…",
  minRows = 20,
}) {
  const textareaRef = useRef(null);
  const md = value ?? "";

  /**
   * Apply a transform to the current textarea selection.
   *
   *   transform({ before, selected, after }) =>
   *     { text, selectionStart, selectionEnd }
   *
   *   text            The full replacement string for the selection region
   *                   (i.e. what will sit between `before` and `after`).
   *   selectionStart  Absolute cursor position after the edit.
   *   selectionEnd    Absolute selection-end after the edit.
   */
  const applyTransform = useCallback(
    (transform) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart ?? md.length;
      const end = ta.selectionEnd ?? md.length;
      const before = md.slice(0, start);
      const selected = md.slice(start, end);
      const after = md.slice(end);
      const {
        text,
        selectionStart = before.length + text.length,
        selectionEnd = selectionStart,
      } = transform({ before, selected, after });
      const nextValue = before + text + after;

      ta.focus();
      // Prefer execCommand so the browser's native undo stack captures the
      // edit. Deprecated but still widely supported on textareas in 2026.
      let inserted = false;
      try {
        ta.setSelectionRange(start, end);
        inserted = document.execCommand("insertText", false, text);
      } catch {
        inserted = false;
      }
      if (!inserted) {
        onChange(nextValue);
      }
      // Restore selection after React re-renders. Two RAFs give the
      // reconciler time to flush the controlled value back into the DOM.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          try {
            ta.setSelectionRange(selectionStart, selectionEnd);
          } catch {
            /* ignore */
          }
        });
      });
    },
    [md, onChange],
  );

  /** Wrap the selection with a symmetric marker (e.g. **bold**). */
  const wrap = useCallback(
    (marker) => {
      applyTransform(({ before, selected }) => {
        const text = `${marker}${selected || "text"}${marker}`;
        const selStart = before.length + marker.length;
        const selEnd = selStart + (selected ? selected.length : "text".length);
        return { text, selectionStart: selStart, selectionEnd: selEnd };
      });
    },
    [applyTransform],
  );

  /** Prefix every line in the current selection with `prefixFor(index)`. */
  const applyLinePrefix = useCallback(
    (prefixFor) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart ?? md.length;
      const end = ta.selectionEnd ?? md.length;
      // Expand start to the beginning of its line.
      const lineStart = md.lastIndexOf("\n", Math.max(start - 1, 0)) + 1;
      const region = md.slice(lineStart, end);
      const before = md.slice(0, lineStart);
      const after = md.slice(end);
      const lines = region.length ? region.split("\n") : [""];
      const transformed = lines
        .map((line, i) => `${prefixFor(i)}${line}`)
        .join("\n");
      const nextValue = before + transformed + after;
      ta.focus();
      try {
        ta.setSelectionRange(lineStart, end);
        const ok = document.execCommand("insertText", false, transformed);
        if (!ok) onChange(nextValue);
      } catch {
        onChange(nextValue);
      }
      const selStart = lineStart;
      const selEnd = lineStart + transformed.length;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          try {
            ta.setSelectionRange(selStart, selEnd);
          } catch {
            /* ignore */
          }
        });
      });
    },
    [md, onChange],
  );

  const insertBlock = useCallback(
    (blockText, placeholderRange) => {
      applyTransform(({ before }) => {
        const needsLeadingNl = before.length > 0 && !before.endsWith("\n\n");
        const prefix = needsLeadingNl ? (before.endsWith("\n") ? "\n" : "\n\n") : "";
        const text = prefix + blockText;
        let selStart = before.length + text.length;
        let selEnd = selStart;
        if (placeholderRange) {
          selStart = before.length + prefix.length + placeholderRange[0];
          selEnd = before.length + prefix.length + placeholderRange[1];
        }
        return { text, selectionStart: selStart, selectionEnd: selEnd };
      });
    },
    [applyTransform],
  );

  const insertLink = useCallback(() => {
    applyTransform(({ before, selected }) => {
      const label = selected || "link text";
      const url = "https://";
      const text = `[${label}](${url})`;
      // Place cursor inside the URL portion for easy typing.
      const urlStart = before.length + label.length + 3;
      const urlEnd = urlStart + url.length;
      return { text, selectionStart: urlStart, selectionEnd: urlEnd };
    });
  }, [applyTransform]);

  const onKeyDown = useCallback(
    (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const k = e.key.toLowerCase();
      if (k === "b") {
        e.preventDefault();
        wrap("**");
      } else if (k === "i") {
        e.preventDefault();
        wrap("_");
      } else if (k === "k") {
        e.preventDefault();
        insertLink();
      }
    },
    [wrap, insertLink],
  );

  const count = md.length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <Toolbar
        onBold={() => wrap("**")}
        onItalic={() => wrap("_")}
        onH2={() => applyLinePrefix(() => "## ")}
        onH3={() => applyLinePrefix(() => "### ")}
        onUl={() => applyLinePrefix(() => "- ")}
        onOl={() => applyLinePrefix((i) => `${i + 1}. `)}
        onQuote={() => applyLinePrefix(() => "> ")}
        onLink={insertLink}
        onHr={() => insertBlock("---\n")}
      />
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        <div className="p-3">
          <textarea
            ref={textareaRef}
            value={md}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            rows={minRows}
            placeholder={placeholder}
            spellCheck
            className="w-full min-h-[24rem] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono leading-relaxed outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-y"
          />
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
            <span>Markdown · GFM</span>
            <span>{count.toLocaleString()} chars</span>
          </div>
        </div>
        <div className="p-3 bg-slate-50/40">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
            Live preview
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 min-h-[24rem] overflow-auto">
            {md.trim() ? (
              <article
                className="prose prose-slate prose-sm max-w-none
                  prose-headings:font-display prose-headings:text-navy
                  prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-navy
                  prose-blockquote:border-l-brand-blue"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
              </article>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Preview will appear here as you type.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Toolbar */

function Toolbar({
  onBold,
  onItalic,
  onH2,
  onH3,
  onUl,
  onOl,
  onQuote,
  onLink,
  onHr,
}) {
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 bg-white/95 backdrop-blur">
      <ToolBtn onClick={onBold} label="Bold (Ctrl+B)">
        <Bold className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={onItalic} label="Italic (Ctrl+I)">
        <Italic className="w-3.5 h-3.5" />
      </ToolBtn>
      <Divider />
      <ToolBtn onClick={onH2} label="Heading 2">
        <Heading2 className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={onH3} label="Heading 3">
        <Heading3 className="w-3.5 h-3.5" />
      </ToolBtn>
      <Divider />
      <ToolBtn onClick={onUl} label="Bulleted list">
        <List className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={onOl} label="Numbered list">
        <ListOrdered className="w-3.5 h-3.5" />
      </ToolBtn>
      <Divider />
      <ToolBtn onClick={onQuote} label="Blockquote">
        <Quote className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={onLink} label="Link (Ctrl+K)">
        <LinkIcon className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={onHr} label="Horizontal rule">
        <Minus className="w-3.5 h-3.5" />
      </ToolBtn>
    </div>
  );
}

function ToolBtn({ onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="inline-flex items-center justify-center h-7 w-7 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-4 w-px bg-slate-200" aria-hidden />;
}
