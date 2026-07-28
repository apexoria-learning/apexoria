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
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { Trash2, HelpCircle } from "lucide-react";

const empty = { q: "", a: "" };

export default function FaqPage() {
  const { content, update, validationErrors } = useContent();
  const list = content.FAQ_ITEMS || [];
  const [confirmDelete, setConfirmDelete] = useState(null);

  const setItem = (i, k, v) => {
    const next = [...list];
    next[i] = { ...next[i], [k]: v };
    update("FAQ_ITEMS", next);
  };

  const errFor = (i, field) => {
    const wanted = `${i}.${field}`;
    const hit = validationErrors.find(
      (e) => e.key === "FAQ_ITEMS" && e.path.join(".") === wanted
    );
    return hit?.message?.split(": ").slice(1).join(": ");
  };

  const decorated = list.map((f, i) => ({
    __id: `faq-${i}-${(f.q || "").slice(0, 12)}`,
    data: f,
    index: i,
  }));

  const addFaq = () => update("FAQ_ITEMS", [...list, { ...empty }]);

  return (
    <div className="space-y-4 max-w-4xl">
      <Card>
        <SectionTitle
          description="Order matters — drag high-intent questions to the top."
          action={<AddButton onClick={addFaq}>Add FAQ</AddButton>}
        >
          FAQ items ({list.length})
        </SectionTitle>

        {list.length === 0 ? (
          <EmptyState
            icon={HelpCircle}
            title="No FAQs yet"
            hint="Add common questions to reduce lead-form friction."
            action={<AddButton onClick={addFaq}>Add FAQ</AddButton>}
          />
        ) : (
          <SortableList
            items={decorated}
            getItemId={(it) => it.__id}
            onReorder={(nextItems) =>
              update("FAQ_ITEMS", nextItems.map((it) => it.data))
            }
            renderItem={({ item, dragHandle }) => {
              const i = item.index;
              const f = item.data;
              return (
                <div className="rounded-lg border border-slate-200 p-3 sm:p-4 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {dragHandle}
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Q{i + 1}
                      </span>
                    </div>
                    <IconBtn
                      title="Delete"
                      danger
                      onClick={() => setConfirmDelete(i)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </IconBtn>
                  </div>
                  <div className="space-y-3">
                    <Field label="Question" required error={errFor(i, "q")}>
                      <TextInput
                        value={f.q}
                        onChange={(v) => setItem(i, "q", v)}
                        error={!!errFor(i, "q")}
                      />
                    </Field>
                    <Field label="Answer" required error={errFor(i, "a")}>
                      <TextArea
                        value={f.a}
                        onChange={(v) => setItem(i, "a", v)}
                        showCount
                        maxLength={1200}
                        error={!!errFor(i, "a")}
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
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title="Delete this FAQ?"
        description="It will be removed from the FAQ accordion on save."
        confirmLabel="Delete FAQ"
        destructive
        onConfirm={() => {
          update("FAQ_ITEMS", list.filter((_, idx) => idx !== confirmDelete));
          setConfirmDelete(null);
        }}
      />
    </div>
  );
}
