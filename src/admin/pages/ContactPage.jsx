import React from "react";
import { useContent } from "../AdminContext";
import {
  Card,
  Field,
  TextInput,
  UrlInput,
  EmailInput,
  PhoneInput,
  NumberInput,
  SectionTitle,
  StarRating,
} from "../components/FormControls";
import { validateContent } from "../validation";

/**
 * Look up validation errors for a specific data-key + JSON-path segment.
 * Returns the message string or undefined.
 */
function findError(errors, key, pathSegments) {
  const wanted = pathSegments.join(".");
  const hit = errors.find(
    (e) => e.key === key && e.path.join(".") === wanted
  );
  return hit?.message?.split(": ").slice(1).join(": "); // strip "KEY › path: " prefix
}

export default function ContactPage() {
  const { content, update, validationErrors } = useContent();
  const c = content.CONTACT || {};
  const g = content.GOOGLE_REVIEWS || {};
  const setC = (k, v) => update("CONTACT", { ...c, [k]: v });
  const setG = (k, v) => update("GOOGLE_REVIEWS", { ...g, [k]: v });

  // Errors specific to each section (compute once per render, filter is cheap for <30 entries)
  const errs = validationErrors;
  const errContact = (path) => findError(errs, "CONTACT", path);
  const errWa = findError(errs, "WHATSAPP_LINK", []);
  const errReviews = (path) => findError(errs, "GOOGLE_REVIEWS", path);

  return (
    <div className="space-y-4 max-w-3xl">
      <Card>
        <SectionTitle description="Shown in the header contact strip and the tel: link.">
          Phone &amp; email
        </SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="Phone (display)"
            hint="Format: +91 XXXXXXXXXX"
            error={errContact(["phone"])}
            required
          >
            <PhoneInput
              value={c.phone}
              onChange={(v) => setC("phone", v)}
              placeholder="+91 XXXXXXXXXX"
              error={errContact(["phone"])}
            />
          </Field>
          <Field
            label="Phone (raw, digits only)"
            hint="Used in the tel: link. E.g. 917498490687"
            error={errContact(["phoneRaw"])}
            required
          >
            <TextInput
              value={c.phoneRaw}
              onChange={(v) => setC("phoneRaw", v)}
              placeholder="917498490687"
              error={errContact(["phoneRaw"])}
            />
          </Field>
          <Field label="Email" error={errContact(["email"])} required>
            <EmailInput
              value={c.email}
              onChange={(v) => setC("email", v)}
              placeholder="apexorialearning@gmail.com"
              error={errContact(["email"])}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle description="Public URLs used across footer, contact card, and share widgets.">
          Socials
        </SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Instagram URL" error={errContact(["instagram"])}>
            <UrlInput
              value={c.instagram}
              onChange={(v) => setC("instagram", v)}
              placeholder="https://instagram.com/…"
              error={errContact(["instagram"])}
            />
          </Field>
          <Field label="Instagram handle" hint="E.g. @apexoria_learning">
            <TextInput
              value={c.instagramHandle}
              onChange={(v) => setC("instagramHandle", v)}
              placeholder="@apexoria_learning"
            />
          </Field>
          <Field label="LinkedIn URL" error={errContact(["linkedin"])}>
            <UrlInput
              value={c.linkedin}
              onChange={(v) => setC("linkedin", v)}
              error={errContact(["linkedin"])}
            />
          </Field>
          <Field label="Facebook URL" error={errContact(["facebook"])}>
            <UrlInput
              value={c.facebook}
              onChange={(v) => setC("facebook", v)}
              error={errContact(["facebook"])}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle description="wa.me deeplink with a URL-encoded pre-filled message.">
          WhatsApp deep link
        </SectionTitle>
        <Field
          label="WhatsApp URL"
          hint="Include prefilled message via ?text=… (URL-encoded)"
          error={errWa}
          required
        >
          <UrlInput
            value={content.WHATSAPP_LINK}
            onChange={(v) => update("WHATSAPP_LINK", v)}
            placeholder="https://wa.me/91..."
            error={errWa}
          />
        </Field>
      </Card>

      <Card>
        <SectionTitle description="Rating badge shown on the landing page. Star widget is display-only; use the number for edits.">
          Google reviews
        </SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <Field label="Rating (0–5, decimals ok)" error={errReviews(["rating"])} required>
            <NumberInput
              value={g.rating}
              onChange={(v) => setG("rating", v)}
              min={0}
              max={5}
              step={0.1}
              placeholder="4.9"
              error={errReviews(["rating"])}
            />
            <div className="mt-2">
              <StarRating
                value={Number(g.rating) || 0}
                onChange={(v) => setG("rating", v)}
                step={0.5}
              />
            </div>
          </Field>
          <Field label="Total count" error={errReviews(["count"])} required>
            <NumberInput
              value={g.count}
              onChange={(v) => setG("count", v)}
              min={0}
              step={1}
              placeholder="120"
              error={errReviews(["count"])}
            />
          </Field>
          <Field label="Google reviews URL" error={errReviews(["url"])} required>
            <UrlInput
              value={g.url}
              onChange={(v) => setG("url", v)}
              error={errReviews(["url"])}
            />
          </Field>
        </div>
      </Card>
    </div>
  );
}
