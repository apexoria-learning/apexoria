import React from "react";
import { useContent } from "../AdminContext";
import { Card, Field, TextInput, TextArea, SectionTitle, IconBtn, AddButton } from "../components/FormControls";
import { Trash2 } from "lucide-react";

const empty = { q: "", a: "" };

export default function FaqPage() {
  const { content, update } = useContent();
  const list = content.FAQ_ITEMS || [];

  const setItem = (i, k, v) => {
    const next = [...list]; next[i] = { ...next[i], [k]: v }; update("FAQ_ITEMS", next);
  };
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list]; [next[i], next[j]] = [next[j], next[i]]; update("FAQ_ITEMS", next);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <Card>
        <SectionTitle action={<AddButton onClick={() => update("FAQ_ITEMS", [...list, { ...empty }])}>Add FAQ</AddButton>}>
          FAQ items ({list.length})
        </SectionTitle>
        <p className="text-xs text-slate-500 mb-3">Order matters. Reorder to bring high-intent questions to the top.</p>
        <div className="space-y-3">
          {list.map((f, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-3 sm:p-4 bg-slate-50/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Q{i + 1}</span>
                <div className="flex items-center gap-1">
                  <IconBtn title="Move up" onClick={() => move(i, -1)}><span className="text-xs">↑</span></IconBtn>
                  <IconBtn title="Move down" onClick={() => move(i, 1)}><span className="text-xs">↓</span></IconBtn>
                  <IconBtn title="Delete" danger onClick={() => update("FAQ_ITEMS", list.filter((_, idx) => idx !== i))}>
                    <Trash2 className="w-4 h-4" />
                  </IconBtn>
                </div>
              </div>
              <div className="space-y-3">
                <Field label="Question">
                  <TextInput value={f.q} onChange={(v) => setItem(i, "q", v)} />
                </Field>
                <Field label="Answer">
                  <TextArea value={f.a} onChange={(v) => setItem(i, "a", v)} rows={4} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
