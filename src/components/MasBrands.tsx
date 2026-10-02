import type { CSSProperties } from "react";
import { Link } from "../router";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import { pickService } from "./MasAudience";
import type { Brand } from "../brands";
import { useBrand, useGroup } from "../localize";
import { useLang } from "../i18n";
import { track } from "../track";

/**
 * The portfolio, split the way the business is split: brands MAS owns outright,
 * and venues it operates for owners under the owner's own name. The second
 * card names nobody; the list is shared on request.
 */
export default function MasBrands({ parent }: { parent: Brand }) {
  const ui = parent.ui;
  const { tr, href } = useLang();
  const { brandDetail } = useGroup();
  const owned = [useBrand("aroma"), useBrand("covy")];

  const label = "text-[10px] font-semibold uppercase tracking-[0.24em]";

  return (
    <section id="brands" className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32" style={{ background: ui.bgAlt }}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow brand={parent} className="mb-6">{tr("Brands and venues", "العلامات والأماكن")}</Eyebrow>
        </Reveal>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 sm:mb-14">
          <Reveal delay={0.06}>
            <h2 className="text-[2.3rem] sm:text-5xl md:text-6xl font-semibold leading-[1.02] tracking-[-0.045em]" style={{ color: ui.text }}>
              {tr("Some we own.", "بعضها نملكه.")}
              <br />
              <span style={{ color: ui.textFaint }}>{tr("Some we run for you.", "وبعضها نديره لك.")}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-[15px] leading-relaxed max-w-sm" style={{ color: ui.textMuted }}>
              {tr(
                "Two brands developed and run by the group, each under its own name. Alongside them, venues we operate for their owners, under theirs.",
                "علامتان طوّرتهما المجموعة وتديرهما، كلٌّ باسمها. وإلى جانبهما أماكن نشغّلها لملّاكها، بأسمائهم هم.",
              )}
            </p>
          </Reveal>
        </div>

        <div className="grid gap-10 lg:gap-6 lg:grid-cols-3">
          {/* Owned */}
          <div className="lg:col-span-2 min-w-0">
            <Reveal>
              <p className={`${label} mb-4 flex items-center gap-3`} style={{ color: ui.text }}>
                <span aria-hidden className="h-px w-6" style={{ background: parent.accent }} />
                {tr("Brands we own", "علامات نملكها")}
              </p>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2">
              {owned.map((b, i) => (
                <Reveal key={b.key} delay={0.06 + i * 0.07} className="h-full">
                  <Link
                    to={href(b.path)}
                    onClick={() => track("brand_open", { brand: b.key })}
                    className="mas-brand group h-full flex flex-col rounded-2xl overflow-hidden border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ borderColor: ui.line, background: ui.bgSoft, outlineColor: parent.accent }}
                  >
                    <div className="flex items-center justify-center h-40 sm:h-44 px-8 border-b" style={{ background: b.plateBg, borderColor: ui.line }}>
                      <span className="mas-logo" style={{ "--mas-logo": `url(${b.logo})` } as CSSProperties}>
                        <img src={b.logo} alt="" className="block h-14 sm:h-16 w-auto" />
                        <span aria-hidden className="mas-logo-tint" />
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col p-6 sm:p-7">
                      <div className="flex items-baseline justify-between gap-4 mb-1">
                        <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.03em]" style={{ color: ui.text }}>
                          {b.name}
                        </h3>
                        <span
                          className="shrink-0 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full tracking-[0.16em]"
                          style={{ color: parent.accent, background: "rgba(79,111,82,0.1)" }}
                        >
                          {tr("Owned", "ملك المجموعة")}
                        </span>
                      </div>
                      <p className="text-sm mb-5" style={{ color: ui.textFaint }}>{b.descriptor}</p>

                      <ul className="space-y-2.5 mb-7">
                        {(brandDetail[b.key] ?? []).map((line) => (
                          <li key={line} className="text-[14px] leading-relaxed ps-5 relative" style={{ color: ui.textMuted }}>
                            <span aria-hidden className="absolute start-0 top-[0.6em] w-1.5 h-1.5 rotate-45" style={{ background: parent.accent }} />
                            {line}
                          </li>
                        ))}
                      </ul>

                      <span className="mt-auto inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold" style={{ color: parent.accent }}>
                        {tr(`Visit ${b.name}`, `زُر ${b.name}`)}
                        <ArrowRight size={15} aria-hidden className="mas-go rtl:-scale-x-100" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Operated */}
          <div className="min-w-0 flex flex-col">
            <Reveal>
              <p className={`${label} mb-4 flex items-center gap-3`} style={{ color: ui.text }}>
                <span aria-hidden className="h-px w-6" style={{ background: parent.accent }} />
                {tr("Venues we operate for owners", "أماكن نشغّلها لملّاكها")}
              </p>
            </Reveal>
            <Reveal delay={0.2} className="h-full flex-1">
              <article className="h-full flex flex-col rounded-2xl overflow-hidden border" style={{ borderColor: ui.line, background: ui.bgSoft }}>
                {/* A blank fascia: the sign is the owner's, not ours. */}
                <div className="flex items-center justify-center h-40 sm:h-44 px-8 border-b" style={{ background: ui.bg, borderColor: ui.line }}>
                  <div
                    aria-hidden
                    className="w-full max-w-[220px] rounded-md border border-dashed px-5 py-4 text-center"
                    style={{ borderColor: "rgba(62,39,35,0.28)" }}
                  >
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: ui.textFaint }}>
                      {tr("Your name here", "اسمك هنا")}
                    </span>
                    <span className="mt-2 mx-auto block h-px w-10" style={{ background: parent.accent }} />
                  </div>
                </div>
                <div className="flex-1 flex flex-col p-6 sm:p-7">
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.03em]" style={{ color: ui.text }}>
                      {tr("Owner-branded venues", "أماكن بأسماء ملّاكها")}
                    </h3>
                    <span
                      className="shrink-0 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full border tracking-[0.16em]"
                      style={{ color: ui.textMuted, borderColor: ui.line }}
                    >
                      {tr("Operated", "بإدارتنا")}
                    </span>
                  </div>
                  <p className="text-sm mb-5" style={{ color: ui.textFaint }}>
                    {tr("Named on request", "الأسماء عند الطلب")}
                  </p>
                  <p className="text-[14px] leading-relaxed mb-7" style={{ color: ui.textMuted }}>
                    {tr(
                      "The owner holds the site and the capital. MAS runs the floor, the kitchen and the numbers to the standard we hold our own brands to, and reports every month. The name over the door stays the owner's.",
                      "المالك يملك الموقع ورأس المال، وماس تدير الصالة والمطبخ والأرقام بالمعيار نفسه الذي نلتزم به في علاماتنا، وترفع تقريرًا كل شهر. ويبقى الاسم على الباب اسم المالك.",
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      track("brands_operate_cta");
                      pickService("operate");
                    }}
                    className="mt-auto self-start inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold px-5 rounded-full border transition-colors hover:bg-black/[0.03]"
                    style={{ borderColor: ui.line, color: ui.text }}
                  >
                    {tr("How we operate", "كيف نشغّل")}
                    <ArrowRight size={15} aria-hidden className="rtl:-scale-x-100" />
                  </button>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
