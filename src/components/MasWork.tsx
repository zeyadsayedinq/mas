import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import { CASE_STUDIES, type Brand } from "../brands";

/**
 * Selected work.
 *
 * Case studies are the one credibility device that belongs on a group site
 * this size, and only because MAS sells operations as a service: none of the
 * pure brand owners carry them, every third party operator does. They are the
 * proof for the section above, so they sit directly under it.
 *
 * Deliberately static. The page gets one interactive element and it is the
 * services selector.
 */
export default function MasWork({ brand }: { brand: Brand }) {
  const ui = brand.ui;

  return (
    <section id="work" className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32" style={{ background: ui.bg }}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow brand={brand} className="mb-6">Our work</Eyebrow>
        </Reveal>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <Reveal delay={0.06}>
            <h2 className="text-[2.5rem] sm:text-5xl md:text-6xl font-semibold leading-[1.0] tracking-[-0.045em]" style={{ color: ui.text }}>
              Rooms we took on,
              <br />
              <span style={{ color: ui.textFaint }}>and what changed.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-[15px] leading-relaxed max-w-sm" style={{ color: ui.textMuted }}>
              Named clients on request. Where an owner has asked to stay
              unnamed, the venue is described rather than identified.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {CASE_STUDIES.map((c, i) => (
            <Reveal key={c.key} delay={0.08 + i * 0.06}>
              <article
                className="h-full flex flex-col rounded-2xl border p-7 sm:p-8"
                style={{ borderColor: ui.line, background: ui.bgSoft }}
              >
                <span
                  className="self-start text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full mb-5"
                  style={{ letterSpacing: "0.16em", color: brand.accent, background: "rgba(161,102,58,0.1)" }}
                >
                  {c.service}
                </span>

                <h3 className="text-xl font-semibold tracking-[-0.03em] mb-5" style={{ color: ui.text }}>
                  {c.client}
                </h3>

                <p className="text-[10px] font-semibold uppercase mb-2" style={{ letterSpacing: "0.2em", color: ui.textFaint }}>
                  The problem
                </p>
                <p className="text-[14px] leading-relaxed mb-5" style={{ color: ui.textMuted }}>
                  {c.challenge}
                </p>

                <p className="text-[10px] font-semibold uppercase mb-2" style={{ letterSpacing: "0.2em", color: ui.textFaint }}>
                  What we did
                </p>
                <p className="text-[14px] leading-relaxed mb-7" style={{ color: ui.textMuted }}>
                  {c.did}
                </p>

                <div className="mt-auto grid grid-cols-3 gap-4 pt-6 border-t" style={{ borderColor: ui.line }}>
                  {c.results.map((r) => (
                    <div key={r.label} className="min-w-0">
                      <p className="text-xl font-semibold tracking-[-0.04em] mb-1" style={{ color: brand.accent }}>
                        {r.value}
                      </p>
                      <p className="text-[10px] leading-tight uppercase" style={{ letterSpacing: "0.12em", color: ui.textFaint }}>
                        {r.label}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
