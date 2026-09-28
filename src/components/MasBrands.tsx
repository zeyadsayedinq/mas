import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import { BRAND_DETAIL, CHILD_BRANDS, type Brand } from "../brands";

/**
 * The two owned brands.
 *
 * A portfolio of two only works if each one gets real estate rather than a
 * slot in a grid built for twelve, so these are half-page cards with the
 * supplied lockup on the plate it was drawn for.
 */
export default function MasBrands({ parent }: { parent: Brand }) {
  const ui = parent.ui;

  return (
    <section id="brands" className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32" style={{ background: ui.bgAlt }}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow brand={parent} className="mb-6">Our brands</Eyebrow>
        </Reveal>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <Reveal delay={0.06}>
            <h2 className="text-[2.5rem] sm:text-5xl md:text-6xl font-semibold leading-[1.0] tracking-[-0.045em]" style={{ color: ui.text }}>
              Built in house,
              <br />
              <span style={{ color: ui.textFaint }}>owned outright.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-[15px] leading-relaxed max-w-sm" style={{ color: ui.textMuted }}>
              Two brands, developed by the group and run by the group. Each
              trades under its own name with its own kitchen, team and customer.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {CHILD_BRANDS.map((b, i) => (
            <Reveal key={b.key} delay={0.08 + i * 0.07}>
              <article
                className="h-full flex flex-col rounded-2xl overflow-hidden border"
                style={{ borderColor: ui.line, background: ui.bgSoft }}
              >
                <div
                  className="flex items-center justify-center py-16 px-8 border-b"
                  style={{ background: b.plateBg, borderColor: ui.line }}
                >
                  <img src={b.logo} alt={b.name} className="h-16 sm:h-20 w-auto" />
                </div>

                <div className="flex-1 flex flex-col p-7 sm:p-9">
                  <div className="flex items-baseline justify-between gap-4 mb-1.5">
                    <h3 className="text-2xl font-semibold tracking-[-0.03em]" style={{ color: ui.text }}>
                      {b.name}
                    </h3>
                    <span
                      className="shrink-0 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full"
                      style={{ letterSpacing: "0.16em", color: parent.accent, background: "rgba(161,102,58,0.1)" }}
                    >
                      Owned
                    </span>
                  </div>
                  <p className="text-sm mb-6" style={{ color: ui.textFaint }}>{b.descriptor}</p>

                  <ul className="space-y-3 mb-8">
                    {BRAND_DETAIL[b.key].map((line) => (
                      <li key={line} className="text-[14px] leading-relaxed pl-6 relative" style={{ color: ui.textMuted }}>
                        <span className="absolute left-0 top-[0.45em] w-1.5 h-1.5 rotate-45" style={{ background: parent.accent }} />
                        {line}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={b.path}
                    className="mt-auto self-start inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full transition-transform hover:scale-[1.02]"
                    style={{ background: parent.button, color: parent.buttonText }}
                  >
                    Visit {b.name}
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
