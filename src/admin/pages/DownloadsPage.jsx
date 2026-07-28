import React, { useState } from "react";
import { useContent } from "../AdminContext";
import {
  Card,
  Field,
  TextInput,
  SectionTitle,
  IconBtn,
  AddButton,
} from "../components/FormControls";
import PdfField from "../components/PdfField";
import SortableList from "../components/SortableList";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { Trash2, FileDown } from "lucide-react";

function slugify(s) {
  return (s || "misc").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function DownloadsPage() {
  const { content, update, validationErrors } = useContent();
  const resources = content.RESOURCES || [];
  const [confirmDelete, setConfirmDelete] = useState(null);

  const setItem = (i, k, v) => {
    const next = [...resources];
    next[i] = { ...next[i], [k]: v };
    update("RESOURCES", next);
  };

  const errFor = (key, path) => {
    const wanted = path.join(".");
    const hit = validationErrors.find(
      (e) => e.key === key && e.path.join(".") === wanted
    );
    return hit?.message?.split(": ").slice(1).join(": ");
  };

  // Give resources stable ids for drag-reorder.
  const decorated = resources.map((r, i) => ({
    __id: `res-${i}-${slugify(r.label).slice(0, 12)}`,
    data: r,
    index: i,
  }));

  return (
    <div className="space-y-4 max-w-4xl">
      <Card>
        <SectionTitle description="Used by the hero, footer, and FinalCTA “Download Brochure” buttons.">
          Main brochure
        </SectionTitle>
        <Field label="Brochure PDF" error={errFor("BROCHURE_URL", [])}>
          <PdfField
            value={content.BROCHURE_URL}
            onChange={(v) => update("BROCHURE_URL", v)}
            folder="brochure"
            filename="apexoria-brochure.pdf"
          />
        </Field>
      </Card>

      <Card>
        <SectionTitle
          description="Shown in the Footer resources column. Drag to reorder."
          action={
            resources.length > 0 && (
              <AddButton
                onClick={() =>
                  update("RESOURCES", [...resources, { label: "", file: "" }])
                }
              >
                Add resource
              </AddButton>
            )
          }
        >
          Study notes ({resources.length})
        </SectionTitle>

        {resources.length === 0 ? (
          <EmptyState
            icon={FileDown}
            title="No study notes yet"
            hint="Add PDF resources like LWC / Apex / QA notes to give visitors a taste of course quality."
            action={
              <AddButton
                onClick={() =>
                  update("RESOURCES", [...resources, { label: "", file: "" }])
                }
              >
                Add first resource
              </AddButton>
            }
          />
        ) : (
          <SortableList
            items={decorated}
            getItemId={(item) => item.__id}
            onReorder={(next) => update("RESOURCES", next.map((d) => d.data))}
            renderItem={({ item, index, dragHandle }) => {
              const r = item.data;
              const i = item.index;
              return (
                <div className="rounded-lg border border-slate-200 p-3 sm:p-4 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {dragHandle}
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        #{index + 1}
                      </span>
                      {r.label && (
                        <span className="text-sm text-slate-700 truncate">
                          {r.label}
                        </span>
                      )}
                    </div>
                    <IconBtn
                      title="Delete"
                      danger
                      onClick={() => setConfirmDelete(i)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </IconBtn>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <Field
                      label="Label"
                      hint="Shown as the link text in the footer."
                      error={errFor("RESOURCES", [i, "label"])}
                      required
                    >
                      <TextInput
                        value={r.label}
                        onChange={(v) => setItem(i, "label", v)}
                        placeholder="LWC Notes"
                        error={errFor("RESOURCES", [i, "label"])}
                      />
                    </Field>
                    <Field
                      label="PDF"
                      hint="Upload or paste a public URL."
                      error={errFor("RESOURCES", [i, "file"])}
                    >
                      <PdfField
                        value={r.file}
                        onChange={(v) => setItem(i, "file", v)}
                        folder={`resources/${slugify(r.label)}`}
                        filename={r.label ? `${slugify(r.label)}.pdf` : undefined}
                      />
                    </Field>
                  </div>
                </div>
              );
            }}
          />
        )}
      </Card>

      <ConfirmDialog
        open={confirmDelete !== null}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        title="Delete resource?"
        description="This removes the footer link. The uploaded PDF stays in Storage — restore by re-adding with the same URL."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (confirmDelete === null) return;
          update("RESOURCES", resources.filter((_, idx) => idx !== confirmDelete));
          setConfirmDelete(null);
        }}
      />
    </div>
  );
}
