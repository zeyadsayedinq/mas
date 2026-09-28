import { useRef, type ReactNode, cloneElement, isValidElement } from "react";

/**
 * Wraps a single button/link and pulls it a few pixels toward the cursor
 * while the pointer is nearby, then springs back. Mouse only.
 */
export default function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const raf = useRef(0);
  const enabled = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!isValidElement(children)) return <>{children}</>;
  if (!enabled) return children;

  const el = children as React.ReactElement<{
    onPointerMove?: (e: React.PointerEvent<HTMLElement>) => void;
    onPointerLeave?: (e: React.PointerEvent<HTMLElement>) => void;
    style?: React.CSSProperties;
  }>;

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const t = e.currentTarget;
    const r = t.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => { t.style.transform = `translate3d(${x}px, ${y}px, 0)`; });
    el.props.onPointerMove?.(e);
  };
  const onPointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    const t = e.currentTarget;
    cancelAnimationFrame(raf.current);
    t.style.transform = "translate3d(0,0,0)";
    el.props.onPointerLeave?.(e);
  };

  return cloneElement(el, {
    onPointerMove,
    onPointerLeave,
    style: { ...(el.props.style || {}), transition: "transform 260ms cubic-bezier(.16,1,.3,1)", willChange: "transform" },
  });
}
