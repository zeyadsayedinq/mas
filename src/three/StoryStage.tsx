import { useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import type { Kind } from "./models";
import {
  addLights, animatePiece, blobTexture, bounce, breathe, disposeScene, fitCamera, makeGovernor, makePiece, makeRenderer,
  pieceCorners, puffTexture, type Piece,
} from "./kit";

interface Props {
  accent: string;
  /** Read every frame: the story position, 0 at the first stage, 2 at the last. */
  getStage: () => number;
  /** +1 for left-to-right pages, -1 for Arabic, so the next stage arrives from the reading side. */
  flow: 1 | -1;
  fallback: ReactNode;
  label: string;
  /** Word the custom cursor shows over the canvas. */
  cursorLabel?: string;
  className?: string;
  /** Where in the canvas the pieces should sit: centre and width, as fractions of the canvas width. */
  focus?: { x: number; w: number };
}

/** What sits on each stage, in stage-local coordinates. */
const STAGES: { elev: number; pieces: { kind: Kind; x: number; z: number; s: number }[] }[] = [
  {
    elev: 0.2,
    pieces: [
      { kind: "iced", x: 0, z: 0.2, s: 1 },
      { kind: "cup", x: -2.15, z: 1.2, s: 0.95 },
      { kind: "juice", x: 2.1, z: -0.7, s: 1 },
    ],
  },
  { elev: 0.5, pieces: [{ kind: "steak", x: 0, z: 0, s: 1.3 }] },
  { elev: 0.56, pieces: [{ kind: "feteer", x: 0, z: 0, s: 1.3 }] },
];

interface Group { g: THREE.Group; pieces: Piece[]; yaw: number; yawV: number }

/**
 * The one WebGL canvas behind the scroll story. All three stages live in a
 * single scene: as the story moves on, the current group slides out towards
 * the reading edge, turning and shrinking, while the next one swings in, and
 * the camera drifts from eye level for the drinks to looking down on the
 * plates. Drag spins the stage in view, a tap makes a piece hop.
 */
export default function StoryStage({ accent, getStage, flow, fallback, label, cursorLabel, className = "", focus }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const read = useRef(getStage);
  read.current = getStage;
  const flowRef = useRef(flow);
  flowRef.current = flow;
  const focusRef = useRef(focus ?? { x: 0.5, w: 1 });
  focusRef.current = focus ?? { x: 0.5, w: 1 };
  const relayout = useRef<(() => void) | null>(null);
  useEffect(() => { relayout.current?.(); }, [focus?.x, focus?.w]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setFailed(true); return; }

    let built = false, cancelled = false, gen = 0;
    let teardown: (() => void) | null = null;

    async function build() {
      if (built || cancelled) return;
      built = true;
      const my = ++gen;
      const made = makeRenderer(el!);
      if (!made) { setFailed(true); return; }
      const { renderer, canvas } = made;
      if (cursorLabel) canvas.dataset.cursor = cursorLabel;
      canvas.style.cursor = "grab";

      const scene = new THREE.Scene();
      addLights(scene);
      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200);
      const blob = blobTexture();
      const puff = puffTexture();

      // One piece per idle slice, so building the three stages never blocks the page.
      const groups: Group[] = [];
      for (let gi = 0; gi < STAGES.length; gi++) {
        const g = new THREE.Group();
        const pieces: Piece[] = [];
        scene.add(g);
        for (let i = 0; i < STAGES[gi].pieces.length; i++) {
          const d = STAGES[gi].pieces[i];
          const p = makePiece(d.kind, accent, blob, puff, gi * 2 + i * 1.3);
          p.root.position.set(d.x, 0, d.z);
          p.root.scale.setScalar(d.s);
          g.add(p.root);
          pieces.push(p);
          await breathe();
          if (cancelled || my !== gen) {
            disposeScene(scene); blob.dispose(); puff.dispose();
            renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
            return;
          }
        }
        groups.push({ g, pieces, yaw: 0, yawV: 0 });
      }

      // One camera fit per stage, computed with that stage at the origin.
      let fits: { pos: THREE.Vector3; target: THREE.Vector3 }[] = [];
      let spread = 8;
      function layout() {
        const w = el!.clientWidth || 1, h = el!.clientHeight || 1;
        const fo = focusRef.current;
        renderer.setSize(w, h, false);
        // fit inside the focus region, then widen the view to the whole
        // canvas and slide the image across so the region sits where asked
        camera.clearViewOffset();
        camera.aspect = (w * fo.w) / h;
        camera.updateProjectionMatrix();
        spread = camera.aspect < 1 ? 6.5 : 8.5;
        fits = groups.map((gr, i) => {
          groups.forEach((o) => { o.g.position.set(0, 0, 0); o.g.rotation.set(0, 0, 0); o.g.scale.setScalar(1); });
          const pts: THREE.Vector3[] = [];
          gr.pieces.forEach((p) => pieceCorners(p, pts));
          const f = fitCamera(camera, pts, STAGES[i].elev, i === 0 ? 0.86 : 0.78, 0);
          return { pos: camera.position.clone(), target: f.target };
        });
        camera.aspect = w / h;
        if (fo.w < 1 || fo.x !== 0.5) camera.setViewOffset(w, h, -(fo.x - 0.5) * w, 0, w, h);
        camera.updateProjectionMatrix();
        if (fo.w < 1) spread = 8.5 / fo.w * 0.75;
      }
      layout();
      relayout.current = layout;
      const ro = new ResizeObserver(layout);
      ro.observe(el!);

      // Pointer
      const ptr = { x: 0, y: 0, tx: 0, ty: 0, down: false, lx: 0, moved: 0 };
      const ray = new THREE.Raycaster();
      let current = 0;
      const onMove = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        ptr.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
        ptr.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
        if (!ptr.down) return;
        const dx = e.clientX - ptr.lx;
        ptr.lx = e.clientX;
        ptr.moved += Math.abs(dx);
        if (ptr.moved > 6) {
          const gr = groups[current];
          gr.yawV = dx * 0.011; gr.yaw += gr.yawV;
          canvas.style.cursor = "grabbing";
        }
      };
      const onDown = (e: PointerEvent) => { ptr.down = true; ptr.lx = e.clientX; ptr.moved = 0; };
      const onUp = (e: PointerEvent) => {
        if (!ptr.down) return;
        ptr.down = false;
        canvas.style.cursor = "grab";
        if (ptr.moved >= 8) return;
        const r = canvas.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
        ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
        const gr = groups[current];
        let best: Piece | null = null, bd = Infinity;
        for (const p of gr.pieces) {
          const hs = ray.intersectObject(p.holder, true);
          if (hs.length && hs[0].distance < bd) { bd = hs[0].distance; best = p; }
        }
        if (best) bounce(best);
        else gr.pieces.forEach((p, i) => setTimeout(() => bounce(p), i * 110));
      };
      const onLeave = () => { ptr.tx = 0; ptr.ty = 0; };
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointerleave", onLeave);
      const onCancel = () => { ptr.down = false; };
      canvas.addEventListener("pointercancel", onCancel);

      // Render loop, only while on screen.
      let raf = 0, running = false, last = performance.now(), t = 0;
      const govern = makeGovernor(renderer, layout);
      // Shaders compile in the background, so the first frame never stalls the page.
      const ready: Promise<unknown> = renderer.compileAsync ? renderer.compileAsync(scene, camera).catch(() => {}) : Promise.resolve();
      let wanted = false;
      let landed = -1;
      const timers: number[] = [];
      const camPos = new THREE.Vector3(), camTarget = new THREE.Vector3(), right = new THREE.Vector3();
      function frame(now: number) {
        govern(now - last);
        const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
        ptr.x += (ptr.tx - ptr.x) * 0.06; ptr.y += (ptr.ty - ptr.y) * 0.06;
        const s = Math.max(0, Math.min(2, read.current()));
        const sgn = flowRef.current;
        current = Math.round(s);

        // a hop when a new stage settles
        if (Math.abs(s - current) < 0.04 && landed !== current) {
          if (landed !== -1) groups[current].pieces.forEach((p, i) => timers.push(window.setTimeout(() => bounce(p), 60 + i * 120)));
          landed = current;
        }

        groups.forEach((gr, k) => {
          const d = k - s;
          const ad = Math.abs(d);
          gr.g.visible = ad < 1.15;
          if (!gr.g.visible) return;
          if (!(ptr.down && k === current)) { gr.yaw += gr.yawV; gr.yawV *= 0.95; }
          // ease drag back towards the front when released and slow
          if (!ptr.down && Math.abs(gr.yawV) < 0.002) gr.yaw += (Math.round(gr.yaw / (Math.PI * 2)) * Math.PI * 2 - gr.yaw) * 0.02;
          gr.g.position.set(d * spread * sgn, -Math.min(1, ad) * 0.8, -Math.min(1, ad) * 1.5);
          gr.g.rotation.y = d * -1.1 * sgn + gr.yaw + (k > 0 ? t * 0.18 : Math.sin(t * 0.4) * 0.12);
          gr.g.scale.setScalar(1 - Math.min(1, ad) * 0.35);
          gr.pieces.forEach((p) => {
            const spin = animatePiece(p, t, dt, 0.05);
            p.holder.rotation.y = spin + (k === 0 ? Math.sin(t * 0.6 + p.phase) * 0.25 : 0);
          });
        });

        // camera drifts between the stage fits
        const a = Math.floor(s), b = Math.min(2, a + 1), f = s - a;
        const ef = f * f * (3 - 2 * f);
        camPos.lerpVectors(fits[a].pos, fits[b].pos, ef);
        camTarget.lerpVectors(fits[a].target, fits[b].target, ef);
        camera.position.copy(camPos);
        camera.lookAt(camTarget);
        camera.updateMatrixWorld();
        right.setFromMatrixColumn(camera.matrixWorld, 0);
        camera.position.addScaledVector(right, ptr.x * 0.5 + Math.sin(t * 0.25) * 0.15);
        camera.position.y += -ptr.y * 0.3 + Math.sin(t * 0.33) * 0.06;
        camera.lookAt(camTarget);

        renderer.render(scene, camera);
        if (running) raf = requestAnimationFrame(frame);
      }
      const start = () => {
        wanted = true;
        ready.then(() => { if (wanted && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); } });
      };
      const stop = () => { wanted = false; running = false; cancelAnimationFrame(raf); };
      const playIO = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop()), { threshold: 0.01 });
      playIO.observe(el!);
      const onVis = () => {
        if (document.hidden) stop();
        else { const r = el!.getBoundingClientRect(); if (r.bottom > 0 && r.top < window.innerHeight) start(); }
      };
      document.addEventListener("visibilitychange", onVis);

      teardown = () => {
        stop(); playIO.disconnect(); ro.disconnect();
        relayout.current = null;
        timers.forEach(clearTimeout);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointerleave", onLeave);
        canvas.removeEventListener("pointercancel", onCancel);
        document.removeEventListener("visibilitychange", onVis);
        disposeScene(scene);
        blob.dispose(); puff.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        canvas.remove();
      };
    }

    // Built when the stage is getting close, and handed back when it is far
    // away, so the GPU memory goes to whatever is on screen.
    const warmIO = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) void build(); },
      { rootMargin: "700px 0px" },
    );
    warmIO.observe(el);
    const farIO = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting || !built) return;
        teardown?.();
        teardown = null;
        built = false;
        gen++;
      },
      { rootMargin: "250% 0px" },
    );
    farIO.observe(el);
    return () => { cancelled = true; warmIO.disconnect(); farIO.disconnect(); teardown?.(); };
  }, [accent, cursorLabel]);

  if (failed) return <>{fallback}</>;
  return <div ref={wrap} role="img" aria-label={label} className={className} />;
}
