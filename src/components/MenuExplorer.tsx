import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import Reveal from "./Reveal";
import Kinetic from "./Kinetic";
import { useLang } from "../i18n";
import { useMenu, type MenuHit } from "../menuLocal";
import { track } from "../track";
import type { MenuItem } from "../menu";
import type { Brand } from "../brands";
import "../styles/aroma-content.css";

interface MenuExplorerProps {
  brand: Brand;
}

/** Detail of the `aroma:menu` window event other sections fire to open a tab. */
export interface AromaMenuDetail {
  section: string;
  category?: string;
}

/**
 * Folds the spellings people actually type: case, Arabic diacritics, the
 * alef family, taa marbuta and alef maqsura, and the tatweel.
 */
function fold(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ًͯ-ٰٟـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[ؤ]/g, "و")
    .replace(/[ئ]/g, "ي")
    .replace(/\s+/g, " ")
    .trim();
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="ac-mark">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

/**
 * The real menu, 196 items across five menus. Two levels, because that is how
 * the kitchen actually organises it: pick a menu, then a category. Search cuts
 * across everything, in either language. No prices, ever.
 *
 * Other sections can open a tab with
 *   window.dispatchEvent(new CustomEvent("aroma:menu", { detail: { section, category } }))
 */
export default function MenuExplorer({ brand }: MenuExplorerProps) {
  const { tr, ar } = useLang();
  const { menu, all } = useMenu();
  const [sectionKey, setSectionKey] = useState(menu[0].key);
  const [categoryKey, setCategoryKey] = useState(menu[0].categories[0].key);
  const [query, setQuery] = useState("");
  const ui = brand.ui;

  const section = menu.find((s) => s.key === sectionKey) ?? menu[0];
  const category = section.categories.find((c) => c.key === categoryKey) ?? section.categories[0];

  const index = useMemo(
    () => all.map((i) => ({ hit: i, hay: fold(`${i.name} ${i.description ?? ""} ${i.category} ${i.section}`) })),
    [all],
  );

  const results = useMemo(() => {
    const q = fold(query);
    if (!q) return null;
    // Light Arabic stemming: drop a leading "ال" and a trailing taa marbuta.
    const words = q.split(" ").map((w) => {
      let x = w;
      if (/^ال[\u0600-\u06ff]{3,}/.test(x)) x = x.slice(2);
      if (x.length > 3 && /ه$/.test(x)) x = x.slice(0, -1);
      return x;
    });
    return index.filter(({ hay }) => words.every((w) => hay.includes(w))).map(({ hit }) => hit).slice(0, 36);
  }, [query, index]);

  const pickSection = (key: string, cat?: string, source = "tab") => {
    const next = menu.find((s) => s.key === key);
    if (!next) return;
    const c = next.categories.find((x) => x.key === cat) ?? next.categories[0];
    setSectionKey(next.key);
    setCategoryKey(c.key);
    track("menu_open", { section: next.key, category: c.key, source });
  };

  // Other sections (the dish roulette, the showcase buttons) can open a tab.
  const pickRef = useRef(pickSection);
  pickRef.current = pickSection;
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<AromaMenuDetail>).detail;
      if (!d?.section) return;
      setQuery("");
      pickRef.current(d.section, d.category, "event");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      requestAnimationFrame(() =>
        document.getElementById("menu")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }),
      );
    };
    window.addEventListener("aroma:menu", on);
    return () => window.removeEventListener("aroma:menu", on);
  }, []);

  // Keep the active chip in view when it changes, so swiping the rail and then
  // picking a menu never leaves it half off screen. Works in both directions.
  const sectionRail = useRef<HTMLDivElement>(null);
  const categoryRail = useRef<HTMLDivElement>(null);
  useEffect(() => {
    for (const rail of [sectionRail.current, categoryRail.current]) {
      const on = rail?.querySelector<HTMLElement>('[aria-selected="true"]');
      if (!rail || !on || rail.scrollWidth <= rail.clientWidth) continue;
      const delta = on.getBoundingClientRect().left - rail.getBoundingClientRect().left - (rail.clientWidth - on.offsetWidth) / 2;
      rail.scrollTo({ left: rail.scrollLeft + delta, behavior: "smooth" });
    }
  }, [sectionKey, categoryKey]);

  const items: (MenuItem | MenuHit)[] = results ?? category.items;
  const showCategoryRow = !results && section.categories.length > 1;
  const gridKey = results ? `q-${query}` : `${section.key}-${category.key}`;

  return (
    <section
      id="menu"
      className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32 scroll-mt-16"
      style={{ background: ui.bg }}
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color: brand.accent }}>
            {tr("Menu", "المنيو")}
          </p>
        </Reveal>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <h2 className="leading-[1.0] tracking-[-0.03em]" style={{ color: ui.text }}>
            <span className="block font-playfair italic text-4xl sm:text-6xl md:text-7xl">
              <Kinetic text={tr("From the grill", "من الشوّاية")} />
            </span>
            <span className="block text-4xl sm:text-6xl md:text-7xl tracking-[-0.05em]">
              <Kinetic text={tr("to the pastry counter.", "لحد فاترينة الحلويات.")} delay={0.2} />
            </span>
          </h2>

          <Reveal delay={0.12}>
            <div className="w-full md:w-auto md:min-w-[280px]">
              <div
                className="flex items-center gap-2.5 rounded-full ps-4 pe-1.5 py-1.5 border focus-within:ring-2"
                style={{ borderColor: ui.line, background: ui.bgSoft, ["--tw-ring-color" as string]: `${brand.accent}55` }}
              >
                <Search size={16} aria-hidden style={{ color: ui.textFaint }} />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={tr("Search the menu", "دوّر في المنيو")}
                  aria-label={tr("Search the menu", "دوّر في المنيو")}
                  className="flex-1 bg-transparent outline-none focus-visible:outline-none text-base sm:text-sm min-w-0 py-1.5 [&::-webkit-search-cancel-button]:hidden"
                  style={{ color: ui.text }}
                  enterKeyHint="search"
                />
                <button
                  onClick={() => setQuery("")}
                  aria-label={tr("Clear search", "امسح البحث")}
                  className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center transition-opacity"
                  style={{ opacity: query ? 1 : 0, pointerEvents: query ? "auto" : "none" }}
                  tabIndex={query ? 0 : -1}
                >
                  <X size={15} style={{ color: ui.textFaint }} />
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div ref={sectionRail} role="tablist" aria-label={tr("Menus", "المنيوهات")} className="rail rail-wrap mb-4">
            {menu.map((s) => {
              const on = s.key === sectionKey && !results;
              return (
                <button
                  key={s.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => {
                    setQuery("");
                    if (s.key !== sectionKey || results) pickSection(s.key);
                  }}
                  className="text-sm font-medium px-5 min-h-[44px] rounded-full transition-all whitespace-nowrap active:scale-95"
                  style={
                    on
                      ? { background: brand.accent, color: brand.accentText, boxShadow: `0 10px 22px -12px ${brand.accent}` }
                      : { background: "transparent", color: ui.textMuted, border: `1px solid ${ui.line}` }
                  }
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {showCategoryRow && (
            <div ref={categoryRail} role="tablist" aria-label={tr("Categories", "الأقسام")} className="rail rail-wrap mb-4">
              {section.categories.map((cat) => {
                const on = cat.key === category.key;
                return (
                  <button
                    key={cat.key}
                    role="tab"
                    aria-selected={on}
                    onClick={() => {
                      if (on) return;
                      setCategoryKey(cat.key);
                      track("menu_open", { section: section.key, category: cat.key, source: "tab" });
                    }}
                    className="text-xs font-medium px-3.5 min-h-[44px] rounded-full transition-all whitespace-nowrap active:scale-95"
                    style={
                      on
                        ? { background: `${brand.accent}1f`, color: "#5d7a2b", border: `1px solid ${brand.accent}55` }
                        : { background: "transparent", color: ui.textMuted, border: `1px solid ${ui.line}` }
                    }
                  >
                    {cat.label}
                    <span className="ms-1.5 opacity-60">{cat.items.length}</span>
                  </button>
                );
              })}
            </div>
          )}

          <p className="text-sm mb-8" style={{ color: ui.textFaint }} aria-live="polite">
            {results
              ? ar
                ? `${results.length} ${results.length === 1 ? "نتيجة" : "نتائج"} لـ «${query.trim()}»`
                : `${results.length} ${results.length === 1 ? "match" : "matches"} for “${query.trim()}”`
              : section.note}
          </p>
        </Reveal>

        {items.length === 0 ? (
          <p className="text-sm py-10" style={{ color: ui.textMuted }}>
            {tr("Nothing matches that. Try a dish name or an ingredient.", "مفيش حاجة بالاسم ده. جرّب اسم طبق أو مكوّن.")}
          </p>
        ) : (
          <div
            key={gridKey}
            className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 rounded-lg overflow-hidden"
            style={{ background: ui.line }}
          >
            {items.map((item, i) => (
              <div
                key={`${item.name}-${i}`}
                className="ac-tile h-full px-5 sm:px-6 py-5 sm:py-6 flex flex-col gap-2"
                style={{ background: ui.bgSoft, animationDelay: `${Math.min(0.36, i * 0.03)}s` }}
              >
                <p className="text-[15px] font-medium leading-snug" style={{ color: ui.text }}>
                  <Highlight text={item.name} query={results ? query : ""} />
                </p>
                {item.description && (
                  <p className="text-sm leading-relaxed" style={{ color: ui.textMuted }}>
                    <Highlight text={item.description} query={results ? query : ""} />
                  </p>
                )}
                {"section" in item && (
                  <span className="mt-auto pt-2 text-[10px] uppercase tracking-[0.14em]" style={{ color: ui.textFaint }}>
                    <Fragment>{item.section} · {item.category}</Fragment>
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-xs" style={{ color: ui.textFaint }}>
          {tr(
            "Shisha is served on the terrace, ask the team for the current selection.",
            "الشيشة على التراس، اسأل الفريق عن المتاح النهارده.",
          )}
        </p>
      </div>
    </section>
  );
}
