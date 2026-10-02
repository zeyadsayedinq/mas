import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AtSign, Expand } from "lucide-react";
import Reveal from "./Reveal";
import Kinetic from "./Kinetic";
import Lightbox, { type LightboxImage } from "./Lightbox";
import { useLang } from "../i18n";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { SOCIAL } from "../config";
import { track } from "../track";
import type { Brand } from "../brands";
import "../styles/aroma-content.css";

interface InstagramGridProps {
  brand: Brand;
}

/**
 * Real stills pulled from Aroma's own reels (public/video), cropped 4:5.
 * `ratio` varies the tile shape so the columns stagger like a wall of prints.
 */
const PHOTOS = [
  { src: "/gallery/aroma-01.webp", ratio: "4 / 5", en: ["The bar, first thing", "The Aroma Lounge bar and pastry counter"], ar: ["البار أول اليوم", "بار أروما لاونج وفاترينة الحلويات"] },
  { src: "/gallery/aroma-02.webp", ratio: "1 / 1", en: ["Latte art at the bar", "A cup with latte art, held over the counter"], ar: ["لاتيه آرت من البار", "فنجان عليه رسمة لاتيه فوق البار"] },
  { src: "/gallery/aroma-03.webp", ratio: "4 / 5", en: ["Seafood, straight from the kitchen", "A brass pan of seafood on a terrazzo table"], ar: ["سي فود طالع من المطبخ", "طاسة سي فود على ترابيزة تيرازو"] },
  { src: "/gallery/aroma-04.webp", ratio: "4 / 5", en: ["A full table on the terrace", "Guests at a terrace table at night with food and coffee"], ar: ["ترابيزة مليانة على التراس", "ضيوف على ترابيزة في التراس بالليل مع أكل وقهوة"] },
  { src: "/gallery/aroma-05.webp", ratio: "1 / 1", en: ["Feteer, fresh from the oven", "A close up of a feteer topped with micro greens"], ar: ["فطير طالع من الفرن", "لقطة قريبة لفطيرة عليها ورق أخضر"] },
  { src: "/gallery/aroma-06.webp", ratio: "4 / 5", en: ["The main room", "The main room with the green Aroma mark on a white arch"], ar: ["الصالة الرئيسية", "الصالة الرئيسية وشعار أروما الأخضر على قوس أبيض"] },
  { src: "/gallery/aroma-07.webp", ratio: "4 / 5", en: ["Mint and lime, over ice", "A tall mint and lime drink being finished at the bar"], ar: ["نعناع وليمون على تلج", "مشروب نعناع وليمون بيتجهّز على البار"] },
  { src: "/gallery/aroma-08.webp", ratio: "1 / 1", en: ["Friends on the terrace, late", "A group of friends taking a selfie on the terrace at night"], ar: ["صحاب على التراس بالليل", "مجموعة صحاب بياخدوا سيلفي على التراس بالليل"] },
  { src: "/gallery/aroma-09.webp", ratio: "4 / 5", en: ["Two plates at a time", "A waiter in the main room carrying two dishes"], ar: ["طبقين في المرة", "جرسون في الصالة شايل طبقين"] },
] as const;

/**
 * "What the room actually looks like": a staggered wall of real photos with a
 * gentle parallax between columns on desktop. Any photo opens full screen.
 */
export default function InstagramGrid({ brand }: InstagramGridProps) {
  const { tr, ar } = useLang();
  const ui = brand.ui;
  const handle = SOCIAL.aroma.instagram || brand.instagram;
  const profileUrl = handle ? `https://instagram.com/${handle}` : undefined;
  const wide = useMediaQuery("(min-width: 640px)");
  const cols = wide ? 3 : 2;
  const [open, setOpen] = useState<number | null>(null);

  const images: LightboxImage[] = useMemo(
    () => PHOTOS.map((p) => ({ src: p.src, caption: (ar ? p.ar : p.en)[0], alt: (ar ? p.ar : p.en)[1] })),
    [ar],
  );
  const columns = useMemo(() => {
    const out: number[][] = Array.from({ length: cols }, () => []);
    PHOTOS.forEach((_, i) => out[i % cols].push(i));
    return out;
  }, [cols]);

  // Parallax between columns, desktop pointer devices only, only on screen.
  const section = useRef<HTMLElement>(null);
  const colEls = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const el = section.current;
    if (!el || !wide) return;
    if (!window.matchMedia("(hover: hover)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const speeds = [-26, 34, -14];
    let raf = 0;
    let visible = false;
    const apply = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 when the section enters from below, +1 as it leaves at the top.
      const p = Math.max(-1, Math.min(1, (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2)));
      colEls.current.forEach((c, i) => {
        if (c) c.style.transform = `translate3d(0, ${(p * speeds[i % speeds.length]).toFixed(1)}px, 0)`;
      });
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(apply);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) onScroll();
    });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      colEls.current.forEach((c) => c && (c.style.transform = ""));
    };
  }, [wide]);

  const openAt = (i: number) => {
    setOpen(i);
    track("gallery_open", { photo: i + 1 });
  };
  const close = useCallback(() => setOpen(null), []);

  return (
    <section ref={section} id="gallery" className="relative overflow-hidden px-5 sm:px-10 md:px-14 py-20 sm:py-28" style={{ background: ui.bg }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.22em] mb-5" style={{ color: brand.accent }}>
                {tr("The room", "من جوّه")}
              </p>
            </Reveal>
            <h2 className="leading-[1.02] tracking-[-0.03em]" style={{ color: ui.text }}>
              <span className="block font-playfair italic text-4xl sm:text-5xl md:text-6xl">
                <Kinetic text={tr("What the room", "شكل المكان")} />
              </span>
              <span className="block text-4xl sm:text-5xl md:text-6xl tracking-[-0.05em]">
                <Kinetic text={tr("actually looks like.", "على الطبيعة.")} delay={0.18} />
              </span>
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-5 text-[15px] leading-relaxed max-w-sm" style={{ color: ui.textMuted }}>
                {tr("Stills from our own videos, no staging. Tap any photo to look closer.", "لقطات من فيديوهاتنا، من غير تصنّع. دوس على أي صورة تشوفها أقرب.")}
              </p>
            </Reveal>
          </div>

          {profileUrl && (
            <Reveal delay={0.08}>
              <a
                href={profileUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => track("instagram_click", { from: "gallery" })}
                className="inline-flex items-center gap-2 text-sm font-medium px-6 min-h-[48px] rounded-full transition-transform hover:scale-[1.02]"
                style={{ background: brand.accent, color: brand.accentText }}
              >
                <AtSign size={16} aria-hidden />
                <span dir="ltr">@{handle}</span>
              </a>
            </Reveal>
          )}
        </div>

        <div className="flex gap-2.5 sm:gap-4 items-start">
          {columns.map((idxs, c) => (
            <div
              key={`${cols}-${c}`}
              ref={(el) => {
                colEls.current[c] = el;
              }}
              className={`ac-gal-col flex-1 min-w-0 flex flex-col gap-2.5 sm:gap-4 ${c === 1 ? "mt-10 sm:mt-16" : ""}`}
            >
              {idxs.map((i) => {
                const p = PHOTOS[i];
                const [caption, alt] = ar ? p.ar : p.en;
                return (
                  <Reveal key={p.src} delay={Math.min(0.3, i * 0.04)}>
                    <button
                      onClick={() => openAt(i)}
                      className="ac-gal-tile group relative block w-full overflow-hidden rounded-xl sm:rounded-2xl text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{ aspectRatio: p.ratio, background: ui.bgAlt, outlineColor: brand.accent }}
                      aria-label={tr(`Open photo: ${caption}`, `افتح الصورة: ${caption}`)}
                    >
                      <img
                        src={p.src}
                        alt={alt}
                        loading="lazy"
                        decoding="async"
                        width={576}
                        height={720}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(16,22,10,0.55), transparent)" }} />
                      <span className="ac-gal-cap absolute bottom-0 inset-x-0 flex items-end justify-between gap-2 p-2.5 sm:p-4">
                        <span className="text-[11px] sm:text-sm font-medium text-white leading-snug">{caption}</span>
                        <span aria-hidden className="hidden sm:flex shrink-0 h-8 w-8 rounded-full items-center justify-center bg-white/90" style={{ color: ui.text }}>
                          <Expand size={14} />
                        </span>
                      </span>
                    </button>
                  </Reveal>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <Lightbox images={images} index={open} onIndex={setOpen} onClose={close} className="aroma-type" />
    </section>
  );
}
