import React, { useState } from "react";
import { useContent } from "../AdminContext";
import {
  Card,
  Field,
  TextInput,
  TextArea,
  ColorInput,
  SectionTitle,
  IconBtn,
  AddButton,
} from "../components/FormControls";
import SortableList from "../components/SortableList";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { Trash2, Tag, ListChecks } from "lucide-react";

// -----------------------------------------------------------------------
// Reusable string-bullet list (used inside every card for `includes`
// and at the bottom for COURSE_OPTIONS).
// -----------------------------------------------------------------------
function StringList({ items, onChange, placeholder, addLabel = "Add row" }) {
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

export default function PricingPage() {
  const { content, update, validationErrors } = useContent();
  const paths = content.PATHS || [];
  const offer = content.SPECIAL_OFFER || {};
  const options = content.COURSE_OPTIONS || [];

  const [confirmDelete, setConfirmDelete] = useState(null);

  const setPath = (i, k, v) => {
    const next = [...paths];
    next[i] = { ...next[i], [k]: v };
    update("PATHS", next);
  };

  const errFor = (key, pathStr) => {
    const hit = validationErrors.find(
      (e) => e.key === key && e.path.join(".") === pathStr
    );
    return hit?.message?.split(": ").slice(1).join(": ");
  };

  const decorated = paths.map((p, i) => ({
    __id: `tier-${i}-${(p.id || "").slice(0, 12)}`,
    data: p,
    index: i,
  }));

  const addTier = () =>
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
    ]);

  return (
    <div className="space-y-6 max-w-5xl">
      <Card>
        <SectionTitle
          description="Cards shown on the pricing section. Drag to reorder; the first card renders in the leftmost slot."
          action={<AddButton onClick={addTier}>Add pricing card</AddButton>}
        >
          Pricing tiers ({paths.length})
        </SectionTitle>

        {paths.length === 0 ? (
          <EmptyState
            icon={Tag}
            title="No pricing tiers yet"
            hint="Add your first tier to populate the pricing section."
            action={<AddButton onClick={addTier}>Add tier</AddButton>}
          />
        ) : (
          <SortableList
            items={decorated}
            getItemId={(it) => it.__id}
            onReorder={(nextItems) =>
              update("PATHS", nextItems.map((it) => it.data))
            }
            renderItem={({ item, dragHandle }) => {
              const i = item.index;
              const p = item.data;
              return (
                <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {dragHandle}
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Card #{i + 1}
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
                    <Field
                      label="Internal ID"
                      hint="Lowercase, unique. E.g. foundation."
                      error={errFor("PATHS", `${i}.id`)}
                    >
                      <TextInput
                        value={p.id}
                        onChange={(v) => setPath(i, "id", v)}
                        error={!!errFor("PATHS", `${i}.id`)}
                      />
                    </Field>
                    <Field label="Tier name" error={errFor("PATHS", `${i}.tier`)}>
                      <TextInput
                        value={p.tier}
                        onChange={(v) => setPath(i, "tier", v)}
                        error={!!errFor("PATHS", `${i}.tier`)}
                      />
                    </Field>
                    <Field label="Level" error={errFor("PATHS", `${i}.level`)}>
                      <TextInput
                        value={p.level}
                        onChange={(v) => setPath(i, "level", v)}
                        error={!!errFor("PATHS", `${i}.level`)}
                      />
                    </Field>
                    <Field label="Price" error={errFor("PATHS", `${i}.price`)}>
                      <TextInput
                        value={p.price}
                        onChange={(v) => setPath(i, "price", v)}
                        placeholder="₹9,999"
                        error={!!errFor("PATHS", `${i}.price`)}
                      />
                    </Field>
                    <Field
                      label="Detail"
                      hint="E.g. 70 hrs · 3 months."
                      error={errFor("PATHS", `${i}.detail`)}
                    >
                      <TextInput
                        value={p.detail}
                        onChange={(v) => setPath(i, "detail", v)}
                        error={!!errFor("PATHS", `${i}.detail`)}
                      />
                    </Field>
                    <Field
                      label="Accent colour"
                      hint="Used for the card badge/border on site."
                      error={errFor("PATHS", `${i}.color`)}
                    >
                      <ColorInput
                        value={p.color}
                        onChange={(v) => setPath(i, "color", v)}
                        error={!!errFor("PATHS", `${i}.color`)}
                      />
                    </Field>
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!p.popular}
                        onChange={(e) => setPath(i, "popular", e.target.checked)}
                        id={`popular-${i}`}
                      />
                      <label
                        htmlFor={`popular-${i}`}
                        className="text-xs text-slate-700"
                      >
                        Mark as “Most Popular”
                      </label>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Field label="Includes bullets">
                      <StringList
                        items={p.includes || []}
                        onChange={(next) => setPath(i, "includes", next)}
                        placeholder="E.g. Full Admin + Development track"
                        addLabel="Add bullet"
                      />
                    </Field>
                  </div>
                </div>
              );
            }}
          />
        )}
      </Card>

      <Card>
        <SectionTitle description="Time-limited enrollment card shown alongside the tiers.">
          Enrollment special offer
        </SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Tier label">
            <TextInput
              value={offer.tier}
              onChange={(v) =>
                update("SPECIAL_OFFER", { ...offer, tier: v })
              }
            />
          </Field>
          <Field label="Level">
            <TextInput
              value={offer.level}
              onChange={(v) =>
                update("SPECIAL_OFFER", { ...offer, level: v })
              }
            />
          </Field>
          <Field label="Price">
            <TextInput
              value={offer.price}
              onChange={(v) =>
                update("SPECIAL_OFFER", { ...offer, price: v })
              }
            />
          </Field>
          <Field label="Internal ID">
            <TextInput
              value={offer.id}
              onChange={(v) => update("SPECIAL_OFFER", { ...offer, id: v })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Tagline">
              <TextArea
                value={offer.tagline}
                onChange={(v) =>
                  update("SPECIAL_OFFER", { ...offer, tagline: v })
                }
                showCount
                maxLength={240}
              />
            </Field>
          </div>
        </div>
        <div className="mt-3">
          <Field label="Includes bullets">
            <StringList
              items={offer.includes || []}
              onChange={(next) =>
                update("SPECIAL_OFFER", { ...offer, includes: next })
              }
              placeholder="E.g. Flexible access to course content"
              addLabel="Add bullet"
            />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle description="Exact values shown in the Lead Form “Interested Course” dropdown. Keep consistent with tier names.">
          Lead form course dropdown
        </SectionTitle>
        {options.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="No dropdown options yet"
            hint="Add options so leads can select the course they’re interested in."
            action={
              <AddButton onClick={() => update("COURSE_OPTIONS", [""])}>
                Add option
              </AddButton>
            }
          />
        ) : (
          <StringList
            items={options}
            onChange={(next) => update("COURSE_OPTIONS", next)}
            placeholder="E.g. Salesforce Crash Course — ₹9,999"
            addLabel="Add option"
          />
        )}
      </Card>

      <ConfirmDialog
        open={confirmDelete !== null}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title="Delete this pricing card?"
        description="It will disappear from the pricing section on save."
        confirmLabel="Delete card"
        destructive
        onConfirm={() => {
          update("PATHS", paths.filter((_, idx) => idx !== confirmDelete));
          setConfirmDelete(null);
        }}
      />
    </div>
  );
}
