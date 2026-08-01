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
  NumberInput,
} from "../components/FormControls";
import SortableList from "../components/SortableList";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { Trash2, BookOpen, HelpCircle, MessageSquareQuote } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COURSE_KEYS = [
  { id: "foundation", label: "Foundation" },
  { id: "crash-course", label: "Crash Course" },
  { id: "complete-course", label: "Complete Course" },
  { id: "salesforce-qa", label: "Salesforce QA" },
  { id: "automation-qa", label: "Automation QA" },
  { id: "interview-prep", label: "Interview Prep" },
];

// ---- Reusable string list
function StringList({ items, onChange, placeholder, addLabel = "Add item" }) {
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

// ---- Week-by-week editor
function WeekByWeekEditor({ items, onChange }) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const addWeek = () =>
    onChange([...(items || []), { week: items.length + 1, topic: "", points: [] }]);

  const setWeek = (i, k, v) => {
    const next = [...items];
    next[i] = { ...next[i], [k]: v };
    onChange(next);
  };

  const removeWeek = (i) => {
    onChange(items.filter((_, idx) => idx !== i));
    setConfirmDelete(null);
  };

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No weeks yet"
        hint="Add your first week to populate the schedule."
        action={<AddButton onClick={addWeek}>Add week</AddButton>}
      />
    );
  }

  const decorated = items.map((w, i) => ({
    __id: `week-${i}-${(w.topic || "").slice(0, 12)}`,
    data: w,
    index: i,
  }));

  return (
    <>
      <SortableList
        items={decorated}
        getItemId={(it) => it.__id}
        onReorder={(nextItems) => onChange(nextItems.map((it) => it.data))}
        renderItem={({ item, dragHandle }) => {
          const i = item.index;
          const w = item.data;
          return (
            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/60">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {dragHandle}
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Week #{i + 1}
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
                <Field label="Week number">
                  <NumberInput
                    value={w.week}
                    onChange={(v) => setWeek(i, "week", v)}
                    min={1}
                    placeholder="1"
                  />
                </Field>
                <Field label="Topic">
                  <TextInput
                    value={w.topic}
                    onChange={(v) => setWeek(i, "topic", v)}
                    placeholder="e.g. Apex Fundamentals"
                  />
                </Field>
                <Field label="Points" hint="Key takeaways for this week.">
                  <StringList
                    items={w.points || []}
                    onChange={(next) => setWeek(i, "points", next)}
                    placeholder="e.g. Triggers & classes"
                    addLabel="Add point"
                  />
                </Field>
              </div>
            </div>
          );
        }}
      />
      <ConfirmDialog
        open={confirmDelete !== null}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        title="Remove week?"
        description="This week will be removed from the schedule. You can undo by clicking Reload before saving."
        confirmLabel="Remove"
        destructive
        onConfirm={() => removeWeek(confirmDelete)}
      />
    </>
  );
}

// ---- FAQ editor
function FaqEditor({ items, onChange }) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const addFaq = () => onChange([...(items || []), { q: "", a: "" }]);

  const setFaq = (i, k, v) => {
    const next = [...items];
    next[i] = { ...next[i], [k]: v };
    onChange(next);
  };

  const removeFaq = (i) => {
    onChange(items.filter((_, idx) => idx !== i));
    setConfirmDelete(null);
  };

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={HelpCircle}
        title="No FAQs yet"
        hint="Add your first FAQ item."
        action={<AddButton onClick={addFaq}>Add FAQ</AddButton>}
      />
    );
  }

  const decorated = items.map((f, i) => ({
    __id: `faq-${i}-${(f.q || "").slice(0, 12)}`,
    data: f,
    index: i,
  }));

  return (
    <>
      <SortableList
        items={decorated}
        getItemId={(it) => it.__id}
        onReorder={(nextItems) => onChange(nextItems.map((it) => it.data))}
        renderItem={({ item, dragHandle }) => {
          const i = item.index;
          const f = item.data;
          return (
            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/60">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {dragHandle}
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    FAQ #{i + 1}
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
                <Field label="Question">
                  <TextInput
                    value={f.q}
                    onChange={(v) => setFaq(i, "q", v)}
                    placeholder="e.g. Do I need coding skills?"
                  />
                </Field>
                <Field label="Answer">
                  <TextArea
                    value={f.a}
                    onChange={(v) => setFaq(i, "a", v)}
                    rows={3}
                    placeholder="Your answer here..."
                  />
                </Field>
              </div>
            </div>
          );
        }}
      />
      <ConfirmDialog
        open={confirmDelete !== null}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        title="Remove FAQ?"
        description="This FAQ will be removed. You can undo by clicking Reload before saving."
        confirmLabel="Remove"
        destructive
        onConfirm={() => removeFaq(confirmDelete)}
      />
    </>
  );
}

// ---- Main per-course editor
function CourseEditor({ courseKey, data, onChange }) {
  const course = data || {};

  const setCourse = (k, v) => onChange({ ...course, [k]: v });

  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle description="Basic course info.">Course Details</SectionTitle>
        <div className="space-y-3">
          <Field label="Title">
            <TextInput
              value={course.title}
              onChange={(v) => setCourse("title", v)}
              placeholder="e.g. Salesforce Foundation"
              data-testid={`course-${courseKey}-title`}
            />
          </Field>
          <Field label="Tagline">
            <TextInput
              value={course.tagline}
              onChange={(v) => setCourse("tagline", v)}
              placeholder="e.g. Start your Salesforce journey with the fundamentals"
              data-testid={`course-${courseKey}-tagline`}
            />
          </Field>
          <Field label="Chips" hint="Duration, level, mode, etc.">
            <StringList
              items={course.chips || []}
              onChange={(next) => setCourse("chips", next)}
              placeholder="e.g. 5 hrs/week"
              addLabel="Add chip"
            />
          </Field>
          <Field label="Description" hint="Brief course summary.">
            <TextArea
              value={course.description}
              onChange={(v) => setCourse("description", v)}
              rows={4}
              showCount
              maxLength={800}
              data-testid={`course-${courseKey}-description`}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle
          description="Weekly curriculum breakdown."
          action={
            (course.weekByWeek || []).length > 0 && (
              <AddButton
                onClick={() =>
                  setCourse("weekByWeek", [
                    ...(course.weekByWeek || []),
                    { week: (course.weekByWeek || []).length + 1, topic: "", points: [] },
                  ])
                }
              >
                Add week
              </AddButton>
            )
          }
        >
          Week-by-Week Schedule ({(course.weekByWeek || []).length})
        </SectionTitle>
        <WeekByWeekEditor
          items={course.weekByWeek || []}
          onChange={(next) => setCourse("weekByWeek", next)}
        />
      </Card>

      <Card>
        <SectionTitle description="Key learning outcomes.">Outcomes</SectionTitle>
        <StringList
          items={course.outcomes || []}
          onChange={(next) => setCourse("outcomes", next)}
          placeholder="e.g. Write Apex triggers and classes"
          addLabel="Add outcome"
        />
      </Card>

      <Card>
        <SectionTitle description="Target audience description.">
          Who This Is For
        </SectionTitle>
        <TextArea
          value={course.whoThisIsFor}
          onChange={(v) => setCourse("whoThisIsFor", v)}
          rows={4}
          showCount
          maxLength={600}
          placeholder="Describe the ideal student for this course..."
          data-testid={`course-${courseKey}-who-this-is-for`}
        />
      </Card>

      <Card>
        <SectionTitle description="Student testimonial for this course.">
          Testimonial
        </SectionTitle>
        <div className="space-y-3">
          <Field label="Name">
            <TextInput
              value={course.testimonial?.name}
              onChange={(v) =>
                setCourse("testimonial", { ...course.testimonial, name: v })
              }
              placeholder="e.g. Sneha Patil"
              data-testid={`course-${courseKey}-testimonial-name`}
            />
          </Field>
          <Field label="Role">
            <TextInput
              value={course.testimonial?.role}
              onChange={(v) =>
                setCourse("testimonial", { ...course.testimonial, role: v })
              }
              placeholder="e.g. Salesforce Admin Trainee"
              data-testid={`course-${courseKey}-testimonial-role`}
            />
          </Field>
          <Field label="Photo URL (optional)" hint="Path like /images/testimonials/name.webp">
            <TextInput
              value={course.testimonial?.photo || ""}
              onChange={(v) =>
                setCourse("testimonial", { ...course.testimonial, photo: v || null })
              }
              placeholder="e.g. /images/testimonials/sneha.webp"
              data-testid={`course-${courseKey}-testimonial-photo`}
            />
          </Field>
          <Field label="Quote">
            <TextArea
              value={course.testimonial?.quote}
              onChange={(v) =>
                setCourse("testimonial", { ...course.testimonial, quote: v })
              }
              rows={3}
              placeholder="Their testimonial quote..."
              data-testid={`course-${courseKey}-testimonial-quote`}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle
          description="Course-specific FAQ items."
          action={
            (course.faq || []).length > 0 && (
              <AddButton
                onClick={() =>
                  setCourse("faq", [...(course.faq || []), { q: "", a: "" }])
                }
              >
                Add FAQ
              </AddButton>
            )
          }
        >
          FAQ ({(course.faq || []).length})
        </SectionTitle>
        <FaqEditor
          items={course.faq || []}
          onChange={(next) => setCourse("faq", next)}
        />
      </Card>

      <Card>
        <SectionTitle description="Label shown in the enroll button.">
          Enroll Label
        </SectionTitle>
        <TextInput
          value={course.enrollLabel}
          onChange={(v) => setCourse("enrollLabel", v)}
          placeholder="e.g. Salesforce Foundation — ₹1,999"
          data-testid={`course-${courseKey}-enroll-label`}
        />
      </Card>
    </div>
  );
}

// ---- Main page
export default function CoursesPageEditor() {
  const { content, update } = useContent();
  const allCourses = content.ALL_COURSES_PAGE || {};

  const setCourseData = (key, data) => {
    update("ALL_COURSES_PAGE", { ...allCourses, [key]: data });
  };

  return (
    <div className="max-w-5xl">
      <Tabs defaultValue="foundation" className="w-full">
        <TabsList className="w-full grid grid-cols-6 mb-4">
          {COURSE_KEYS.map((c) => (
            <TabsTrigger key={c.id} value={c.id} className="text-xs">
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {COURSE_KEYS.map((c) => (
          <TabsContent key={c.id} value={c.id}>
            <CourseEditor
              courseKey={c.id}
              data={allCourses[c.id]}
              onChange={(data) => setCourseData(c.id, data)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
