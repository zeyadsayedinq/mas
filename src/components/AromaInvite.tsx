import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Minus, Plus, Check, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import Kinetic from "./Kinetic";
import TiltCard from "./TiltCard";
import InviteActions from "./InviteActions";
import { useLang } from "../i18n";
import { useBranches } from "../localize";
import { track } from "../track";
import { dayLabel, inviteUrl, isoDay, readInvite, whatsappLink, type InviteData } from "../invite/core";
import { AROMA_PLANS, AROMA_TIMES, aromaCopy, drawAromaCard, planLabel, type AromaPlan } from "../invite/aromaCard";
import type { Brand } from "../brands";
import "../styles/invite.css";

/**
 * "Bring someone": pick what you are up for, the branch, the day and the
 * time, add a name, and the page writes an Aroma invitation. The card on the
 * right is the actual image that gets sent, redrawn as the choices change. It
 * goes out through the phone's share menu (WhatsApp, Instagram, Messages,
 * Snapchat), as a WhatsApp link, as a saved picture or as a copied link, and
 * whoever opens the link lands on the same card.
 */
export default function AromaInvite({ brand, defaultBranch }: { brand: Brand; defaultBranch?: string }) {
  const ui = brand.ui;
  const { tr, ar } = useLang();
  const branches = useBranches();
  const short = (name: string) => name.replace(/^Aroma Lounge\s+|^أروما لاونج\s+/, "");

  const [plan, setPlan] = useState<AromaPlan>("coffee");
  const [branch, setBranch] = useState(defaultBranch && branches.some((b) => b.key === defaultBranch) ? defaultBranch : branches[0].key);
  const [day, setDay] = useState(() => isoDay(0));
  const [time, setTime] = useState<string>("17:00");
  const [people, setPeople] = useState(2);
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [received, setReceived] = useState(false);

  const box = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const [image, setImage] = useState<Promise<Blob> | null>(null);

  const branchName = short(branches.find((b) => b.key === branch)?.name ?? "");
  const data: InviteData = useMemo(
    () => ({ b: "aroma", m: plan, g: people, a: time, d: day, br: branch, to: to.trim() || undefined, from: from.trim() || undefined }),
    [plan, people, time, day, branch, to, from],
  );
  const copy = useMemo(() => aromaCopy(data, ar, branchName), [data, ar, branchName]);

  // An invitation link opens straight onto its card.
  useEffect(() => {
    const inv = readInvite("aroma");
    if (!inv) return;
    if (AROMA_PLANS.includes(inv.m as AromaPlan)) setPlan(inv.m as AromaPlan);
    if (inv.br && branches.some((b) => b.key === inv.br)) setBranch(inv.br);
    if (inv.d) setDay(inv.d);
    if (inv.a) setTime(inv.a);
    setPeople(inv.g ?? 2);
    setTo(inv.to ?? "");
    setFrom(inv.from ?? "");
    setReceived(true);
    setNear(true);
    track("invite_open", { brand: "aroma" });
    const t = window.setTimeout(() => document.getElementById("invite")?.scrollIntoView({ block: "start" }), 600);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Nothing is drawn until the section is close.
  useEffect(() => {
    const el = box.current;
    if (!el || near) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: "500px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  // Redraw the card a moment after the choices settle.
  useEffect(() => {
    if (!near) return;
    let dead = false;
    const t = window.setTimeout(() => {
      const p = drawAromaCard(data, ar, branchName);
      setImage(p);
      p.then((blob) => {
        if (dead) return;
        setSrc((old) => {
          if (old) URL.revokeObjectURL(old);
          return URL.createObjectURL(blob);
        });
      }).catch(() => {});
    }, 140);
    return () => { dead = true; window.clearTimeout(t); };
  }, [near, data, ar, branchName]);
  useEffect(() => () => { if (src) URL.revokeObjectURL(src); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const makeOwn = () => {
    setReceived(false);
    setTo("");
    setFrom("");
    if (window.location.hash.includes("invite=")) window.history.replaceState(null, "", window.location.pathname + window.location.search);
  };
  const reserve = () => {
    window.dispatchEvent(new CustomEvent("mas:prefill", { detail: { branch, message: `${copy.title} ${dayLabel(day, ar, false)}, ${time}, ${people}` } }));
    document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth", block: "start" });
    track("invite_reserve", { brand: "aroma" });
  };

  const dayText = dayLabel(day, ar, false);
  const yesText = from
    ? tr(`I'm in, ${from}. Aroma Lounge ${branchName}, ${dayText} at ${time}.`, `جاي يا ${from}. أروما لاونج ${branchName}، ${dayText} الساعة ${time}.`)
    : tr(`I'm in. Aroma Lounge ${branchName}, ${dayText} at ${time}.`, `جاي. أروما لاونج ${branchName}، ${dayText} الساعة ${time}.`);

  const chip = (on: boolean): CSSProperties => ({
    background: on ? brand.accent : "#FFFFFF",
    color: on ? brand.accentText : ui.text,
    borderColor: on ? brand.accent : ui.line,
  });
  const label = "block text-[11px] uppercase tracking-[0.18em] mb-3 font-semibold";
  const other = day !== isoDay(0) && day !== isoDay(1);

  return (
    <section ref={box} id="invite" className="relative px-5 sm:px-10 md:px-14 py-20 sm:py-28 overflow-hidden scroll-mt-16" style={{ background: ui.bgAlt }}>
      <div className="mx-auto max-w-6xl grid gap-12 lg:gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-start">
        <div>
          <h2 className="text-[40px] leading-[1.04] sm:text-6xl" style={{ color: ui.text }}>
            <Kinetic key={received ? "r1" : "b1"} text={received ? (to ? `${to},` : tr("Hey,", "أهلاً،")) : tr("Bring someone.", "هات حد معاك.")} className="font-playfair block text-[0.8em]" style={{ color: brand.accent }} />
            <Kinetic key={received ? "r2" : "b2"} text={received ? tr("you're invited.", "إنت معزوم.") : tr("Send them an invitation.", "ابعتله عزومة.")} className="block" delay={0.2} />
          </h2>
          <Reveal delay={0.08}>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed" style={{ color: ui.textMuted }}>
              {received
                ? from
                  ? tr(`${from} wants you at Aroma. The card has the details.`, `${from} عايزك في أروما. التفاصيل في الكارت.`)
                  : tr("Someone wants you at Aroma. The card has the details.", "في حد عايزك في أروما. التفاصيل في الكارت.")
                : tr(
                    "Pick the plan, add a name, and send the card on WhatsApp, Instagram, Messages or Snapchat. Or just save it as an image.",
                    "اختار الخروجة، اكتب الاسم، وابعت الكارت على واتساب أو إنستجرام أو الرسايل أو سناب شات. أو احفظه صورة.",
                  )}
            </p>
          </Reveal>

          {received ? (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={whatsappLink(yesText, "")}
                target="_blank"
                rel="noreferrer"
                onClick={() => track("invite_yes", { brand: "aroma" })}
                className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium px-7 py-3 rounded-full transition-transform hover:scale-[1.03] active:scale-95"
                style={{ background: brand.accent, color: brand.accentText }}
              >
                <Check size={15} />
                {tr("Say yes on WhatsApp", "قول جاي على واتساب")}
              </a>
              <button type="button" onClick={makeOwn} className="min-h-[44px] inline-flex items-center text-sm font-medium px-6 py-3 rounded-full border bg-white" style={{ borderColor: ui.line, color: ui.text }}>
                {tr("Make one of your own", "اعمل عزومتك إنت")}
              </button>
            </div>
          ) : (
            <Reveal delay={0.12}>
              <div className="mt-9 grid gap-7">
                <div role="group" aria-labelledby="ai-plan">
                  <span id="ai-plan" className={label} style={{ color: ui.textMuted }}>{tr("The plan", "الخروجة")}</span>
                  <div className="flex flex-wrap gap-2">
                    {AROMA_PLANS.map((p) => (
                      <button key={p} type="button" aria-pressed={plan === p} onClick={() => setPlan(p)} className="ai-chip min-h-[44px] px-4 rounded-full border text-sm" style={chip(plan === p)}>
                        {planLabel(p, ar)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-10 gap-y-7">
                  <div role="group" aria-labelledby="ai-branch">
                    <span id="ai-branch" className={label} style={{ color: ui.textMuted }}>{tr("Where", "فين")}</span>
                    <div className="flex flex-wrap gap-2">
                      {branches.map((b) => (
                        <button key={b.key} type="button" aria-pressed={branch === b.key} onClick={() => setBranch(b.key)} className="ai-chip min-h-[44px] px-4 rounded-full border text-sm" style={chip(branch === b.key)}>
                          {short(b.name)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div role="group" aria-labelledby="ai-day">
                    <span id="ai-day" className={label} style={{ color: ui.textMuted }}>{tr("When", "إمتى")}</span>
                    <div className="flex flex-wrap gap-2">
                      {[0, 1].map((off) => (
                        <button key={off} type="button" aria-pressed={day === isoDay(off)} onClick={() => setDay(isoDay(off))} className="ai-chip min-h-[44px] px-4 rounded-full border text-sm" style={chip(day === isoDay(off))}>
                          {off === 0 ? tr("Today", "النهارده") : tr("Tomorrow", "بكرة")}
                        </button>
                      ))}
                      <label className="ai-chip relative min-h-[44px] inline-flex items-center px-4 rounded-full border text-sm cursor-pointer" style={chip(other)}>
                        <span>{other ? dayText : tr("Another day", "يوم تاني")}</span>
                        <input type="date" min={isoDay(0)} value={day} onChange={(e) => e.target.value && setDay(e.target.value)} aria-label={tr("Pick a date", "اختار التاريخ")} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-10 gap-y-7">
                  <div role="group" aria-labelledby="ai-time">
                    <span id="ai-time" className={label} style={{ color: ui.textMuted }}>{tr("What time", "الساعة كام")}</span>
                    <div className="flex flex-wrap gap-2">
                      {AROMA_TIMES.map((t) => (
                        <button key={t} type="button" aria-pressed={time === t} onClick={() => setTime(t)} className="ai-chip min-h-[44px] min-w-[60px] px-3.5 rounded-full border text-sm tabular-nums" style={chip(time === t)}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div role="group" aria-labelledby="ai-people">
                    <span id="ai-people" className={label} style={{ color: ui.textMuted }}>{tr("How many", "كام واحد")}</span>
                    <div className="inline-flex items-center rounded-full border bg-white" style={{ borderColor: ui.line }}>
                      <button type="button" onClick={() => setPeople((n) => Math.max(1, n - 1))} disabled={people <= 1} aria-label={tr("One fewer", "واحد أقل")} className="h-11 w-11 grid place-items-center rounded-full disabled:opacity-30" style={{ color: ui.text }}>
                        <Minus size={16} />
                      </button>
                      <span className="min-w-[44px] text-center text-sm tabular-nums" style={{ color: ui.text }} aria-live="polite">{people}</span>
                      <button type="button" onClick={() => setPeople((n) => Math.min(12, n + 1))} disabled={people >= 12} aria-label={tr("One more", "واحد كمان")} className="h-11 w-11 grid place-items-center rounded-full disabled:opacity-30" style={{ color: ui.text }}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 max-w-lg">
                  <label className="block">
                    <span className={label} style={{ color: ui.textMuted }}>{tr("Who is it for", "لمين")}</span>
                    <input value={to} onChange={(e) => setTo(e.target.value.slice(0, 24))} placeholder={tr("Their name (optional)", "الاسم (اختياري)")} autoComplete="off" className="w-full bg-white border rounded-full px-4 py-2.5 text-[15px] outline-none" style={{ borderColor: ui.line, color: ui.text }} />
                  </label>
                  <label className="block">
                    <span className={label} style={{ color: ui.textMuted }}>{tr("From", "من")}</span>
                    <input value={from} onChange={(e) => setFrom(e.target.value.slice(0, 24))} placeholder={tr("Your name (optional)", "اسمك (اختياري)")} autoComplete="given-name" className="w-full bg-white border rounded-full px-4 py-2.5 text-[15px] outline-none" style={{ borderColor: ui.line, color: ui.text }} />
                  </label>
                </div>
              </div>
            </Reveal>
          )}
        </div>

        {/* The card: exactly the image that gets sent. */}
        <Reveal delay={0.1}>
          <div className="mx-auto w-full max-w-[400px]">
            <TiltCard>
              <div className="ai-card relative rounded-[22px] overflow-hidden bg-white" style={{ aspectRatio: "4 / 5", boxShadow: "0 30px 60px -32px rgba(35,48,26,.45)", border: `1px solid ${ui.line}` }}>
                {src ? (
                  <img key={src} src={src} alt={`${copy.title} ${copy.meta.join(", ")}`} className="ai-pop absolute inset-0 h-full w-full" width={1080} height={1350} />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-sm" style={{ color: ui.textFaint }}>
                    {tr("Writing your card…", "بنكتب الكارت…")}
                  </div>
                )}
              </div>
            </TiltCard>
            <div className="mt-6">
              <InviteActions
                brand="aroma"
                image={image}
                fileName="aroma-invitation.png"
                text={copy.shareText}
                url={inviteUrl(data)}
                colors={{ solidBg: brand.accent, solidFg: brand.accentText, line: ui.line, fg: ui.text, muted: ui.textMuted }}
              />
              {!received && (
                <div className="mt-4 text-center">
                  <button type="button" onClick={reserve} className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4" style={{ color: ui.text }}>
                    {tr("Reserve the table too", "احجز الترابيزة كمان")}
                    <ArrowRight size={15} className="rtl:-scale-x-100" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
