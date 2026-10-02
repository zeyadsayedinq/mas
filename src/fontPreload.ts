import archivo from "./assets/fonts/archivo-latin-wdth-normal.woff2?url";
import fraunces from "./assets/fonts/fraunces-latin-soft-normal.woff2?url";
import caveat from "./assets/fonts/caveat-latin-700-normal.woff2?url";
import dmSans from "./assets/fonts/dm-sans-latin-wght-normal.woff2?url";
import bodoni from "./assets/fonts/bodoni-moda-latin-wght-normal.woff2?url";
import bodoniItalic from "./assets/fonts/bodoni-moda-latin-wght-italic.woff2?url";
import jost from "./assets/fonts/jost-latin-wght-normal.woff2?url";
import plex from "./assets/fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2?url";
import plexBold from "./assets/fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2?url";
import almarai from "./assets/fonts/almarai-arabic-400-normal.woff2?url";
import almaraiBold from "./assets/fonts/almarai-arabic-700-normal.woff2?url";
import amiri from "./assets/fonts/amiri-arabic-400-normal.woff2?url";

/**
 * Start fetching the faces the first screen needs before the CSS asks for
 * them, so headlines don't jump when the real font swaps in.
 */
export function preloadFonts(pathname: string) {
  const ar = pathname === "/ar" || pathname.startsWith("/ar/");
  const base = ar ? pathname.slice(3) || "/" : pathname;
  let list: string[];
  if (base.startsWith("/aroma")) list = ar ? [almarai, almaraiBold] : [fraunces, caveat, dmSans];
  else if (base.startsWith("/covy")) list = ar ? [amiri, plex] : [bodoni, bodoniItalic, jost];
  else list = ar ? [plex, plexBold] : [archivo];
  for (const href of list) {
    const l = document.createElement("link");
    l.rel = "preload";
    l.as = "font";
    l.type = "font/woff2";
    l.crossOrigin = "anonymous";
    l.href = href;
    document.head.appendChild(l);
  }
}
