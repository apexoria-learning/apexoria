import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Shared renderer for Privacy / Terms and any future legal doc.
 *
 * Props
 *   testId            data-testid on the outer <main>. Required.
 *   title             Rendered as <h1> and pushed to document.title.
 *   metaDescription   Written into <meta name="description">.
 *   lastUpdated       Small subhead. Optional.
 *   contentMd         Markdown source. If empty/whitespace, we render the
 *                     empty-state placeholder AND set <meta name="robots"
 *                     content="noindex,follow"> so an unfilled page never
 *                     enters the Google index.
 */
export default function LegalDoc({
  testId,
  title,
  metaDescription,
  lastUpdated,
  contentMd,
}) {
  const isEmpty = !contentMd || !contentMd.trim();

  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = `${title} — Apexoria Learning`;

    const upsertMeta = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      const created = !tag;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      const prev = tag.getAttribute("content");
      tag.setAttribute("content", content);
      return () => {
        if (created) tag.remove();
        else if (prev !== null) tag.setAttribute("content", prev);
      };
    };

    const cleanups = [];
    if (metaDescription) cleanups.push(upsertMeta("description", metaDescription));
    cleanups.push(
      upsertMeta("robots", isEmpty ? "noindex,follow" : "index,follow"),
    );

    return () => {
      document.title = prevTitle;
      cleanups.forEach((fn) => fn());
    };
  }, [title, metaDescription, isEmpty]);

  return (
    <main
      data-testid={testId}
      className="min-h-screen bg-white pt-28 sm:pt-32 pb-20"
    >
      <div className="max-w-3xl mx-auto px-5 lg:px-8">
        <header className="mb-10 border-b border-slate-200 pb-6">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-navy tracking-tight">
            {title}
          </h1>
          {lastUpdated && (
            <p className="mt-2 text-xs uppercase tracking-wider text-slate-500">
              Last updated: {lastUpdated}
            </p>
          )}
        </header>

        {isEmpty ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
            <p className="text-sm text-slate-600">
              This page is being prepared. Please check back soon.
            </p>
          </div>
        ) : (
          <article
            className="prose prose-slate prose-lg max-w-none
              prose-headings:font-display prose-headings:text-navy prose-headings:tracking-tight
              prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-2xl sm:prose-h2:text-[1.75rem] prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-200
              prose-h3:mt-10 prose-h3:mb-3 prose-h3:text-xl
              prose-p:my-5 prose-p:leading-[1.8] prose-p:text-slate-700
              prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline
              prose-strong:text-navy prose-strong:font-semibold
              prose-ul:my-5 prose-ol:my-5 prose-ul:pl-6 prose-ol:pl-6
              prose-li:my-2 prose-li:leading-relaxed prose-li:text-slate-700
              prose-hr:my-10 prose-hr:border-slate-200
              prose-blockquote:border-l-brand-blue prose-blockquote:text-slate-600 prose-blockquote:my-6
              prose-code:text-navy prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
              prose-table:my-8 prose-table:w-full prose-table:text-sm prose-table:border prose-table:border-slate-200 prose-table:rounded-lg prose-table:overflow-hidden
              prose-thead:bg-slate-50 prose-thead:border-b prose-thead:border-slate-200
              prose-th:text-left prose-th:font-semibold prose-th:text-navy prose-th:px-4 prose-th:py-3
              prose-td:px-4 prose-td:py-3 prose-td:text-slate-700 prose-td:align-top prose-td:border-t prose-td:border-slate-100
              prose-tr:border-0"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {contentMd}
            </ReactMarkdown>
          </article>
        )}
      </div>
    </main>
  );
}
