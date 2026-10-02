import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLang } from "../i18n";
import "../styles/aroma-content.css";

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  /** Open index, or null when closed. */
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
  /** Brand type wrapper class, e.g. "aroma-type", since the viewer is portalled to <body>. */
  className?: string;
}

/**
 * Full screen photo viewer. Arrow keys (mirrored in Arabic), Esc, swipe on
 * touch, focus kept inside while open and handed back on close, page scroll
 * locked underneath. Neighbouring photos are preloaded.
 */
export default function Lightbox({ images, index, onIndex, onClose, className = "" }: LightboxProps) {
  const { tr, ar } = useLang();
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const dir = useRef(0);
  const open = index !== null;
  const n = images.length;

  const go = (step: number) => {
    if (index === null) return;
    dir.current = step;
    onIndex((index + step + n) % n);
  };
  const goRef = useRef(go);
  goRef.current = go;

  // Focus in, scroll lock, keys; focus back out on close.
  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const forward = (e.key === "ArrowRight") !== ar;
        goRef.current(forward ? 1 : -1);
      } else if (e.key === "Tab") {
        const f = dialog.current?.querySelectorAll<HTMLElement>("button");
        if (!f || f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prevOverflow;
      (opener.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
  }, [open, ar, onClose]);

  // Preload the neighbours.
  useEffect(() => {
    if (index === null) return;
    for (const k of [index + 1, index - 1]) {
      const img = new Image();
      img.src = images[(k + n) % n].src;
    }
  }, [index, images, n]);

  // Swipe.
  const start = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    start.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      // Swiping towards the reading direction's start shows the next photo.
      const forward = dx < 0 ? !ar : ar;
      go(forward ? 1 : -1);
    } else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.5) {
      onClose();
    }
  };

  if (!open || index === null) return null;
  const img = images[index];
  const from = dir.current === 0 ? 0 : (dir.current > 0 ? 1 : -1) * (ar ? -40 : 40);

  return createPortal(
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={tr("Photo viewer", "عارض الصور")}
      className={`ac-lb fixed inset-0 z-[200] flex flex-col ${className}`}
      style={{ background: "rgba(16,22,10,0.94)" }}
      dir={ar ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-3 text-white">
        <span className="text-sm tabular-nums opacity-80" aria-live="polite" dir="ltr">
          {index + 1} / {n}
        </span>
        <button
          ref={closeBtn}
          onClick={onClose}
          aria-label={tr("Close", "إغلاق")}
          className="h-11 w-11 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X size={20} aria-hidden />
        </button>
      </div>

      <div
        className="relative flex-1 min-h-0 flex items-center justify-center px-3 sm:px-20 touch-pan-y select-none"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (start.current = null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          draggable={false}
          className="ac-lb-img max-h-full max-w-full rounded-lg object-contain shadow-2xl"
          style={{ ["--ac-from" as string]: `${from}px` }}
        />

        <button
          onClick={() => go(-1)}
          aria-label={tr("Previous photo", "الصورة اللي قبلها")}
          className="hidden sm:flex absolute start-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ChevronLeft size={22} aria-hidden className="rtl:-scale-x-100" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label={tr("Next photo", "الصورة اللي بعدها")}
          className="hidden sm:flex absolute end-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ChevronRight size={22} aria-hidden className="rtl:-scale-x-100" />
        </button>
      </div>

      <div className="px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center text-white">
        {img.caption && <p className="text-[15px]">{img.caption}</p>}
        <div className="mt-3 flex items-center justify-center gap-4 sm:hidden">
          <button onClick={() => go(-1)} aria-label={tr("Previous photo", "الصورة اللي قبلها")} className="h-11 w-11 rounded-full flex items-center justify-center bg-white/10">
            <ChevronLeft size={20} aria-hidden className="rtl:-scale-x-100" />
          </button>
          <span className="text-xs opacity-60">{tr("Swipe for more", "اسحب للمزيد")}</span>
          <button onClick={() => go(1)} aria-label={tr("Next photo", "الصورة اللي بعدها")} className="h-11 w-11 rounded-full flex items-center justify-center bg-white/10">
            <ChevronRight size={20} aria-hidden className="rtl:-scale-x-100" />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
