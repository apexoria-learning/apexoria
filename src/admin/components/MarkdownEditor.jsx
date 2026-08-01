import React, { useEffect, useRef } from "react";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";

/**
 * Reusable Markdown editor for CMS admin pages.
 *
 * Uses Toast UI Editor (vanilla, NOT the React wrapper) mounted via useEffect.
 * Defaults to WYSIWYG mode with a Markdown/WYSIWYG toggle visible in the toolbar.
 *
 * Props
 *   value            Current markdown string (may be "" or undefined).
 *   onChange         (nextMd: string) => void, fires on every keystroke.
 *   placeholder      Editor placeholder text.
 *   minRows          Minimum rows; height is derived as `max(minRows * 1.5, 24)rem`.
 *
 * Data contract: value is always a markdown string, onChange always passes markdown.
 * The editor syncs when the value prop changes (e.g., tab switching in LegalPage).
 */
export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Start writing in Markdown…",
  minRows = 20,
}) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const onChangeRef = useRef(onChange);

  // Keep onChange callback ref up to date without re-mounting the editor.
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Mount the Toast UI Editor on first render.
  useEffect(() => {
    // Guard against React 19 Strict Mode double-mount in dev.
    if (editorRef.current) return;

    const height = `${Math.max(minRows * 1.5, 24)}rem`;

    const editor = new Editor({
      el: containerRef.current,
      height,
      initialEditType: "wysiwyg",
      previewStyle: "vertical",
      usageStatistics: false,
      hideModeSwitch: false,
      placeholder,
      initialValue: value ?? "",
      toolbarItems: [
        ["heading", "bold", "italic", "strike"],
        ["hr", "quote"],
        ["ul", "ol", "task"],
        ["table", "link"],
        ["code", "codeblock"],
      ],
    });

    // Wire up onChange event to call the React onChange prop.
    editor.on("change", () => {
      const md = editor.getMarkdown();
      onChangeRef.current(md);
    });

    editorRef.current = editor;

    // Cleanup on unmount.
    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Mount once; height and placeholder are intentionally frozen.

  // Sync editor content when the value prop changes (e.g., tab switch).
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const currentMd = editor.getMarkdown();
    const nextMd = value ?? "";

    // Only update if the value differs (avoids triggering onChange loops).
    if (currentMd !== nextMd) {
      // The second argument `false` prevents Toast UI from firing a change event.
      editor.setMarkdown(nextMd, false);
    }
  }, [value]);

  const count = (value ?? "").length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-visible">
      <div ref={containerRef} className="overflow-hidden rounded-t-xl" />
      <div className="px-3 py-1.5 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200">
        <span>Markdown · GFM</span>
        <span>{count.toLocaleString()} chars</span>
      </div>
    </div>
  );
}
