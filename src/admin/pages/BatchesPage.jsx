import React, { useState } from "react";
import { useContent } from "../AdminContext";
import {
  Card,
  Field,
  TextInput,
  NumberInput,
  SelectInput,
  DateField,
  SectionTitle,
  IconBtn,
  AddButton,
} from "../components/FormControls";
import SortableList from "../components/SortableList";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { Trash2, Calendar } from "lucide-react";

const emptyBatch = {
  start: "",
  mode: "Weekday",
  time: "",
  seats: 12,
  course: "",
};

const MODE_OPTIONS = [
  { value: "Weekday", label: "Weekday" },
  { value: "Weekend", label: "Weekend" },
];

const COMMON_TIME_SLOTS = [
  "Morning (9 AM – 11 AM)",
  "Afternoon (2 PM – 4 PM)",
  "Evening (6 PM – 8 PM)",
  "Night (8 PM – 10 PM)",
];

export default function BatchesPage() {
  const { content, update, validationErrors } = useContent();
  const batches = content.BATCHES || [];
  const [confirmDelete, setConfirmDelete] = useState(null);

  const setBatches = (next) => update("BATCHES", next);
  const setField = (i, k, v) => {
    const next = [...batches];
    next[i] = { ...next[i], [k]: v };
    setBatches(next);
  };

  const errFor = (i, field) => {
    const wanted = `${i}.${field}`;
    const hit = validationErrors.find(
      (e) => e.key === "BATCHES" && e.path.join(".") === wanted
    );
    return hit?.message?.split(": ").slice(1).join(": ");
  };

  // decorate for stable drag keys
  const decorated = batches.map((b, i) => ({
    __id: `batch-${i}-${(b.course || "").slice(0, 12)}`,
    data: b,
    index: i,
  }));

  const addBatch = () => setBatches([...batches, { ...emptyBatch }]);

  return (
    <div className="space-y-4 max-w-4xl">
      <Card>
        <SectionTitle
          description="Seats ≤ 5 shows an orange “Only N left” urgency badge on the site. Drag rows to reorder."
          action={<AddButton onClick={addBatch}>Add batch</AddButton>}
        >
          Upcoming cohorts ({batches.length})
        </SectionTitle>

        {batches.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No batches yet"
            hint="Add your first cohort so learners can pick a start date."
            action={<AddButton onClick={addBatch}>Add batch</AddButton>}
          />
        ) : (
          <SortableList
            items={decorated}
            getItemId={(it) => it.__id}
            onReorder={(nextItems) => setBatches(nextItems.map((it) => it.data))}
            renderItem={({ item, dragHandle }) => {
              const i = item.index;
              const b = item.data;
              const isCustomTime =
                b.time && !COMMON_TIME_SLOTS.includes(b.time);
              return (
                <div className="rounded-lg border border-slate-200 p-3 sm:p-4 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {dragHandle}
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Batch #{i + 1}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Start date" error={errFor(i, "start")}>
                      <DateField
                        value={b.start}
                        onChange={(v) => setField(i, "start", v)}
                        error={!!errFor(i, "start")}
                      />
                    </Field>
                    <Field label="Mode" error={errFor(i, "mode")}>
                      <SelectInput
                        value={b.mode}
                        onChange={(v) => setField(i, "mode", v)}
                        options={MODE_OPTIONS}
                        placeholder="Select mode"
                        error={!!errFor(i, "mode")}
                      />
                    </Field>
                    <Field label="Time slot" error={errFor(i, "time")}>
                      <div className="space-y-2">
                        <SelectInput
                          value={isCustomTime ? "__custom" : b.time}
                          onChange={(v) => {
                            if (v === "__custom") {
                              setField(i, "time", b.time || "Custom time");
                            } else {
                              setField(i, "time", v);
                            }
                          }}
                          options={[
                            ...COMMON_TIME_SLOTS.map((t) => ({
                              value: t,
                              label: t,
                            })),
                            { value: "__custom", label: "Custom…" },
                          ]}
                          placeholder="Pick a slot"
                          error={!!errFor(i, "time")}
                        />
                        {isCustomTime && (
                          <TextInput
                            value={b.time}
                            onChange={(v) => setField(i, "time", v)}
                            placeholder="Custom time (e.g. 7 PM – 9 PM)"
                          />
                        )}
                      </div>
                    </Field>
                    <Field label="Seats available" error={errFor(i, "seats")}>
                      <NumberInput
                        value={b.seats}
                        onChange={(v) => setField(i, "seats", v)}
                        min={0}
                        max={200}
                        placeholder="12"
                        error={!!errFor(i, "seats")}
                      />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field
                        label="Course"
                        hint="Free-text; shows as the row title on the site."
                        error={errFor(i, "course")}
                      >
                        <TextInput
                          value={b.course}
                          onChange={(v) => setField(i, "course", v)}
                          placeholder="Salesforce Complete Course"
                          error={!!errFor(i, "course")}
                        />
                      </Field>
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
        title="Delete this batch?"
        description="This will remove the cohort from the site as soon as you save."
        confirmLabel="Delete batch"
        destructive
        onConfirm={() => {
          setBatches(batches.filter((_, idx) => idx !== confirmDelete));
          setConfirmDelete(null);
        }}
      />
    </div>
  );
}
