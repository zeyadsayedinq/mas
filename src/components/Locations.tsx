import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Navigation, Phone } from "lucide-react";
import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import { OpenNowBadge } from "./Branches";
import { mapsUrl } from "../branches";
import type { Brand } from "../brands";
import { branchLive, useBranches, useBrand } from "../localize";
import { useLang } from "../i18n";
import { track } from "../track";

interface LocationsProps {
  brand: Brand;
}

/**
 * Compact footprint strip for the group page, from the same branch data the
 * Aroma page uses. Address, hours and phone only appear once confirmed.
 */
export default function Locations({ brand }: LocationsProps) {
  const ui = brand.ui;
  const { tr, href } = useLang();
  const branches = useBranches();
  const aroma = useBrand("aroma");

  return (
    <section id="locations" className="relative px-5 sm:px-10 md:px-14 py-20 sm:py-24" style={{ background: ui.bg }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <Reveal>
            <Eyebrow brand={brand} className="mb-4">{tr("Where to find us", "أين تجدنا")}</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.04em]" style={{ color: ui.text }}>
              {tr("Our own rooms, across New Cairo.", "أماكننا في القاهرة الجديدة.")}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <Link
              to={href("/aroma")}
              className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-100 opacity-80"
              style={{ color: ui.textMuted }}
            >
              {tr(`All ${aroma.name} branches`, `كل فروع ${aroma.name}`)}
              <ArrowRight size={15} aria-hidden className="rtl:-scale-x-100" />
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-px sm:grid-cols-2 rounded-xl overflow-hidden border" style={{ background: ui.line, borderColor: ui.line }}>
          {branches.map((b, i) => (
            <Reveal key={b.key} delay={0.06 + i * 0.06} className="h-full">
              <div className="h-full px-6 sm:px-7 py-7 flex flex-col gap-4" style={{ background: ui.bgSoft }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[16px] font-semibold tracking-[-0.01em]" style={{ color: ui.text }}>{b.name}</p>
                    <p className="text-sm mt-1 flex items-center gap-1.5" style={{ color: ui.textFaint }}>
                      <MapPin size={13} aria-hidden className="shrink-0" />
                      {branchLive(b, "address") ? b.address : b.area}
                    </p>
                  </div>
                  <a
                    href={mapsUrl(b)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track("directions_click", { branch: b.key, from: "group" })}
                    className="shrink-0 inline-flex min-h-[44px] items-center gap-1.5 text-xs font-semibold px-4 rounded-full border transition-colors hover:bg-black/[0.03]"
                    style={{ borderColor: ui.line, color: ui.textMuted }}
                    aria-label={tr(`Directions to ${b.name}`, `الاتجاهات إلى ${b.name}`)}
                  >
                    <Navigation size={13} aria-hidden />
                    {tr("Directions", "الاتجاهات")}
                  </a>
                </div>

                {(branchLive(b, "hours") || branchLive(b, "phone")) && (
                  <div className="flex flex-wrap items-center gap-3">
                    {branchLive(b, "hours") && <OpenNowBadge branch={b} brand={brand} />}
                    {branchLive(b, "phone") && (
                      <a
                        href={`tel:${b.phone.replace(/\s/g, "")}`}
                        onClick={() => track("call_click", { branch: b.key, from: "group" })}
                        className="inline-flex min-h-[44px] items-center gap-1.5 text-[13px]"
                        style={{ color: ui.textMuted }}
                        dir="ltr"
                      >
                        <Phone size={13} aria-hidden />
                        {b.phone}
                      </a>
                    )}
                  </div>
                )}

                <ul className="mt-auto flex flex-wrap gap-1.5" aria-label={tr("At this branch", "في هذا الفرع")}>
                  {b.tags.map((t) => (
                    <li
                      key={t}
                      className="text-[11px] px-2.5 py-1 rounded-full"
                      style={{ background: ui.bgAlt, color: ui.textMuted }}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
