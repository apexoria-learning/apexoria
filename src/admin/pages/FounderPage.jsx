import React from "react";
import { useContent } from "../AdminContext";
import { Card, Field, TextInput, TextArea, SectionTitle, IconBtn, AddButton } from "../components/FormControls";
import FileUpload from "../components/FileUpload";
import { Trash2 } from "lucide-react";

export default function FounderPage() {
  const { content, update } = useContent();
  const f = content.FOUNDER || {};
  const setF = (k, v) => update("FOUNDER", { ...f, [k]: v });

  const skills = f.skills || [];
  const certs = f.certifications || [];

  return (
    <div className="space-y-4 max-w-3xl">
      <Card>
        <SectionTitle>Profile</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Name">
            <TextInput value={f.name} onChange={(v) => setF("name", v)} />
          </Field>
          <Field label="Role / one-liner">
            <TextInput value={f.role} onChange={(v) => setF("role", v)} />
          </Field>
        </div>
        <div className="mt-3">
          <Field label="Photo" hint="Uploads to Firebase Storage. Square 512×512 recommended.">
            <div className="flex items-start gap-4 flex-wrap">
              {f.photo && (
                <img src={f.photo} alt="" className="w-24 h-24 rounded-xl object-cover ring-1 ring-slate-200" />
              )}
              <FileUpload
                folder="founder"
                accept="image/*"
                value={f.photo}
                onUploaded={(url) => setF("photo", url)}
                label="Upload photo"
              />
            </div>
          </Field>
        </div>
        <div className="mt-3">
          <Field label="Bio" hint="Long-form. Rendered as a paragraph on the Founder section.">
            <TextArea value={f.bio} onChange={(v) => setF("bio", v)} rows={8} />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle action={<AddButton onClick={() => setF("skills", [...skills, ""])}>Add skill</AddButton>}>
          Skills
        </SectionTitle>
        <div className="space-y-2">
          {skills.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <TextInput
                value={s}
                onChange={(v) => {
                  const next = [...skills];
                  next[i] = v;
                  setF("skills", next);
                }}
              />
              <IconBtn
                title="Remove"
                danger
                onClick={() => setF("skills", skills.filter((_, idx) => idx !== i))}
              >
                <Trash2 className="w-4 h-4" />
              </IconBtn>
            </div>
          ))}
          {skills.length === 0 && <div className="text-xs text-slate-500">No skills yet. Click Add skill.</div>}
        </div>
      </Card>

      <Card>
        <SectionTitle action={<AddButton onClick={() => setF("certifications", [...certs, ""])}>Add certification</AddButton>}>
          Certifications
        </SectionTitle>
        <div className="space-y-2">
          {certs.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <TextInput
                value={s}
                onChange={(v) => {
                  const next = [...certs];
                  next[i] = v;
                  setF("certifications", next);
                }}
                placeholder="e.g. Salesforce Platform Developer I"
              />
              <IconBtn
                title="Remove"
                danger
                onClick={() => setF("certifications", certs.filter((_, idx) => idx !== i))}
              >
                <Trash2 className="w-4 h-4" />
              </IconBtn>
            </div>
          ))}
          {certs.length === 0 && <div className="text-xs text-slate-500">No certifications listed.</div>}
        </div>
      </Card>
    </div>
  );
}
