import React from "react";
import { useContent } from "../AdminContext";
import { Card, Field, TextInput, TextArea, SectionTitle, IconBtn, AddButton } from "../components/FormControls";
import { Trash2 } from "lucide-react";

export default function MiscPage() {
  const { content, update } = useContent();

  const stats = content.STATS || [];
  const vProps = content.VALUE_PROPS || [];
  const pSteps = content.PLACEMENT_STEPS || [];

  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <SectionTitle
          action={<AddButton onClick={() => update("STATS", [...stats, { value: "", label: "" }])}>Add stat</AddButton>}
        >
          Stats ({stats.length})
        </SectionTitle>
        <div className="space-y-2">
          {stats.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-center">
              <TextInput value={s.value} onChange={(v) => { const n = [...stats]; n[i] = { ...n[i], value: v }; update("STATS", n); }} placeholder="200+" />
              <TextInput value={s.label} onChange={(v) => { const n = [...stats]; n[i] = { ...n[i], label: v }; update("STATS", n); }} placeholder="Students Trained" />
              <IconBtn title="Delete" danger onClick={() => update("STATS", stats.filter((_, idx) => idx !== i))}>
                <Trash2 className="w-4 h-4" />
              </IconBtn>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle
          action={
            <AddButton
              onClick={() =>
                update("VALUE_PROPS", [
                  ...vProps,
                  { n: String(vProps.length + 1).padStart(2, "0"), title: "", body: "", icon: "Sparkles" },
                ])
              }
            >
              Add value prop
            </AddButton>
          }
        >
          Why Apexoria — value props ({vProps.length})
        </SectionTitle>
        <div className="space-y-3">
          {vProps.map((p, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-3 sm:p-4 bg-slate-50/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">#{i + 1}</span>
                <IconBtn title="Delete" danger onClick={() => update("VALUE_PROPS", vProps.filter((_, idx) => idx !== i))}>
                  <Trash2 className="w-4 h-4" />
                </IconBtn>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="Number"><TextInput value={p.n} onChange={(v) => { const n = [...vProps]; n[i] = { ...n[i], n: v }; update("VALUE_PROPS", n); }} /></Field>
                <Field label="Title"><TextInput value={p.title} onChange={(v) => { const n = [...vProps]; n[i] = { ...n[i], title: v }; update("VALUE_PROPS", n); }} /></Field>
                <Field label="Icon (lucide name)" hint="e.g. Radio, GraduationCap, Briefcase"><TextInput value={p.icon} onChange={(v) => { const n = [...vProps]; n[i] = { ...n[i], icon: v }; update("VALUE_PROPS", n); }} /></Field>
                <div className="sm:col-span-3">
                  <Field label="Body"><TextArea rows={3} value={p.body} onChange={(v) => { const n = [...vProps]; n[i] = { ...n[i], body: v }; update("VALUE_PROPS", n); }} /></Field>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle
          action={
            <AddButton
              onClick={() =>
                update("PLACEMENT_STEPS", [...pSteps, { title: "", body: "", icon: "Sparkles" }])
              }
            >
              Add step
            </AddButton>
          }
        >
          Placement support steps ({pSteps.length})
        </SectionTitle>
        <div className="space-y-3">
          {pSteps.map((p, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-3 sm:p-4 bg-slate-50/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Step {i + 1}</span>
                <IconBtn title="Delete" danger onClick={() => update("PLACEMENT_STEPS", pSteps.filter((_, idx) => idx !== i))}>
                  <Trash2 className="w-4 h-4" />
                </IconBtn>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="Title"><TextInput value={p.title} onChange={(v) => { const n = [...pSteps]; n[i] = { ...n[i], title: v }; update("PLACEMENT_STEPS", n); }} /></Field>
                <Field label="Icon (lucide name)"><TextInput value={p.icon} onChange={(v) => { const n = [...pSteps]; n[i] = { ...n[i], icon: v }; update("PLACEMENT_STEPS", n); }} /></Field>
                <div className="sm:col-span-3">
                  <Field label="Body"><TextArea rows={2} value={p.body} onChange={(v) => { const n = [...pSteps]; n[i] = { ...n[i], body: v }; update("PLACEMENT_STEPS", n); }} /></Field>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
