import { useLayoutEffect, useRef, useState } from "react";
import { MapPin, Phone, Star, Clock, Navigation, MessageCircle, Info } from "lucide-react";
import Reveal from "./Reveal";
import Kinetic from "./Kinetic";
import MapPanel from "./MapPanel";
import { whatsappUrl, type Branch } from "../branches";
import { useBranches, branchLive } from "../localize";
import { useLang } from "../i18n";
import { track } from "../track";
import type { Brand } from "../brands";
import "../styles/aroma-content.css";

interface BranchesProps {
  brand: Brand;
}

/** Google Maps search link for a branch's live listing. */
export const directionsUrl = (b: Branch) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.mapQuery || b.name)}`;

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Open right now, in the visitor's clock, and the next change. Handles after-midnight closes. */
export function openInfo(branch: Branch, now = new Date()): { open: boolean; at: string } {
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const today = branch.hours[day];
  const yesterday = branch.hours[(day + 6) % 7];
  if (toMin(yesterday.close) < toMin(yesterday.open) && mins < toMin(yesterday.close)) return { open: true, at: yesterday.close };
  if (mins < toMin(today.open)) return { open: false, at: today.open };
  if (toMin(today.close) < toMin(today.open) || mins < toMin(today.close)) return { open: true, at: today.close };
  return { open: false, at: branch.hours[(day + 1) % 7].open };
}

/** "9am" / "٩ص" style clock label, Western digits in both languages. */
export function clock(hhmm: string, ar: boolean): string {
  const [h, m] = hhmm.split(":").map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const mm = m ? `:${String(m).padStart(2, "0")}` : "";
  if (ar) return `${h12}${mm} ${h < 12 ? "ص" : "م"}`;
  return `${h12}${mm}${h < 12 ? "am" : "pm"}`;
}

/**
 * Live open/closed pill. Renders nothing until the branch's hours are
 * confirmed, so nobody is told a made-up closing time. Other pages rely on
 * that null.
 */
export function OpenNowBadge({ branch, brand }: { branch: Branch; brand: Brand }) {
  const { tr } = useLang();
  if (!branchLive(branch, "hours")) return null;
  const s = openInfo(branch);
  const when = s.open
    ? tr(`Closes at ${clock(s.at, false)}`, `يقفل ${clock(s.at, true)}`)
    : tr(`Opens at ${clock(s.at, false)}`, `يفتح ${clock(s.at, true)}`);
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
      style={{
        background: s.open ? `${brand.accent}22` : brand.ui.line,
        color: s.open ? "#5d7a2b" : brand.ui.textMuted,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.open ? brand.accent : brand.ui.textFaint }} />
      {s.open ? tr("Open now", "مفتوح دلوقتي") : tr("Closed", "مقفول")}
      <span style={{ color: brand.ui.textFaint }}>· {when}</span>
    </span>
  );
}

export default function Branches({ brand }: BranchesProps) {
  const { tr, ar } = useLang();
  const branches = useBranches();
  const [activeKey, setActiveKey] = useState(branches[0].key);
  const active = branches.find((b) => b.key === activeKey) ?? branches[0];
  const ui = brand.ui;

  const live = {
    address: branchLive(active, "address"),
    hours: branchLive(active, "hours"),
    phone: branchLive(active, "phone"),
    whatsapp: branchLive(active, "whatsapp"),
  };
  const anyPending = !live.address || !live.hours || !live.phone;
  const hours = active.hours[new Date().getDay()];

  // Sliding pill under the active tab.
  const tabs = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ x: 0, w: 0 });
  useLayoutEffect(() => {
    const measure = () => {
      const on = tabs.current?.querySelector<HTMLElement>('[aria-selected="true"]');
      if (on) setPill({ x: on.offsetLeft, w: on.offsetWidth });
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeKey, ar]);

  const pick = (key: string) => {
    setActiveKey(key);
    track("branch_select", { branch: key });
  };

  return (
    <section
      id="branches"
      className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32"
      style={{ background: ui.bgAlt }}
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color: brand.accent }}>
            {tr("Branches", "الفروع")}
          </p>
        </Reveal>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 sm:mb-12">
          <h2 className="leading-[1.0] tracking-[-0.03em]" style={{ color: ui.text }}>
            <span className="block font-playfair italic text-4xl sm:text-6xl md:text-7xl">
              <Kinetic text={tr("Two rooms,", "فرعين،")} />
            </span>
            <span className="block text-4xl sm:text-6xl md:text-7xl tracking-[-0.05em]">
              <Kinetic text={tr("pick yours.", "اختار الأقرب ليك.")} delay={0.18} />
            </span>
          </h2>
          <Reveal delay={0.12}>
            <p className="text-sm sm:text-[15px] leading-relaxed max-w-xs" style={{ color: ui.textMuted }}>
              {tr(
                "Switch branch and the map, directions and details follow.",
                "غيّر الفرع والخريطة والاتجاهات والتفاصيل هتتغيّر معاه.",
              )}
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div
            ref={tabs}
            role="tablist"
            aria-label={tr("Branches", "الفروع")}
            className="ac-seg mb-6 max-w-full"
            style={{ background: "#FFFFFF", border: `1px solid ${ui.line}` }}
          >
            <span
              aria-hidden
              className="ac-seg-pill"
              style={{ width: pill.w, transform: `translateX(${pill.x}px)`, background: brand.accent, opacity: pill.w ? 1 : 0 }}
            />
            {branches.map((b) => {
              const on = b.key === activeKey;
              return (
                <button
                  key={b.key}
                  role="tab"
                  aria-selected={on}
                  aria-controls="branch-panel"
                  onClick={() => pick(b.key)}
                  className="relative text-sm font-medium px-5 sm:px-6 min-h-[44px] rounded-full transition-colors whitespace-nowrap"
                  style={{ color: on ? brand.accentText : ui.textMuted }}
                >
                  {b.name.replace(/^(Aroma Lounge|أروما لاونج)\s*/, "")}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 items-start">
          <Reveal className="min-w-0">
            <MapPanel brand={brand} branch={active} />
          </Reveal>

          <Reveal delay={0.08} className="min-w-0">
            <div
              id="branch-panel"
              role="tabpanel"
              key={active.key}
              className="ac-step rounded-xl border p-6 sm:p-8 max-w-full"
              style={{ borderColor: ui.line, background: ui.bgSoft }}
            >
              <p className="text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: ui.textFaint }}>
                {active.area}
              </p>
              <h3 className="text-2xl sm:text-3xl font-playfair italic mb-3" style={{ color: ui.text }}>
                {active.name}
              </h3>

              {live.hours && (
                <div className="mb-5">
                  <OpenNowBadge branch={active} brand={brand} />
                </div>
              )}

              <ul className="space-y-3.5 text-sm">
                {live.address && (
                  <li className="flex gap-3">
                    <MapPin size={16} aria-hidden className="shrink-0 mt-0.5" style={{ color: brand.accent }} />
                    <span style={{ color: ui.textMuted }}>{active.address}</span>
                  </li>
                )}
                {live.hours && (
                  <li className="flex gap-3">
                    <Clock size={16} aria-hidden className="shrink-0 mt-0.5" style={{ color: brand.accent }} />
                    <span style={{ color: ui.textMuted }}>
                      {tr(
                        `Today ${clock(hours.open, false)} to ${clock(hours.close, false)}`,
                        `النهارده من ${clock(hours.open, true)} لـ ${clock(hours.close, true)}`,
                      )}
                    </span>
                  </li>
                )}
                {live.phone && (
                  <li className="flex gap-3">
                    <Phone size={16} aria-hidden className="shrink-0 mt-0.5" style={{ color: brand.accent }} />
                    <a
                      href={`tel:${active.phone.replace(/\s/g, "")}`}
                      onClick={() => track("call_click", { branch: active.key })}
                      style={{ color: ui.textMuted }}
                      dir="ltr"
                    >
                      {active.phone}
                    </a>
                  </li>
                )}
                {active.rating && (
                  <li className="flex gap-3 items-center">
                    <Star size={16} aria-hidden className="shrink-0" style={{ color: "#E0A526", fill: "#E0A526" }} />
                    <span style={{ color: ui.textMuted }}>
                      {tr(
                        `${active.rating} on Google, ${active.reviews} reviews`,
                        `${active.rating} على جوجل، ${active.reviews} تقييم`,
                      )}
                    </span>
                  </li>
                )}
              </ul>

              {anyPending && (
                <p
                  className="mt-5 flex gap-2.5 text-[13px] leading-relaxed rounded-lg px-3.5 py-3"
                  style={{ background: `${brand.accent}12`, color: ui.textMuted }}
                >
                  <Info size={15} aria-hidden className="shrink-0 mt-0.5" style={{ color: "#5d7a2b" }} />
                  {tr(
                    "Opening hours and the branch line are on their way. Directions take you to the live Google listing.",
                    "مواعيد الفرع ورقمه جايين قريب. الاتجاهات بتوديك على صفحة الفرع على جوجل.",
                  )}
                </p>
              )}

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
                  href={directionsUrl(active)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track("directions_click", { branch: active.key })}
                  className="inline-flex items-center justify-center gap-2 text-sm font-medium px-6 min-h-[48px] rounded-full transition-transform hover:scale-[1.02] active:scale-95"
                  style={{ background: brand.accent, color: brand.accentText }}
                >
                  <Navigation size={15} aria-hidden className="rtl:-scale-x-100" />
                  {tr("Directions", "الاتجاهات")}
                </a>
                {live.whatsapp && (
                  <a
                    href={whatsappUrl(active, tr(`Hi, I'd like to ask about ${active.name}.`, `أهلًا، عايز أسأل عن ${active.name}.`))}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track("whatsapp_click", { branch: active.key })}
                    className="inline-flex items-center justify-center gap-2 text-sm font-medium px-6 min-h-[48px] rounded-full border transition-colors"
                    style={{ borderColor: ui.line, color: ui.text }}
                  >
                    <MessageCircle size={15} aria-hidden />
                    {tr("WhatsApp", "واتساب")}
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
