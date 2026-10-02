import { useEffect, useId, useRef, type CSSProperties } from "react";
import { Moon, Sun } from "lucide-react";
import { useLang } from "../i18n";
import { track } from "../track";
import "../styles/covy.css";

/** Default dimmer level: low lamps, a few stars out. */
export const DEFAULT_LIGHT = 0.62;

/** Write the level onto the COVY page root, where every lit thing reads it. */
export function applyLight(v: number) {
  const root = document.querySelector<HTMLElement>("[data-covy-root]");
  root?.style.setProperty("--cv-light", v.toFixed(3));
}

interface CovyDimmerProps {
  value: number;
  onChange: (v: number) => void;
  className?: string;
}

/**
 * The room's dimmer: a styled range from candlelight to lights up. Keyboard
 * and screen reader friendly through the native input; the fill and glow on
 * the thumb follow the level.
 */
export default function CovyDimmer({ value, onChange, className = "" }: CovyDimmerProps) {
  const { tr } = useLang();
  const id = useId();
  const sent = useRef(0);

  useEffect(() => () => window.clearTimeout(sent.current), []);

  const say =
    value < 0.3 ? tr("Candlelight", "ضوء الشموع") : value < 0.72 ? tr("Low lamps", "إضاءة خافتة") : tr("Lights up", "إضاءة كاملة");

  const set = (v: number) => {
    onChange(v);
    // One event per adjustment, not one per pixel of drag.
    window.clearTimeout(sent.current);
    sent.current = window.setTimeout(() => track("dimmer", { level: Math.round(v * 100) }), 700);
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-full ps-4 pe-3 ${className}`}
      style={{ background: "rgba(38,45,63,.88)", border: "1px solid rgba(220,212,207,.2)", color: "#DCD4CF" }}
    >
      <label htmlFor={id} className="shrink-0 text-[10px] uppercase tracking-[0.22em] font-medium leading-tight">
        {tr("Lights", "الإضاءة")}
        <span className="block normal-case tracking-normal text-[11px] opacity-70 font-normal mt-0.5 min-w-[76px]" aria-hidden>
          {say}
        </span>
      </label>
      <Moon size={14} aria-hidden className="shrink-0 opacity-70" />
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(value * 100)}
        onChange={(e) => set(Number(e.target.value) / 100)}
        aria-valuetext={say}
        className="cv-range min-w-0 flex-1"
        style={{ "--fill": `${Math.round(value * 100)}%` } as CSSProperties}
      />
      <Sun size={15} aria-hidden className="shrink-0 opacity-80" />
    </div>
  );
}
