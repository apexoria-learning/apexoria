import Marquee from "react-fast-marquee";

const WORDS = [
  "200+ Learners Trained",
  "No Coding Required",
  "Guaranteed Placement",
  "Job-Ready in 3 Months",
  "Salesforce QA Testing",
];

export default function EditorialMarquee({ dark = false }) {
  return (
    <div
      data-testid="editorial-marquee"
      className={`py-8 border-y ${dark ? "bg-navy border-white/10" : "bg-white border-slate-100"}`}
    >
      <Marquee speed={30} gradient={false}>
        {WORDS.concat(WORDS).map((w, i) => (
          <span
            key={i}
            className={`font-display font-black text-5xl md:text-7xl mx-8 uppercase tracking-tight ${
              dark ? "text-stroke-white" : "text-stroke-navy"
            }`}
          >
            {w} <span className="text-brand-gold" style={{ WebkitTextStroke: "0" }}>•</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
