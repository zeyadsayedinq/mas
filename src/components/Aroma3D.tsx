import { lazy, Suspense, type ReactNode } from "react";
import type { Kind } from "../three/models";
import type { PickPoint } from "../three/Scene3D";

// three.js is only fetched when one of these mounts, so the group page and
// COVY never pay for it.
const Scene3D = lazy(() => import("../three/Scene3D"));
const StoryStage = lazy(() => import("../three/StoryStage"));

const HERO_KINDS: Kind[] = ["iced", "cup", "feteer", "steak", "juice"];
const ONE: Record<Kind, Kind[]> = { cup: ["cup"], steak: ["steak"], feteer: ["feteer"], iced: ["iced"], juice: ["juice"] };

export function Hero3D({
  accent, fallback, onPick, labels, label,
}: {
  accent: string;
  fallback: ReactNode;
  onPick: (k: Kind, at: PickPoint) => void;
  labels?: Partial<Record<Kind, string>>;
  label: string;
}) {
  return (
    <Suspense fallback={fallback}>
      <Scene3D kinds={HERO_KINDS} accent={accent} mode="row" onPick={onPick} labels={labels} fallback={fallback} label={label} className="w-full h-full" />
    </Suspense>
  );
}

export function Story3D(props: {
  accent: string;
  getStage: () => number;
  flow: 1 | -1;
  fallback: ReactNode;
  label: string;
  cursorLabel?: string;
  className?: string;
  focus?: { x: number; w: number };
}) {
  return (
    <Suspense fallback={props.fallback}>
      <StoryStage {...props} />
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
