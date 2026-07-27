import React from "react";
import { useContent } from "../AdminContext";
import { Card, Field, TextInput, TextArea, SectionTitle, IconBtn, AddButton } from "../components/FormControls";
import FileUpload from "../components/FileUpload";
import { Trash2 } from "lucide-react";

function StringList({ items, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      {items.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <TextInput
            value={v}
            onChange={(nv) => { const next = [...items]; next[i] = nv; onChange(next); }}
            placeholder={placeholder}
          />
          <IconBtn title="Remove" danger onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
            <Trash2 className="w-4 h-4" />
          </IconBtn>
        </div>
      ))}
      <AddButton onClick={() => onChange([...items, ""])}>Add bullet</AddButton>
    </div>
  );
}

export default function CurriculumPage() {
  const { content, update } = useContent();
  const tracks = content.CURRICULUM_TRACKS || [];

  const setTrack = (ti, patch) => {
    const next = [...tracks];
    next[ti] = { ...next[ti], ...patch };
    update("CURRICULUM_TRACKS", next);
  };

  const setCourse = (ti, ci, patch) => {
    const next = [...tracks];
    const courses = [...(next[ti].courses || [])];
    courses[ci] = { ...courses[ci], ...patch };
    next[ti] = { ...next[ti], courses };
    update("CURRICULUM_TRACKS", next);
  };

  const addCourse = (ti) => {
    const next = [...tracks];
    const courses = [...(next[ti].courses || []), {
      key: `course-${Date.now()}`,
      title: "New Course",
      tagline: "",
      chips: [],
      description: "",
      highlights: [],
      brochureUrl: "/apexoria-brochure.pdf",
      enrollLabel: "",
    }];
    next[ti] = { ...next[ti], courses };
    update("CURRICULUM_TRACKS", next);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {tracks.map((t, ti) => (
        <Card key={ti}>
          <SectionTitle
            action={
              <div className="flex items-center gap-2">
                <AddButton onClick={() => addCourse(ti)}>Add course</AddButton>
                <IconBtn
                  title="Delete track"
                  danger
                  onClick={() => update("CURRICULUM_TRACKS", tracks.filter((_, idx) => idx !== ti))}
                >
                  <Trash2 className="w-4 h-4" />
                </IconBtn>
              </div>
            }
          >
            Track: {t.title || t.key}
          </SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <Field label="Key">
              <TextInput value={t.key} onChange={(v) => setTrack(ti, { key: v })} />
            </Field>
            <Field label="Title">
              <TextInput value={t.title} onChange={(v) => setTrack(ti, { title: v })} />
            </Field>
            <Field label="Overline">
              <TextInput value={t.overline} onChange={(v) => setTrack(ti, { overline: v })} />
            </Field>
          </div>

          <div className="space-y-3">
            {(t.courses || []).map((c, ci) => (
              <div key={ci} className="rounded-lg border border-slate-200 p-3 sm:p-4 bg-slate-50/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Course #{ci + 1}
                  </span>
                  <IconBtn
                    title="Delete course"
                    danger
                    onClick={() => {
                      const next = [...tracks];
                      next[ti] = { ...next[ti], courses: (t.courses || []).filter((_, idx) => idx !== ci) };
                      update("CURRICULUM_TRACKS", next);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </IconBtn>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Key">
                    <TextInput value={c.key} onChange={(v) => setCourse(ti, ci, { key: v })} />
                  </Field>
                  <Field label="Title">
                    <TextInput value={c.title} onChange={(v) => setCourse(ti, ci, { title: v })} />
                  </Field>
                  <Field label="Tagline">
                    <TextInput value={c.tagline} onChange={(v) => setCourse(ti, ci, { tagline: v })} />
                  </Field>
                  <Field label="Enrol label (used in course dropdown)">
                    <TextInput value={c.enrollLabel} onChange={(v) => setCourse(ti, ci, { enrollLabel: v })} />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Chips (short badges)">
                      <StringList
                        items={c.chips || []}
                        onChange={(next) => setCourse(ti, ci, { chips: next })}
                        placeholder="E.g. 3 Months"
                      />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Description">
                      <TextArea value={c.description} onChange={(v) => setCourse(ti, ci, { description: v })} rows={4} />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Highlights (bullets)">
                      <StringList
                        items={c.highlights || []}
                        onChange={(next) => setCourse(ti, ci, { highlights: next })}
                        placeholder="E.g. Apex fundamentals & triggers"
                      />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Brochure PDF" hint="Upload a per-course PDF, or paste a URL/path.">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <TextInput
                          value={c.brochureUrl}
                          onChange={(v) => setCourse(ti, ci, { brochureUrl: v })}
                          placeholder="/apexoria-brochure.pdf or Firebase URL"
                        />
                        <FileUpload
                          folder={`brochures/${t.key || "track"}/${c.key || "course"}`}
                          accept="application/pdf"
                          value={c.brochureUrl}
                          onUploaded={(url) => setCourse(ti, ci, { brochureUrl: url })}
                          label="Upload PDF"
                        />
                      </div>
                    </Field>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
