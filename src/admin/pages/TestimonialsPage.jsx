import React, { useState } from "react";
import { useContent } from "../AdminContext";
import {
  Card,
  Field,
  TextInput,
  TextArea,
  StarRating,
  SectionTitle,
  IconBtn,
  AddButton,
} from "../components/FormControls";
import ImageField from "../components/ImageField";
import SortableList from "../components/SortableList";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { Trash2, MessageSquareQuote } from "lucide-react";

const emptyT = {
  name: "",
  role: "",
  company: "",
  quote: "",
  rating: 5,
  photo: "",
};

export default function TestimonialsPage() {
  const { content, update, validationErrors } = useContent();
  const list = content.TESTIMONIALS || [];
  const [confirmDelete, setConfirmDelete] = useState(null);

  const setItem = (i, k, v) => {
    const next = [...list];
    next[i] = { ...next[i], [k]: v };
    update("TESTIMONIALS", next);
  };

  const errFor = (i, field) => {
    const wanted = `${i}.${field}`;
    const hit = validationErrors.find(
      (e) => e.key === "TESTIMONIALS" && e.path.join(".") === wanted
    );
    return hit?.message?.split(": ").slice(1).join(": ");
  };

  const decorated = list.map((t, i) => ({
    __id: `test-${i}-${(t.name || "").slice(0, 12)}`,
    data: t,
    index: i,
  }));

  const addTestimonial = () => update("TESTIMONIALS", [...list, { ...emptyT }]);

  return (
    <div className="space-y-4 max-w-4xl">
      <Card>
        <SectionTitle
          description="Rendered on the site’s social-proof section. Drag to reorder — top ones show first."
          action={<AddButton onClick={addTestimonial}>Add testimonial</AddButton>}
        >
          Testimonials ({list.length})
        </SectionTitle>

        {list.length === 0 ? (
          <EmptyState
            icon={MessageSquareQuote}
            title="No testimonials yet"
            hint="Add a first quote from a graduate to build social proof."
            action={<AddButton onClick={addTestimonial}>Add testimonial</AddButton>}
          />
        ) : (
          <SortableList
            items={decorated}
            getItemId={(it) => it.__id}
            onReorder={(nextItems) =>
              update("TESTIMONIALS", nextItems.map((it) => it.data))
            }
            renderItem={({ item, dragHandle }) => {
              const i = item.index;
              const t = item.data;
              return (
                <div className="rounded-lg border border-slate-200 p-3 sm:p-4 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {dragHandle}
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        #{i + 1} {t.name && `— ${t.name}`}
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
                  <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4">
                    <div>
                      <Field label="Photo" error={errFor(i, "photo")}>
                        <ImageField
                          value={t.photo}
                          onChange={(v) => setItem(i, "photo", v)}
                          folder="testimonial-photos"
                          aspect="aspect-square"
                          width="w-24"
                        />
                      </Field>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label="Name" required error={errFor(i, "name")}>
                        <TextInput
                          value={t.name}
                          onChange={(v) => setItem(i, "name", v)}
                          error={!!errFor(i, "name")}
                        />
                      </Field>
                      <Field label="Role" error={errFor(i, "role")}>
                        <TextInput
                          value={t.role}
                          onChange={(v) => setItem(i, "role", v)}
                          placeholder="Salesforce Developer"
                          error={!!errFor(i, "role")}
                        />
                      </Field>
                      <Field
                        label="Company (optional)"
                        error={errFor(i, "company")}
                      >
                        <TextInput
                          value={t.company}
                          onChange={(v) => setItem(i, "company", v)}
                          placeholder="at Company Name"
                          error={!!errFor(i, "company")}
                        />
                      </Field>
                      <Field label="Rating" error={errFor(i, "rating")}>
                        <StarRating
                          value={t.rating}
                          onChange={(v) => setItem(i, "rating", v)}
                          step={1}
                        />
                      </Field>
                      <div className="sm:col-span-2">
                        <Field label="Quote" required error={errFor(i, "quote")}>
                          <TextArea
                            value={t.quote}
                            onChange={(v) => setItem(i, "quote", v)}
                            showCount
                            maxLength={600}
                            placeholder="What the student said…"
                            error={!!errFor(i, "quote")}
                          />
                        </Field>
                      </div>
                    </div>
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
        title="Delete this testimonial?"
        description="The quote will be removed from the site on save."
        confirmLabel="Delete testimonial"
        destructive
        onConfirm={() => {
          update("TESTIMONIALS", list.filter((_, idx) => idx !== confirmDelete));
          setConfirmDelete(null);
        }}
      />
    </div>
  );
}
