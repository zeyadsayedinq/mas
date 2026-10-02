import { useEffect, useMemo, useRef, useState } from "react";
import { Dices, Lock, LockOpen, RotateCcw, ArrowRight } from "lucide-react";
import Kinetic from "./Kinetic";
import { useLang } from "../i18n";
import { useMenu, type MenuHit } from "../menuLocal";
import { track } from "../track";
import type { Brand } from "../brands";
import "../styles/aroma-3d.css";

const ROWS = [-2, -1, 0, 1, 2];
const mod = (a: number, n: number) => ((a % n) + n) % n;
const easeOutQuint = (x: number) => 1 - Math.pow(1 - x, 5);

/** Stable shuffle, so neighbouring rows on a reel are not all from one category. */
function shuffle<T>(list: T[], seed: number): T[] {
  const a = [...list];
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Reel { pos: number; from: number; dist: number; t0: number; dur: number; spinning: boolean }

/**
 * "Can't decide? Spin." A three-reel slot machine over the real menu: a drink,
 * a main and something sweet. Tap a reel to keep it, spin the rest, then send
 * the picks to the reservation form as a note.
 */
export default function AromaRoulette({ brand }: { brand: Brand }) {
  const { tr, ar } = useLang();
  const { all } = useMenu();
  const ui = brand.ui;

  const reels = useMemo(() => {
    const names = (f: (h: MenuHit) => boolean, seed: number) => shuffle(all.filter(f).map((h) => h.name), seed);
    return [
      { key: "drink", label: tr("Drink", "مشروب"), items: names((h) => h.sectionKey === "beverages" && h.categoryKey !== "soft", 7) },
      { key: "main", label: tr("Main", "طبق رئيسي"), items: names((h) => h.sectionKey === "food" && ["main-course", "feteer", "burgers"].includes(h.categoryKey), 11) },
      { key: "sweet", label: tr("Something sweet", "حاجة حلوة"), items: names((h) => h.sectionKey === "dessert", 13) },
    ];
  }, [all, tr]);

  const state = useRef<Reel[]>(reels.map((_, i) => ({ pos: i * 3 + 2, from: 0, dist: 0, t0: 0, dur: 0, spinning: false })));
  const rowEls = useRef<(HTMLSpanElement | null)[][]>([[], [], []]);
  const stripEls = useRef<(HTMLDivElement | null)[]>([]);
  const winEls = useRef<(HTMLButtonElement | null)[]>([]);
  const raf = useRef(0);
  const rowH = useRef(58);
  const [locked, setLocked] = useState([false, false, false]);
  const [spinning, setSpinning] = useState(false);
  const [pulled, setPulled] = useState(false);
  const [result, setResult] = useState<string[] | null>(null);
  const [spins, setSpins] = useState(0);
  const reduce = useRef(false);

  const draw = (i: number) => {
    const r = state.current[i];
    const items = reels[i].items;
    if (!items.length) return;
    const base = Math.floor(r.pos), frac = r.pos - base;
    ROWS.forEach((k, j) => {
      const el = rowEls.current[i][j];
      if (!el) return;
      const idx = mod(base - k, items.length);
      if (el.textContent !== items[idx]) el.textContent = items[idx];
      el.parentElement!.style.transform = `translate3d(0, calc(-50% + ${((k + frac) * rowH.current).toFixed(1)}px), 0)`;
    });
  };

  const current = (i: number) => reels[i].items[mod(Math.round(state.current[i].pos), reels[i].items.length)];

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const measure = () => {
      rowH.current = window.innerWidth < 640 ? 54 : 60;
      reels.forEach((_, i) => draw(i));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => { window.removeEventListener("resize", measure); cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reels]);

  const spin = () => {
    if (spinning) return;
    const todo = reels.map((_, i) => !locked[i]);
    if (!todo.some(Boolean)) return;
    track("roulette_spin", { spin: spins + 1, kept: locked.filter(Boolean).length });
    setSpins((n) => n + 1);
    setPulled(true);
    window.setTimeout(() => setPulled(false), 380);
    setSpinning(true);
    setResult(null);
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const now = performance.now();
    let order = 0;
    reels.forEach((reel, i) => {
      if (!todo[i]) return;
      const r = state.current[i];
      const n = reel.items.length;
      const cur = mod(Math.round(r.pos), n);
      let target = Math.floor(Math.random() * n);
      if (target === cur) target = mod(target + 1 + Math.floor(n / 3), n);
      let dist = mod(target - cur, n);
      const min = 14 + order * 7;
      while (dist < min) dist += n;
      r.pos = Math.round(r.pos);
      r.from = r.pos; r.dist = dist; r.t0 = now + order * 60;
      r.dur = reduce.current ? 1 : 1150 + order * 480;
      r.spinning = true;
      order++;
    });

    const landed = new Set<number>();
    const tick = (t: number) => {
      let busy = false;
      reels.forEach((_, i) => {
        const r = state.current[i];
        if (!r.spinning) return;
        const u = Math.max(0, Math.min(1, (t - r.t0) / r.dur));
        // run past the line a touch and settle back onto it
        const settle = u > 0.8 ? Math.sin(((u - 0.8) / 0.2) * Math.PI) * 0.28 : 0;
        const prev = r.pos;
        r.pos = r.from + r.dist * easeOutQuint(u) + settle;
        const v = Math.abs(r.pos - prev) * 60; // rows per second, roughly
        const strip = stripEls.current[i];
        if (strip) {
          const b = v > 10 ? Math.min(2.5, (v - 10) * 0.06) : 0;
          const want = b > 0.2 ? `blur(${b.toFixed(1)}px)` : "";
          if (strip.style.filter !== want) strip.style.filter = want;
        }
        draw(i);
        if (u >= 1) {
          r.pos = r.from + r.dist;
          r.spinning = false;
          draw(i);
          if (strip) strip.style.filter = "";
          if (!landed.has(i)) {
            landed.add(i);
            if (coarse) navigator.vibrate?.(8);
            const w = winEls.current[i];
            if (w) { w.classList.remove("aro-land"); void w.offsetWidth; w.classList.add("aro-land"); }
          }
        } else busy = true;
      });
      if (busy) raf.current = requestAnimationFrame(tick);
      else {
        setSpinning(false);
        setResult(reels.map((_, i) => current(i)));
      }
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
  };

  const toggle = (i: number) => {
    if (spinning) return;
    setLocked((l) => l.map((v, j) => (j === i ? !v : v)));
  };

  const save = () => {
    const picks = result ?? reels.map((_, i) => current(i));
    track("roulette_save", { picks: picks.length });
    const y0 = window.scrollY;
    window.dispatchEvent(new CustomEvent("mas:prefill", { detail: { message: tr("Craving: ", "نفسي في: ") + picks.join(ar ? "، " : ", ") } }));
    // The reservation form scrolls itself into view when it hears this; if it
    // did not, go there ourselves.
    window.setTimeout(() => {
      if (Math.abs(window.scrollY - y0) < 2) document.getElementById("reserve")?.scrollIntoView({ behavior: reduce.current ? "auto" : "smooth", block: "start" });
    }, 120);
  };

  const allLocked = locked.every(Boolean);
  const join = (p: string[]) => (ar ? `${p[0]}، و${p[1]}، و${p[2]}` : `${p[0]}, ${p[1]} and ${p[2]}`);
  const dark = "#5d7a2c";

  return (
    <section id="spin" className="aro-roulette relative overflow-hidden px-5 sm:px-10 md:px-14 py-20 sm:py-28" style={{ background: ui.bgAlt }}>
      <div className="mx-auto max-w-6xl grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 lg:gap-16 items-center">
        <div>
          <h2 className="text-[40px] leading-[1.02] sm:text-6xl" style={{ color: ui.text }}>
            <Kinetic text={tr("Can't decide?", "مش عارف تختار؟")} className="font-playfair block text-[0.8em]" style={{ color: brand.accent }} />
            <Kinetic text={tr("Spin.", "لفّها.")} className="block" delay={0.2} />
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed" style={{ color: ui.textMuted }}>
            {tr(
              "A drink, a main and something sweet, straight off the menu. Tap a reel to keep it, spin the rest.",
              "مشروب وطبق رئيسي وحاجة حلوة، من المنيو على طول. دوس على أي بكرة عشان تثبّتها، ولفّ الباقي.",
            )}
          </p>

          {/* result, desktop */}
          <div className="hidden lg:block mt-8">
            {resultCard()}
          </div>
        </div>

        <div className="relative flex items-stretch gap-3 sm:gap-5">
          {/* the machine */}
          <div
            className="relative flex-1 min-w-0 rounded-[28px] p-3 sm:p-4 shadow-[0_24px_60px_-24px_rgba(60,85,20,0.55)]"
            style={{ background: `linear-gradient(160deg, ${brand.accent} 0%, ${dark} 100%)` }}
          >
            <div className="flex items-center justify-between gap-3 px-1 pb-3">
              <span className="font-playfair text-white text-[20px] sm:text-[22px] leading-none">{tr("lucky spin", "لفّة الحظ")}</span>
              <span aria-hidden className={`aro-lights flex gap-1.5 ${spinning ? "is-on" : ""}`}>
                {Array.from({ length: 7 }).map((_, i) => (
                  <span key={i} className="block w-2 h-2 rounded-full" style={{ background: i % 2 ? "#FFE9A8" : "#FFFFFF", opacity: spinning ? undefined : 0.55 }} />
                ))}
              </span>
            </div>

            <div className="relative grid grid-cols-3 gap-1.5 sm:gap-2 rounded-2xl bg-white p-1.5 sm:p-2">
              {reels.map((reel, i) => (
                <div key={reel.key} className="min-w-0">
                  <p className="text-center text-[10.5px] sm:text-[11px] uppercase tracking-[0.14em] font-semibold pt-1 pb-1.5 truncate" style={{ color: ui.textFaint }}>
                    {reel.label}
                  </p>
                  <button
                    type="button"
                    ref={(el) => { winEls.current[i] = el; }}
                    onClick={() => toggle(i)}
                    aria-pressed={locked[i]}
                    aria-label={locked[i] ? tr(`${reel.label} kept. Tap to let it spin.`, `${reel.label} متثبّت. دوس عشان يلفّ تاني.`) : tr(`Keep this ${reel.label.toLowerCase()}`, `ثبّت الـ${reel.label}`)}
                    data-cursor={locked[i] ? tr("Unlock", "فكّ") : tr("Keep", "ثبّت")}
                    className="aro-reel block w-full rounded-xl transition-colors"
                    style={{
                      height: "calc(var(--aro-row, 58px) * 2.6)",
                      background: locked[i] ? `${brand.accent}1c` : "#F7F8F4",
                      boxShadow: locked[i] ? `inset 0 0 0 2px ${brand.accent}` : `inset 0 0 0 1px ${ui.line}`,
                    }}
                  >
                    <div ref={(el) => { stripEls.current[i] = el; }} className="absolute inset-0" aria-hidden>
                      {ROWS.map((k, j) => (
                        <div key={k} className="aro-reel-row px-1.5 sm:px-2" style={{ height: "var(--aro-row, 58px)" }}>
                          <span
                            ref={(el) => { rowEls.current[i][j] = el; }}
                            className="block text-[12.5px] sm:text-[14px] font-semibold leading-tight line-clamp-2"
                            style={{ color: ui.text }}
                          />
                        </div>
                      ))}
                    </div>
                    <span aria-hidden className="absolute inset-x-1 top-1/2 -translate-y-1/2 rounded-lg border-y-2 pointer-events-none" style={{ height: "var(--aro-row, 58px)", borderColor: `${brand.accent}40` }} />
                    <span aria-hidden className="aro-reel-mask rounded-xl" style={{ background: `linear-gradient(${locked[i] ? "#eef3e4" : "#F7F8F4"} 0%, transparent 30%, transparent 70%, ${locked[i] ? "#eef3e4" : "#F7F8F4"} 100%)` }} />
                    <span
                      aria-hidden
                      className="absolute top-1 end-1 z-10 grid place-items-center w-5 h-5 rounded-full transition-all"
                      style={{ background: locked[i] ? brand.accent : "transparent", color: locked[i] ? "#fff" : ui.textFaint, opacity: locked[i] ? 1 : 0.55 }}
                    >
                      {locked[i] ? <Lock size={11} /> : <LockOpen size={11} />}
                    </span>
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={spin}
              disabled={spinning || allLocked}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-[15px] font-semibold transition-transform active:scale-[0.97] hover:scale-[1.01] disabled:opacity-70"
              style={{ color: dark }}
            >
              <Dices size={18} aria-hidden className={spinning ? "animate-spin" : ""} />
              {allLocked ? tr("Unlock a reel to spin", "فكّ بكرة عشان تلفّ") : spins ? tr("Spin again", "لفّ تاني") : tr("Spin", "لفّ")}
            </button>
          </div>

          {/* the lever */}
          <button
            type="button"
            onClick={spin}
            disabled={spinning || allLocked}
            aria-label={tr("Pull the lever to spin", "اسحب الذراع عشان تلفّ")}
            data-cursor={tr("Pull", "اسحب")}
            className={`aro-lever hidden sm:flex relative w-14 shrink-0 flex-col items-center justify-center ${pulled ? "is-pulled" : ""}`}
          >
            <span aria-hidden className="relative block h-[62%] w-full">
              <span className="aro-lever-arm absolute left-1/2 -translate-x-1/2 bottom-1/2 flex flex-col items-center" style={{ height: "50%" }}>
                <span className="block w-9 h-9 rounded-full shadow-md" style={{ background: "radial-gradient(circle at 35% 30%, #fff 0%, #FFE9A8 35%, #E9B949 100%)" }} />
                <span className="block w-2 flex-1 rounded-full" style={{ background: "linear-gradient(90deg,#c9ccc4,#f3f4f1,#b9bcb4)" }} />
              </span>
              <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-6 h-12 rounded-full" style={{ background: dark }} />
            </span>
          </button>
        </div>

        {/* result, phone and tablet */}
        <div className="lg:hidden -mt-2">
          {resultCard()}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {result ? tr(`Your table: ${join(result)}.`, `ترابيزتك: ${join(result)}.`) : ""}
      </p>
    </section>
  );

  function resultCard() {
    if (!result) {
      return (
        <p className="font-playfair text-[22px]" style={{ color: ui.textFaint }}>
          {spinning ? tr("rolling…", "بتلفّ…") : tr("hit spin and see what lands", "دوس لفّ وشوف هيطلعلك إيه")}
        </p>
      );
    }
    return (
      <div key={spins} className="aro-result rounded-3xl bg-white p-5 sm:p-6 shadow-[0_18px_50px_-30px_rgba(35,48,26,0.45)]" style={{ border: `1px solid ${ui.line}` }}>
        <p className="text-[11px] uppercase tracking-[0.2em] font-semibold" style={{ color: brand.accent }}>{tr("Your table", "ترابيزتك")}</p>
        <ul className="mt-3 grid gap-2">
          {result.map((r, i) => (
            <li key={i} className="flex items-baseline gap-3">
              <span className="w-24 shrink-0 text-[12px]" style={{ color: ui.textFaint }}>{reels[i].label}</span>
              <span className="text-[16px] font-semibold" style={{ color: ui.text }}>{r}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={save}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform hover:scale-[1.03] active:scale-95"
            style={{ background: brand.accent, color: brand.accentText }}
          >
            {tr("Save to my table", "احفظها لترابيزتي")}
            <ArrowRight size={15} aria-hidden className="rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            onClick={spin}
            disabled={spinning || allLocked}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium border transition-colors disabled:opacity-50"
            style={{ borderColor: `${brand.accent}88`, color: ui.text }}
          >
            <RotateCcw size={15} aria-hidden />
            {tr("Spin again", "لفّ تاني")}
          </button>
        </div>
      </div>
    );
  }
}
