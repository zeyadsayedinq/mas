import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Minus, Plus, ArrowRight, RotateCcw, Check } from "lucide-react";
import Reveal from "./Reveal";
import Kinetic from "./Kinetic";
import Magnetic from "./Magnetic";
import Sparkle from "./Sparkle";
import { useLang } from "../i18n";
import { track } from "../track";
import monogram from "../assets/brand/covy-monogram-greige.webp";
import InviteActions from "./InviteActions";
import { dayLabel, inviteUrl, isoDay, readInvite, whatsappLink, type InviteData } from "../invite/core";
import { COVY_ARRIVALS, covyCopy, drawCovyCard, type CovyMood } from "../invite/covyCard";
import type { Brand } from "../brands";
import "../styles/covy.css";

/**
 * Hand a message to the shared enquiry form and take the visitor there. The
 * form listens for "mas:prefill"; if it has not been wired to yet, the
 * message box is filled directly as long as it is still empty.
 */
export function sendToCovy(message: string) {
  window.dispatchEvent(new CustomEvent("mas:prefill", { detail: { message } }));
  requestAnimationFrame(() => {
    const box = document.getElementById("cf-message") as HTMLTextAreaElement | null;
    if (box && !box.value) box.value = message;
  });
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

type Mood = CovyMood;
const ARRIVALS = COVY_ARRIVALS;
type Arrival = (typeof ARRIVALS)[number];

const MAX_GUESTS = 20;
const NAVY = "#262D3F";
const GREIGE = "#DCD4CF";
const GLOW = "#F4EFEB";

/** Where the little stars fly when the card opens. */
const BURST = [
  { x: -8, y: 12, bx: "-46px", by: "-40px", s: 12 }, { x: 96, y: 8, bx: "40px", by: "-44px", s: 10 },
  { x: -4, y: 70, bx: "-50px", by: "20px", s: 9 }, { x: 100, y: 64, bx: "46px", by: "30px", s: 12 },
  { x: 50, y: -3, bx: "6px", by: "-54px", s: 8 }, { x: 30, y: 100, bx: "-20px", by: "46px", s: 8 },
];

/**
 * "Plan your evening": pick a mood, a night, a party size and a time, add a
 * name, and COVY writes an invitation. The card flips from its cover (the
 * monogram) to the written side. It can be sent to anyone as an image
 * through the phone's share menu, sent on WhatsApp, saved as a picture, or
 * copied as a link; the person who opens the link sees the same card. It can
 * also go straight into the enquiry form to hold the table. Every line on it
 * is built from what COVY actually is: a lounge with a late kitchen, a full
 * bar, quiet rooms, and private hire.
 */
export default function CovyEvening({ brand }: { brand: Brand }) {
  const ui = brand.ui;
  const { tr, ar } = useLang();
  const [mood, setMood] = useState<Mood | null>(null);
  const [guests, setGuests] = useState(2);
  const [arrival, setArrival] = useState<Arrival | null>(null);
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(() => isoDay(0));
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [image, setImage] = useState<Promise<Blob> | null>(null);
  /** Someone opened a link they were sent: show them their invitation first. */
  const [received, setReceived] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const data: InviteData | null = useMemo(
    () => (mood && arrival ? { b: "covy", m: mood, g: guests, a: arrival, d: day, to: to.trim() || undefined, from: from.trim() || undefined } : null),
    [mood, arrival, guests, day, to, from],
  );
  const copy = useMemo(() => (data ? covyCopy(data, ar) : null), [data, ar]);

  // An invitation link opens straight onto its card.
  useEffect(() => {
    const inv = readInvite("covy");
    if (!inv) return;
    setMood(inv.m as Mood);
    setGuests(inv.g ?? 2);
    setArrival((ARRIVALS as readonly string[]).includes(inv.a ?? "") ? (inv.a as Arrival) : "21:00");
    if (inv.d) setDay(inv.d);
    setTo(inv.to ?? "");
    setFrom(inv.from ?? "");
    setReceived(true);
    setImage(drawCovyCard(inv, ar));
    track("invite_open", { brand: "covy" });
    const t = window.setTimeout(() => {
      setOpen(true);
      document.getElementById("evening")?.scrollIntoView({ block: "start" });
    }, 500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moods: { key: Mood; label: string }[] = [
    { key: "quiet", label: tr("Quiet table for two", "طاولة هادئة لشخصين") },
    { key: "friends", label: tr("Catching up with friends", "لقاء مع الأصدقاء") },
    { key: "late", label: tr("A late dinner", "عشاء متأخر") },
    { key: "private", label: tr("A private evening", "سهرة خاصة") },
  ];
  const timeLabel = (a: Arrival) => (a === "late" ? tr("Late", "متأخرًا") : a);

  const pickMood = (m: Mood) => {
    setMood(m);
    if (m === "quiet") setGuests(2);
    if (m === "friends" && guests < 3) setGuests(4);
    if (m === "private" && guests < 6) setGuests(10);
  };

  const guestWord = (n: number) =>
    ar ? (n === 1 ? "ضيف واحد" : n === 2 ? "ضيفان" : n <= 10 ? `${n} ضيوف` : `${n} ضيفًا`) : n === 1 ? "1 guest" : `${n} guests`;

  // The card, written from the choices (the same writer draws the image).
  const title = copy?.title ?? "";
  const lines = copy?.lines ?? [];

  const ready = !!mood && !!arrival;

  const compose = () => {
    if (!ready) return;
    if (open) {
      // Already written: turn it over and write it again.
      setOpen(false);
      window.setTimeout(() => setOpen(true), 700);
    } else setOpen(true);
    // Draw the image now, so sending it later is instant.
    if (data) setImage(drawCovyCard(data, ar));
    track("evening_card", { mood: mood!, guests, arrival: arrival! });
    // On a phone the card sits below the choices: bring it up.
    const el = cardRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      }
    }
  };

  const reset = () => {
    setOpen(false);
    setReceived(false);
    setImage(null);
    if (window.location.hash.includes("invite=")) window.history.replaceState(null, "", window.location.pathname + window.location.search);
    window.setTimeout(() => {
      setMood(null);
      setArrival(null);
      setGuests(2);
      setDay(isoDay(0));
      setTo("");
      setFrom("");
    }, 450);
  };

  // Any change after the card is written turns it back over, so what is sent always matches what is shown.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (received) return;
    setOpen(false);
    setImage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const dayText = dayLabel(day, ar);
  const yesText = from
    ? tr(`I'm in, ${from}. COVY, ${dayText}${arrival && arrival !== "late" ? ` at ${arrival}` : ""}.`, `موافق يا ${from}. كوفي، ${dayText}${arrival && arrival !== "late" ? ` الساعة ${arrival}` : ""}.`)
    : tr(`I'm in. COVY, ${dayText}${arrival && arrival !== "late" ? ` at ${arrival}` : ""}.`, `موافق. كوفي، ${dayText}${arrival && arrival !== "late" ? ` الساعة ${arrival}` : ""}.`);

  const send = () => {
    const message = [
      tr("Hello COVY,", "مرحبًا كوفي،"),
      tr(`I'd like to plan an evening: ${title.charAt(0).toLowerCase()}${title.slice(1)}.`, `أودّ ترتيب سهرة: ${title}.`),
      "",
      `${tr("Guests", "عدد الضيوف")}: ${guests}`,
      `${tr("Arriving", "الوصول")}: ${arrival ? timeLabel(arrival) : ""}`,
      `${tr("The night", "الليلة")}: ${dayText}`,
    ].join("\n");
    track("evening_send", { mood: mood ?? "", guests });
    sendToCovy(message);
  };

  const chip = (on: boolean) =>
    ({
      background: on ? NAVY : "transparent",
      color: on ? GREIGE : ui.text,
      borderColor: on ? NAVY : "rgba(38,45,63,.28)",
    }) as CSSProperties;

  const groupLabel = "block text-[10px] uppercase tracking-[0.22em] mb-3 font-semibold";

  return (
    <section id="evening" className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32 overflow-hidden" style={{ background: ui.bg }}>
      <div className="mx-auto max-w-6xl grid gap-12 lg:gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] items-start">
        <div>
          <Reveal>
            <p className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color: brand.accent }}>
              <Sparkle size={10} color={brand.accent} />
              {received ? tr("Your invitation", "دعوتك") : tr("Plan your evening", "خطّط لسهرتك")}
            </p>
          </Reveal>
          <h2 className="leading-[1.02] tracking-[-0.03em]" style={{ color: ui.text }}>
            <Kinetic key={received ? "r1" : "b1"} variant="curtain" stagger={0.04} text={received ? (to ? `${to},` : tr("An evening,", "سهرة،")) : tr("Tell us the mood.", "قل لنا المزاج،")} className="block font-playfair italic text-4xl sm:text-5xl md:text-6xl" />
            <Kinetic key={received ? "r2" : "b2"} variant="curtain" stagger={0.04} delay={0.18} text={received ? tr("you're invited.", "أنت مدعوّ.") : tr("We'll write the invitation.", "ونكتب نحن الدعوة.")} className="block text-4xl sm:text-5xl md:text-6xl tracking-[-0.045em]" />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed" style={{ color: ui.textMuted }}>
              {received
                ? from
                  ? tr(`${from} planned an evening at COVY and saved you a seat. The card has the details.`, `${from} رتّب سهرة في كوفي وحجز لك مكانًا. التفاصيل في البطاقة.`)
                  : tr("Someone planned an evening at COVY and saved you a seat. The card has the details.", "هناك من رتّب سهرة في كوفي وحجز لك مكانًا. التفاصيل في البطاقة.")
                : tr(
                    "Pick the evening, add a name, and COVY writes a card. Send it to anyone on WhatsApp, Instagram, Messages or Snapchat, or keep it as an image.",
                    "اختر السهرة وأضف الاسم، ويكتب لك كوفي بطاقة. أرسلها لمن تشاء على واتساب أو إنستجرام أو الرسائل أو سناب شات، أو احتفظ بها كصورة.",
                  )}
            </p>
          </Reveal>

          {received && (
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={whatsappLink(yesText, "")}
                target="_blank"
                rel="noreferrer"
                onClick={() => track("invite_yes", { brand: "covy" })}
                className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium px-7 py-3 rounded-full transition-transform hover:scale-[1.03] active:scale-95"
                style={{ background: NAVY, color: GREIGE }}
              >
                <Check size={15} />
                {tr("Say yes on WhatsApp", "وافق عبر واتساب")}
              </a>
              <button
                type="button"
                onClick={reset}
                className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full border"
                style={{ borderColor: "rgba(38,45,63,.28)", color: ui.text }}
              >
                {tr("Plan one of your own", "رتّب سهرتك أنت")}
              </button>
            </div>
          )}

          {!received && (
          <Reveal delay={0.14}>
            <div className="mt-10 grid gap-8">
              <div role="group" aria-labelledby="cv-mood-l">
                <span id="cv-mood-l" className={groupLabel} style={{ color: ui.textMuted }}>
                  {tr("The mood", "المزاج")}
                </span>
                <div className="flex flex-wrap gap-2">
                  {moods.map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      aria-pressed={mood === m.key}
                      onClick={() => pickMood(m.key)}
                      className="cv-chip min-h-[44px] px-4 sm:px-5 rounded-full border text-sm"
                      style={chip(mood === m.key)}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-end gap-x-10 gap-y-8">
                <div role="group" aria-labelledby="cv-guests-l">
                  <span id="cv-guests-l" className={groupLabel} style={{ color: ui.textMuted }}>
                    {tr("How many", "كم شخصًا")}
                  </span>
                  <div className="inline-flex items-center rounded-full border" style={{ borderColor: "rgba(38,45,63,.28)" }}>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      disabled={guests <= 1}
                      aria-label={tr("One fewer guest", "ضيف أقل")}
                      className="h-11 w-11 grid place-items-center rounded-full disabled:opacity-30"
                      style={{ color: ui.text }}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="min-w-[88px] text-center text-sm tabular-nums" style={{ color: ui.text }} aria-live="polite">
                      {guestWord(guests)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))}
                      disabled={guests >= MAX_GUESTS}
                      aria-label={tr("One more guest", "ضيف إضافي")}
                      className="h-11 w-11 grid place-items-center rounded-full disabled:opacity-30"
                      style={{ color: ui.text }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div role="group" aria-labelledby="cv-time-l" className="min-w-0">
                  <span id="cv-time-l" className={groupLabel} style={{ color: ui.textMuted }}>
                    {tr("Arriving", "الوصول")}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {ARRIVALS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        aria-pressed={arrival === a}
                        onClick={() => setArrival(a)}
                        className="cv-chip min-h-[44px] min-w-[56px] px-3.5 rounded-full border text-sm tabular-nums"
                        style={chip(arrival === a)}
                      >
                        {timeLabel(a)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div role="group" aria-labelledby="cv-day-l">
                <span id="cv-day-l" className={groupLabel} style={{ color: ui.textMuted }}>
                  {tr("Which night", "أي ليلة")}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {[0, 1].map((off) => (
                    <button
                      key={off}
                      type="button"
                      aria-pressed={day === isoDay(off)}
                      onClick={() => setDay(isoDay(off))}
                      className="cv-chip min-h-[44px] px-4 sm:px-5 rounded-full border text-sm"
                      style={chip(day === isoDay(off))}
                    >
                      {off === 0 ? tr("Tonight", "الليلة") : tr("Tomorrow", "غدًا")}
                    </button>
                  ))}
                  <label
                    className="cv-chip relative min-h-[44px] inline-flex items-center px-4 sm:px-5 rounded-full border text-sm cursor-pointer"
                    style={chip(day !== isoDay(0) && day !== isoDay(1))}
                  >
                    <span>{day !== isoDay(0) && day !== isoDay(1) ? dayLabel(day, ar) : tr("Another night", "ليلة أخرى")}</span>
                    <input
                      type="date"
                      min={isoDay(0)}
                      value={day}
                      onChange={(e) => e.target.value && setDay(e.target.value)}
                      aria-label={tr("Pick a date", "اختر التاريخ")}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 max-w-lg">
                <label className="block">
                  <span className={groupLabel} style={{ color: ui.textMuted }}>{tr("Who is it for", "إلى مَن")}</span>
                  <input
                    value={to}
                    onChange={(e) => setTo(e.target.value.slice(0, 24))}
                    placeholder={tr("Their name (optional)", "الاسم (اختياري)")}
                    autoComplete="off"
                    className="w-full bg-transparent border-b py-2.5 text-[15px] outline-none"
                    style={{ borderColor: "rgba(38,45,63,.28)", color: ui.text }}
                  />
                </label>
                <label className="block">
                  <span className={groupLabel} style={{ color: ui.textMuted }}>{tr("From", "مِن")}</span>
                  <input
                    value={from}
                    onChange={(e) => setFrom(e.target.value.slice(0, 24))}
                    placeholder={tr("Your name (optional)", "اسمك (اختياري)")}
                    autoComplete="given-name"
                    className="w-full bg-transparent border-b py-2.5 text-[15px] outline-none"
                    style={{ borderColor: "rgba(38,45,63,.28)", color: ui.text }}
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Magnetic>
                  <button
                    type="button"
                    onClick={compose}
                    aria-disabled={!ready}
                    className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium px-7 py-3 rounded-full transition-[transform,opacity] hover:scale-[1.03] active:scale-95"
                    style={{ background: brand.accent, color: brand.accentText, opacity: ready ? 1 : 0.55 }}
                  >
                    <Sparkle size={11} color="currentColor" />
                    {tr("Write the invitation", "اكتب الدعوة")}
                  </button>
                </Magnetic>
                {!ready && (
                  <span className="text-xs" style={{ color: ui.textMuted }}>
                    {tr("Pick a mood and a time first.", "اختر المزاج والوقت أولًا.")}
                  </span>
                )}
              </div>
            </div>
          </Reveal>
          )}
        </div>

        {/* The card: its cover first, the written side once composed. */}
        <Reveal delay={0.12}>
          <div ref={cardRef} className={`cv-flip relative mx-auto w-full max-w-[420px] ${open ? "is-open" : ""}`}>
            <div className="sr-only" aria-live="polite">
              {open ? tr(`Your evening card is ready: ${title}.`, `بطاقة سهرتك جاهزة: ${title}.`) : ""}
            </div>
            {BURST.map((b, i) => (
              <span
                key={i}
                aria-hidden
                className="cv-burst z-10"
                style={{ left: `${b.x}%`, top: `${b.y}%`, animationDelay: `${0.55 + i * 0.06}s`, "--bx": b.bx, "--by": b.by } as CSSProperties}
              >
                <Sparkle size={b.s} color={brand.accent} />
              </span>
            ))}
            <div className="cv-flip-inner">
              {/* Cover */}
              <div
                aria-hidden={open}
                className="cv-face relative rounded-[22px] overflow-hidden flex flex-col items-center justify-center text-center px-8 py-14 min-h-[480px] sm:min-h-[520px]"
                style={{ background: NAVY, color: GREIGE, boxShadow: "0 30px 60px -30px rgba(38,45,63,.55)" }}
              >
                <div className="absolute inset-3 rounded-[16px] border pointer-events-none" style={{ borderColor: "rgba(220,212,207,.22)" }} />
                <div className="cv-foil" />
                <img src={monogram} alt="" aria-hidden className="w-28 sm:w-32 h-auto opacity-95" />
                <p className="mt-8 text-[10px] uppercase tracking-[0.34em]" style={{ color: "rgba(220,212,207,.7)" }}>
                  {tr("An evening at COVY", "سهرة في كوفي")}
                </p>
                <div className="mt-6 flex items-center gap-2 opacity-70">
                  <Sparkle size={7} color={GREIGE} />
                  <Sparkle size={11} color={GREIGE} className="covy-twinkle" />
                  <Sparkle size={7} color={GREIGE} />
                </div>
                <p className="mt-6 text-sm max-w-[240px] leading-relaxed" style={{ color: "rgba(220,212,207,.62)" }}>
                  {tr("Your invitation will be written here.", "ستُكتب دعوتك هنا.")}
                </p>
              </div>

              {/* Written side */}
              <div
                aria-hidden={!open}
                className="cv-face cv-face-back relative rounded-[22px] overflow-hidden flex flex-col text-center px-7 sm:px-10 py-10 min-h-[480px] sm:min-h-[520px]"
                style={{ background: NAVY, color: GREIGE, boxShadow: "0 30px 60px -30px rgba(38,45,63,.55)" }}
              >
                <div className="absolute inset-3 rounded-[16px] border pointer-events-none" style={{ borderColor: "rgba(220,212,207,.22)" }} />
                <div aria-hidden className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ background: "radial-gradient(60% 80% at 50% 0%, rgba(244,239,235,.1), transparent 70%)" }} />
                <div className="cv-foil" />
                <img src={monogram} alt="" aria-hidden className="cv-card-line relative mx-auto w-14 h-auto" style={{ transitionDelay: "0.55s" }} />
                <p className="cv-card-line relative mt-5 text-[10px] uppercase tracking-[0.34em]" style={{ color: "rgba(220,212,207,.72)", transitionDelay: "0.65s" }}>
                  {copy?.eyebrow ?? tr("An evening at COVY", "سهرة في كوفي")}
                </p>
                {copy?.forLine && (
                  <p className="cv-card-line relative mt-3 font-playfair italic text-lg" style={{ color: "#7E98AE", transitionDelay: "0.7s" }}>
                    {copy.forLine}
                  </p>
                )}
                <h3 className="cv-card-line relative mt-4 font-playfair italic text-[34px] sm:text-[40px] leading-[1.08]" style={{ color: GLOW, transitionDelay: "0.75s" }}>
                  {title}
                </h3>
                <div className="cv-card-line relative my-6 flex items-center justify-center gap-3" style={{ transitionDelay: "0.85s" }}>
                  <span className="h-px w-12" style={{ background: "rgba(220,212,207,.3)" }} />
                  <Sparkle size={10} color={brand.accent} />
                  <span className="h-px w-12" style={{ background: "rgba(220,212,207,.3)" }} />
                </div>
                <div className="relative grid gap-3">
                  {lines.map((l, i) => (
                    <p key={l} className="cv-card-line text-[15px] leading-relaxed" style={{ color: "rgba(220,212,207,.86)", transitionDelay: `${0.95 + i * 0.12}s` }}>
                      {l}
                    </p>
                  ))}
                </div>
                {copy?.fromLine && (
                  <p className="cv-card-line relative mt-auto pt-6 font-playfair italic text-xl" style={{ color: GLOW, transitionDelay: "1.25s" }}>
                    {copy.fromLine}
                  </p>
                )}
                <div
                  className={`cv-card-line relative ${copy?.fromLine ? "pt-4" : "mt-auto pt-8"} flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.2em] tabular-nums`}
                  style={{ color: "rgba(220,212,207,.7)", transitionDelay: "1.35s" }}
                >
                  <span>{dayText}</span>
                  <Sparkle size={6} color={GREIGE} />
                  <span>{arrival ? timeLabel(arrival) : ""}</span>
                  <Sparkle size={6} color={GREIGE} />
                  <span>{guestWord(guests)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-7 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} aria-hidden={!open}>
            <InviteActions
              brand="covy"
              image={image}
              fileName="covy-invitation.png"
              text={copy?.shareText ?? ""}
              url={data ? inviteUrl(data) : ""}
              active={open}
              colors={{ solidBg: NAVY, solidFg: GREIGE, line: "rgba(38,45,63,.28)", fg: ui.text, muted: ui.textMuted }}
            />
            {!received && (
              <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2">
                <button type="button" onClick={send} tabIndex={open ? 0 : -1} className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4" style={{ color: ui.text }}>
                  {tr("Hold this table with COVY", "احجز هذه الطاولة لدى كوفي")}
                  <ArrowRight size={15} className="rtl:-scale-x-100" />
                </button>
                <button type="button" onClick={reset} tabIndex={open ? 0 : -1} className="min-h-[44px] inline-flex items-center gap-2 text-sm" style={{ color: ui.textMuted }}>
                  <RotateCcw size={14} />
                  {tr("Start again", "ابدأ من جديد")}
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
