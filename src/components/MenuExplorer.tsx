import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import Reveal from "./Reveal";
import { MENU, ALL_ITEMS, type MenuItem } from "../menu";

type SearchHit = MenuItem & { section: string; category: string };
import type { Brand } from "../brands";

interface MenuExplorerProps {
  brand: Brand;
}

/**
 * The real menu, 196 items across five menus. Two levels, because that is how
 * the kitchen actually organises it: pick a menu, then a category. Search cuts
 * across everything, which at this size is the fastest way in.
 */
export default function MenuExplorer({ brand }: MenuExplorerProps) {
  const [sectionKey, setSectionKey] = useState(MENU[0].key);
  const [categoryKey, setCategoryKey] = useState(MENU[0].categories[0].key);
  const [query, setQuery] = useState("");
  const ui = brand.ui;

  const section = MENU.find((s) => s.key === sectionKey) ?? MENU[0];
  const category =
    section.categories.find((c) => c.key === categoryKey) ?? section.categories[0];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return ALL_ITEMS.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.description ?? "").toLowerCase().includes(q),
    ).slice(0, 36);
  }, [query]);

  const pickSection = (key: string) => {
    setSectionKey(key);
    const next = MENU.find((s) => s.key === key);
    if (next) setCategoryKey(next.categories[0].key);
  };

  // Keep the active tab in view when it changes, so swiping the rail and then
  // picking a menu never leaves the chosen chip half off screen.
  const sectionRail = useRef<HTMLDivElement>(null);
  const categoryRail = useRef<HTMLDivElement>(null);
  useEffect(() => {
    for (const rail of [sectionRail.current, categoryRail.current]) {
      const on = rail?.querySelector<HTMLElement>('[aria-selected="true"]');
      if (!rail || !on) continue;
      const offset = on.getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft;
      const to = offset - (rail.clientWidth - on.offsetWidth) / 2;
      rail.scrollTo({ left: Math.max(0, to), behavior: "smooth" });
    }
  }, [sectionKey, categoryKey]);

  const items: (MenuItem | SearchHit)[] = results ?? category.items;
  const showCategoryRow = !results && section.categories.length > 1;

  return (
    <section
      id="menu"
      className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32"
      style={{ background: ui.bg }}
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color: brand.accent }}>
            Menu
          </p>
        </Reveal>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <Reveal delay={0.06}>
            <h2 className="leading-[1.0] tracking-[-0.03em]" style={{ color: ui.text }}>
              <span className="block font-playfair italic text-4xl sm:text-6xl md:text-7xl">
                From the grill
              </span>
              <span className="block text-4xl sm:text-6xl md:text-7xl tracking-[-0.05em]">
                to the pastry counter.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="w-full md:w-auto md:min-w-[260px]">
              <div
                className="flex items-center gap-2.5 rounded-full px-4 py-2.5 border"
                style={{ borderColor: ui.line, background: ui.bgSoft }}
              >
                <Search size={16} style={{ color: ui.textFaint }} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search the menu"
                  aria-label="Search the menu"
                  className="flex-1 bg-transparent outline-none text-sm min-w-0"
                  style={{ color: ui.text }}
                />
                {query && (
                  <button onClick={() => setQuery("")} aria-label="Clear search">
                    <X size={15} style={{ color: ui.textFaint }} />
                  </button>
                )}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div ref={sectionRail} role="tablist" aria-label="Menus" className="rail rail-wrap mb-4">
            {MENU.map((s) => (
              <button
                key={s.key}
                role="tab"
                aria-selected={s.key === sectionKey && !results}
                onClick={() => {
                  setQuery("");
                  pickSection(s.key);
                }}
                className="text-sm font-medium px-5 py-2.5 rounded-full transition-all whitespace-nowrap"
                style={
                  s.key === sectionKey && !results
                    ? { background: brand.accent, color: brand.accentText }
                    : { background: "transparent", color: ui.textMuted, border: `1px solid ${ui.line}` }
                }
              >
                {s.label}
              </button>
            ))}
          </div>

          {showCategoryRow && (
            <div ref={categoryRail} role="tablist" aria-label="Categories" className="rail rail-wrap mb-4">
              {section.categories.map((cat) => (
                <button
                  key={cat.key}
                  role="tab"
                  aria-selected={cat.key === category.key}
                  onClick={() => setCategoryKey(cat.key)}
                  className="text-xs font-medium px-3.5 py-2.5 rounded-full transition-all whitespace-nowrap"
                  style={
                    cat.key === category.key
                      ? { background: `${brand.accent}1f`, color: brand.accent, border: `1px solid ${brand.accent}55` }
                      : { background: "transparent", color: ui.textFaint, border: `1px solid ${ui.line}` }
                  }
                >
                  {cat.label}
                  <span className="ml-1.5 opacity-60">{cat.items.length}</span>
                </button>
              ))}
            </div>
          )}

          <p className="text-sm mb-8" style={{ color: ui.textFaint }}>
            {results
              ? `${results.length} ${results.length === 1 ? "match" : "matches"} for "${query}"`
              : section.note}
          </p>
        </Reveal>

        {items.length === 0 ? (
          <p className="text-sm py-10" style={{ color: ui.textMuted }}>
            Nothing matches that. Try a dish name or an ingredient.
          </p>
        ) : (
          <div
            className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 rounded-lg overflow-hidden"
            style={{ background: ui.line }}
          >
            {items.map((item, i) => (
              <Reveal key={`${item.name}-${i}`} delay={Math.min(0.3, i * 0.03)}>
                <div className="h-full px-5 sm:px-6 py-5 sm:py-6 flex flex-col gap-2" style={{ background: ui.bgSoft }}>
                  <p className="text-[15px] font-medium leading-snug" style={{ color: ui.text }}>
                    {item.name}
                  </p>
                  {item.description && (
                    <p className="text-sm leading-relaxed" style={{ color: ui.textMuted }}>
                      {item.description}
                    </p>
                  )}
                  {"section" in item && (
                    <span className="mt-auto pt-2 text-[10px] uppercase tracking-[0.14em]" style={{ color: ui.textFaint }}>
                      {item.section} · {item.category}
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <p className="mt-6 text-xs" style={{ color: ui.textFaint }}>
          Shisha is served on the terrace, ask the team for the current selection.
        </p>
      </div>
    </section>
  );
}
