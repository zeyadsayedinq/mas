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

  return (
    <section ref={box} id={id} className={`relative isolate overflow-hidden bg-black text-white ${className}`}>
      <img src={poster} alt="" aria-hidden className="absolute inset-0 -z-20 h-full w-full object-cover" style={{ objectPosition }} loading="lazy" />
      {!still && (
        <video
          ref={vid}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          style={{ objectPosition }}
          src={near ? src : undefined}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
        />
      )}
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
