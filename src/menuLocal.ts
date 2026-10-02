import { useMemo } from "react";
import { MENU, type MenuItem, type MenuSection } from "./menu";
import { AR } from "./ar";
import { useLang, type Lang } from "./i18n";

/* The Aroma menu in the current language. Kept apart from localize.ts so the
   group page and COVY never download a menu they do not show. */

const m = (s: string | undefined, ar: boolean) => (s && ar ? AR.menu?.[s] ?? s : s);

export function localizeMenu(lang: Lang): MenuSection[] {
  if (lang !== "ar") return MENU;
  return MENU.map((s) => ({
    ...s,
    label: m(s.label, true)!,
    note: m(s.note, true)!,
    categories: s.categories.map((c) => ({
      ...c,
      label: m(c.label, true)!,
      items: c.items.map((i) => ({ name: m(i.name, true)!, description: m(i.description, true) })),
    })),
  }));
}

export type MenuHit = MenuItem & { section: string; category: string; sectionKey: string; categoryKey: string };

export function useMenu() {
  const { lang } = useLang();
  return useMemo(() => {
    const menu = localizeMenu(lang);
    const all: MenuHit[] = menu.flatMap((s) =>
      s.categories.flatMap((c) =>
        c.items.map((i) => ({ ...i, section: s.label, category: c.label, sectionKey: s.key, categoryKey: c.key })),
      ),
    );
    return { menu, all };
  }, [lang]);
}

