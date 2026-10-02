import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  Minus,
  Plus,
  Armchair,
  Sun,
  Flame,
  Laptop,
  MessageCircle,
  Navigation,
  RotateCcw,
  Info,
  Star,
  CalendarCheck,
  Users,
} from "lucide-react";
import Reveal from "./Reveal";
import Kinetic from "./Kinetic";
import Confetti from "./Confetti";
import ContactForm from "./ContactForm";
import { OpenNowBadge, clock, directionsUrl } from "./Branches";
import { whatsappUrl } from "../branches";
import { useBranches, branchLive } from "../localize";
import { useLang } from "../i18n";
import { track } from "../track";
import { RESERVATION } from "../config";
import type { Brand } from "../brands";
import "../styles/aroma-content.css";

interface ReservationProps {
  brand: Brand;
  /** Branch key to preselect, e.g. "madinaty" on the Madinaty landing page. */
  defaultBranch?: string;
}

/** Detail of the `aroma:reserve` window event (Desks, footer, nav shortcuts). */
export interface AromaReserveDetail {
  seating?: string;
  branch?: string;
  tab?: "table" | "other";
}

const SEATING = [
  { key: "indoor", icon: Armchair, en: ["Indoor", "Main room, air conditioned"], ar: ["جوّه", "الصالة الرئيسية، مكيّفة"] },
  { key: "terrace", icon: Sun, en: ["Terrace", "Outdoor, open air"], ar: ["التراس", "برّه في الهوا"] },
  { key: "shisha", icon: Flame, en: ["Shisha area", "Terrace, shisha service"], ar: ["منطقة الشيشة", "على التراس، بخدمة شيشة"] },
  { key: "desk", icon: Laptop, en: ["Work desk", "Quiet section, power and wifi"], ar: ["مكتب شغل", "الجزء الهادي، كهربا وواي فاي"] },
] as const;

const pad = (n: number) => String(n).padStart(2, "0");
const localIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromIso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/**
 * Reserve a table (or a desk), or send any other request.
 *
 * Booking hands off to the branch's WhatsApp with everything prefilled, which
 * is how a table actually gets confirmed in Cairo. Until a branch's WhatsApp
 * number is confirmed in branches.ts, the last step says plainly that online
 * booking isn't live yet and shows the plan instead. It never fakes a
 * confirmation and never invents availability.
 *
 * Listens for:
 *   mas:prefill    { message?, branch? }        notes + branch, scrolls here
 *   aroma:reserve  { seating?, branch?, tab? }  preselects, scrolls here
 */
export default function Reservation({ brand, defaultBranch }: ReservationProps) {
  const { tr, ar } = useLang();
  const ui = brand.ui;
  const branches = useBranches();
  const validBranch = (k?: string) => (k && branches.some((b) => b.key === k) ? k : undefined);

  const [tab, setTab] = useState<"table" | "other">("table");
  const [step, setStep] = useState(0);
  const [branchKey, setBranchKey] = useState(validBranch(defaultBranch) ?? branches[0].key);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [party, setParty] = useState(2);
  const [seating, setSeating] = useState("indoor");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<null | "sent" | "offline">(null);
  const [burst, setBurst] = useState(0);
  const [flash, setFlash] = useState(false);

  const branch = branches.find((b) => b.key === branchKey) ?? branches[0];
  const waLive = branchLive(branch, "whatsapp");
  const locale = ar ? "ar-EG-u-nu-latn" : "en-GB";
  const seat = SEATING.find((s) => s.key === seating) ?? SEATING[0];
  const seatLabel = (ar ? seat.ar : seat.en)[0];

  useEffect(() => {
    const k = validBranch(defaultBranch);
    if (k) setBranchKey(k);
  }, [defaultBranch]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- events from other sections ---------- */
  const scrollHere = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() =>
      document.getElementById("reserve")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }),
    );
  };
  const branchesRef = useRef(branches);
  branchesRef.current = branches;
  useEffect(() => {
    const valid = (k?: string) => (k && branchesRef.current.some((b) => b.key === k) ? k : undefined);
    const onPrefill = (e: Event) => {
      const d = (e as CustomEvent<{ message?: string; branch?: string }>).detail ?? {};
      setTab("table");
      setResult(null);
      if (d.message) {
        setNotes(d.message);
        setFlash(true);
        window.setTimeout(() => setFlash(false), 2200);
      }
      const k = valid(d.branch);
      if (k) setBranchKey(k);
      scrollHere();
    };
    const onReserve = (e: Event) => {
      const d = (e as CustomEvent<AromaReserveDetail>).detail ?? {};
      setResult(null);
      setTab(d.tab === "other" ? "other" : "table");
      if (d.seating && SEATING.some((s) => s.key === d.seating)) setSeating(d.seating);
      const k = valid(d.branch);
      if (k) setBranchKey(k);
      scrollHere();
    };
    window.addEventListener("mas:prefill", onPrefill);
    window.addEventListener("aroma:reserve", onReserve);
    return () => {
      window.removeEventListener("mas:prefill", onPrefill);
      window.removeEventListener("aroma:reserve", onReserve);
    };
  }, []);

  /* ---------- dates and slots ---------- */
  const days = useMemo(() => {
    const out: { value: string; weekday: string; day: string; month: string }[] = [];
    for (let i = 0; i < RESERVATION.daysAhead; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      out.push({
        value: localIso(d),
        weekday: i === 0 ? tr("Today", "النهارده") : i === 1 ? tr("Tmrw", "بكرة") : d.toLocaleDateString(locale, { weekday: "short" }),
        day: String(d.getDate()),
        month: d.toLocaleDateString(locale, { month: "short" }),
      });
    }
    return out;
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  // Slots already gone today are hidden. No slot is ever shown as "booked":
  // there is no live availability, so the page doesn't pretend there is.
  const slots = useMemo(() => {
    if (!date) return [];
    if (date !== localIso(new Date())) return RESERVATION.slots;
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes() + 30;
    return RESERVATION.slots.filter((s) => {
      const [h, m] = s.split(":").map(Number);
      return h * 60 + m > mins;
    });
  }, [date]);

  const dateLong = date ? fromIso(date).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" }) : "";
  const dateShort = date ? fromIso(date).toLocaleDateString(locale, { day: "numeric", month: "short" }) : "";

  const STEPS = [tr("Branch", "الفرع"), tr("When", "الميعاد"), tr("Guests", "العدد"), tr("Seating", "المكان"), tr("Details", "بياناتك")];

  const canAdvance = [true, Boolean(date && time), true, Boolean(seating), waLive ? Boolean(name.trim() && phone.trim()) : true][step];

  /* ---------- keep the card in view as steps change ---------- */
  const card = useRef<HTMLDivElement>(null);
  const firstStep = useRef(true);
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    const el = card.current;
    if (el && el.getBoundingClientRect().top < 70) {
      el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  }, [step, result]);

  /* ---------- submit ---------- */
  const waMessage = () => {
    const lines = ar
      ? [
          `أهلًا ${branch.name}، عايز أحجز ${seating === "desk" ? "مكتب" : "ترابيزة"}.`,
          "",
          `الاسم: ${name}`,
          `الموبايل: ${phone}`,
          `اليوم: ${dateLong}`,
          `الساعة: ${clock(time, true)}`,
          `عدد الأفراد: ${party}`,
          `المكان: ${seatLabel}`,
          ...(notes.trim() ? [`ملاحظات: ${notes.trim()}`] : []),
        ]
      : [
          `Hi ${branch.name}, I'd like to book ${seating === "desk" ? "a desk" : "a table"}.`,
          "",
          `Name: ${name}`,
          `Phone: ${phone}`,
          `Date: ${dateLong}`,
          `Time: ${clock(time, false)}`,
          `Guests: ${party}`,
          `Seating: ${seatLabel}`,
          ...(notes.trim() ? [`Notes: ${notes.trim()}`] : []),
        ];
    return lines.join("\n");
  };

  function handleSubmit() {
    if (waLive) {
      window.open(whatsappUrl(branch, waMessage()), "_blank", "noopener");
      track("reserve_submit", { branch: branch.key, party, seating, method: "whatsapp" });
      setResult("sent");
      setBurst((n) => n + 1);
    } else {
      track("reserve_preview", { branch: branch.key, party, seating });
      setResult("offline");
    }
  }

  function startOver() {
    setResult(null);
    setStep(0);
    setDate("");
    setTime("");
    setName("");
    setPhone("");
    setNotes("");
  }

  /* ---------- styling helpers ---------- */
  const pillStyle = (selected: boolean) => ({
    background: selected ? brand.accent : "#FFFFFF",
    color: selected ? brand.accentText : ui.textMuted,
    border: `1px solid ${selected ? "transparent" : ui.line}`,
    boxShadow: selected ? `0 10px 22px -14px ${brand.accent}` : "none",
  });
  const inputStyle = { borderColor: ui.line, color: ui.text };
  const inputClass = "w-full bg-transparent border-b outline-none text-base sm:text-[15px] py-3 transition-colors focus:border-current";
  const labelClass = "block text-[10px] uppercase tracking-[0.2em] mb-1";
  const deep = "#5d7a2b";

  /* ---------- tabs pill ---------- */
  const tabsRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ x: 0, w: 0 });
  useLayoutEffect(() => {
    const measure = () => {
      const on = tabsRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
      if (on) setPill({ x: on.offsetLeft, w: on.offsetWidth });
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [tab, ar]);

  const summaryRows: [string, string, boolean][] = [
    [tr("Branch", "الفرع"), branch.name.replace(/^(Aroma Lounge|أروما لاونج)\s*/, ""), true],
    [tr("Date", "اليوم"), dateShort || tr("Not set", "لسه"), Boolean(date)],
    [tr("Time", "الساعة"), time ? clock(time, ar) : tr("Not set", "لسه"), Boolean(time)],
    [tr("Guests", "العدد"), String(party), true],
    [tr("Seating", "المكان"), seatLabel, true],
  ];

  /* ---------- result screens ---------- */
  const resultView = result && (
    <div ref={card} className="ac-step relative rounded-xl border p-7 sm:p-10 scroll-mt-24" style={{ borderColor: ui.line, background: ui.bgSoft }}>
      <Confetti fire={result === "sent" ? burst : 0} />
      {result === "sent" ? (
        <div className="text-center" role="status">
          <span className="ac-pop inline-flex items-center justify-center w-14 h-14 rounded-full mb-6" style={{ background: brand.accent, color: brand.accentText }}>
            <Check size={24} aria-hidden />
          </span>
          <h3 className="text-3xl sm:text-4xl font-playfair italic mb-3" style={{ color: ui.text }}>
            {tr("Almost there.", "فاضل خطوة.")}
          </h3>
          <p className="text-[15px] leading-relaxed max-w-md mx-auto" style={{ color: ui.textMuted }}>
            {tr(
              "WhatsApp opened with your booking written out. Press send there and the branch confirms your table.",
              "الواتساب اتفتح والحجز مكتوب جاهز. دوس إرسال هناك والفرع هيأكد لك الحجز.",
            )}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={whatsappUrl(branch, waMessage())}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("whatsapp_click", { branch: branch.key, from: "reserve" })}
              className="inline-flex items-center justify-center gap-2 text-sm font-medium px-7 min-h-[48px] rounded-full"
              style={{ background: brand.accent, color: brand.accentText }}
            >
              <MessageCircle size={16} aria-hidden />
              {tr("Open WhatsApp again", "افتح الواتساب تاني")}
            </a>
            <button onClick={startOver} className="inline-flex items-center justify-center gap-2 text-sm font-medium px-7 min-h-[48px] rounded-full border" style={{ borderColor: ui.line, color: ui.text }}>
              <RotateCcw size={15} aria-hidden />
              {tr("Book another", "احجز حاجة تانية")}
            </button>
          </div>
        </div>
      ) : (
        <div role="status">
          <span className="inline-flex items-center gap-2 text-[11px] font-medium px-3 py-1.5 rounded-full mb-5" style={{ background: `${brand.accent}18`, color: deep }}>
            <Info size={13} aria-hidden />
            {tr("Nothing has been sent", "مفيش حاجة اتبعتت")}
          </span>
          <h3 className="text-3xl sm:text-4xl font-playfair italic mb-3" style={{ color: ui.text }}>
            {tr("Online booking isn't live yet.", "الحجز أونلاين لسه مش متاح.")}
          </h3>
          <p className="text-[15px] leading-relaxed max-w-lg" style={{ color: ui.textMuted }}>
            {tr(
              "We haven't connected the branches to this page yet, so no table is held. Here's your plan so you have it handy. For now, the easiest way is to drop by.",
              "لسه ما ربطناش الفروع بالصفحة دي، فمفيش ترابيزة اتحجزت. دي خطتك عشان تبقى معاك. لحد ما الحجز يشتغل، أسهل حاجة إنك تعدّي علينا.",
            )}
          </p>
          <dl className="mt-7 grid grid-cols-2 sm:grid-cols-3 gap-px rounded-lg overflow-hidden" style={{ background: ui.line }}>
            {[
              [tr("Branch", "الفرع"), branch.name.replace(/^(Aroma Lounge|أروما لاونج)\s*/, "")],
              [tr("Date", "اليوم"), dateLong],
              [tr("Time", "الساعة"), clock(time, ar)],
              [tr("Guests", "العدد"), String(party)],
              [tr("Seating", "المكان"), seatLabel],
              ...(notes.trim() ? [[tr("Notes", "ملاحظات"), notes.trim()]] : []),
            ].map(([k, v]) => (
              <div key={k} className="px-4 py-3.5 min-w-0" style={{ background: ui.bgAlt }}>
                <dt className="text-[10px] uppercase tracking-[0.16em] mb-1" style={{ color: ui.textFaint }}>{k}</dt>
                <dd className="text-sm break-words" style={{ color: ui.text }}>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={directionsUrl(branch)}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("directions_click", { branch: branch.key, from: "reserve" })}
              className="inline-flex items-center justify-center gap-2 text-sm font-medium px-7 min-h-[48px] rounded-full"
              style={{ background: brand.accent, color: brand.accentText }}
            >
              <Navigation size={15} aria-hidden className="rtl:-scale-x-100" />
              {tr(`Directions to ${branch.area}`, `الطريق لـ ${branch.name.replace(/^أروما لاونج\s*/, "")}`)}
            </a>
            <button
              onClick={() => {
                setResult(null);
                setStep(4);
              }}
              className="inline-flex items-center justify-center gap-2 text-sm font-medium px-7 min-h-[48px] rounded-full border"
              style={{ borderColor: ui.line, color: ui.text }}
            >
              <ChevronLeft size={16} aria-hidden className="rtl:-scale-x-100" />
              {tr("Change details", "عدّل التفاصيل")}
            </button>
            <button onClick={startOver} className="inline-flex items-center justify-center gap-2 text-sm font-medium px-5 min-h-[48px] rounded-full" style={{ color: ui.textMuted }}>
              <RotateCcw size={15} aria-hidden />
              {tr("Start over", "ابدأ من الأول")}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section id="reserve" className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32 scroll-mt-16" style={{ background: ui.bgAlt }}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color: brand.accent }}>
            {tr("Reserve", "احجز")}
          </p>
        </Reveal>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10 sm:mb-12">
          <h2 className="leading-[1.0] tracking-[-0.03em]" style={{ color: ui.text }}>
            <span className="block font-playfair italic text-4xl sm:text-6xl md:text-7xl">
              <Kinetic text={tr("Hold a table,", "احجز ترابيزة،")} />
            </span>
            <span className="block text-4xl sm:text-6xl md:text-7xl tracking-[-0.05em]">
              <Kinetic text={tr("or a desk.", "أو مكتب.")} delay={0.18} />
            </span>
          </h2>

          <Reveal delay={0.1}>
            <div
              ref={tabsRef}
              role="tablist"
              aria-label={tr("What do you need?", "محتاج إيه؟")}
              className="ac-seg w-full sm:w-auto"
              style={{ background: "#FFFFFF", border: `1px solid ${ui.line}` }}
            >
              <span aria-hidden className="ac-seg-pill" style={{ width: pill.w, transform: `translateX(${pill.x}px)`, background: brand.accent, opacity: pill.w ? 1 : 0 }} />
              {([
                ["table", CalendarCheck, tr("Book a table", "احجز ترابيزة")],
                ["other", Users, tr("Something else?", "حاجة تانية؟")],
              ] as const).map(([key, Icon, label]) => {
                const on = tab === key;
                return (
                  <button
                    key={key}
                    role="tab"
                    id={`rv-tab-${key}`}
                    aria-selected={on}
                    aria-controls={`rv-panel-${key}`}
                    onClick={() => {
                      setTab(key);
                      track("reserve_tab", { tab: key });
                    }}
                    className="relative flex-1 sm:flex-none inline-flex items-center justify-center gap-2 text-sm font-medium px-5 sm:px-6 min-h-[44px] rounded-full transition-colors whitespace-nowrap"
                    style={{ color: on ? brand.accentText : ui.textMuted }}
                  >
                    <Icon size={15} aria-hidden />
                    {label}
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {tab === "other" ? (
          <div id="rv-panel-other" role="tabpanel" aria-labelledby="rv-tab-other" className="ac-step grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <div className="min-w-0">
              <h3 className="text-2xl sm:text-3xl font-playfair italic mb-4" style={{ color: ui.text }}>
                {tr("Groups, events, or beans by the bag.", "مجموعات، مناسبات، أو بن بالكيس.")}
              </h3>
              <p className="text-[15px] leading-relaxed max-w-sm" style={{ color: ui.textMuted }}>
                {tr(
                  "Planning something bigger than a table, or want our coffee at home or at work? Tell us what you need and the team will come back to you.",
                  "بتخطط لحاجة أكبر من ترابيزة، أو عايز قهوتنا في البيت أو الشغل؟ قولّنا محتاج إيه والفريق هيرد عليك.",
                )}
              </p>
            </div>
            <div className="min-w-0 rounded-xl border p-6 sm:p-9" style={{ borderColor: ui.line, background: ui.bgSoft }}>
              <ContactForm brand={brand} defaultSubject={brand.name} listen={false} />
            </div>
          </div>
        ) : (
          <div id="rv-panel-table" role="tabpanel" aria-labelledby="rv-tab-table" className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-12 items-start min-w-0">
            <div className="min-w-0">
              {resultView || (
                <div ref={card} className="rounded-xl border p-5 sm:p-9 max-w-full overflow-hidden scroll-mt-24" style={{ borderColor: ui.line, background: ui.bgSoft }}>
                  {/* step rail */}
                  <ol className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 -mx-1 px-1" aria-label={tr("Steps", "الخطوات")}>
                    {STEPS.map((label, i) => (
                      <li key={label} className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => i < step && setStep(i)}
                          disabled={i > step}
                          aria-current={i === step ? "step" : undefined}
                          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] min-h-[36px] disabled:cursor-default"
                          style={{ color: i === step ? deep : i < step ? ui.textMuted : ui.textFaint }}
                        >
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-colors"
                            style={i < step ? { background: brand.accent, color: brand.accentText } : { border: `1px solid ${i === step ? brand.accent : ui.line}` }}
                          >
                            {i < step ? <Check size={12} aria-hidden /> : i + 1}
                          </span>
                          <span className={i === step ? "" : "hidden sm:inline"}>{label}</span>
                        </button>
                        {i < STEPS.length - 1 && <span aria-hidden className="w-4 sm:w-5 h-px" style={{ background: i < step ? brand.accent : ui.line }} />}
                      </li>
                    ))}
                  </ol>

                  <div key={step} className="ac-step">
                    {step === 0 && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {branches.map((b) => {
                          const selected = b.key === branchKey;
                          return (
                            <button
                              key={b.key}
                              onClick={() => setBranchKey(b.key)}
                              aria-pressed={selected}
                              className="text-start rounded-xl p-5 transition-all active:scale-[0.98]"
                              style={{ border: `1px solid ${selected ? brand.accent : ui.line}`, background: selected ? `${brand.accent}12` : "#FFFFFF" }}
                            >
                              <span className="flex items-start justify-between gap-3">
                                <span className="block text-[15px] font-medium mb-1" style={{ color: ui.text }}>{b.name}</span>
                                <span
                                  aria-hidden
                                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                                  style={selected ? { background: brand.accent, color: brand.accentText } : { border: `1px solid ${ui.line}` }}
                                >
                                  {selected && <Check size={12} />}
                                </span>
                              </span>
                              <span className="block text-sm mb-3" style={{ color: ui.textFaint }}>{b.area}</span>
                              <span className="flex flex-wrap items-center gap-2">
                                <OpenNowBadge branch={b} brand={brand} />
                                {b.rating && (
                                  <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: ui.textMuted }}>
                                    <Star size={12} aria-hidden style={{ color: "#E0A526", fill: "#E0A526" }} />
                                    {b.rating} {tr("on Google", "على جوجل")}
                                  </span>
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {step === 1 && (
                      <div>
                        <p className={labelClass} style={{ color: ui.textFaint }}>{tr("Date", "اليوم")}</p>
                        <div className="rail ac-date-rail mb-7 pb-2">
                          {days.map((d) => (
                            <button
                              key={d.value}
                              onClick={() => {
                                setDate(d.value);
                                setTime("");
                              }}
                              aria-pressed={d.value === date}
                              className="w-[64px] rounded-xl py-3 text-center transition-all active:scale-95"
                              style={pillStyle(d.value === date)}
                            >
                              <span className="block text-[10px] uppercase tracking-[0.1em]">{d.weekday}</span>
                              <span className="block text-lg leading-tight">{d.day}</span>
                              <span className="block text-[10px]">{d.month}</span>
                            </button>
                          ))}
                        </div>

                        <p className={labelClass} style={{ color: ui.textFaint }}>{tr("Time", "الساعة")}</p>
                        {!date ? (
                          <p className="text-sm mt-2" style={{ color: ui.textFaint }}>{tr("Pick a date first.", "اختار اليوم الأول.")}</p>
                        ) : slots.length === 0 ? (
                          <p className="text-sm mt-2" style={{ color: ui.textFaint }}>{tr("That's it for today. Pick another day.", "خلاص النهارده. اختار يوم تاني.")}</p>
                        ) : (
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                            {slots.map((slot) => (
                              <button
                                key={slot}
                                onClick={() => setTime(slot)}
                                aria-pressed={slot === time}
                                className="rounded-lg min-h-[44px] text-sm transition-all active:scale-95"
                                style={pillStyle(slot === time)}
                              >
                                {clock(slot, ar)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {step === 2 && (
                      <div className="py-6 flex flex-col items-center">
                        <p className={labelClass} style={{ color: ui.textFaint }} id="rv-guests">{tr("Guests", "عدد الأفراد")}</p>
                        <div className="flex items-center gap-7 mt-4" role="group" aria-labelledby="rv-guests">
                          <button
                            onClick={() => setParty((p) => Math.max(1, p - 1))}
                            disabled={party <= 1}
                            className="w-12 h-12 rounded-full border flex items-center justify-center transition-all active:scale-90 disabled:opacity-40"
                            style={{ borderColor: ui.line, color: ui.text, background: "#FFFFFF" }}
                            aria-label={tr("Fewer guests", "أقل")}
                          >
                            <Minus size={17} aria-hidden />
                          </button>
                          <span key={party} className="ac-pop text-5xl tabular-nums w-16 text-center" style={{ color: ui.text }} aria-live="polite">
                            {party}
                          </span>
                          <button
                            onClick={() => setParty((p) => Math.min(RESERVATION.maxPartySize, p + 1))}
                            disabled={party >= RESERVATION.maxPartySize}
                            className="w-12 h-12 rounded-full border flex items-center justify-center transition-all active:scale-90 disabled:opacity-40"
                            style={{ borderColor: ui.line, color: ui.text, background: "#FFFFFF" }}
                            aria-label={tr("More guests", "أكتر")}
                          >
                            <Plus size={17} aria-hidden />
                          </button>
                        </div>
                        <p className="mt-6 text-sm text-center max-w-xs" style={{ color: ui.textFaint }}>
                          {tr(`More than ${RESERVATION.maxPartySize}?`, `أكتر من ${RESERVATION.maxPartySize}؟`)}{" "}
                          <button onClick={() => setTab("other")} className="underline underline-offset-4 min-h-[44px]" style={{ color: deep }}>
                            {tr("Tell us about your group", "احكيلنا عن المجموعة")}
                          </button>
                        </p>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {SEATING.map((s) => {
                          const selected = s.key === seating;
                          const [label, note] = ar ? s.ar : s.en;
                          return (
                            <button
                              key={s.key}
                              onClick={() => setSeating(s.key)}
                              aria-pressed={selected}
                              className="text-start rounded-xl p-5 flex gap-4 transition-all active:scale-[0.98]"
                              style={{ border: `1px solid ${selected ? brand.accent : ui.line}`, background: selected ? `${brand.accent}12` : "#FFFFFF" }}
                            >
                              <span className="shrink-0 mt-0.5" style={{ color: deep }}>
                                <s.icon size={20} aria-hidden />
                              </span>
                              <span>
                                <span className="block text-[15px] font-medium mb-1" style={{ color: ui.text }}>{label}</span>
                                <span className="block text-sm" style={{ color: ui.textFaint }}>{note}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {step === 4 && (
                      <div className="grid gap-7">
                        {waLive ? (
                          <div className="grid gap-7 sm:grid-cols-2">
                            <div>
                              <label className={labelClass} style={{ color: ui.textFaint }} htmlFor="rv-name">{tr("Name", "الاسم")}</label>
                              <input id="rv-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder={tr("Your name", "اسمك")} className={inputClass} style={inputStyle} />
                            </div>
                            <div>
                              <label className={labelClass} style={{ color: ui.textFaint }} htmlFor="rv-phone">{tr("Phone", "الموبايل")}</label>
                              <input id="rv-phone" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" autoComplete="tel" placeholder="01x xxxx xxxx" dir="ltr" className={`${inputClass} rtl:text-right`} style={inputStyle} />
                            </div>
                          </div>
                        ) : (
                          <p className="flex gap-2.5 text-[13px] leading-relaxed rounded-lg px-3.5 py-3" style={{ background: `${brand.accent}12`, color: ui.textMuted }}>
                            <Info size={15} aria-hidden className="shrink-0 mt-0.5" style={{ color: deep }} />
                            {tr(
                              "No name or number needed yet: online booking isn't connected, so nothing leaves this page.",
                              "مش محتاجين اسمك ولا رقمك دلوقتي: الحجز أونلاين لسه مش متوصّل، فمفيش حاجة بتخرج من الصفحة دي.",
                            )}
                          </p>
                        )}
                        <div>
                          <label className={labelClass} style={{ color: ui.textFaint }} htmlFor="rv-notes">{tr("Anything we should know", "أي حاجة نعرفها")}</label>
                          <textarea
                            id="rv-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder={tr("High chair, birthday, quiet table, optional", "كرسي أطفال، عيد ميلاد، ترابيزة هادية، اختياري")}
                            className={`${inputClass} resize-none`}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-9">
                    <button
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      disabled={step === 0}
                      className="inline-flex items-center gap-1.5 text-sm min-h-[44px] pe-2 transition-opacity disabled:opacity-0"
                      style={{ color: ui.textMuted }}
                    >
                      <ChevronLeft size={16} aria-hidden className="rtl:-scale-x-100" />
                      {tr("Back", "رجوع")}
                    </button>

                    <button
                      onClick={() => (step === 4 ? handleSubmit() : setStep((s) => s + 1))}
                      disabled={!canAdvance}
                      className="inline-flex items-center gap-2 text-sm font-medium px-7 sm:px-8 min-h-[48px] rounded-full transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{ background: brand.accent, color: brand.accentText }}
                    >
                      {step === 4 && waLive && <MessageCircle size={16} aria-hidden />}
                      {step === 4 ? (waLive ? tr("Send on WhatsApp", "ابعت على واتساب") : tr("See my plan", "شوف خطتك")) : tr("Continue", "كمّل")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* summary rail, fills in as you go */}
            <div className="min-w-0 lg:sticky lg:top-24">
              <div className="rounded-xl border p-6 sm:p-7 max-w-full" style={{ borderColor: ui.line, background: ui.bgSoft }}>
                <p className="text-[10px] uppercase tracking-[0.2em] mb-5" style={{ color: ui.textFaint }}>
                  {tr("Your booking", "حجزك")}
                </p>
                <dl className="space-y-4 text-sm">
                  {summaryRows.map(([k, v, set]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4">
                      <dt style={{ color: ui.textFaint }}>{k}</dt>
                      <dd className="text-end" style={{ color: set ? ui.text : ui.textFaint }}>{v}</dd>
                    </div>
                  ))}
                  {notes.trim() && (
                    <div
                      className="rounded-lg px-3 py-2.5 -mx-3 transition-colors duration-700"
                      style={{ background: flash ? `${brand.accent}22` : "transparent" }}
                    >
                      <dt className="mb-1" style={{ color: ui.textFaint }}>{tr("Notes", "ملاحظات")}</dt>
                      <dd className="break-words" style={{ color: ui.text }}>{notes.trim()}</dd>
                    </div>
                  )}
                </dl>
                <p className="mt-6 pt-5 border-t text-xs leading-relaxed" style={{ borderColor: ui.line, color: ui.textFaint }}>
                  {waLive
                    ? tr("You send the request on WhatsApp and the branch confirms it there.", "بتبعت الطلب على واتساب والفرع بيأكده هناك.")
                    : tr("Online booking opens soon. Plan it here and keep the summary.", "الحجز أونلاين قريب. خطّط هنا وخلّي الملخص معاك.")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
