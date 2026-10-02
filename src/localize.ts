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
import { BRANCHES, type Branch } from "./branches";
import { AR } from "./ar";
import { CONFIRMED, DEFAULT_BRANCH, live } from "./config";
import { useLang, type Lang } from "./i18n";

/** A brand with its copy swapped for the current language. */
export function localizeBrand(brand: Brand, lang: Lang): Brand {
  if (lang !== "ar") return brand;
  const ar = AR.core!.BRANDS_AR[brand.key];
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

/** Aroma branches, localised and led by the default (priority) branch. */
export function useBranches(): Branch[] {
  const { lang } = useLang();
  return useMemo(() => {
    const list = [...BRANCHES].sort((a, b) => (a.key === DEFAULT_BRANCH ? -1 : b.key === DEFAULT_BRANCH ? 1 : 0));
    if (lang !== "ar") return list;
    return list.map((b) => ({ ...b, ...(AR.core!.BRANCHES_AR[b.key] ?? {}) }));
  }, [lang]);
}

/** Can this branch field be shown? See config.ts. */
export const branchLive = (b: Branch, field: keyof Branch["confirmed"]) => live(b.confirmed[field]);

/** Group page content in the current language, with unconfirmed items removed. */
export function useGroup() {
  const { lang } = useLang();
  return useMemo(() => {
    const ar = lang === "ar";
    const A = (ar ? AR.core : null)!;
    const now = (ar ? A.NOW_AR : NOW)
      .map((n, i) => ({ ...n, confirmed: NOW[i]?.confirmed }))
      .filter((n) => live(!!n.confirmed))
      .map((n) => ({ ...n, kindLabel: ar ? A.NOW_KIND_AR[n.kind] : n.kind }));
    return {
      stats: live(CONFIRMED.groupStats) ? (ar ? A.GROUP_STATS_AR : GROUP_STATS) : [],
      services: ar ? A.SERVICES_AR : SERVICES,
      cases: live(CONFIRMED.caseStudies) ? (ar ? A.CASE_STUDIES_AR : CASE_STUDIES) : [],
      now,
      management: ar ? A.MANAGEMENT_AR : MANAGEMENT,
      brandDetail: ar ? A.BRAND_DETAIL_AR : BRAND_DETAIL,
    };
  }, [lang]);
}
