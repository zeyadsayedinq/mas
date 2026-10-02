import { useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import type { Kind } from "./models";
import {
  addLights, animatePiece, blobTexture, bounce, disposeScene, fitCamera, makePiece, makeRenderer,
  pieceCorners, puffTexture, toScreen, type Piece,
} from "./kit";

export interface PickPoint { x: number; y: number }

interface Props {
  kinds: Kind[];
  accent: string;
  /** "row" is the hero still life; "single" is one turntable piece. */
  mode: "row" | "single";
  onPick?: (kind: Kind, at: PickPoint) => void;
  /** Short names shown by the custom cursor while hovering a piece. */
  labels?: Partial<Record<Kind, string>>;
  fallback: ReactNode;
  className?: string;
  label: string;
}

/** Wide screens: the whole spread in one row. */
const ROW: { kind: Kind; x: number; z: number; s: number }[] = [
  { kind: "iced", x: -7, z: 0.2, s: 1 },
  { kind: "cup", x: -3.5, z: -0.2, s: 1 },
  { kind: "feteer", x: 0, z: 0.25, s: 1 },
  { kind: "steak", x: 3.5, z: -0.2, s: 1 },
  { kind: "juice", x: 7, z: 0.2, s: 1 },
];

/**
 * Phones and portrait tablets: four pieces in two depth rows, tall glasses at
 * the back and the plates in front, seen from higher up so the group fills a
 * tall frame instead of sitting as a thin strip across the middle.
 */
const STACK: { kind: Kind; x: number; z: number; s: number }[] = [
  { kind: "iced", x: -1.0, z: -2.3, s: 1.5 },
  { kind: "juice", x: 1.1, z: -1.8, s: 1.5 },
  { kind: "feteer", x: -1.3, z: 1.5, s: 0.95 },
  { kind: "steak", x: 1.3, z: 2.6, s: 0.95 },
];

/**
 * WebGL stage for the procedural food and drink models. The heavy part
 * (renderer, geometry, textures) is only built once the stage is close to the
 * viewport. Renders only while on screen, tunes down for touch devices, and
 * hands back to the flat art when WebGL is missing or the person prefers
 * reduced motion.
 */
export default function Scene3D({ kinds, accent, mode, onPick, labels, fallback, className = "", label }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const pick = useRef(onPick);
  pick.current = onPick;
  const names = useRef(labels);
  names.current = labels;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setFailed(true); return; }

    let built = false;
    let cancelled = false;
    let teardown: (() => void) | null = null;

    function build() {
      if (built || cancelled) return;
      built = true;
      const made = makeRenderer(el!);
      if (!made) { setFailed(true); return; }
      const { renderer, canvas } = made;

      const scene = new THREE.Scene();
      addLights(scene);
      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200);
      const blob = blobTexture();
      const puff = puffTexture();

      const items: Piece[] = kinds.map((k, i) => {
        const p = makePiece(k, accent, blob, puff, i * 1.3);
        scene.add(p.root);
        return p;
      });
      const byKind = (k: Kind) => items.find((p) => p.kind === k);

      let visible: Piece[] = items;
      const base = new Map<Piece, number>();
      let aim = new THREE.Vector3();
      let camBase = new THREE.Vector3();
      let narrow = false;

      function layout() {
        const w = el!.clientWidth || 1, h = el!.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        items.forEach((p) => (p.root.visible = false));

        if (mode === "single") {
          const p = items[0];
          p.root.visible = true; p.root.position.set(0, 0, 0); p.root.scale.setScalar(1);
          visible = [p]; base.set(p, 1);
          const f = fitCamera(camera, pieceCorners(p), 0.28, 0.8);
          aim = f.target; camBase = camera.position.clone();
          return;
        }
        narrow = camera.aspect < 1.25;
        const plan = narrow ? STACK : ROW;
        visible = [];
        for (const slot of plan) {
          const p = byKind(slot.kind);
          if (!p) continue;
          p.root.visible = true;
          p.root.position.set(slot.x, 0, slot.z);
          p.root.scale.setScalar(slot.s);
          base.set(p, slot.s);
          visible.push(p);
        }
        const pts: THREE.Vector3[] = [];
        visible.forEach((p) => pieceCorners(p, pts));
        const f = fitCamera(camera, pts, narrow ? 0.66 : 0.24, narrow ? 0.93 : 0.94);
        aim = f.target; camBase = camera.position.clone();
      }
      layout();
      const ro = new ResizeObserver(layout);
      ro.observe(el!);

      // Pointer: parallax, hover, tap, drag-to-spin
      const ptr = { x: 0, y: 0, tx: 0, ty: 0, down: false, sx: 0, lx: 0, moved: 0 };
      let grabbed: Piece | null = null;
      const ray = new THREE.Raycaster();
      let hovered: Piece | null = null;
      function hit(e: PointerEvent): Piece | null {
        const r = canvas.getBoundingClientRect();
        const v = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(v, camera);
        let best: Piece | null = null, bd = Infinity;
        for (const it of visible) {
          const hs = ray.intersectObject(it.holder, true);
          if (hs.length && hs[0].distance < bd) { bd = hs[0].distance; best = it; }
        }
        return best;
      }
      const onMove = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        ptr.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
        ptr.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
        if (ptr.down) {
          const dx = e.clientX - ptr.lx;
          ptr.moved += Math.abs(dx);
          ptr.lx = e.clientX;
          const target = mode === "single" ? items[0] : grabbed;
          if (target && ptr.moved > 6) { target.yawV = dx * 0.012; target.yaw += target.yawV; }
        } else if (mode === "row" && e.pointerType === "mouse") {
          const h = hit(e);
          if (h !== hovered) {
            hovered = h;
            canvas.style.cursor = h ? "pointer" : "grab";
            const n = h ? names.current?.[h.kind] : undefined;
            if (n) canvas.dataset.cursor = n; else delete canvas.dataset.cursor;
          }
        }
      };
      const onDown = (e: PointerEvent) => {
        ptr.down = true; ptr.sx = ptr.lx = e.clientX; ptr.moved = 0;
        grabbed = mode === "row" ? hit(e) : items[0];
      };
      const onUp = (e: PointerEvent) => {
        if (!ptr.down) return;
        const wasTap = ptr.moved < 8;
        ptr.down = false;
        if (!wasTap) { grabbed = null; return; }
        const h = mode === "row" ? hit(e) : items[0];
        grabbed = null;
        if (!h) return;
        bounce(h);
        if (mode === "row" && pick.current) {
          const top = new THREE.Vector3(0, h.height * (base.get(h) ?? 1) + 0.2, 0).add(h.root.position);
          pick.current(h.kind, toScreen(top, camera, canvas));
        }
      };
      const onLeave = () => { ptr.tx = 0; ptr.ty = 0; hovered = null; delete canvas.dataset.cursor; };
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointerleave", onLeave);
      canvas.addEventListener("pointercancel", () => { ptr.down = false; grabbed = null; });
      if (mode === "row") { canvas.style.cursor = "grab"; }
      if (mode === "single") canvas.dataset.cursor = "Drag";

      // Tilt with the phone, where the browser allows it.
      const onTilt = (e: DeviceOrientationEvent) => {
        if (e.gamma == null || e.beta == null) return;
        ptr.tx = Math.max(-1, Math.min(1, e.gamma / 30));
        ptr.ty = Math.max(-1, Math.min(1, (e.beta - 50) / 30));
      };
      if (window.matchMedia("(hover: none)").matches) window.addEventListener("deviceorientation", onTilt);

      // Render loop, only while on screen. Pieces pop in, staggered, the first
      // time the stage is seen.
      let raf = 0, running = false, last = performance.now(), t = 0;
      let introAt = -1;
      const tmp = new THREE.Vector3();
      function frame(now: number) {
        const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
        if (introAt < 0) introAt = t;
        ptr.x += (ptr.tx - ptr.x) * 0.06; ptr.y += (ptr.ty - ptr.y) * 0.06;

        let scroll = 0;
        if (mode === "single") {
          const r = el!.getBoundingClientRect();
          scroll = ((window.innerHeight - r.top) / (window.innerHeight + r.height)) * Math.PI * 1.4;
        }

        visible.forEach((p, i) => {
          const hv = hovered === p ? 1 : 0;
          p.hover += (hv - p.hover) * 0.12;
          if (!(ptr.down && grabbed === p)) { p.yaw += p.yawV; p.yawV *= 0.94; }
          const spin = animatePiece(p, t, dt);
          // entrance: a quick pop with overshoot
          const e = Math.max(0, Math.min(1, (t - introAt - 0.15 - i * 0.12) / 0.7));
          const back = e === 1 ? 1 : 1 + 2.2 * Math.pow(e - 1, 3) + 1.2 * Math.pow(e - 1, 2);
          p.root.scale.setScalar((base.get(p) ?? 1) * Math.max(0.001, back));
          if (mode === "single") p.holder.rotation.y = 0.5 + scroll + p.yaw + t * 0.25 + spin;
          else p.holder.rotation.y = Math.sin(t * 0.5 + p.phase) * 0.35 + ptr.x * 0.5 + p.hover * 0.6 + p.yaw + spin + (1 - e) * 1.5;
          p.holder.rotation.x = mode === "row" ? ptr.y * 0.06 : 0;
        });
        if (mode === "row") {
          const right = tmp.setFromMatrixColumn(camera.matrixWorld, 0);
          camera.position.copy(camBase).addScaledVector(right, ptr.x * (narrow ? 0.35 : 0.6));
          camera.position.y = camBase.y - ptr.y * 0.25;
          camera.lookAt(aim);
        }
        renderer.render(scene, camera);
        if (running) raf = requestAnimationFrame(frame);
      }
      const start = () => { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); } };
      const stop = () => { running = false; cancelAnimationFrame(raf); };
      const playIO = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop()), { threshold: 0.02 });
      playIO.observe(el!);
      const onVis = () => {
        if (document.hidden) stop();
        else { const r = el!.getBoundingClientRect(); if (r.bottom > 0 && r.top < window.innerHeight) start(); }
      };
      document.addEventListener("visibilitychange", onVis);

      teardown = () => {
        stop(); playIO.disconnect(); ro.disconnect();
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("deviceorientation", onTilt);
        document.removeEventListener("visibilitychange", onVis);
        disposeScene(scene);
        blob.dispose(); puff.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        canvas.remove();
      };
    }

    const warmIO = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { build(); warmIO.disconnect(); } },
      { rootMargin: "600px 0px" },
    );
    warmIO.observe(el);

    return () => {
      cancelled = true;
      warmIO.disconnect();
      teardown?.();
    };
  }, [kinds, accent, mode]);

  if (failed) return <>{fallback}</>;
  return <div ref={wrap} role="img" aria-label={label} className={className} />;
}
