import React from "react";
import { useContent } from "../AdminContext";
import { Card, Field, SectionTitle } from "../components/FormControls";
import ImageField from "../components/ImageField";

const SECTION_IMAGES = [
  {
    key: "heroAbstract",
    label: "Hero background",
    hint: "Wide landscape image shown in the hero. Aspect ~3:2. Also generates 640/1280 responsive variants.",
    aspect: "aspect-[3/2]",
  },
  {
    key: "team",
    label: "Team photo",
    hint: "Used near the hiring partners strip. Aspect ~3:2.",
    aspect: "aspect-[3/2]",
  },
];

export default function ImagesPage() {
  const { content, update } = useContent();
  const images = content.IMAGES || {};

  const setImg = (k, v) => update("IMAGES", { ...images, [k]: v });

  return (
    <div className="space-y-4 max-w-4xl">
      <Card>
        <SectionTitle description="Brand marks used in the header, footer, and Salesforce badge.">
          Logos
        </SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Apexoria logo" hint="Square-ish. Shown in the header + login page.">
            <ImageField
              value={content.LOGO_URL}
              onChange={(v) => update("LOGO_URL", v)}
              folder="images/logo"
              aspect="aspect-square"
              width="w-24"
            />
          </Field>
          <Field label="Salesforce cloud logo" hint="Optional accent used in course headers.">
            <ImageField
              value={content.SALESFORCE_LOGO}
              onChange={(v) => update("SALESFORCE_LOGO", v)}
              folder="images/salesforce"
              aspect="aspect-square"
              width="w-24"
            />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle description="Landing-page imagery. Aim for compressed WebP under 200 KB where possible.">
          Section imagery
        </SectionTitle>
        <div className="space-y-6">
          {SECTION_IMAGES.map(({ key, label, hint, aspect }) => (
            <Field key={key} label={label} hint={hint}>
              <ImageField
                value={images[key]}
                onChange={(v) => setImg(key, v)}
                folder={`images/${key}`}
                aspect={aspect}
                width="w-40"
              />
            </Field>
          ))}
        </div>
      </Card>
    </div>
  );
}
