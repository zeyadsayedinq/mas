import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import Kinetic from "./Kinetic";
import Sparkle from "./Sparkle";
import { sendToCovy } from "./CovyEvening";
import { useLang } from "../i18n";
import { track } from "../track";
import type { Brand } from "../brands";
import "../styles/covy.css";

interface CovyMenuProps {
  brand: Brand;
}

const NAVY = "#262D3F";
const MOCHA = "#765F4D";
const GLOW = "#F4EFEB";

/**
 * COVY's menu is not published yet, so the section is a sealed envelope.
 * Break the seal and the flap lifts, a card rises and a single line types
 * itself out. No dishes, no prices; just the honest state of things and a
 * way to hear when it is ready. Swap this for the real menu once it exists.
 */
export default function CovyMenu({ brand }: CovyMenuProps) {
  const ui = brand.ui;
  const { tr } = useLang();
  const line = tr("The menu is being written.", "المنيو قيد الكتابة.");
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!open) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(line.length);
      return;
    }
    setTyped(0);
    let i = 0;
    let timer = 0;
    const step = () => {
      i += 1;
      setTyped(i);
      if (i < line.length) timer = window.setTimeout(step, line[i - 1] === " " ? 120 : 62 + Math.random() * 50);
    };
    timer = window.setTimeout(step, 1300);
    return () => window.clearTimeout(timer);
  }, [open, line]);

  const done = typed >= line.length;

  const unseal = () => {
    if (open) return;
    setOpen(true);
    track("menu_open", { brand: "covy" });
  };

  const notify = () => {
    track("menu_notify", { brand: "covy" });
    sendToCovy(
      [tr("Hello COVY,", "مرحبًا كوفي،"), tr("Please let me know when the menu is out.", "أرجو إبلاغي حين يصدر المنيو.")].join("\n"),
    );
  };

  return (
    <section id="menu" className="relative overflow-hidden py-24 sm:py-32" style={{ background: ui.bg }}>
      <div className="mx-auto max-w-3xl px-5 sm:px-10 md:px-14 text-center">
        <Reveal>
          <p className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color: brand.accent }}>
            <Sparkle size={10} color={brand.accent} />
            {tr("The menu", "المنيو")}
          </p>
        </Reveal>
        <h2 className="leading-[1.04] tracking-[-0.03em]" style={{ color: ui.text }}>
          <Kinetic variant="curtain" stagger={0.05} text={tr("Still under", "ما زال")} className="block font-playfair italic text-4xl sm:text-5xl md:text-6xl" />
          <Kinetic variant="curtain" stagger={0.05} delay={0.18} text={tr("seal.", "مختومًا.")} className="block text-4xl sm:text-5xl md:text-6xl tracking-[-0.045em]" />
        </h2>
        <Reveal delay={0.08}>
          <p className="mt-6 mx-auto max-w-md text-[15px] leading-relaxed" style={{ color: ui.textMuted }}>
            {tr(
              "Nothing goes on the page until it is right. Until then, the floor team will tell you what the kitchen is making tonight.",
              "لا شيء يُنشر قبل أن يكتمل. وحتى ذلك الحين، سيخبرك فريق الصالة بما يحضّره المطبخ الليلة.",
            )}
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="relative mx-auto mt-32 sm:mt-44 w-full max-w-[460px]" dir="ltr">
            <div className={`cv-env ${open ? "is-open" : ""}`}>
              <div
                className="cv-env-back"
                style={{ background: `linear-gradient(180deg, #1d2231, ${NAVY})`, boxShadow: "0 40px 60px -34px rgba(38,45,63,.7)" }}
              />

              {/* The card inside. Only its top half ever leaves the envelope. */}
              <div className="cv-letter px-6 pt-6 sm:pt-7 text-center" style={{ background: GLOW, boxShadow: "0 -6px 20px -12px rgba(38,45,63,.4)" }}>
                <div className="absolute inset-2 rounded-[4px] border pointer-events-none" style={{ borderColor: "rgba(118,95,77,.28)" }} />
                <p className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.34em]" style={{ color: MOCHA }}>
                  <Sparkle size={8} color={MOCHA} />
                  {tr("COVY", "كوفي")}
                  <Sparkle size={8} color={MOCHA} />
                </p>
                <p
                  className="mt-3 font-playfair italic text-[22px] sm:text-[26px] leading-snug min-h-[2.6em]"
                  style={{ color: NAVY }}
                  dir="auto"
                  aria-live="polite"
                >
                  <span className="sr-only">{open ? line : ""}</span>
                  <span aria-hidden>
                    {open ? line.slice(0, typed) : ""}
                    {open && !done && <span className="cv-caret" />}
                  </span>
                </p>
              </div>

              <div className="cv-env-pocket" style={{ background: "#2F3649" }}>
                <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                  <path d="M0,0 L50,50 L100,0" fill="none" stroke="rgba(220,212,207,.18)" strokeWidth=".4" vectorEffect="non-scaling-stroke" />
                  <path d="M0,100 L42,50 M100,100 L58,50" fill="none" stroke="rgba(38,45,63,.5)" strokeWidth=".6" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              <div className="cv-env-flap" style={{ background: "#39425A" }}>
                <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                  <path d="M0,0 L50,100 L100,0" fill="none" stroke="rgba(220,212,207,.22)" strokeWidth=".5" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>

              <button
                type="button"
                onClick={unseal}
                aria-label={tr("Break the seal and open the envelope", "افتح الختم والظرف")}
                aria-expanded={open}
                className="cv-seal grid place-items-center"
                tabIndex={open ? -1 : 0}
              >
                <span
                  className="cv-seal-pulse grid place-items-center w-16 h-16 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, #8a7160, ${MOCHA} 55%, #5f4c3e)`,
                    boxShadow: "0 6px 14px -4px rgba(0,0,0,.45), inset 0 0 0 3px rgba(95,76,62,.9), inset 0 0 0 5px rgba(220,212,207,.18)",
                  }}
                >
                  <Sparkle size={22} color="#DCD4CF" />
                </span>
              </button>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 min-h-[52px] flex items-center justify-center">
          {!open ? (
            <p className="text-[11px] uppercase tracking-[0.26em]" style={{ color: ui.textMuted }} aria-hidden>
              {tr("Break the seal", "افتح الختم")}
            </p>
          ) : (
            <button
              onClick={notify}
              className={`min-h-[44px] inline-flex items-center gap-2 text-sm font-medium px-7 py-3 rounded-full transition-[opacity,transform] duration-700 hover:scale-[1.03] active:scale-95 ${done ? "opacity-100" : "opacity-0 translate-y-2 pointer-events-none"}`}
              style={{ background: brand.accent, color: brand.accentText }}
              tabIndex={done ? 0 : -1}
            >
              {tr("Tell me when it's ready", "أخبروني حين يصدر")}
              <ArrowRight size={15} className="rtl:-scale-x-100" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
