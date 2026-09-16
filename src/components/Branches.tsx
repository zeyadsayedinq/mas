import { useState } from "react";
import { MapPin, Phone, Star, Clock, ExternalLink, MessageCircle } from "lucide-react";
import Reveal from "./Reveal";
import MapPanel from "./MapPanel";
import { BRANCHES, mapsUrl, whatsappUrl, openState, type Branch } from "../branches";
import type { Brand } from "../brands";

interface BranchesProps {
  brand: Brand;
}

export function OpenNowBadge({ branch, brand }: { branch: Branch; brand: Brand }) {
  const state = openState(branch);
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
      style={{
        background: state.open ? `${brand.accent}22` : brand.ui.line,
        color: state.open ? brand.accent : brand.ui.textMuted,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: state.open ? brand.accent : brand.ui.textFaint }}
      />
      {state.open ? "Open now" : "Closed"}
      <span style={{ color: brand.ui.textFaint }}>· {state.label}</span>
    </span>
  );
}

export default function Branches({ brand }: BranchesProps) {
  const [activeKey, setActiveKey] = useState(BRANCHES[0].key);
  const active = BRANCHES.find((b) => b.key === activeKey) ?? BRANCHES[0];
  const ui = brand.ui;

  const hours = active.hours[new Date().getDay()];

  return (
    <section
      id="branches"
      className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32"
      style={{ background: ui.bgAlt }}
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color: brand.accent }}>
            Branches
          </p>
        </Reveal>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 sm:mb-14">
          <Reveal delay={0.06}>
            <h2 className="leading-[1.0] tracking-[-0.03em]" style={{ color: ui.text }}>
              <span className="block font-playfair italic text-4xl sm:text-6xl md:text-7xl">Two rooms,</span>
              <span className="block text-4xl sm:text-6xl md:text-7xl tracking-[-0.05em]">ten minutes apart.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-sm sm:text-[15px] leading-relaxed max-w-xs" style={{ color: ui.textMuted }}>
              Tap a pin to switch branch. Hours, phone and directions all follow.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 items-start">
          <Reveal className="min-w-0">
            <MapPanel brand={brand} branches={BRANCHES} activeKey={activeKey} onSelect={setActiveKey} />
          </Reveal>

          <Reveal delay={0.08} className="min-w-0">
            <div className="rounded-xl border p-6 sm:p-8 max-w-full" style={{ borderColor: ui.line, background: ui.bgSoft }}>
              <div className="flex flex-wrap items-center gap-2.5 mb-5">
                {BRANCHES.map((b) => (
                  <button
                    key={b.key}
                    onClick={() => setActiveKey(b.key)}
                    className="text-xs font-medium px-4 py-2 rounded-full transition-colors"
                    style={
                      b.key === activeKey
                        ? { background: brand.accent, color: brand.accentText }
                        : { background: "transparent", color: ui.textMuted, border: `1px solid ${ui.line}` }
                    }
                  >
                    {b.area}
                  </button>
                ))}
              </div>

              <h3 className="text-2xl sm:text-3xl font-playfair italic mb-3" style={{ color: ui.text }}>
                {active.name}
              </h3>

              <div className="mb-6">
                <OpenNowBadge branch={active} brand={brand} />
              </div>

              <ul className="space-y-3.5 text-sm">
                <li className="flex gap-3">
                  <MapPin size={16} className="shrink-0 mt-0.5" style={{ color: brand.accent }} />
                  <span style={{ color: ui.textMuted }}>{active.address}</span>
                </li>
                <li className="flex gap-3">
                  <Clock size={16} className="shrink-0 mt-0.5" style={{ color: brand.accent }} />
                  <span style={{ color: ui.textMuted }}>
                    Today {hours.open} to {hours.close}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone size={16} className="shrink-0 mt-0.5" style={{ color: brand.accent }} />
                  <a href={`tel:${active.phone.replace(/\s/g, "")}`} style={{ color: ui.textMuted }}>
                    {active.phone}
                  </a>
                </li>
                {active.rating && (
                  <li className="flex gap-3">
                    <Star size={16} className="shrink-0 mt-0.5" style={{ color: brand.accent }} />
                    <span style={{ color: ui.textMuted }}>
                      {active.rating} on Google, {active.reviews} reviews · {active.priceRange}
                    </span>
                  </li>
                )}
              </ul>

              <div className="flex flex-wrap gap-2 mt-6">
                {active.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-3 py-1.5 rounded-full"
                    style={{ background: ui.bgAlt, color: ui.textMuted, border: `1px solid ${ui.line}` }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <a
                  href={mapsUrl(active)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-sm font-medium px-6 py-3 rounded-full transition-transform hover:scale-[1.02]"
                  style={{ background: brand.accent, color: brand.accentText }}
                >
                  Open in Maps
                  <ExternalLink size={14} />
                </a>
                <a
                  href={whatsappUrl(active, `Hi, I'd like to ask about ${active.name}.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-sm font-medium px-6 py-3 rounded-full border transition-colors"
                  style={{ borderColor: ui.line, color: ui.text }}
                >
                  <MessageCircle size={15} />
                  WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
