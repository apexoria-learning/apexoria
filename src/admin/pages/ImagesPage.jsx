import React from "react";
import { useContent } from "../AdminContext";
import { Card, Field, TextInput, SectionTitle } from "../components/FormControls";
import FileUpload from "../components/FileUpload";

const IMAGE_KEYS = [
  { key: "heroAbstract", label: "Hero background", hint: "Wide landscape image shown in the hero." },
  { key: "student1", label: "Student photo #1", hint: "Used in the SuccessStories section." },
  { key: "student2", label: "Student photo #2", hint: "Used in the SuccessStories section." },
  { key: "team", label: "Team photo", hint: "Used near the hiring partners strip." },
];

export default function ImagesPage() {
  const { content, update } = useContent();
  const images = content.IMAGES || {};

  const setImg = (k, v) => update("IMAGES", { ...images, [k]: v });

  return (
    <div className="space-y-4 max-w-4xl">
      <Card>
        <SectionTitle>Logos</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Apexoria logo URL">
            <TextInput value={content.LOGO_URL} onChange={(v) => update("LOGO_URL", v)} />
          </Field>
          <Field label="Salesforce cloud logo URL">
            <TextInput value={content.SALESFORCE_LOGO} onChange={(v) => update("SALESFORCE_LOGO", v)} />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle>Section imagery</SectionTitle>
        <div className="space-y-4">
          {IMAGE_KEYS.map(({ key, label, hint }) => (
            <div key={key} className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 items-start">
              <div>
                {images[key] ? (
                  <img src={images[key]} alt="" className="w-full aspect-[3/2] object-cover rounded-lg ring-1 ring-slate-200" />
                ) : (
                  <div className="w-full aspect-[3/2] rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">No image</div>
                )}
              </div>
              <div className="space-y-2">
                <Field label={label} hint={hint}>
                  <TextInput value={images[key]} onChange={(v) => setImg(key, v)} />
                </Field>
                <FileUpload
                  folder={`images/${key}`}
                  accept="image/*"
                  value={images[key]}
                  onUploaded={(url) => setImg(key, url)}
                  label={`Upload ${label.toLowerCase()}`}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
