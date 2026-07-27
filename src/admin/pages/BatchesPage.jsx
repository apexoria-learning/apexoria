import React from "react";
import { useContent } from "../AdminContext";
import { Card, Field, TextInput, NumberInput, SectionTitle, IconBtn, AddButton } from "../components/FormControls";
import { Trash2, GripVertical } from "lucide-react";

const emptyBatch = {
  start: "",
  mode: "Weekday",
  time: "",
  seats: 12,
  course: "",
};

export default function BatchesPage() {
  const { content, update } = useContent();
  const batches = content.BATCHES || [];

  const setBatches = (next) => update("BATCHES", next);
  const setField = (i, k, v) => {
    const next = [...batches];
    next[i] = { ...next[i], [k]: v };
    setBatches(next);
  };

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= batches.length) return;
    const next = [...batches];
    [next[i], next[j]] = [next[j], next[i]];
    setBatches(next);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <Card>
        <SectionTitle action={<AddButton onClick={() => setBatches([...batches, { ...emptyBatch }])}>Add batch</AddButton>}>
          Upcoming cohorts ({batches.length})
        </SectionTitle>
        <p className="text-xs text-slate-500 mb-3">
          Seats ≤ 5 shows an orange “Only N left” urgency badge on the site.
        </p>

        <div className="space-y-3">
          {batches.map((b, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-3 sm:p-4 bg-slate-50/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Batch #{i + 1}
                </span>
                <div className="flex items-center gap-1">
                  <IconBtn title="Move up" onClick={() => move(i, -1)}>
                    <GripVertical className="w-4 h-4 rotate-90" />
                  </IconBtn>
                  <IconBtn title="Delete" danger onClick={() => setBatches(batches.filter((_, idx) => idx !== i))}>
                    <Trash2 className="w-4 h-4" />
                  </IconBtn>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Start date" hint="E.g. 27 Jul 2026">
                  <TextInput value={b.start} onChange={(v) => setField(i, "start", v)} placeholder="27 Jul 2026" />
                </Field>
                <Field label="Mode" hint="Weekday / Weekend">
                  <TextInput value={b.mode} onChange={(v) => setField(i, "mode", v)} placeholder="Weekday" />
                </Field>
                <Field label="Time slot">
                  <TextInput value={b.time} onChange={(v) => setField(i, "time", v)} placeholder="Morning (9 AM – 11 AM)" />
                </Field>
                <Field label="Seats available">
                  <NumberInput value={b.seats} onChange={(v) => setField(i, "seats", v)} placeholder="12" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Course" hint="Free-text; will show as the row title">
                    <TextInput value={b.course} onChange={(v) => setField(i, "course", v)} placeholder="Salesforce Complete Course" />
                  </Field>
                </div>
              </div>
            </div>
          ))}
          {batches.length === 0 && (
            <div className="text-sm text-slate-500 py-6 text-center border border-dashed rounded-lg">
              No batches. Click “Add batch” to create one.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
