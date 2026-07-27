import React from "react";
import { useContent } from "../AdminContext";
import { Card, Field, TextInput, SectionTitle } from "../components/FormControls";

export default function ContactPage() {
  const { content, update } = useContent();
  const c = content.CONTACT || {};
  const setC = (k, v) => update("CONTACT", { ...c, [k]: v });

  return (
    <div className="space-y-4 max-w-3xl">
      <Card>
        <SectionTitle>Phone &amp; email</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Phone (display)" hint="Format: +91 XXXXXXXXXX">
            <TextInput value={c.phone} onChange={(v) => setC("phone", v)} placeholder="+91 XXXXXXXXXX" />
          </Field>
          <Field label="Phone (raw, digits only)" hint="Used in the tel: link. E.g. 917498490687">
            <TextInput value={c.phoneRaw} onChange={(v) => setC("phoneRaw", v)} placeholder="917498490687" />
          </Field>
          <Field label="Email">
            <TextInput value={c.email} onChange={(v) => setC("email", v)} placeholder="apexorialearning@gmail.com" />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle>Socials</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Instagram URL">
            <TextInput value={c.instagram} onChange={(v) => setC("instagram", v)} />
          </Field>
          <Field label="Instagram handle" hint="E.g. @apexoria_learning">
            <TextInput value={c.instagramHandle} onChange={(v) => setC("instagramHandle", v)} />
          </Field>
          <Field label="LinkedIn URL">
            <TextInput value={c.linkedin} onChange={(v) => setC("linkedin", v)} />
          </Field>
          <Field label="Facebook URL">
            <TextInput value={c.facebook} onChange={(v) => setC("facebook", v)} />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle>WhatsApp deep link</SectionTitle>
        <Field label="WhatsApp URL" hint="Include prefilled message via ?text=... (URL-encoded)">
          <TextInput
            value={content.WHATSAPP_LINK}
            onChange={(v) => update("WHATSAPP_LINK", v)}
            placeholder="https://wa.me/91..."
          />
        </Field>
      </Card>

      <Card>
        <SectionTitle>Google reviews</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Rating">
            <TextInput
              value={content.GOOGLE_REVIEWS?.rating}
              onChange={(v) => update("GOOGLE_REVIEWS", { ...content.GOOGLE_REVIEWS, rating: Number(v) || v })}
              placeholder="4.9"
            />
          </Field>
          <Field label="Total count">
            <TextInput
              value={content.GOOGLE_REVIEWS?.count}
              onChange={(v) => update("GOOGLE_REVIEWS", { ...content.GOOGLE_REVIEWS, count: Number(v) || v })}
              placeholder="120"
            />
          </Field>
          <Field label="Google reviews URL">
            <TextInput
              value={content.GOOGLE_REVIEWS?.url}
              onChange={(v) => update("GOOGLE_REVIEWS", { ...content.GOOGLE_REVIEWS, url: v })}
            />
          </Field>
        </div>
      </Card>
    </div>
  );
}
