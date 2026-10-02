/**
 * Arabic copy is a separate download: an English visitor never fetches it,
 * and the Arabic menu (the largest part) is only fetched on the Aroma page.
 */
type Core = typeof import("./ar.core");

export const AR: { core: Core | null; menu: Record<string, string> | null } = { core: null, menu: null };

let corePromise: Promise<void> | null = null;
let menuPromise: Promise<void> | null = null;

/** Returns a promise while something is still loading, or null once it is all here. */
export function ensureArabic(needMenu: boolean): Promise<unknown> | null {
  corePromise ??= import("./ar.core").then((m) => { AR.core = m; });
  if (needMenu) menuPromise ??= import("./menu.ar").then((m) => { AR.menu = m.MENU_AR; });
  const waiting: Promise<void>[] = [];
  if (!AR.core) waiting.push(corePromise);
  if (needMenu && !AR.menu) waiting.push(menuPromise!);
  if (!waiting.length) return null;
  return (pending ??= Promise.all(waiting).then(() => { pending = null; }));
}
let pending: Promise<void> | null = null;
