import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import { NOW, type Brand } from "../brands";

/**
 * What is happening right now.
 *
 * A group site is expected to show signs of life, but a Newsroom that has to
 * be fed weekly becomes a liability the month it stops. This is the version
 * that survives neglect: openings, sites in build and live hiring, four at a
 * time, added to a plain array rather than a CMS.
 */
export default function MasNow({ brand }: { brand: Brand }) {
  const ui = brand.ui;

  const tone: Record<string, string> = {
    Opening: brand.accent,
    "In build": ui.textFaint,
    Hiring: "#4F6F52",
    Group: ui.textFaint,
  };

  return (
    <section id="now" className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32" style={{ background: ui.bgAlt }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
          <Reveal>
            <div>
              <Eyebrow brand={brand} className="mb-5">Happening now</Eyebrow>
              <h2 className="text-[2.25rem] sm:text-4xl md:text-5xl font-semibold leading-[1.0] tracking-[-0.045em]" style={{ color: ui.text }}>
                Where the group is this month.
              </h2>
            </div>
          </Reveal>
        </div>

        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: ui.line, background: ui.bgSoft }}>
          {NOW.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <article
                className="grid gap-x-6 gap-y-2 p-6 sm:p-7 md:grid-cols-[130px_150px_minmax(0,1fr)] md:items-baseline"
                style={{ borderTop: i ? `1px solid ${ui.line}` : undefined }}
              >
                <span className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.18em", color: ui.textFaint }}>
                  {item.date}
                </span>
                <span
                  className="justify-self-start text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full"
                  style={{ letterSpacing: "0.14em", color: tone[item.kind], border: `1px solid ${ui.line}` }}
                >
                  {item.kind}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[17px] font-semibold tracking-[-0.02em] mb-1" style={{ color: ui.text }}>
                    {item.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed" style={{ color: ui.textMuted }}>
                    {item.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
