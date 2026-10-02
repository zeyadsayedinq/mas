import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  src: string;
  poster: string;
  children: ReactNode;
  /** Where the copy sits. The black end of the gradient follows it. */
  align?: "bottom" | "center";
  className?: string;
  id?: string;
  objectPosition?: string;
}

/**
 * Full-bleed looping footage with a black-to-transparent wash over it so copy
 * stays readable. Plays only while on screen, and falls back to the still
 * frame for people who prefer reduced motion or are saving data.
 */
export default function VideoBand({ src, poster, children, align = "bottom", className = "", id, objectPosition = "50% 50%" }: Props) {
  const box = useRef<HTMLElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);
  const [near, setNear] = useState(false);
  const media = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    if (reduce || conn?.saveData) { setStill(true); return; }
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setNear(true);
        const v = vid.current;
        if (!v) return;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "200px 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Footage drifts a little slower than the page and eases in from a slight
  // zoom as the band crosses the screen. Transform only, only while visible.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = box.current, m = media.current;
    if (!el || !m) return;
    let raf = 0, on = false;
    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)));
      const scale = 1.14 - (1 - Math.abs(p)) * 0.08;
      m.style.transform = `translate3d(0, ${(p * 7).toFixed(2)}%, 0) scale(${scale.toFixed(3)})`;
    };
    const onScroll = () => { if (on && !raf) raf = requestAnimationFrame(paint); };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) paint(); }, { rootMargin: "100px 0px" });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section ref={box} id={id} className={`relative isolate overflow-hidden bg-black text-white ${className}`}>
      <div ref={media} aria-hidden className="absolute inset-0 -z-20" style={{ transform: "scale(1.06)" }}>
      <img src={poster} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition }} loading="lazy" decoding="async" />
      {/* The video element only exists once the band is close, so nothing is fetched for footage nobody has scrolled to. */}
      {!still && near && (
        <video
          ref={vid}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition }}
          src={src}
          muted
          autoPlay
          loop
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
        />
      )}
      </div>
      {/* black to clear, stronger where the copy sits */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            align === "bottom"
              ? "linear-gradient(to top, rgba(0,0,0,.92) 0%, rgba(0,0,0,.7) 32%, rgba(0,0,0,.18) 68%, rgba(0,0,0,.35) 100%)"
              : "radial-gradient(ellipse at center, rgba(0,0,0,.72) 0%, rgba(0,0,0,.45) 55%, rgba(0,0,0,.25) 100%)",
        }}
      />
      {children}
    </section>
  );
}
