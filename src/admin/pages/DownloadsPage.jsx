import React from "react";
import { useContent } from "../AdminContext";
import { Card, Field, TextInput, SectionTitle, IconBtn, AddButton } from "../components/FormControls";
import FileUpload from "../components/FileUpload";
import { Trash2 } from "lucide-react";

export default function DownloadsPage() {
  const { content, update } = useContent();
  const resources = content.RESOURCES || [];

  const setItem = (i, k, v) => {
    const next = [...resources]; next[i] = { ...next[i], [k]: v }; update("RESOURCES", next);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <Card>
        <SectionTitle>Main brochure</SectionTitle>
        <p className="text-xs text-slate-500 mb-3">
          Used by the hero, footer, and FinalCTA “Download Brochure” buttons.
        </p>
        <Field label="Brochure URL" hint="Upload replaces the URL below.">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <TextInput value={content.BROCHURE_URL} onChange={(v) => update("BROCHURE_URL", v)} />
            <FileUpload
              folder="brochure"
              accept="application/pdf"
              value={content.BROCHURE_URL}
              onUploaded={(url) => update("BROCHURE_URL", url)}
              label="Upload brochure"
            />
          </div>
        </Field>
      </Card>

      <Card>
        <SectionTitle
          action={
            <AddButton onClick={() => update("RESOURCES", [...resources, { label: "", file: "" }])}>
              Add resource
            </AddButton>
          }
        >
          Study notes ({resources.length})
        </SectionTitle>
        <p className="text-xs text-slate-500 mb-3">
          Shown in the Footer Resources column.
        </p>
        <div className="space-y-3">
          {resources.map((r, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-3 sm:p-4 bg-slate-50/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">#{i + 1}</span>
                <IconBtn title="Delete" danger onClick={() => update("RESOURCES", resources.filter((_, idx) => idx !== i))}>
                  <Trash2 className="w-4 h-4" />
                </IconBtn>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Label">
                  <TextInput value={r.label} onChange={(v) => setItem(i, "label", v)} placeholder="LWC Notes" />
                </Field>
                <Field label="File URL">
                  <TextInput value={r.file} onChange={(v) => setItem(i, "file", v)} placeholder="/resources/apexoria-lwc-notes.pdf" />
                </Field>
                <div className="sm:col-span-2">
                  <FileUpload
                    folder={`resources/${r.label ? r.label.toLowerCase().replace(/\s+/g, "-") : "misc"}`}
                    accept="application/pdf"
                    value={r.file}
                    onUploaded={(url) => setItem(i, "file", url)}
                    label="Upload PDF for this resource"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
