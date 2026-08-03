import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "../ui/select";
import { COURSE_OPTIONS } from "../../data";
import { trackEvent } from "@/lib/analytics";

const EMPTY = { full_name: "", phone: "", email: "", course_interest: "", preferred_batch: "", message: "", company_website: "" };

export default function LeadFormFields({ pageMountedAt, prefillCourse, onSuccess }) {
  const [form, setForm] = useState(() => ({ ...EMPTY, course_interest: prefillCourse || "" }));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const cooldownTimer = useRef(null);

  useEffect(() => () => clearTimeout(cooldownTimer.current), []);

  useEffect(() => {
    if (prefillCourse) setForm((f) => ({ ...f, course_interest: prefillCourse }));
  }, [prefillCourse]);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = "Please enter your name";
    const phone = form.phone.replace(/[\s-]/g, "");
    if (!/^(?:\+?91)?[6-9]\d{9}$/.test(phone)) e.phone = "Enter a valid Indian mobile number";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) e.email = "Enter a valid email";
    if (!form.course_interest) e.course_interest = "Select a course";
    if (!form.preferred_batch) e.preferred_batch = "Select a batch timing";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const mapCourseToGF = (value) => {
    const v = value.toLowerCase();
    if (v.includes("foundation")) return "Salesforce Foundation";
    if (v.includes("crash")) return "Salesforce Crashcourse";
    if (v.includes("complete")) return "Salesforce Complete Course";
    if (v.includes("special")) return "Special Offer";
    if (v.includes("qa")) return "Salesforce QA Testing Course";
    return "Not Sure Yet";
  };

  const mapBatchToGF = (value) => {
    const v = value.toLowerCase();
    if (v.includes("morning")) return "Morning";
    if (v.includes("afternoon")) return "Afternoon";
    if (v.includes("evening")) return "Evening";
    return "";
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (loading || cooldown) return;

    // Honeypot — silently pretend success if bot filled the trap field
    if (form.company_website) {
      onSuccess();
      toast.success("Thanks! We'll call you shortly for your free counselling session.");
      setForm(EMPTY);
      setCooldown(true);
      clearTimeout(cooldownTimer.current);
      cooldownTimer.current = setTimeout(() => setCooldown(false), 15000);
      return;
    }

    // Time-trap — silently pretend success if submitted too fast (< 2s)
    // Timer starts from page mount (captured in eager parent LeadForm)
    if (Date.now() - pageMountedAt < 2000) {
      onSuccess();
      toast.success("Thanks! We'll call you shortly for your free counselling session.");
      setForm(EMPTY);
      setCooldown(true);
      clearTimeout(cooldownTimer.current);
      cooldownTimer.current = setTimeout(() => setCooldown(false), 15000);
      return;
    }

    // localStorage cooldown — survive page reloads (12s between submits)
    const last = parseInt(localStorage.getItem("apex_lead_last") || "0", 10);
    if (Date.now() - last < 12000) {
      toast.error("Please wait a few seconds before submitting again.");
      return;
    }

    if (!validate()) return;
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append(process.env.REACT_APP_GF_ENTRY_NAME, form.full_name);
      fd.append(process.env.REACT_APP_GF_ENTRY_PHONE, form.phone);
      fd.append(process.env.REACT_APP_GF_ENTRY_EMAIL, form.email);
      fd.append(process.env.REACT_APP_GF_ENTRY_COURSE, mapCourseToGF(form.course_interest));
      const batchVal = mapBatchToGF(form.preferred_batch);
      if (batchVal) fd.append(process.env.REACT_APP_GF_ENTRY_BATCH, batchVal);
      if (form.message) fd.append(process.env.REACT_APP_GF_ENTRY_MESSAGE, form.message);

      await fetch(process.env.REACT_APP_GF_ACTION_URL, {
        method: "POST",
        mode: "no-cors",
        body: fd,
      });

      localStorage.setItem("apex_lead_last", String(Date.now()));
      trackEvent("lead_form_submit_success", {
        course: mapCourseToGF(form.course_interest),
        batch: mapBatchToGF(form.preferred_batch) || "unspecified",
      });
      onSuccess();
      toast.success("Thanks! We'll call you shortly for your free counselling session.");
      setForm(EMPTY);
      setCooldown(true);
      clearTimeout(cooldownTimer.current);
      cooldownTimer.current = setTimeout(() => setCooldown(false), 15000);
    } catch {
      toast.error("Something went wrong. Please try again or reach us on WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (k) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue transition ${
      errors[k] ? "border-red-400" : "border-slate-200"
    }`;

  return (
    <form onSubmit={submit} data-testid="lead-form" noValidate>
      {/* Honeypot */}
      <input
        type="text" tabIndex={-1} autoComplete="off"
        value={form.company_website}
        onChange={(e) => set("company_website", e.target.value)}
        className="hidden" aria-hidden="true"
      />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-navy mb-1.5">Full Name *</label>
          <input data-testid="lead-name" className={inputCls("full_name")} placeholder="Your full name" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} />
          {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Phone Number *</label>
            <input data-testid="lead-phone" className={inputCls("phone")} placeholder="+91 98765 43210" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Email *</label>
            <input data-testid="lead-email" className={inputCls("email")} placeholder="you@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Interested Course / Tier *</label>
            <Select value={form.course_interest} onValueChange={(v) => set("course_interest", v)}>
              <SelectTrigger data-testid="lead-course" className={`rounded-xl py-6 ${errors.course_interest ? "border-red-400" : "border-slate-200"}`}>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {COURSE_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.course_interest && <p className="text-xs text-red-500 mt-1">{errors.course_interest}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Preferred Batch Timing *</label>
            <Select value={form.preferred_batch} onValueChange={(v) => set("preferred_batch", v)}>
              <SelectTrigger data-testid="lead-batch" className={`rounded-xl py-6 ${errors.preferred_batch ? "border-red-400" : "border-slate-200"}`}>
                <SelectValue placeholder="Morning / Afternoon / Evening" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Morning (9 AM – 11 AM)">Morning (9 AM – 11 AM)</SelectItem>
                <SelectItem value="Afternoon (1 PM – 4 PM)">Afternoon (1 PM – 4 PM)</SelectItem>
                <SelectItem value="Evening (8 PM – 10 PM)">Evening (8 PM – 10 PM)</SelectItem>
              </SelectContent>
            </Select>
            {errors.preferred_batch && <p className="text-xs text-red-500 mt-1">{errors.preferred_batch}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy mb-1.5">Message (optional)</label>
          <textarea data-testid="lead-message" rows={3} className={inputCls("message")} placeholder="Anything you'd like us to know?" value={form.message} onChange={(e) => set("message", e.target.value)} />
        </div>

        <button
          data-testid="lead-submit-btn"
          type="submit"
          disabled={loading || cooldown}
          className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white font-bold py-4 rounded-full hover:scale-[1.02] active:scale-95 transition-transform shadow-lg shadow-brand-orange/30 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : "Get Free Counselling Call"}
        </button>
      </div>
    </form>
  );
}
