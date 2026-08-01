import React, { useState } from "react";
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
import { Trash2, Target } from "lucide-react";

export default function InterviewPrepEditor() {
  const { content, update, validationErrors } = useContent();
  const data = content.INTERVIEW_PREP || {};
  const features = data.features || [];
  const [confirmDelete, setConfirmDelete] = useState(null);

  const setData = (k, v) => update("INTERVIEW_PREP", { ...data, [k]: v });

  const errFor = (path) => {
    const wanted = path.join(".");
    const hit = validationErrors.find(
      (e) => e.key === "INTERVIEW_PREP" && e.path.join(".") === wanted
    );
    return hit?.message?.split(": ").slice(1).join(": ");
  };

  const addFeature = () =>
    setData("features", [
      ...features,
      { icon: "Target", label: "", description: "" },
    ]);

  const setFeature = (i, k, v) => {
    const next = [...features];
    next[i] = { ...next[i], [k]: v };
    setData("features", next);
  };

  const removeFeature = (i) => {
    setData("features", features.filter((_, idx) => idx !== i));
    setConfirmDelete(null);
  };

  const decorated = features.map((f, i) => ({
    __id: `feature-${i}-${(f.label || "").slice(0, 12)}`,
    data: f,
    index: i,
  }));

  return (
    <div className="space-y-4 max-w-4xl">
      <Card>
        <SectionTitle description="Headline and subheading for the Interview Preparation section.">
          Headline
        </SectionTitle>
        <div className="space-y-3">
          <Field label="Overline" error={errFor(["overline"])}>
            <TextInput
              value={data.overline}
              onChange={(v) => setData("overline", v)}
              placeholder="e.g. CAREER SERVICES"
              error={errFor(["overline"])}
              data-testid="interview-prep-overline"
            />
          </Field>
          <Field
            label="Headline prefix"
            hint="Part before the highlighted phrase."
            error={errFor(["headlinePrefix"])}
          >
            <TextInput
              value={data.headlinePrefix}
              onChange={(v) => setData("headlinePrefix", v)}
              placeholder="e.g. Turn your Salesforce skills into a "
              error={errFor(["headlinePrefix"])}
              data-testid="interview-prep-headline-prefix"
            />
          </Field>
          <Field
            label="Headline highlight"
            hint="The gold-highlighted phrase in the headline."
            error={errFor(["headlineHighlight"])}
          >
            <TextInput
              value={data.headlineHighlight}
              onChange={(v) => setData("headlineHighlight", v)}
              placeholder="e.g. signed offer"
              error={errFor(["headlineHighlight"])}
              data-testid="interview-prep-headline-highlight"
            />
          </Field>
          <Field
            label="Headline suffix"
            hint="Part after the highlighted phrase."
            error={errFor(["headlineSuffix"])}
          >
            <TextInput
              value={data.headlineSuffix}
              onChange={(v) => setData("headlineSuffix", v)}
              placeholder="e.g. ."
              error={errFor(["headlineSuffix"])}
              data-testid="interview-prep-headline-suffix"
            />
          </Field>
          <Field
            label="Sub-copy"
            hint="Brief description below the headline."
            error={errFor(["subCopy"])}
          >
            <TextArea
              value={data.subCopy}
              onChange={(v) => setData("subCopy", v)}
              rows={3}
              showCount
              maxLength={500}
              error={errFor(["subCopy"])}
              data-testid="interview-prep-subcopy"
            />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle description="Pricing and tagline for the program.">
          Pricing
        </SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Price" error={errFor(["price"])}>
            <TextInput
              value={data.price}
              onChange={(v) => setData("price", v)}
              placeholder="₹2,999"
              error={errFor(["price"])}
              data-testid="interview-prep-price"
            />
          </Field>
          <Field label="Tagline" error={errFor(["tagline"])}>
            <TextInput
              value={data.tagline}
              onChange={(v) => setData("tagline", v)}
              placeholder="e.g. 2-week Career Track"
              error={errFor(["tagline"])}
              data-testid="interview-prep-tagline"
            />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle
          description="Program features with icons. Drag to reorder."
          action={
            features.length > 0 && (
              <AddButton onClick={addFeature}>Add feature</AddButton>
            )
          }
        >
          Features ({features.length})
        </SectionTitle>

        {features.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No features yet"
            hint="Add your first feature to populate the section."
            action={<AddButton onClick={addFeature}>Add feature</AddButton>}
          />
        ) : (
          <SortableList
            items={decorated}
            getItemId={(it) => it.__id}
            onReorder={(nextItems) =>
              setData("features", nextItems.map((it) => it.data))
            }
            renderItem={({ item, dragHandle }) => {
              const i = item.index;
              const f = item.data;
              return (
                <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {dragHandle}
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Feature #{i + 1}
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
                    <Field
                      label="Icon"
                      hint="Lucide icon name."
                      error={errFor(["features", i, "icon"])}
                    >
                      <IconPicker
                        value={f.icon}
                        onChange={(v) => setFeature(i, "icon", v)}
                        error={!!errFor(["features", i, "icon"])}
                      />
                    </Field>
                    <Field
                      label="Label"
                      error={errFor(["features", i, "label"])}
                    >
                      <TextInput
                        value={f.label}
                        onChange={(v) => setFeature(i, "label", v)}
                        placeholder="e.g. 10 Mock Interviews"
                        error={!!errFor(["features", i, "label"])}
                        data-testid={`interview-prep-feature-${i}-label`}
                      />
                    </Field>
                    <Field
                      label="Description"
                      error={errFor(["features", i, "description"])}
                    >
                      <TextArea
                        value={f.description}
                        onChange={(v) => setFeature(i, "description", v)}
                        rows={2}
                        placeholder="Brief description of this feature"
                        error={!!errFor(["features", i, "description"])}
                        data-testid={`interview-prep-feature-${i}-desc`}
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
        <SectionTitle description="CTA button labels.">
          Call-to-Action
        </SectionTitle>
        <div className="space-y-3">
          <Field label="Enroll button label" error={errFor(["ctaLabel"])}>
            <TextInput
              value={data.ctaLabel}
              onChange={(v) => setData("ctaLabel", v)}
              placeholder="e.g. Enroll Now"
              error={errFor(["ctaLabel"])}
              data-testid="interview-prep-cta-label"
            />
          </Field>
          <Field label="WhatsApp CTA label" error={errFor(["whatsappCta"])}>
            <TextInput
              value={data.whatsappCta}
              onChange={(v) => setData("whatsappCta", v)}
              placeholder="e.g. Ask About This Program"
              error={errFor(["whatsappCta"])}
              data-testid="interview-prep-whatsapp-cta"
            />
          </Field>
        </div>
      </Card>

      <ConfirmDialog
        open={confirmDelete !== null}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        title="Remove feature?"
        description="This feature will be removed from the list. You can undo by clicking Reload before saving."
        confirmLabel="Remove"
        destructive
        onConfirm={() => removeFeature(confirmDelete)}
      />
    </div>
  );
}
