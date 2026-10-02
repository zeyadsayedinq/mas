import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Beef, ChefHat, Citrus, Coffee, Croissant, Flame, Hand, Leaf, Share2, Sun, Fish } from "lucide-react";
import { Story3D } from "./Aroma3D";
import { CoffeeCup, Feteer, Ribeye } from "./ProductArt";
import { useLang } from "../i18n";
import { useMenu } from "../menuLocal";
import { MENU } from "../menu";
import { track } from "../track";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { Brand } from "../brands";
import "../styles/aroma-3d.css";

type Tr = (en: string, ar: string) => string;

interface StageDef {
  key: "drinks" | "grill" | "feteer";
  rail: [string, string];
  accent: [string, string];
  head: [string, string];
  chips: { icon: ReactNode; label: [string, string] }[];
  /** Real menu items, by their English names, so the Arabic follows the same entry. */
  picks: { section: string; category: string; name: string }[];
  menu: { section: string; category: string; label: [string, string] };
  tint: string;
}

const STAGES: StageDef[] = [
  {
    key: "drinks",
    rail: ["Drinks", "المشروبات"],
    accent: ["From the bar,", "من البار،"],
    head: ["poured to order, hot or iced.", "بتتعمل على طلبك، سخنة أو ساقعة."],
    chips: [
      { icon: <Coffee size={15} />, label: ["Lavazza espresso, pulled to order", "إسبريسو لافاتسا، بيتعمل على طلبك"] },
      { icon: <Citrus size={15} />, label: ["Fresh juice and smoothies", "عصاير فريش وسموذي"] },
      { icon: <Leaf size={15} />, label: ["Matcha, frappe and shakes", "ماتشا وفرابيه وميلك شيك"] },
      { icon: <Sun size={15} />, label: ["Hot or iced, all day", "سخن أو ساقع، طول اليوم"] },
    ],
    picks: [
      { section: "beverages", category: "hot", name: "Spanish Latte" },
      { section: "beverages", category: "cold", name: "Iced Spanish Latte" },
      { section: "beverages", category: "juices", name: "Fresh Orange Juice" },
    ],
    menu: { section: "beverages", category: "hot", label: ["See the drinks menu", "شوف منيو المشروبات"] },
    tint: "#82A541",
  },
  {
    key: "grill",
    rail: ["Grill", "المشويات"],
    accent: ["Off the grill,", "من على الشواية،"],
    head: ["Angus rib eye, done properly.", "ريب آي أنجوس، متسوّي صح."],
    chips: [
      { icon: <Beef size={15} />, label: ["Premium Angus rib eye and brisket", "ريب آي وبريسكت أنجوس"] },
      { icon: <Flame size={15} />, label: ["Grilled to order", "بيتشوي على طلبك"] },
      { icon: <ChefHat size={15} />, label: ["Fillet, osso buco, stroganoff", "فيليه وأوسوبوكو وستروجانوف"] },
      { icon: <Fish size={15} />, label: ["Chicken, salmon and seafood too", "وفراخ وسلمون وسي فود كمان"] },
    ],
    picks: [
      { section: "food", category: "main-course", name: "Aroma Rib Eye Steak" },
      { section: "food", category: "main-course", name: "Smoked Angus Brisket" },
      { section: "food", category: "main-course", name: "Aroma Beef Fillet" },
    ],
    menu: { section: "food", category: "main-course", label: ["See the grill menu", "شوف منيو المشويات"] },
    tint: "#C9824A",
  },
  {
    key: "feteer",
    rail: ["Feteer", "الفطير"],
    accent: ["From the feteer counter,", "من ركن الفطير،"],
    head: ["folded by hand, straight from the oven.", "مطبّق بالإيد، وطالع من الفرن على طول."],
    chips: [
      { icon: <Hand size={15} />, label: ["Layered and folded by hand", "طبقات مطبّقة بالإيد"] },
      { icon: <Croissant size={15} />, label: ["Sweet or savoury", "حلو أو حادق"] },
      { icon: <Flame size={15} />, label: ["Straight from the oven", "من الفرن على طول"] },
      { icon: <Share2 size={15} />, label: ["Cut to share", "متقطّع للمشاركة"] },
    ],
    picks: [
      { section: "food", category: "feteer", name: "Meshaltet" },
      { section: "food", category: "feteer", name: "Mix Cheese Feteer" },
      { section: "food", category: "feteer", name: "Nutella Marshmallow Feteer" },
    ],
    menu: { section: "food", category: "feteer", label: ["See the feteer menu", "شوف منيو الفطير"] },
    tint: "#D9A441",
  },
];

/** Hero pieces map onto the stages. */
export const STAGE_OF: Record<string, number> = { iced: 0, cup: 0, juice: 0, steak: 1, feteer: 2 };

/** Ask the story to scroll to a stage (the hero uses this). */
export function goToStage(stage: number) {
  window.dispatchEvent(new CustomEvent("aroma:story", { detail: { stage } }));
}

/** Plateau between stages so each one holds still while you read it. */
function hold(raw: number) {
  const s = Math.max(0, Math.min(2, raw));
  const a = Math.floor(s), f = s - a;
  const e = Math.max(0, Math.min(1, (f - 0.28) / 0.44));
  return a + e * e * (3 - 2 * e);
}

function Words({ text, on, base = 0 }: { text: string; on: boolean; base?: number }) {
  const parts = text.split(/(\s+)/);
  let n = 0;
  return (
    <span className={`aro-words ${on ? "is-on" : ""}`} aria-hidden>
      {parts.map((w, i) =>
        /^\s+$/.test(w) ? " " : (
          <span key={i} className="aro-wm"><span className="aro-w" style={{ transitionDelay: `${base + n++ * 0.05}s` }}>{w}</span></span>
        ),
      )}
    </span>
  );
}

function ArtFor({ i, accent }: { i: number; accent: string }) {
  const cls = "w-full h-full object-contain";
  return i === 0 ? <CoffeeCup accent={accent} className={cls} /> : i === 1 ? <Ribeye accent={accent} className={cls} /> : <Feteer accent={accent} className={cls} />;
}

/**
 * One pinned scroll story for the whole kitchen: drinks, then the grill, then
 * feteer, with a single WebGL canvas that carries the models from one stage
 * to the next. Replaces three back-to-back pinned showcases.
 */
export default function AromaStory({ brand }: { brand: Brand }) {
  const { tr, ar } = useLang();
  const { menu } = useMenu();
  const ui = brand.ui;
  const sec = useRef<HTMLElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const raw = useRef(0);
  const [active, setActive] = useState(0);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const wide = useMediaQuery("(min-width: 1024px)");
  const focus = useMemo(() => (wide ? { x: ar ? 0.27 : 0.73, w: 0.5 } : { x: 0.5, w: 1 }), [wide, ar]);

  // Real items, looked up by English name and read from the localised menu.
  const picks = useMemo(
    () =>
      STAGES.map((st) =>
        st.picks.map((pk) => {
          const sIdx = MENU.findIndex((s) => s.key === pk.section);
          const cIdx = MENU[sIdx]?.categories.findIndex((c) => c.key === pk.category) ?? -1;
          const iIdx = Math.max(0, MENU[sIdx]?.categories[cIdx]?.items.findIndex((it) => it.name === pk.name) ?? 0);
          const cat = menu[sIdx]?.categories[cIdx];
          const item = cat?.items[iIdx];
          return item ? { name: item.name, description: item.description, category: cat.label } : null;
        }).filter(Boolean) as { name: string; description?: string; category: string }[],
      ),
    [menu],
  );

  // Scroll drives the story. One rAF-throttled listener, only while the
  // section is near the viewport.
  useEffect(() => {
    if (reduce) return;
    const el = sec.current;
    if (!el) return;
    let ticking = false, near = false;
    const measure = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      const p = Math.max(0, Math.min(1, -r.top / span));
      raw.current = p;
      if (fill.current) fill.current.style.transform = `scaleX(${p})`;
      setActive(Math.min(2, Math.floor(p * 3)));
    };
    const onScroll = () => { if (near && !ticking) { ticking = true; requestAnimationFrame(measure); } };
    const io = new IntersectionObserver(([e]) => { near = e.isIntersecting; if (near) measure(); }, { rootMargin: "200px 0px" });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [reduce]);

  const jump = useCallback((i: number) => {
    const el = sec.current;
    if (!el) return;
    if (reduce) { document.getElementById(`story-${STAGES[i].key}`)?.scrollIntoView({ block: "start" }); return; }
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * ((i + 0.5) / 3), behavior: "smooth" });
  }, [reduce]);

  useEffect(() => {
    const on = (e: Event) => {
      const st = (e as CustomEvent<{ stage: number }>).detail?.stage;
      if (typeof st === "number") jump(st);
    };
    window.addEventListener("aroma:story", on);
    return () => window.removeEventListener("aroma:story", on);
  }, [jump]);

  const getStage = useCallback(() => hold(raw.current * 3 - 0.5), []);

  const openMenu = (st: StageDef) => {
    track("menu_open", { section: st.menu.section, category: st.menu.category, from: "story" });
    const y = window.scrollY;
    window.dispatchEvent(new CustomEvent("aroma:menu", { detail: { section: st.menu.section, category: st.menu.category } }));
    // If nothing picked the event up and moved the page, go to the menu ourselves.
    window.setTimeout(() => {
      if (Math.abs(window.scrollY - y) < 2) document.getElementById("menu")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }, 120);
  };

  const stageText = (st: StageDef, i: number, on: boolean, tr: Tr) => (
    <div
      key={st.key}
      id={reduce ? `story-${st.key}` : undefined}
      className={`aro-stage ${on ? "is-on" : ""}`}
      aria-hidden={!on}
      {...(!on ? { inert: true } : {})}
    >
      <h2 className="text-[29px] leading-[1.06] sm:text-5xl lg:text-[3.4rem] lg:leading-[1.02]" style={{ color: ui.text }}>
        <span className="font-playfair block text-[0.82em] mb-1" style={{ color: brand.accent }}>
          <Words text={tr(...st.accent)} on={on} />
        </span>
        <span className="block"><Words text={tr(...st.head)} on={on} base={0.12} /></span>
        <span className="sr-only">{tr(...st.accent)} {tr(...st.head)}</span>
      </h2>

      <ul className="aro-chips no-scrollbar mt-4 sm:mt-5 flex flex-nowrap sm:flex-wrap gap-2 overflow-x-auto sm:overflow-visible -mx-5 px-5 sm:mx-0 sm:px-0 py-1" aria-label={tr("What to expect", "هتلاقي إيه")}>
        {st.chips.map((c, k) => (
          <li
            key={k}
            className="aro-chip shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] sm:text-[13px] font-medium"
            style={{ transitionDelay: on ? `${0.25 + k * 0.07}s` : "0s", background: `${brand.accent}14`, color: ui.text, border: `1px solid ${brand.accent}33` }}
          >
            <span aria-hidden style={{ color: brand.accent }}>{c.icon}</span>
            {tr(...c.label)}
          </li>
        ))}
      </ul>

      <p className="aro-picks-inline lg:hidden mt-4 text-[13.5px] leading-snug" style={{ color: ui.textMuted }}>
        <span className="font-semibold" style={{ color: brand.accent }}>{tr("On the menu: ", "في المنيو: ")}</span>
        {picks[i].map((it) => it.name).join(" · ")}
      </p>

      <ol className="aro-picks hidden lg:grid mt-6 gap-2" aria-label={tr("From the menu", "من المنيو")}>
        {picks[i].map((it, k) => (
          <li
            key={it.name}
            className="aro-pick flex items-baseline gap-3 border-b pb-2"
            style={{ borderColor: ui.line, transitionDelay: on ? `${0.45 + k * 0.08}s` : "0s" }}
          >
            <span className="text-[11px] tabular-nums" style={{ color: ui.textFaint }}>0{k + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold truncate" style={{ color: ui.text }}>{it.name}</span>
              {it.description && <span className="hidden lg:block text-[12.5px] truncate" style={{ color: ui.textMuted }}>{it.description}</span>}
            </span>
            <span className="shrink-0 text-[11px]" style={{ color: ui.textFaint }}>{it.category}</span>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={() => openMenu(st)}
        className="aro-cta group mt-5 lg:mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-transform hover:scale-[1.03] active:scale-95"
        style={{ background: brand.accent, color: brand.accentText, transitionDelay: on ? "0.55s" : "0s" }}
      >
        {tr(...st.menu.label)}
        <ArrowRight size={16} className="rtl:-scale-x-100 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </button>
    </div>
  );

  // Reduced motion: the same three stages, stacked and still.
  if (reduce) {
    return (
      <section id="story" className="px-5 sm:px-10 md:px-14 py-20" style={{ background: ui.bg }} aria-label={tr("Drinks, grill and feteer", "مشروبات ومشويات وفطير")}>
        <div className="mx-auto max-w-6xl grid gap-16">
          {STAGES.map((st, i) => (
            <div key={st.key} className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="aspect-square max-w-[360px] w-full mx-auto"><ArtFor i={i} accent={brand.accent} /></div>
              {stageText(st, i, true, tr)}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="story"
      ref={sec}
      className="aro-story relative"
      style={{ background: ui.bg }}
      aria-label={tr("Drinks, grill and feteer", "مشروبات ومشويات وفطير")}
    >
      <div className="aro-pin sticky top-0 overflow-hidden">
        {/* stage tints, crossfading */}
        {STAGES.map((st, i) => (
          <div
            key={st.key}
            aria-hidden
            className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
            style={{
              opacity: active === i ? 1 : 0,
              background: `radial-gradient(55% 50% at ${ar ? "30%" : "70%"} 55%, ${st.tint}24 0%, ${st.tint}0a 45%, #FFFFFF00 75%)`,
            }}
          />
        ))}
        {/* big stage number behind everything */}
        <div aria-hidden className="aro-bignum pointer-events-none absolute end-[4%] top-[10%] lg:top-[14%] select-none" style={{ color: brand.accent }}>
          {STAGES.map((st, i) => (
            <span key={st.key} className={`aro-bignum-n ${active === i ? "is-on" : ""}`}>0{i + 1}</span>
          ))}
        </div>

        <div className="aro-grid relative h-full mx-auto max-w-[1320px] px-5 sm:px-10 md:px-14">
          <div className="aro-canvas relative" data-cursor={tr("Drag", "اسحب")}>
            <Story3D
              accent={brand.accent}
              getStage={getStage}
              flow={ar ? -1 : 1}
              cursorLabel={tr("Drag", "اسحب")}
              focus={focus}
              label={tr("Iced coffee, a cup of coffee and fresh juice, then a rib eye steak, then feteer. Drag to spin, tap to make it hop.", "آيس كوفي وفنجان قهوة وعصير فريش، بعدين ستيك ريب آي، بعدين فطير. اسحب عشان تلفّها، ودوس عشان تنطّ.")}
              className="w-full h-full"
              fallback={
                <div className="relative w-full h-full">
                  {STAGES.map((st, i) => (
                    <div key={st.key} className="absolute inset-0 flex items-center justify-center transition-opacity duration-500" style={{ opacity: active === i ? 1 : 0 }}>
                      <div className="h-[80%] aspect-square"><ArtFor i={i} accent={brand.accent} /></div>
                    </div>
                  ))}
                </div>
              }
            />
            <p className="aro-hint font-playfair pointer-events-none absolute bottom-1 inset-x-0 text-center text-[17px]" style={{ color: ui.textFaint }} aria-hidden>
              {tr("drag to spin, tap to make it hop", "اسحب عشان تلفّها، ودوس عشان تنطّ")}
            </p>
          </div>

          <div className="aro-text relative min-w-0">
            {/* progress rail */}
            <div className="aro-rail relative flex items-stretch gap-1 mb-5 lg:mb-8" role="group" aria-label={tr("Story stages", "مراحل القصة")}>
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] rounded-full" style={{ background: ui.line }} />
              <span ref={fill} aria-hidden className="aro-rail-fill absolute inset-x-0 bottom-0 h-[2px] rounded-full" style={{ background: brand.accent }} />
              {STAGES.map((st, i) => (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => jump(i)}
                  aria-current={active === i ? "step" : undefined}
                  className="relative flex-1 flex items-center gap-2 pb-3 pt-1 min-h-[44px] text-start text-[13px] font-medium transition-colors"
                  style={{ color: active === i ? ui.text : ui.textFaint }}
                >
                  <span
                    aria-hidden
                    className="grid place-items-center w-6 h-6 rounded-full text-[10px] tabular-nums transition-all duration-500"
                    style={{
                      background: active >= i ? brand.accent : "#fff",
                      color: active >= i ? "#fff" : ui.textFaint,
                      border: `1px solid ${active >= i ? brand.accent : ui.line}`,
                      transform: active === i ? "scale(1.12)" : "scale(1)",
                    }}
                  >
                    {i + 1}
                  </span>
                  {tr(...st.rail)}
                </button>
              ))}
            </div>

            <div className="aro-stack grid">
              {STAGES.map((st, i) => stageText(st, i, active === i, tr))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

