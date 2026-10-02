import { useMemo } from "react";
import {
  BRANDS,
  BRAND_DETAIL,
  CASE_STUDIES,
  GROUP_STATS,
  MANAGEMENT,
  NOW,
  SERVICES,
  type Brand,
  type BrandKey,
} from "./brands";
import {
  BRANDS_AR,
  BRAND_DETAIL_AR,
  CASE_STUDIES_AR,
  GROUP_STATS_AR,
  MANAGEMENT_AR,
  NOW_AR,
  NOW_KIND_AR,
  SERVICES_AR,
} from "./brands.ar";
import { BRANCHES, type Branch } from "./branches";
import { BRANCHES_AR } from "./branches.ar";
import { MENU, type MenuItem, type MenuSection } from "./menu";
import { MENU_AR } from "./menu.ar";
import { CONFIRMED, DEFAULT_BRANCH, live } from "./config";
import { useLang, type Lang } from "./i18n";

/** A brand with its copy swapped for the current language. */
export function localizeBrand(brand: Brand, lang: Lang): Brand {
  if (lang !== "ar") return brand;
  const ar = BRANDS_AR[brand.key];
  return {
    ...brand,
    name: brand.nameAr || brand.name,
    descriptor: ar.descriptor,
    nav: ar.nav,
    navCta: ar.navCta,
    hero: { ...brand.hero, ...ar.hero },
    about: { ...brand.about, ...ar.about },
    contact: { ...brand.contact, ...ar.contact },
  };
}

export function useBrand(key: BrandKey): Brand {
  const { lang } = useLang();
  return useMemo(() => localizeBrand(BRANDS[key], lang), [key, lang]);
}

const m = (s: string | undefined, ar: boolean) => (s && ar ? MENU_AR[s] ?? s : s);

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

/** Aroma branches, localised and led by the default (priority) branch. */
export function useBranches(): Branch[] {
  const { lang } = useLang();
  return useMemo(() => {
    const list = [...BRANCHES].sort((a, b) => (a.key === DEFAULT_BRANCH ? -1 : b.key === DEFAULT_BRANCH ? 1 : 0));
    if (lang !== "ar") return list;
    return list.map((b) => ({ ...b, ...(BRANCHES_AR[b.key] ?? {}) }));
  }, [lang]);
}

/** Can this branch field be shown? See config.ts. */
export const branchLive = (b: Branch, field: keyof Branch["confirmed"]) => live(b.confirmed[field]);

/** Group page content in the current language, with unconfirmed items removed. */
export function useGroup() {
  const { lang } = useLang();
  return useMemo(() => {
    const ar = lang === "ar";
    const now = (ar ? NOW_AR : NOW)
      .map((n, i) => ({ ...n, confirmed: NOW[i]?.confirmed }))
      .filter((n) => live(!!n.confirmed))
      .map((n) => ({ ...n, kindLabel: ar ? NOW_KIND_AR[n.kind] : n.kind }));
    return {
      stats: live(CONFIRMED.groupStats) ? (ar ? GROUP_STATS_AR : GROUP_STATS) : [],
      services: ar ? SERVICES_AR : SERVICES,
      cases: live(CONFIRMED.caseStudies) ? (ar ? CASE_STUDIES_AR : CASE_STUDIES) : [],
      now,
      management: ar ? MANAGEMENT_AR : MANAGEMENT,
      brandDetail: ar ? BRAND_DETAIL_AR : BRAND_DETAIL,
    };
  }, [lang]);
}
