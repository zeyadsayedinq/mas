/**
 * Search and share data for every page. Kept free of imports so the build
 * step (vite.config.ts) can read it too and bake the tags into static HTML,
 * which is what WhatsApp, Instagram and Facebook actually read: their link
 * previews never run JavaScript.
 */

export interface PageMeta {
  path: string;
  lang: "en" | "ar";
  title: string;
  description: string;
  image: string;
  themeColor: string;
  icon: string;
  /** The same page in the other language. */
  alternate: string;
}

const en = (path: string, title: string, description: string, image: string, themeColor: string, icon: string): PageMeta => ({
  path, lang: "en", title, description, image, themeColor, icon, alternate: path === "/" ? "/ar" : `/ar${path}`,
});
const ar = (path: string, title: string, description: string, image: string, themeColor: string, icon: string): PageMeta => ({
  path: path === "/" ? "/ar" : `/ar${path}`, lang: "ar", title, description, image, themeColor, icon, alternate: path,
});

export const PAGES: PageMeta[] = [
  en("/", "MAS Egypt | Food and beverage group", "MAS Egypt builds and runs food and beverage brands in Cairo, including Aroma Lounge and COVY, and operates venues for owners who have the room but not the team.", "/og/mas.jpg", "#FFFFFF", "/favicon.svg"),
  ar("/", "ماس مصر | مجموعة أغذية ومشروبات", "ماس مصر تبني وتشغّل علامات أغذية ومشروبات في القاهرة، منها أروما لاونج وكوفي، وتدير أماكن لملّاك يملكون المكان ولا يملكون فريق التشغيل.", "/og/mas.jpg", "#FFFFFF", "/favicon.svg"),
  en("/aroma", "Aroma Lounge | Coffee, grill, feteer and desks in New Cairo", "Specialty coffee, fresh juice, a grill and a feteer counter, a shisha terrace and work desks. Two branches in New Cairo: Madinaty and Mivida.", "/og/aroma.jpg", "#FFFFFF", "/icons/aroma.png"),
  ar("/aroma", "أروما لاونج | قهوة، مشويات، فطير ومساحة عمل في القاهرة الجديدة", "قهوة مختصة، عصائر فريش، مشويات وفطير، تراس للشيشة ومساحة للشغل. فرعين في القاهرة الجديدة: مدينتي وميڤيدا.", "/og/aroma.jpg", "#FFFFFF", "/icons/aroma.png"),
  en("/aroma/madinaty", "Aroma Lounge Madinaty | Coffee, grill and feteer", "Aroma Lounge in Madinaty: specialty coffee, grill, feteer, a shisha terrace and work desks. Reserve a table.", "/og/aroma.jpg", "#FFFFFF", "/icons/aroma.png"),
  ar("/aroma/madinaty", "أروما لاونج مدينتي | قهوة، مشويات وفطير", "أروما لاونج في مدينتي: قهوة مختصة، مشويات، فطير، تراس للشيشة ومساحة عمل. احجز ترابيزتك.", "/og/aroma.jpg", "#FFFFFF", "/icons/aroma.png"),
  en("/covy", "COVY | Lounge and late kitchen", "An evening lounge with a late kitchen and a full bar. Quiet rooms, late conversations.", "/og/covy.jpg", "#262D3F", "/icons/covy.png"),
  ar("/covy", "كوفي | لاونج ومطبخ لآخر الليل", "لاونج مسائي بمطبخ مفتوح لوقت متأخر وبار كامل. أماكن هادئة وأحاديث طويلة.", "/og/covy.jpg", "#262D3F", "/icons/covy.png"),
];

export const pageFor = (pathname: string) =>
  PAGES.find((p) => p.path === pathname.replace(/\/+$/, "") || (pathname === "/" && p.path === "/")) ?? PAGES[0];

/** Structured data for search engines, per page. Only confirmed facts go in. */
export function jsonLd(page: PageMeta, site: string): object[] {
  const abs = (p: string) => (site ? site.replace(/\/$/, "") + p : p);
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": abs("/#org"),
    name: "MAS Egypt",
    alternateName: "ماس مصر",
    url: abs("/"),
    logo: abs("/og/mas.jpg"),
    areaServed: "Cairo, Egypt",
  };
  const base = page.path.replace(/^\/ar/, "") || "/";
  if (base.startsWith("/aroma")) {
    const branch = (name: string, area: string, rating: number, count: number) => ({
      "@context": "https://schema.org",
      "@type": "CafeOrCoffeeShop",
      name,
      url: abs(page.path),
      image: abs("/og/aroma.jpg"),
      servesCuisine: ["Coffee", "Egyptian", "Grill", "Feteer"],
      areaServed: area,
      address: { "@type": "PostalAddress", addressLocality: area, addressRegion: "Cairo Governorate", addressCountry: "EG" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: rating, reviewCount: count },
      parentOrganization: { "@id": abs("/#org") },
    });
    return [org, branch("Aroma Lounge Madinaty", "Madinaty", 4.9, 80), branch("Aroma Lounge Mivida", "New Cairo", 4.7, 1500)];
  }
  if (base.startsWith("/covy")) {
    return [org, { "@context": "https://schema.org", "@type": "BarOrPub", name: "COVY", url: abs(page.path), image: abs("/og/covy.jpg"), parentOrganization: { "@id": abs("/#org") } }];
  }
  return [org];
}
