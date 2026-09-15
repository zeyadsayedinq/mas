import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import CupArt from "./CupArt";
import type { CupDimPalette, CupLitPalette } from "../brands";

interface SpotlightSceneProps {
  dim: CupDimPalette;
  lit: CupLitPalette;
  /** Unique per instance. Gradient ids are document global. */
  idPrefix: string;
  /** Cursor position in client coordinates. */
  cursorX: number;
  cursorY: number;
  radius: number;
  /** Extra classes on the base layer, for the Ken Burns zoom on the hero. */
  baseClassName?: string;
  /** Sits above the dim cup, always visible. */
  dimOverlay?: ReactNode;
  /** Sits above the lit cup and is revealed by the same spotlight. */
  litOverlay?: ReactNode;
}

const FULL_BLEED = "absolute inset-0 w-full h-full";

/**
 * The dim cup sits underneath. The lit cup sits on top, masked to a soft
 * circle that follows the cursor, so the room only warms up where you point.
 *
 * Anything passed as `litOverlay` is inside the masked layer, so it is
 * revealed by the same circle. That is how a brand logo fades from a reversed
 * white mark to its real colours as the cursor crosses it.
 *
 * The mask is a radial gradient painted to a canvas and handed to CSS as a
 * base64 PNG. Canvas gives a genuinely soft falloff that a CSS gradient mask
 * matches less convincingly at this radius.
 */
export default function SpotlightScene({
  dim,
  lit,
  idPrefix,
  cursorX,
  cursorY,
  radius,
  baseClassName = "",
  dimOverlay,
  litOverlay,
}: SpotlightSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rectRef = useRef({ left: 0, top: 0, width: 0, height: 0 });
  const lastDraw = useRef({ x: Number.NaN, y: Number.NaN });
  const [maskUrl, setMaskUrl] = useState("");

  if (canvasRef.current === null && typeof document !== "undefined") {
    canvasRef.current = document.createElement("canvas");
  }

  // Keep our own box measurements fresh without reading layout every frame.
  useLayoutEffect(() => {
    const measure = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      rectRef.current = {
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
      };
      const canvas = canvasRef.current;
      const w = Math.max(1, Math.round(r.width));
      const h = Math.max(1, Math.round(r.height));
      if (canvas && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
        lastDraw.current = { x: Number.NaN, y: Number.NaN };
      }
    };

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { left, top, width, height } = rectRef.current;
    const x = cursorX - left;
    const y = cursorY - top;

    // Nothing of the spotlight can land on this element, so stop redrawing.
    // Panels further down the page cost nothing while you are up in the hero.
    const outside =
      x < -radius || y < -radius || x > width + radius || y > height + radius;
    if (outside) {
      if (maskUrl !== "") {
        setMaskUrl("");
        lastDraw.current = { x: Number.NaN, y: Number.NaN };
      }
      return;
    }

    // Skip sub pixel redraws. toDataURL is the expensive part of this loop.
    if (
      Math.abs(x - lastDraw.current.x) < 1 &&
      Math.abs(y - lastDraw.current.y) < 1
    ) {
      return;
    }
    lastDraw.current = { x, y };

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(255,255,255,1)");
    gradient.addColorStop(0.6, "rgba(255,255,255,0.75)");
    gradient.addColorStop(0.75, "rgba(255,255,255,0.4)");
    gradient.addColorStop(0.88, "rgba(255,255,255,0.12)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    setMaskUrl(canvas.toDataURL());
  }, [cursorX, cursorY, radius, maskUrl]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <div className={`absolute inset-0 ${baseClassName}`}>
        <CupArt
          variant="dim"
          palette={dim}
          idPrefix={`${idPrefix}-dim`}
          className={FULL_BLEED}
        />
      </div>

      {dimOverlay}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage: maskUrl ? `url(${maskUrl})` : undefined,
          WebkitMaskImage: maskUrl ? `url(${maskUrl})` : undefined,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          opacity: maskUrl ? 1 : 0,
        }}
      >
        <CupArt
          variant="lit"
          palette={lit}
          idPrefix={`${idPrefix}-lit`}
          className={FULL_BLEED}
        />
        {litOverlay}
      </div>
    </div>
  );
}
