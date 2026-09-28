import { lazy, Suspense, type ReactNode } from "react";
import type { Kind } from "../three/models";

// three.js is only fetched when one of these mounts, so the group page and
// COVY never pay for it.
const Scene3D = lazy(() => import("../three/Scene3D"));

const HERO_KINDS: Kind[] = ["iced", "cup", "feteer", "steak", "juice"];
const ONE: Record<Kind, Kind[]> = { cup: ["cup"], steak: ["steak"], feteer: ["feteer"], iced: ["iced"], juice: ["juice"] };

export function Hero3D({ accent, fallback, onPick }: { accent: string; fallback: ReactNode; onPick: (k: Kind) => void }) {
  return (
    <Suspense fallback={fallback}>
      <Scene3D
        kinds={HERO_KINDS}
        accent={accent}
        mode="row"
        onPick={onPick}
        fallback={fallback}
        label="Coffee, iced coffee, feteer, steak and fresh juice. Tap one to jump to it."
        className="w-full h-full"
      />
    </Suspense>
  );
}

export function Model3D({ kind, accent, fallback, label }: { kind: Kind; accent: string; fallback: ReactNode; label: string }) {
  return (
    <div className="aspect-square w-full">
      <Suspense fallback={fallback}>
        <Scene3D kinds={ONE[kind]} accent={accent} mode="single" fallback={fallback} label={label} className="w-full h-full" />
      </Suspense>
    </div>
  );
}
