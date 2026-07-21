import { HelpCircle, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import { FAQ_ITEMS } from "../../data";
import { FAQ } from "@/constants/testIds";
import { Reveal } from "./Reveal";
import { trackEvent } from "@/lib/analytics";

export default function FaqSection({ onEnroll }) {
  return (
    <section
      id="faq"
      data-testid={FAQ.section}
      className="bg-brand-gray py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-14 lg:gap-20 items-start">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
              Frequently Asked
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-navy mt-4">
              Answers to the questions we hear{" "}
              <span className="text-brand-orange">every week.</span>
            </h2>
            <p className="mt-5 text-slate-600 leading-relaxed max-w-md">
              Still on the fence? Chances are your question is here. If not,
              our counsellors are one WhatsApp message away.
            </p>
            <div className="mt-8 hidden lg:flex items-center gap-3 text-navy">
              <HelpCircle className="text-brand-blue" size={22} />
              <span className="text-sm font-semibold">
                Something specific to ask?
              </span>
            </div>
            <button
              type="button"
              data-testid="faq-cta-btn"
              onClick={() => {
                trackEvent("cta_click", { location: "faq" });
                onEnroll && onEnroll();
              }}
              className="group mt-6 inline-flex items-center gap-2 bg-brand-orange text-white font-bold px-7 py-3.5 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-xl shadow-brand-orange/30"
            >
              Talk to a Counsellor
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-3xl bg-white p-4 sm:p-6 lg:p-8 shadow-xl shadow-navy/5 border border-slate-100">
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`item-${i}`}
                  data-testid={`${FAQ.item}-${i}`}
                  className="border-slate-200 last:border-b-0"
                >
                  <AccordionTrigger
                    data-testid={`${FAQ.trigger}-${i}`}
                    onClick={() =>
                      trackEvent("faq_open", {
                        index: i,
                        question: item.q,
                      })
                    }
                    className="text-left font-display text-base sm:text-lg font-bold text-navy py-5 hover:no-underline"
                  >
                    <span className="pr-4">{item.q}</span>
                  </AccordionTrigger>
                  <AccordionContent
                    data-testid={`${FAQ.content}-${i}`}
                    className="text-slate-600 leading-relaxed text-sm sm:text-base"
                  >
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
