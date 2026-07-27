import React from "react";
import { useContent } from "../AdminContext";
import { Card, Field, TextInput, TextArea, SectionTitle, IconBtn, AddButton } from "../components/FormControls";
import { Trash2 } from "lucide-react";

function StringList({ items, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      {items.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <TextInput
            value={v}
            onChange={(nv) => {
              const next = [...items]; next[i] = nv; onChange(next);
            }}
            placeholder={placeholder}
          />
          <IconBtn title="Remove" danger onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
            <Trash2 className="w-4 h-4" />
          </IconBtn>
        </div>
      ))}
      <AddButton onClick={() => onChange([...items, ""])}>Add row</AddButton>
    </div>
  );
}

export default function PricingPage() {
  const { content, update } = useContent();
  const paths = content.PATHS || [];
  const offer = content.SPECIAL_OFFER || {};
  const options = content.COURSE_OPTIONS || [];

  const setPath = (i, k, v) => {
    const next = [...paths];
    next[i] = { ...next[i], [k]: v };
    update("PATHS", next);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <Card>
        <SectionTitle
          action={
            <AddButton
              onClick={() =>
                update("PATHS", [
                  ...paths,
                  {
                    id: `path-${paths.length + 1}`,
                    tier: "New Course",
                    level: "Beginner",
                    price: "₹0",
                    detail: "",
                    color: "#1E90FF",
                    popular: false,
                    includes: [],
                  },
                ])
              }
            >
              Add pricing card
            </AddButton>
          }
        >
          Pricing tiers ({paths.length})
        </SectionTitle>

        <div className="space-y-4">
          {paths.map((p, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-4 bg-slate-50/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Card #{i + 1}</span>
                <IconBtn title="Delete" danger onClick={() => update("PATHS", paths.filter((_, idx) => idx !== i))}>
                  <Trash2 className="w-4 h-4" />
                </IconBtn>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Internal ID" hint="Lowercase, unique. E.g. foundation">
                  <TextInput value={p.id} onChange={(v) => setPath(i, "id", v)} />
                </Field>
                <Field label="Tier name">
                  <TextInput value={p.tier} onChange={(v) => setPath(i, "tier", v)} />
                </Field>
                <Field label="Level">
                  <TextInput value={p.level} onChange={(v) => setPath(i, "level", v)} />
                </Field>
                <Field label="Price">
                  <TextInput value={p.price} onChange={(v) => setPath(i, "price", v)} placeholder="₹9,999" />
                </Field>
                <Field label="Detail" hint="E.g. 70 hrs · 3 months">
                  <TextInput value={p.detail} onChange={(v) => setPath(i, "detail", v)} />
                </Field>
                <Field label="Accent colour (hex)">
                  <TextInput value={p.color} onChange={(v) => setPath(i, "color", v)} placeholder="#1E90FF" />
                </Field>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!p.popular}
                    onChange={(e) => setPath(i, "popular", e.target.checked)}
                    id={`popular-${i}`}
                  />
                  <label htmlFor={`popular-${i}`} className="text-xs text-slate-700">Mark as “Most Popular”</label>
                </div>
              </div>
              <div className="mt-3">
                <Field label="Includes bullets">
                  <StringList
                    items={p.includes || []}
                    onChange={(next) => setPath(i, "includes", next)}
                    placeholder="E.g. Full Admin + Development track"
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle>Enrollment special offer</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Tier label">
            <TextInput value={offer.tier} onChange={(v) => update("SPECIAL_OFFER", { ...offer, tier: v })} />
          </Field>
          <Field label="Level">
            <TextInput value={offer.level} onChange={(v) => update("SPECIAL_OFFER", { ...offer, level: v })} />
          </Field>
          <Field label="Price">
            <TextInput value={offer.price} onChange={(v) => update("SPECIAL_OFFER", { ...offer, price: v })} />
          </Field>
          <Field label="Internal ID">
            <TextInput value={offer.id} onChange={(v) => update("SPECIAL_OFFER", { ...offer, id: v })} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Tagline">
              <TextArea value={offer.tagline} onChange={(v) => update("SPECIAL_OFFER", { ...offer, tagline: v })} rows={2} />
            </Field>
          </div>
        </div>
        <div className="mt-3">
          <Field label="Includes bullets">
            <StringList
              items={offer.includes || []}
              onChange={(next) => update("SPECIAL_OFFER", { ...offer, includes: next })}
              placeholder="E.g. Flexible access to course content"
            />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle>Lead form course dropdown</SectionTitle>
        <p className="text-xs text-slate-500 mb-3">
          These are the exact values shown in the Lead Form “Interested Course” dropdown. Keep them consistent with the pricing tier names.
        </p>
        <StringList
          items={options}
          onChange={(next) => update("COURSE_OPTIONS", next)}
          placeholder="E.g. Salesforce Crash Course — ₹9,999"
        />
      </Card>
    </div>
  );
}
