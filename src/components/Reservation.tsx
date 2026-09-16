import { useMemo, useState } from "react";
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
} from "lucide-react";
import Reveal from "./Reveal";
import { BRANCHES, whatsappUrl, openState } from "../branches";
import { RESERVATION } from "../config";
import type { Brand } from "../brands";

interface ReservationProps {
  brand: Brand;
}

const SEATING = [
  { key: "indoor", label: "Indoor", note: "Main room, air conditioned", icon: Armchair },
  { key: "terrace", label: "Terrace", note: "Outdoor, open air", icon: Sun },
  { key: "shisha", label: "Shisha area", note: "Terrace, shisha service", icon: Flame },
  { key: "desk", label: "Work desk", note: "Quiet section, power and wifi", icon: Laptop },
];

const STEPS = ["Branch", "When", "Party", "Seating", "Details"];

/**
 * Front end mockup. Nothing is stored anywhere.
 *
 * Submitting shows a confirmation with a reference code and offers a WhatsApp
 * handoff with the booking prefilled, which is how a table actually gets
 * confirmed here. Swap `handleSubmit` for a real booking API when there is one.
 */
export default function Reservation({ brand }: ReservationProps) {
  const ui = brand.ui;
  const [step, setStep] = useState(0);
  const [branchKey, setBranchKey] = useState(BRANCHES[0].key);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [party, setParty] = useState(2);
  const [seating, setSeating] = useState("indoor");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [reference, setReference] = useState("");

  const branch = BRANCHES.find((b) => b.key === branchKey) ?? BRANCHES[0];

  const days = useMemo(() => {
    const out: { value: string; weekday: string; day: string; month: string }[] = [];
    for (let i = 0; i < RESERVATION.daysAhead; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      out.push({
        value: d.toISOString().slice(0, 10),
        weekday: i === 0 ? "Today" : d.toLocaleDateString("en-GB", { weekday: "short" }),
        day: String(d.getDate()),
        month: d.toLocaleDateString("en-GB", { month: "short" }),
      });
    }
    return out;
  }, []);

  /**
   * Some slots read as busy so the picker feels like a real book rather than a
   * wall of identical buttons. Deterministic from date plus time, so it does
   * not reshuffle on every render.
   */
  const busySlots = useMemo(() => {
    if (!date) return new Set<string>();
    const set = new Set<string>();
    RESERVATION.slots.forEach((slot, i) => {
      const seed = [...(date + slot)].reduce((a, c) => a + c.charCodeAt(0), 0);
      const evening = i >= RESERVATION.slots.length - 6;
      if (seed % (evening ? 3 : 5) === 0) set.add(slot);
    });
    return set;
  }, [date]);

  const canAdvance = [
    true,
    Boolean(date && time),
    true,
    Boolean(seating),
    Boolean(name.trim() && phone.trim()),
  ][step];

  const summaryLine = () => {
    const seat = SEATING.find((s) => s.key === seating)?.label ?? "";
    const when = date ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long" }) : "";
    return `${branch.name}, ${when} at ${time}, ${party} ${party === 1 ? "person" : "people"}, ${seat}`;
  };

  function handleSubmit() {
    const ref = `AL-${Date.now().toString(36).slice(-5).toUpperCase()}`;
    setReference(ref);
    setStep(5);
  }

  const waMessage = `Hi ${branch.name}, I'd like to book a table.\n\nRef: ${reference}\nName: ${name}\nPhone: ${phone}\nDate: ${date}\nTime: ${time}\nGuests: ${party}\nSeating: ${SEATING.find((s) => s.key === seating)?.label}${notes ? `\nNotes: ${notes}` : ""}`;

  const pillStyle = (selected: boolean, disabled = false) => ({
    background: selected ? brand.accent : "transparent",
    color: selected ? brand.accentText : disabled ? ui.textFaint : ui.textMuted,
    border: `1px solid ${selected ? "transparent" : ui.line}`,
    opacity: disabled ? 0.45 : 1,
  });

  const inputStyle = { borderColor: ui.line, color: ui.text };
  const inputClass =
    "w-full bg-transparent border-b outline-none text-[15px] py-3 transition-colors focus:border-current";
  const labelClass = "block text-[10px] uppercase tracking-[0.2em] mb-1";

  if (step === 5) {
    return (
      <section id="reserve" className="px-5 sm:px-10 md:px-14 py-24 sm:py-32" style={{ background: ui.bgAlt }}>
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border p-8 sm:p-12 text-center" style={{ borderColor: ui.line, background: ui.bgSoft }}>
            <span
              className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-6"
              style={{ background: brand.accent, color: brand.accentText }}
            >
              <Check size={24} />
            </span>
            <h3 className="text-3xl sm:text-4xl font-playfair italic mb-3" style={{ color: ui.text }}>
              Table requested.
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: ui.textMuted }}>
              {summaryLine()}
            </p>
            <p
              className="inline-block text-[11px] uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-8"
              style={{ background: ui.bgAlt, color: ui.textFaint, border: `1px solid ${ui.line}` }}
            >
              Reference {reference}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappUrl(branch, waMessage)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 text-sm font-medium px-7 py-3.5 rounded-full transition-transform hover:scale-[1.02]"
                style={{ background: brand.accent, color: brand.accentText }}
              >
                <MessageCircle size={16} />
                Confirm on WhatsApp
              </a>
              <button
                onClick={() => {
                  setStep(0);
                  setDate("");
                  setTime("");
                  setName("");
                  setPhone("");
                  setNotes("");
                }}
                className="text-sm font-medium px-7 py-3.5 rounded-full border transition-colors"
                style={{ borderColor: ui.line, color: ui.text }}
              >
                Book another
              </button>
            </div>

            <p className="mt-7 text-xs" style={{ color: ui.textFaint }}>
              This is a demo booking. Nothing has been sent yet.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="reserve" className="px-5 sm:px-10 md:px-14 py-24 sm:py-32" style={{ background: ui.bgAlt }}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color: brand.accent }}>
            Reserve
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="leading-[1.0] tracking-[-0.03em] mb-12" style={{ color: ui.text }}>
            <span className="block font-playfair italic text-4xl sm:text-6xl md:text-7xl">Hold a table,</span>
            <span className="block text-4xl sm:text-6xl md:text-7xl tracking-[-0.05em]">or a desk.</span>
          </h2>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-12 items-start min-w-0">
          <Reveal delay={0.1} className="min-w-0">
            <div className="rounded-xl border p-6 sm:p-9 max-w-full" style={{ borderColor: ui.line, background: ui.bgSoft }}>
              {/* step rail */}
              <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
                {STEPS.map((label, i) => (
                  <div key={label} className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => i < step && setStep(i)}
                      disabled={i > step}
                      className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] disabled:cursor-default"
                      style={{ color: i === step ? brand.accent : i < step ? ui.textMuted : ui.textFaint }}
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                        style={
                          i < step
                            ? { background: brand.accent, color: brand.accentText }
                            : { border: `1px solid ${i === step ? brand.accent : ui.line}` }
                        }
                      >
                        {i < step ? <Check size={11} /> : i + 1}
                      </span>
                      {label}
                    </button>
                    {i < STEPS.length - 1 && <span className="w-5 h-px" style={{ background: ui.line }} />}
                  </div>
                ))}
              </div>

              {step === 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {BRANCHES.map((b) => {
                    const state = openState(b);
                    const selected = b.key === branchKey;
                    return (
                      <button
                        key={b.key}
                        onClick={() => setBranchKey(b.key)}
                        className="text-left rounded-xl p-5 transition-all"
                        style={{
                          border: `1px solid ${selected ? brand.accent : ui.line}`,
                          background: selected ? `${brand.accent}12` : "transparent",
                        }}
                      >
                        <p className="text-[15px] font-medium mb-1" style={{ color: ui.text }}>
                          {b.name}
                        </p>
                        <p className="text-sm mb-3" style={{ color: ui.textFaint }}>
                          {b.area}
                        </p>
                        <span className="text-[11px]" style={{ color: state.open ? brand.accent : ui.textFaint }}>
                          {state.open ? "Open now" : "Closed"} · {state.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 1 && (
                <div>
                  <p className={labelClass} style={{ color: ui.textFaint }}>
                    Date
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-7">
                    {days.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => {
                          setDate(d.value);
                          setTime("");
                        }}
                        className="shrink-0 w-[62px] rounded-xl py-3 text-center transition-all"
                        style={pillStyle(d.value === date)}
                      >
                        <span className="block text-[10px] uppercase tracking-[0.1em]">{d.weekday}</span>
                        <span className="block text-lg leading-tight">{d.day}</span>
                        <span className="block text-[10px]">{d.month}</span>
                      </button>
                    ))}
                  </div>

                  <p className={labelClass} style={{ color: ui.textFaint }}>
                    Time
                  </p>
                  {!date ? (
                    <p className="text-sm mt-2" style={{ color: ui.textFaint }}>
                      Pick a date first.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                      {RESERVATION.slots.map((slot) => {
                        const busy = busySlots.has(slot);
                        return (
                          <button
                            key={slot}
                            disabled={busy}
                            onClick={() => setTime(slot)}
                            className="rounded-lg py-2.5 text-sm transition-all disabled:cursor-not-allowed"
                            style={pillStyle(slot === time, busy)}
                            title={busy ? "Fully booked" : undefined}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="py-6 flex flex-col items-center">
                  <p className={labelClass} style={{ color: ui.textFaint }}>
                    Guests
                  </p>
                  <div className="flex items-center gap-7 mt-4">
                    <button
                      onClick={() => setParty((p) => Math.max(1, p - 1))}
                      className="w-11 h-11 rounded-full border flex items-center justify-center transition-colors"
                      style={{ borderColor: ui.line, color: ui.text }}
                      aria-label="Fewer guests"
                    >
                      <Minus size={17} />
                    </button>
                    <span className="text-5xl tabular-nums w-16 text-center" style={{ color: ui.text }}>
                      {party}
                    </span>
                    <button
                      onClick={() => setParty((p) => Math.min(RESERVATION.maxPartySize, p + 1))}
                      className="w-11 h-11 rounded-full border flex items-center justify-center transition-colors"
                      style={{ borderColor: ui.line, color: ui.text }}
                      aria-label="More guests"
                    >
                      <Plus size={17} />
                    </button>
                  </div>
                  <p className="mt-5 text-sm text-center max-w-xs" style={{ color: ui.textFaint }}>
                    Parties over {RESERVATION.maxPartySize} are handled by the branch directly. Use
                    WhatsApp at the end and the team will sort it.
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {SEATING.map((s) => {
                    const selected = s.key === seating;
                    return (
                      <button
                        key={s.key}
                        onClick={() => setSeating(s.key)}
                        className="text-left rounded-xl p-5 flex gap-4 transition-all"
                        style={{
                          border: `1px solid ${selected ? brand.accent : ui.line}`,
                          background: selected ? `${brand.accent}12` : "transparent",
                        }}
                      >
                        <span className="shrink-0 mt-0.5" style={{ color: brand.accent }}>
                          <s.icon size={20} />
                        </span>
                        <span>
                          <span className="block text-[15px] font-medium mb-1" style={{ color: ui.text }}>
                            {s.label}
                          </span>
                          <span className="block text-sm" style={{ color: ui.textFaint }}>
                            {s.note}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 4 && (
                <div className="grid gap-7">
                  <div className="grid gap-7 sm:grid-cols-2">
                    <div>
                      <label className={labelClass} style={{ color: ui.textFaint }} htmlFor="rv-name">
                        Name
                      </label>
                      <input
                        id="rv-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className={labelClass} style={{ color: ui.textFaint }} htmlFor="rv-phone">
                        Phone
                      </label>
                      <input
                        id="rv-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                        placeholder="01x xxxx xxxx"
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass} style={{ color: ui.textFaint }} htmlFor="rv-notes">
                      Anything we should know
                    </label>
                    <textarea
                      id="rv-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="High chair, birthday, quiet table, optional"
                      className={`${inputClass} resize-none`}
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 mt-9">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1.5 text-sm transition-opacity disabled:opacity-0"
                  style={{ color: ui.textMuted }}
                >
                  <ChevronLeft size={16} />
                  Back
                </button>

                <button
                  onClick={() => (step === 4 ? handleSubmit() : setStep((s) => s + 1))}
                  disabled={!canAdvance}
                  className="text-sm font-medium px-8 py-3.5 rounded-full transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ background: brand.accent, color: brand.accentText }}
                >
                  {step === 4 ? "Request table" : "Continue"}
                </button>
              </div>
            </div>
          </Reveal>

          {/* summary rail, fills in as you go */}
          <Reveal delay={0.16} className="min-w-0">
            <div
              className="rounded-xl border p-6 sm:p-7 lg:sticky lg:top-24 max-w-full"
              style={{ borderColor: ui.line, background: ui.bgSoft }}
            >
              <p className="text-[10px] uppercase tracking-[0.2em] mb-5" style={{ color: ui.textFaint }}>
                Your booking
              </p>
              <dl className="space-y-4 text-sm">
                {[
                  ["Branch", branch.area],
                  ["Date", date ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "Not set"],
                  ["Time", time || "Not set"],
                  ["Guests", String(party)],
                  ["Seating", SEATING.find((s) => s.key === seating)?.label ?? "Not set"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4">
                    <dt style={{ color: ui.textFaint }}>{k}</dt>
                    <dd className="text-right" style={{ color: v === "Not set" ? ui.textFaint : ui.text }}>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 pt-5 border-t text-xs leading-relaxed" style={{ borderColor: ui.line, color: ui.textFaint }}>
                Requests are confirmed by the branch. Demo booking, nothing is stored.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
