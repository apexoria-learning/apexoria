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
import PdfField from "../components/PdfField";
import SortableList from "../components/SortableList";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { Trash2, ChevronDown, ChevronRight, BookOpen, GraduationCap } from "lucide-react";

// -----------------------------------------------------------------------
// Reusable string bullet list (chips / highlights)
// -----------------------------------------------------------------------
function StringList({ items, onChange, placeholder, addLabel = "Add bullet" }) {
  return (
    <div className="space-y-2">
      {(items || []).map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <TextInput
            value={v}
            onChange={(nv) => {
              const next = [...items];
              next[i] = nv;
              onChange(next);
            }}
            placeholder={placeholder}
          />
          <IconBtn
            title="Remove"
            danger
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
          >
            <Trash2 className="w-4 h-4" />
          </IconBtn>
        </div>
      ))}
      <AddButton onClick={() => onChange([...(items || []), ""])}>
        {addLabel}
      </AddButton>
    </div>
  );
}

// -----------------------------------------------------------------------
// Course card — collapsed by default; expand to edit.
// -----------------------------------------------------------------------
function CourseCard({
  track,
  course,
  ci,
  dragHandle,
  onChange,
  onDelete,
  errFor,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2 min-w-0">
          {dragHandle}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1.5 text-left min-w-0"
          >
            {open ? (
              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
            )}
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 shrink-0">
              #{ci + 1}
            </span>
            <span className="text-sm font-medium text-slate-800 truncate">
              {course.title || course.key || "(untitled course)"}
            </span>
          </button>
        </div>
        <IconBtn title="Delete course" danger onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </IconBtn>
      </div>

      {open && (
        <div className="border-t border-slate-200 p-3 sm:p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Key" hint="Unique within the track.">
              <TextInput
                value={course.key}
                onChange={(v) => onChange({ key: v })}
              />
            </Field>
            <Field label="Title" required error={errFor("title")}>
              <TextInput
                value={course.title}
                onChange={(v) => onChange({ title: v })}
                error={!!errFor("title")}
              />
            </Field>
            <Field label="Tagline" error={errFor("tagline")}>
              <TextInput
                value={course.tagline}
                onChange={(v) => onChange({ tagline: v })}
                error={!!errFor("tagline")}
              />
            </Field>
            <Field
              label="Enrol label"
              hint="Also used in the course-dropdown option."
              error={errFor("enrollLabel")}
            >
              <TextInput
                value={course.enrollLabel}
                onChange={(v) => onChange({ enrollLabel: v })}
                error={!!errFor("enrollLabel")}
              />
            </Field>
          </div>
          <Field label="Chips" hint="Short badges (duration, level, mode).">
            <StringList
              items={course.chips || []}
              onChange={(next) => onChange({ chips: next })}
              placeholder="E.g. 3 Months"
              addLabel="Add chip"
            />
          </Field>
          <Field label="Description" required error={errFor("description")}>
            <TextArea
              value={course.description}
              onChange={(v) => onChange({ description: v })}
              showCount
              maxLength={800}
              error={!!errFor("description")}
            />
          </Field>
          <Field label="Highlights" hint="Bullet points on the course card.">
            <StringList
              items={course.highlights || []}
              onChange={(next) => onChange({ highlights: next })}
              placeholder="E.g. Apex fundamentals & triggers"
              addLabel="Add highlight"
            />
          </Field>
          <Field
            label="Brochure PDF"
            hint="Per-course brochure. Falls back to main brochure if empty."
          >
            <PdfField
              value={course.brochureUrl}
              onChange={(v) => onChange({ brochureUrl: v })}
              folder={`brochures/${track.key || "track"}/${course.key || "course"}`}
            />
          </Field>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------
// Main page
// -----------------------------------------------------------------------
export default function CurriculumPage() {
  const { content, update, validationErrors } = useContent();
  const tracks = content.CURRICULUM_TRACKS || [];
  const [confirmTrack, setConfirmTrack] = useState(null);
  const [confirmCourse, setConfirmCourse] = useState(null); // {ti, ci}

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

  const reorderCourses = (ti, nextCourses) => {
    const next = [...tracks];
    next[ti] = { ...next[ti], courses: nextCourses };
    update("CURRICULUM_TRACKS", next);
  };

  const addCourse = (ti) => {
    const t = tracks[ti];
    const courses = [
      ...(t.courses || []),
      {
        key: `course-${Date.now()}`,
        title: "New Course",
        tagline: "",
        chips: [],
        description: "",
        highlights: [],
        brochureUrl: "/apexoria-brochure.pdf",
        enrollLabel: "",
      },
    ];
    setTrack(ti, { courses });
  };

  const addTrack = () =>
    update("CURRICULUM_TRACKS", [
      ...tracks,
      {
        key: `track-${Date.now()}`,
        title: "New Track",
        overline: "",
        courses: [],
      },
    ]);

  const errForCourse = (ti, ci, field) => {
    const wanted = `${ti}.courses.${ci}.${field}`;
    const hit = validationErrors.find(
      (e) => e.key === "CURRICULUM_TRACKS" && e.path.join(".") === wanted
    );
    return hit?.message?.split(": ").slice(1).join(": ");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {tracks.length === 0 && (
        <Card>
          <EmptyState
            icon={GraduationCap}
            title="No tracks yet"
            hint="Tracks are the top-level groupings (e.g. Admin, Developer)."
            action={<AddButton onClick={addTrack}>Add track</AddButton>}
          />
        </Card>
      )}

      {tracks.map((t, ti) => {
        const decoratedCourses = (t.courses || []).map((c, ci) => ({
          __id: `c-${ti}-${ci}-${(c.key || "").slice(0, 12)}`,
          data: c,
          index: ci,
        }));
        return (
          <Card key={ti}>
            <SectionTitle
              action={
                <div className="flex items-center gap-2">
                  <AddButton onClick={() => addCourse(ti)}>Add course</AddButton>
                  <IconBtn
                    title="Delete track"
                    danger
                    onClick={() => setConfirmTrack(ti)}
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
                <TextInput
                  value={t.key}
                  onChange={(v) => setTrack(ti, { key: v })}
                />
              </Field>
              <Field label="Title">
                <TextInput
                  value={t.title}
                  onChange={(v) => setTrack(ti, { title: v })}
                />
              </Field>
              <Field label="Overline">
                <TextInput
                  value={t.overline}
                  onChange={(v) => setTrack(ti, { overline: v })}
                />
              </Field>
            </div>

            {decoratedCourses.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No courses in this track"
                hint="Add a course to expose it on the curriculum section."
                action={
                  <AddButton onClick={() => addCourse(ti)}>Add course</AddButton>
                }
              />
            ) : (
              <SortableList
                items={decoratedCourses}
                getItemId={(it) => it.__id}
                onReorder={(nextItems) =>
                  reorderCourses(ti, nextItems.map((it) => it.data))
                }
                renderItem={({ item, dragHandle }) => (
                  <CourseCard
                    track={t}
                    course={item.data}
                    ci={item.index}
                    dragHandle={dragHandle}
                    onChange={(patch) => setCourse(ti, item.index, patch)}
                    onDelete={() =>
                      setConfirmCourse({ ti, ci: item.index })
                    }
                    errFor={(field) => errForCourse(ti, item.index, field)}
                  />
                )}
              />
            )}
          </Card>
        );
      })}

      {tracks.length > 0 && (
        <div className="flex justify-start">
          <AddButton onClick={addTrack}>Add track</AddButton>
        </div>
      )}

      <ConfirmDialog
        open={confirmTrack !== null}
        onOpenChange={(o) => !o && setConfirmTrack(null)}
        title="Delete this entire track?"
        description="All courses inside will be removed as well."
        confirmLabel="Delete track"
        destructive
        onConfirm={() => {
          update(
            "CURRICULUM_TRACKS",
            tracks.filter((_, idx) => idx !== confirmTrack)
          );
          setConfirmTrack(null);
        }}
      />

      <ConfirmDialog
        open={confirmCourse !== null}
        onOpenChange={(o) => !o && setConfirmCourse(null)}
        title="Delete this course?"
        description="The course will be removed from its track on save."
        confirmLabel="Delete course"
        destructive
        onConfirm={() => {
          if (!confirmCourse) return;
          const { ti, ci } = confirmCourse;
          const next = [...tracks];
          next[ti] = {
            ...next[ti],
            courses: (next[ti].courses || []).filter((_, idx) => idx !== ci),
          };
          update("CURRICULUM_TRACKS", next);
          setConfirmCourse(null);
        }}
      />
    </div>
  );
}
