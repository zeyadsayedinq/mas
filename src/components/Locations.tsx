import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import { OpenNowBadge } from "./Branches";
import { BRANCHES, mapsUrl } from "../branches";
import { BRANDS, type Brand } from "../brands";

interface LocationsProps {
  brand: Brand;
}

/**
 * Compact footprint strip for the group page. Pulls the same branch data the
 * Aroma page uses, so hours and areas never drift between the two.
 */
export default function Locations({ brand }: LocationsProps) {
  const ui = brand.ui;

  return (
    <section
      id="locations"
      className="relative px-5 sm:px-10 md:px-14 py-20 sm:py-24"
      style={{ background: ui.bg }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <Reveal>
            <div>
              <Eyebrow brand={brand} className="mb-4">
                Where to find us
              </Eyebrow>
              <h2 className="text-3xl sm:text-4xl tracking-[-0.04em]" style={{ color: ui.text }}>
                Open across New Cairo.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <Link
              to={BRANDS.aroma.path}
              className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-100 opacity-75"
              style={{ color: ui.textMuted }}
            >
              All Aroma branches
              <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-px sm:grid-cols-2 rounded-lg overflow-hidden" style={{ background: ui.line }}>
          {BRANCHES.map((b, i) => (
            <Reveal key={b.key} delay={0.06 + i * 0.06}>
              <div className="h-full px-6 sm:px-7 py-7 flex flex-col gap-4" style={{ background: ui.bgSoft }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[15px] font-medium" style={{ color: ui.text }}>
                      {b.name}
                    </p>
                    <p className="text-sm mt-1 flex items-center gap-1.5" style={{ color: ui.textFaint }}>
                      <MapPin size={13} />
                      {b.area}
                    </p>
                  </div>
                  <a
                    href={mapsUrl(b)}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-xs font-medium px-4 py-2 rounded-full border transition-colors"
                    style={{ borderColor: ui.line, color: ui.textMuted }}
                  >
                    Directions
                  </a>
                </div>
                <OpenNowBadge branch={b} brand={brand} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
