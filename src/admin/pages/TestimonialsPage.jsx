import React from "react";
import { useContent } from "../AdminContext";
import { Card, Field, TextInput, TextArea, NumberInput, SectionTitle, IconBtn, AddButton } from "../components/FormControls";
import FileUpload from "../components/FileUpload";
import { Trash2 } from "lucide-react";

const emptyT = { name: "", role: "", company: "", quote: "", rating: 5, photo: "" };

export default function TestimonialsPage() {
  const { content, update } = useContent();
  const list = content.TESTIMONIALS || [];

  const setItem = (i, k, v) => {
    const next = [...list]; next[i] = { ...next[i], [k]: v }; update("TESTIMONIALS", next);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <Card>
        <SectionTitle action={<AddButton onClick={() => update("TESTIMONIALS", [...list, { ...emptyT }])}>Add testimonial</AddButton>}>
          Testimonials ({list.length})
        </SectionTitle>
        <div className="space-y-3">
          {list.map((t, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-3 sm:p-4 bg-slate-50/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">#{i + 1}</span>
                <IconBtn title="Delete" danger onClick={() => update("TESTIMONIALS", list.filter((_, idx) => idx !== i))}>
                  <Trash2 className="w-4 h-4" />
                </IconBtn>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4">
                {/* Photo upload column */}
                <div className="space-y-2">
                  {t.photo ? (
                    <img src={t.photo} alt="" className="w-[72px] h-[72px] rounded-full object-cover ring-1 ring-slate-200" />
                  ) : (
                    <div className="w-[72px] h-[72px] rounded-full border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">No photo</div>
                  )}
                  <Field label="Photo URL">
                    <TextInput value={t.photo} onChange={(v) => setItem(i, "photo", v)} placeholder="https://..." />
                  </Field>
                  <FileUpload
                    folder="testimonial-photos"
                    accept="image/*"
                    value={t.photo}
                    onUploaded={(url) => setItem(i, "photo", url)}
                    label="Upload photo"
                  />
                </div>
                {/* Fields column */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Name">
                    <TextInput value={t.name} onChange={(v) => setItem(i, "name", v)} />
                  </Field>
                  <Field label="Role">
                    <TextInput value={t.role} onChange={(v) => setItem(i, "role", v)} placeholder="Salesforce Developer" />
                  </Field>
                  <Field label="Company (optional)">
                    <TextInput value={t.company} onChange={(v) => setItem(i, "company", v)} placeholder="at Company Name" />
                  </Field>
                  <Field label="Rating (1-5)">
                    <NumberInput value={t.rating} onChange={(v) => setItem(i, "rating", v)} placeholder="5" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Quote">
                      <TextArea value={t.quote} onChange={(v) => setItem(i, "quote", v)} rows={5} />
                    </Field>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
