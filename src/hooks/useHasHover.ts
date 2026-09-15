import { useEffect, useState } from "react";

/**
 * True on devices with a real pointer. Touch screens never get a hover state,
 * so the brand panels show their lit version outright rather than sitting dim
 * and waiting for a cursor that is never coming.
 */
export function useHasHover(): boolean {
  const [hasHover, setHasHover] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setHasHover(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return hasHover;
}
