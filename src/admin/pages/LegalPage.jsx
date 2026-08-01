import React, { useState } from "react";
import { useContent } from "../AdminContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  Field,
  TextInput,
  TextArea,
  SectionTitle,
  DateField,
} from "../components/FormControls";
import MarkdownEditor from "../components/MarkdownEditor";
import { ExternalLink, Info } from "lucide-react";

const DOC_KEYS = [
  { key: "privacy", label: "Privacy Policy", route: "/privacy" },
  { key: "terms", label: "Terms of Service", route: "/terms" },
];

const emptyDoc = {
  title: "",
  metaDescription: "",
  lastUpdated: "",
  contentMd: "",
};

export default function LegalPage() {
  const { content, update, validationErrors } = useContent();
  const legal = content.LEGAL_PAGES || {};
  const [tab, setTab] = useState(DOC_KEYS[0].key);

  const setField = (docKey, field, value) => {
    const next = {
      privacy: { ...emptyDoc, ...(legal.privacy || {}) },
      terms: { ...emptyDoc, ...(legal.terms || {}) },
    };
    next[docKey] = { ...next[docKey], [field]: value };
    update("LEGAL_PAGES", next);
  };

  const errFor = (docKey, field) => {
    const wanted = `${docKey}.${field}`;
    const hit = validationErrors.find(
      (e) => e.key === "LEGAL_PAGES" && e.path.join(".") === wanted,
    );
    return hit?.message?.split(": ").slice(1).join(": ");
  };

  return (
    <div className="space-y-4 max-w-6xl">
      <Card>
        <SectionTitle description="Content is Markdown. The live site renders these at /privacy and /terms. Leave a page's content empty to render a 'coming soon' placeholder + a noindex meta tag until you fill it in.">
          Legal Pages
        </SectionTitle>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-3">
            {DOC_KEYS.map((d) => (
              <TabsTrigger key={d.key} value={d.key}>
                {d.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {DOC_KEYS.map((d) => {
            const doc = { ...emptyDoc, ...(legal[d.key] || {}) };
            return (
              <TabsContent key={d.key} value={d.key} className="space-y-4">
                <div className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2">
                  <div className="flex items-start gap-2 text-[11px] text-slate-600">
                    <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                    <span>
                      Live preview below shows your <strong>unsaved draft</strong>.
                      The link on the right opens the <strong>currently-deployed</strong>{" "}
                      page.
                    </span>
                  </div>
                  <a
                    href={d.route}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 hover:text-slate-900 whitespace-nowrap"
                  >
                    Open live page <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Page title" required error={errFor(d.key, "title")}>
                    <TextInput
                      value={doc.title}
                      onChange={(v) => setField(d.key, "title", v)}
                      placeholder={d.label}
                      error={!!errFor(d.key, "title")}
                    />
                  </Field>
                  <Field
                    label="Last updated"
                    hint='Shown as "Last updated: 30 Jul 2026" above the content.'
                    error={errFor(d.key, "lastUpdated")}
                  >
                    <DateField
                      value={doc.lastUpdated}
                      onChange={(v) => setField(d.key, "lastUpdated", v)}
                      error={!!errFor(d.key, "lastUpdated")}
                    />
                  </Field>
                </div>

                <Field
                  label="Meta description"
                  hint="Used in Google search snippet + social share preview. Aim for 120–160 chars."
                  error={errFor(d.key, "metaDescription")}
                >
                  <TextArea
                    value={doc.metaDescription}
                    onChange={(v) => setField(d.key, "metaDescription", v)}
                    rows={2}
                    maxLength={200}
                    showCount
                    error={!!errFor(d.key, "metaDescription")}
                  />
                </Field>

                <Field label="Page content (Markdown)">
                  <MarkdownEditor
                    value={doc.contentMd}
                    onChange={(v) => setField(d.key, "contentMd", v)}
                    placeholder={`Write the ${d.label.toLowerCase()} in Markdown. Use the toolbar or Ctrl+B, Ctrl+I, Ctrl+K.`}
                  />
                </Field>
              </TabsContent>
            );
          })}
        </Tabs>
      </Card>
    </div>
  );
}
