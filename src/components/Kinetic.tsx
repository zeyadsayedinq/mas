import { useEffect, useRef, useState, type CSSProperties } from "react";

interface KineticProps {
  text: string;
  className?: string;
  style?: CSSProperties;
  /** Seconds before the first word moves. */
  delay?: number;
  /** Seconds between words. */
  stagger?: number;
  /** "rise" lifts each word with a slight tilt; "curtain" reveals each word from behind a mask. */
  variant?: "rise" | "curtain";
}

/**
 * A line of type that arrives word by word the first time it scrolls into
 * view. Renders plain text for reduced motion. Use it inside a heading:
 *   <h2><Kinetic text="Two rooms," className="block font-playfair" /></h2>
 */
export default function Kinetic({ text, className = "", style, delay = 0, stagger = 0.06, variant = "rise" }: KineticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = text.split(/(\s+)/);
  let n = 0;
  return (
    <span ref={ref} className={`kinetic kinetic-${variant} ${on ? "is-on" : ""} ${className}`} style={style} aria-label={text}>
      {words.map((w, i) =>
        /^\s+$/.test(w) ? (
          <span key={i} aria-hidden> </span>
        ) : (
          <span key={i} aria-hidden className="kw-mask">
            <span className="kw" style={{ transitionDelay: `${delay + n++ * stagger}s` }}>
              {w}
            </span>
          </span>
        ),
      )}
    </span>
  );
}
