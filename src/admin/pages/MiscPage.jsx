import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { useContent } from "../AdminContext";
import {
  Card,
  Field,
  TextInput,
  TextArea,
  IconPicker,
  SectionTitle,
  IconBtn,
  AddButton,
} from "../components/FormControls";
import SortableList from "../components/SortableList";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  Trash2,
  BarChart3,
  Sparkles,
  Briefcase,
} from "lucide-react";

/**
 * Small preview badge showing the current lucide icon (or a fallback dot).
 */
function IconPreview({ name }) {
  const Icon = LucideIcons[name];
  return (
    <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
      {Icon ? (
        <Icon className="w-4 h-4 text-slate-700" />
      ) : (
        <span className="w-2 h-2 rounded-full bg-slate-300" />
      )}
    </div>
  );
}

export default function MiscPage() {
  const { content, update, validationErrors } = useContent();

  const stats = content.STATS || [];
  const vProps = content.VALUE_PROPS || [];
  const pSteps = content.PLACEMENT_STEPS || [];

  const [confirm, setConfirm] = useState(null); // {key, i}

  const errFor = (key, pathStr) => {
    const hit = validationErrors.find(
      (e) => e.key === key && e.path.join(".") === pathStr
    );
    return hit?.message?.split(": ").slice(1).join(": ");
  };

  // decorators
  const dStats = stats.map((s, i) => ({
    __id: `stat-${i}-${(s.label || "").slice(0, 12)}`,
    data: s,
    index: i,
  }));
  const dVProps = vProps.map((p, i) => ({
    __id: `vp-${i}-${(p.title || "").slice(0, 12)}`,
    data: p,
    index: i,
  }));
  const dSteps = pSteps.map((p, i) => ({
    __id: `ps-${i}-${(p.title || "").slice(0, 12)}`,
    data: p,
    index: i,
  }));

  const askDelete = (key, i) => setConfirm({ key, i });

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ------------------------------------------------------------ Stats */}
      <Card>
        <SectionTitle
          description="Row of headline numbers shown near the hero."
          action={
            <AddButton
              onClick={() =>
                update("STATS", [...stats, { value: "", label: "" }])
              }
            >
              Add stat
            </AddButton>
          }
        >
          Stats ({stats.length})
        </SectionTitle>

        {stats.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="No stats yet"
            hint="Add a few headline metrics (students trained, placement rate, etc.)."
            action={
              <AddButton
                onClick={() =>
                  update("STATS", [...stats, { value: "", label: "" }])
                }
              >
                Add stat
              </AddButton>
            }
          />
        ) : (
          <SortableList
            items={dStats}
            getItemId={(it) => it.__id}
            onReorder={(nextItems) =>
              update("STATS", nextItems.map((it) => it.data))
            }
            renderItem={({ item, dragHandle }) => {
              const i = item.index;
              const s = item.data;
              return (
                <div className="grid grid-cols-[auto_1fr_2fr_auto] gap-2 items-center rounded-lg border border-slate-200 p-2 bg-slate-50/60">
                  {dragHandle}
                  <TextInput
                    value={s.value}
                    onChange={(v) => {
                      const n = [...stats];
                      n[i] = { ...n[i], value: v };
                      update("STATS", n);
                    }}
                    placeholder="200+"
                    error={!!errFor("STATS", `${i}.value`)}
                  />
                  <TextInput
                    value={s.label}
                    onChange={(v) => {
                      const n = [...stats];
                      n[i] = { ...n[i], label: v };
                      update("STATS", n);
                    }}
                    placeholder="Students Trained"
                    error={!!errFor("STATS", `${i}.label`)}
                  />
                  <IconBtn
                    title="Delete"
                    danger
                    onClick={() => askDelete("STATS", i)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </IconBtn>
                </div>
              );
            }}
          />
        )}
      </Card>

      {/* -------------------------------------------------------- Value Props */}
      <Card>
        <SectionTitle
          description="“Why Apexoria” cards. Drag to reorder — first shows top-left."
          action={
            <AddButton
              onClick={() =>
                update("VALUE_PROPS", [
                  ...vProps,
                  {
                    n: String(vProps.length + 1).padStart(2, "0"),
                    title: "",
                    body: "",
                    icon: "Sparkles",
                  },
                ])
              }
            >
              Add value prop
            </AddButton>
          }
        >
          Why Apexoria — value props ({vProps.length})
        </SectionTitle>

        {vProps.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No value props yet"
            hint="Add differentiators that justify why students pick Apexoria."
          />
        ) : (
          <SortableList
            items={dVProps}
            getItemId={(it) => it.__id}
            onReorder={(nextItems) =>
              update("VALUE_PROPS", nextItems.map((it) => it.data))
            }
            renderItem={({ item, dragHandle }) => {
              const i = item.index;
              const p = item.data;
              return (
                <div className="rounded-lg border border-slate-200 p-3 sm:p-4 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {dragHandle}
                      <IconPreview name={p.icon} />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        #{i + 1}
                      </span>
                    </div>
                    <IconBtn
                      title="Delete"
                      danger
                      onClick={() => askDelete("VALUE_PROPS", i)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </IconBtn>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Field label="Number" error={errFor("VALUE_PROPS", `${i}.n`)}>
                      <TextInput
                        value={p.n}
                        onChange={(v) => {
                          const n = [...vProps];
                          n[i] = { ...n[i], n: v };
                          update("VALUE_PROPS", n);
                        }}
                        error={!!errFor("VALUE_PROPS", `${i}.n`)}
                      />
                    </Field>
                    <Field
                      label="Title"
                      required
                      error={errFor("VALUE_PROPS", `${i}.title`)}
                    >
                      <TextInput
                        value={p.title}
                        onChange={(v) => {
                          const n = [...vProps];
                          n[i] = { ...n[i], title: v };
                          update("VALUE_PROPS", n);
                        }}
                        error={!!errFor("VALUE_PROPS", `${i}.title`)}
                      />
                    </Field>
                    <Field
                      label="Icon"
                      hint="Any lucide icon name."
                      error={errFor("VALUE_PROPS", `${i}.icon`)}
                    >
                      <IconPicker
                        value={p.icon}
                        onChange={(v) => {
                          const n = [...vProps];
                          n[i] = { ...n[i], icon: v };
                          update("VALUE_PROPS", n);
                        }}
                        error={!!errFor("VALUE_PROPS", `${i}.icon`)}
                      />
                    </Field>
                    <div className="sm:col-span-3">
                      <Field
                        label="Body"
                        required
                        error={errFor("VALUE_PROPS", `${i}.body`)}
                      >
                        <TextArea
                          value={p.body}
                          onChange={(v) => {
                            const n = [...vProps];
                            n[i] = { ...n[i], body: v };
                            update("VALUE_PROPS", n);
                          }}
                          showCount
                          maxLength={400}
                          error={!!errFor("VALUE_PROPS", `${i}.body`)}
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

      {/* --------------------------------------------------- Placement Steps */}
      <Card>
        <SectionTitle
          description="Steps in the placement-support timeline."
          action={
            <AddButton
              onClick={() =>
                update("PLACEMENT_STEPS", [
                  ...pSteps,
                  { title: "", body: "", icon: "Sparkles" },
                ])
              }
            >
              Add step
            </AddButton>
          }
        >
          Placement support steps ({pSteps.length})
        </SectionTitle>

        {pSteps.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No placement steps yet"
            hint="Add stages of your placement pipeline (mock interviews, referrals, etc.)."
          />
        ) : (
          <SortableList
            items={dSteps}
            getItemId={(it) => it.__id}
            onReorder={(nextItems) =>
              update("PLACEMENT_STEPS", nextItems.map((it) => it.data))
            }
            renderItem={({ item, dragHandle }) => {
              const i = item.index;
              const p = item.data;
              return (
                <div className="rounded-lg border border-slate-200 p-3 sm:p-4 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {dragHandle}
                      <IconPreview name={p.icon} />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Step {i + 1}
                      </span>
                    </div>
                    <IconBtn
                      title="Delete"
                      danger
                      onClick={() => askDelete("PLACEMENT_STEPS", i)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </IconBtn>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Field
                      label="Title"
                      required
                      error={errFor("PLACEMENT_STEPS", `${i}.title`)}
                    >
                      <TextInput
                        value={p.title}
                        onChange={(v) => {
                          const n = [...pSteps];
                          n[i] = { ...n[i], title: v };
                          update("PLACEMENT_STEPS", n);
                        }}
                        error={!!errFor("PLACEMENT_STEPS", `${i}.title`)}
                      />
                    </Field>
                    <Field
                      label="Icon"
                      error={errFor("PLACEMENT_STEPS", `${i}.icon`)}
                    >
                      <IconPicker
                        value={p.icon}
                        onChange={(v) => {
                          const n = [...pSteps];
                          n[i] = { ...n[i], icon: v };
                          update("PLACEMENT_STEPS", n);
                        }}
                        error={!!errFor("PLACEMENT_STEPS", `${i}.icon`)}
                      />
                    </Field>
                    <div className="sm:col-span-3">
                      <Field
                        label="Body"
                        required
                        error={errFor("PLACEMENT_STEPS", `${i}.body`)}
                      >
                        <TextArea
                          value={p.body}
                          onChange={(v) => {
                            const n = [...pSteps];
                            n[i] = { ...n[i], body: v };
                            update("PLACEMENT_STEPS", n);
                          }}
                          showCount
                          maxLength={400}
                          error={!!errFor("PLACEMENT_STEPS", `${i}.body`)}
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
        open={confirm !== null}
        onOpenChange={(o) => !o && setConfirm(null)}
        title="Delete this item?"
        description="It will disappear from the site on save."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (!confirm) return;
          const { key, i } = confirm;
          const source =
            key === "STATS" ? stats : key === "VALUE_PROPS" ? vProps : pSteps;
          update(
            key,
            source.filter((_, idx) => idx !== i)
          );
          setConfirm(null);
        }}
      />
    </div>
  );
}
