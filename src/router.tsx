import { useMemo, useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from "react";

/**
 * The site has eight fixed addresses, so it carries its own few lines of
 * routing instead of a routing library: less to download on every page.
 */
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("popstate", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("popstate", cb);
  };
}
const snapshot = () => window.location.pathname + window.location.search + window.location.hash;

/** "/aroma/" and "/aroma" are the same page. */
export const cleanPath = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p) || "/";

export function useLocation() {
  const key = useSyncExternalStore(subscribe, snapshot, () => "/");
  return useMemo(
    () => ({ pathname: cleanPath(window.location.pathname), search: window.location.search, hash: window.location.hash }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
}

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  const before = cleanPath(window.location.pathname);
  if (opts.replace) window.history.replaceState(null, "", to);
  else window.history.pushState(null, "", to);
  listeners.forEach((l) => l());
  if (cleanPath(window.location.pathname) !== before && !window.location.hash) window.scrollTo(0, 0);
}

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
}

/** An ordinary link that moves between pages without reloading the site. */
export function Link({ to, onClick, target, ...rest }: LinkProps) {
  const click = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (target && target !== "_self")) return;
    e.preventDefault();
    navigate(to);
  };
  return <a href={to} target={target} onClick={click} {...rest} />;
}
