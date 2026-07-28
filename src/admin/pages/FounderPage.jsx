import React, { useState } from "react";
import { useContent } from "../AdminContext";
import {
  Card,
  Field,
  TextInput,
  TextArea,
  SectionTitle,
  IconBtn,
  AddButton,
} from "../components/FormControls";
import SortableList from "../components/SortableList";
import ImageField from "../components/ImageField";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { Trash2, Award, Sparkles } from "lucide-react";

// ---- helpers ------------------------------------------------------------

/**
 * Give string-list items stable ids so drag-reorder keys survive
 * across edits without collapsing to the same react key.
 */
function withIds(items, prefix) {
  return (items || []).map((v, i) => ({
    __id: `${prefix}-${i}-${(v || "").slice(0, 12)}`,
    value: v,
  }));
}

function StringSortableList({ items, onChange, placeholder, addLabel, prefix, emptyIcon, emptyTitle, emptyHint }) {
  const [confirmDelete, setConfirmDelete] = useState(null); // index or null

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        hint={emptyHint}
        action={<AddButton onClick={() => onChange([""])}>{addLabel}</AddButton>}
      />
    );
  }

  const decorated = withIds(items, prefix);
  const commit = (nextDecorated) => onChange(nextDecorated.map((d) => d.value));

  return (
    <>
      <SortableList
        items={decorated}
        getItemId={(item) => item.__id}
        onReorder={commit}
        renderItem={({ item, index, dragHandle }) => (
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
            {dragHandle}
            <TextInput
              value={item.value}
              onChange={(v) => {
                const next = [...decorated];
                next[index] = { ...next[index], value: v };
                commit(next);
              }}
              placeholder={placeholder}
            />
            <IconBtn
              title="Remove"
              danger
              onClick={() => setConfirmDelete(index)}
            >
              <Trash2 className="w-4 h-4" />
            </IconBtn>
          </div>
        )}
      />
      <ConfirmDialog
        open={confirmDelete !== null}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        title="Remove item?"
        description="This entry will be removed from the list. You can undo by clicking Reload before saving."
        confirmLabel="Remove"
        destructive
        onConfirm={() => {
          if (confirmDelete === null) return;
          onChange(items.filter((_, idx) => idx !== confirmDelete));
          setConfirmDelete(null);
        }}
      />
    </>
  );
}

// ---- page ---------------------------------------------------------------

export default function FounderPage() {
  const { content, update, validationErrors } = useContent();
  const f = content.FOUNDER || {};
  const setF = (k, v) => update("FOUNDER", { ...f, [k]: v });

  const errFor = (path) => {
    const wanted = path.join(".");
    const hit = validationErrors.find(
      (e) => e.key === "FOUNDER" && e.path.join(".") === wanted
    );
    return hit?.message?.split(": ").slice(1).join(": ");
  };

  const skills = f.skills || [];
  const certs = f.certifications || [];

  return (
    <div className="space-y-4 max-w-3xl">
      <Card>
        <SectionTitle description="Shown in the Founder section of the landing page.">
          Profile
        </SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Name" error={errFor(["name"])} required>
            <TextInput
              value={f.name}
              onChange={(v) => setF("name", v)}
              error={errFor(["name"])}
            />
          </Field>
          <Field label="Role / one-liner" error={errFor(["role"])} required>
            <TextInput
              value={f.role}
              onChange={(v) => setF("role", v)}
              error={errFor(["role"])}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field
            label="Photo"
            hint="Square 512×512 recommended. Uploads to Firebase Storage."
          >
            <ImageField
              value={f.photo}
              onChange={(v) => setF("photo", v)}
              folder="founder"
              aspect="aspect-square"
              width="w-28"
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field
            label="Bio"
            hint="Long-form. Rendered as a paragraph on the Founder section."
            error={errFor(["bio"])}
            required
          >
            <TextArea
              value={f.bio}
              onChange={(v) => setF("bio", v)}
              rows={5}
              showCount
              maxLength={1200}
              error={errFor(["bio"])}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle
          description="Skills chips on the Founder card. Drag to reorder."
          action={
            skills.length > 0 && (
              <AddButton onClick={() => setF("skills", [...skills, ""])}>
                Add skill
              </AddButton>
            )
          }
        >
          Skills ({skills.length})
        </SectionTitle>
        <StringSortableList
          items={skills}
          onChange={(next) => setF("skills", next)}
          placeholder="e.g. Salesforce Admin"
          addLabel="Add first skill"
          prefix="skill"
          emptyIcon={Sparkles}
          emptyTitle="No skills yet"
          emptyHint="Add short chips describing the founder's core competencies."
        />
      </Card>

      <Card>
        <SectionTitle
          description="Certifications listed under the founder bio. Drag to reorder."
          action={
            certs.length > 0 && (
              <AddButton
                onClick={() => setF("certifications", [...certs, ""])}
              >
                Add certification
              </AddButton>
            )
          }
        >
          Certifications ({certs.length})
        </SectionTitle>
        <StringSortableList
          items={certs}
          onChange={(next) => setF("certifications", next)}
          placeholder="e.g. Salesforce Platform Developer I"
          addLabel="Add first certification"
          prefix="cert"
          emptyIcon={Award}
          emptyTitle="No certifications listed"
          emptyHint="Add credentials to build trust with prospective students."
        />
      </Card>
    </div>
  );
}
