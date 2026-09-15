import { useEffect, useRef, useState } from "react";

export interface CursorPos {
  x: number;
  y: number;
}

const OFFSCREEN: CursorPos = { x: -9999, y: -9999 };

/**
 * Tracks the pointer in client coordinates and eases it with a lerp, so the
 * spotlight trails the cursor instead of snapping to it.
 *
 * Returns client space coordinates. Consumers convert to their own local
 * space, which lets the hero and the brand panels share one listener.
 */
export function useSmoothCursor(easing = 0.1): CursorPos {
  const raw = useRef<CursorPos>(OFFSCREEN);
  const smooth = useRef<CursorPos>(OFFSCREEN);
  const rafRef = useRef<number | null>(null);
  const [pos, setPos] = useState<CursorPos>(OFFSCREEN);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      raw.current.x = e.clientX;
      raw.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      smooth.current.x += (raw.current.x - smooth.current.x) * easing;
      smooth.current.y += (raw.current.y - smooth.current.y) * easing;
      setPos({ x: smooth.current.x, y: smooth.current.y });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [easing]);

  return pos;
}
