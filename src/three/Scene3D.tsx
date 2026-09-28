import { useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { buildModel, type Kind } from "./models";

interface Props {
  kinds: Kind[];
  accent: string;
  /** "row" lines the pieces up as a still life; "single" is one turntable piece. */
  mode: "row" | "single";
  onPick?: (kind: Kind) => void;
  fallback: ReactNode;
  className?: string;
  label: string;
}

function blobTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(64, 64, 4, 64, 64, 62);
  g.addColorStop(0, "rgba(40,50,25,0.38)");
  g.addColorStop(1, "rgba(40,50,25,0)");
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
function puffTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(32, 32, 2, 32, 32, 30);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

/**
 * Small WebGL stage for the procedural food and drink models. The heavy part
 * (renderer, geometry, textures) is only built once the stage is close to the
 * viewport, so a page with four of these pays for the ones a person is
 * actually about to see, not all four at once on load. Renders only while on
 * screen, tunes down for touch devices, and hands back to the flat art when
 * WebGL is missing or the person prefers reduced motion.
 */
export default function Scene3D({ kinds, accent, mode, onPick, fallback, className = "", label }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const pick = useRef(onPick);
  pick.current = onPick;

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

      const coarse = window.matchMedia("(pointer: coarse)").matches;
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: !coarse, alpha: true, powerPreference: "low-power" });
      } catch { setFailed(true); return; }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      const canvas = renderer.domElement;
      canvas.style.cssText = "display:block;width:100%;height:100%;touch-action:pan-y;outline:none";
      el!.appendChild(canvas);

      // Lights only, no PMREM-convolved environment: with several of these
      // stages able to be on a page at once, skipping the environment render
      // pass is the difference between a snappy mount and a stutter, and the
      // matte/porcelain/glass materials here read fine off three lights.
      const scene = new THREE.Scene();
      scene.add(new THREE.HemisphereLight(0xfff6e8, 0xdfe8cc, 0.7));
      const sun = new THREE.DirectionalLight(0xffffff, 1.5);
      sun.position.set(3, 6, 4); scene.add(sun);
      const fill = new THREE.DirectionalLight(0xcfe0ff, 0.45);
      fill.position.set(-4, 2, -3); scene.add(fill);

      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
      const blob = blobTexture();
      const puff = puffTexture();

      // Build every piece once, normalised to a common footprint.
      interface Item { kind: Kind; group: THREE.Group; holder: THREE.Group; baseScale: number; phase: number; hover: number; }
      const items: Item[] = kinds.map((kind, i) => {
        const model = buildModel(kind, accent);
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const target = kind === "iced" || kind === "juice" ? 3.1 : 2.9;
        const s = target / Math.max(size.y * (kind === "iced" || kind === "juice" ? 1 : 2.2), size.x, size.z);
        model.scale.setScalar(s);
        const b2 = new THREE.Box3().setFromObject(model);
        model.position.y -= b2.min.y;
        const holder = new THREE.Group();
        holder.add(model);
        const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.2), new THREE.MeshBasicMaterial({ map: blob, transparent: true, depthWrite: false }));
        shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.01;
        const root = new THREE.Group();
        root.add(shadow, holder);
        scene.add(root);
        const steam = model.userData.steam as THREE.Vector3 | undefined;
        if (steam) {
          for (let k = 0; k < 7; k++) {
            const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: puff, transparent: true, depthWrite: false, opacity: 0 }));
            sp.userData = { puff: true, k, base: steam.clone().multiplyScalar(s) };
            holder.add(sp);
          }
        }
        return { kind, group: root, holder, baseScale: 1, phase: i * 1.3, hover: 0 };
      });

      const spacing = 3.5;
      let visibleItems: Item[] = items;
      let dist = 14;
      function layout() {
        const w = el!.clientWidth || 1, h = el!.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        if (mode === "single") {
          visibleItems = items.slice(0, 1);
          items.forEach((it, i) => (it.group.visible = i === 0));
          items[0].group.position.set(0, 0, 0);
          const tall = items[0].kind === "iced" || items[0].kind === "juice";
          const halfH = tall ? 2.3 : 1.5;
          dist = Math.max(halfH / Math.tan((camera.fov * Math.PI) / 360), 2.2 / (Math.tan((camera.fov * Math.PI) / 360) * camera.aspect));
          camera.position.set(0, tall ? 2.0 : 2.4, dist);
          camera.lookAt(0, tall ? 1.55 : 0.6, 0);
        } else {
          const narrow = camera.aspect < 1.25;
          const wanted: Kind[] = narrow ? ["cup", "feteer", "steak"] : ["iced", "cup", "feteer", "steak", "juice"];
          visibleItems = items.filter((it) => wanted.includes(it.kind));
          items.forEach((it) => (it.group.visible = visibleItems.includes(it)));
          const n = visibleItems.length;
          const sp = narrow ? 1.85 : spacing;
          visibleItems.forEach((it, i) => {
            const mid = narrow && i === (n - 1) / 2;
            it.group.scale.setScalar(narrow ? (mid ? 1.05 : 0.8) : 1);
            it.group.position.set((i - (n - 1) / 2) * sp, 0, narrow ? (mid ? 1.5 : -0.9) : i % 2 ? -0.2 : 0.25);
          });
          const halfW = ((n - 1) * sp) / 2 + (narrow ? 1.2 : 1.9);
          const halfH = narrow ? 1.7 : 2.1;
          dist = Math.max(halfH / Math.tan((camera.fov * Math.PI) / 360), halfW / (Math.tan((camera.fov * Math.PI) / 360) * camera.aspect));
          camera.position.set(0, 3.2, dist);
          camera.lookAt(0, 1.05, 0);
        }
        camera.updateProjectionMatrix();
      }
      layout();
      const ro = new ResizeObserver(layout);
      ro.observe(el!);

      // Pointer: parallax, hover, click, drag
      const ptr = { x: 0, y: 0, tx: 0, ty: 0, down: false, sx: 0, sy: 0, moved: 0, drag: 0, dragV: 0 };
      const ray = new THREE.Raycaster();
      let hovered: Item | null = null;
      function hit(e: PointerEvent): Item | null {
        const r = canvas.getBoundingClientRect();
        const v = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(v, camera);
        let best: Item | null = null, bd = Infinity;
        for (const it of visibleItems) {
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
          ptr.moved += Math.abs(e.clientX - ptr.sx) + Math.abs(e.clientY - ptr.sy);
          ptr.dragV = (e.clientX - ptr.sx) * 0.012; ptr.drag += ptr.dragV;
          ptr.sx = e.clientX; ptr.sy = e.clientY;
        } else if (mode === "row" && e.pointerType === "mouse") {
          hovered = hit(e);
          canvas.style.cursor = hovered ? "pointer" : "default";
        }
      };
      const onDown = (e: PointerEvent) => { ptr.down = true; ptr.sx = e.clientX; ptr.sy = e.clientY; ptr.moved = 0; };
      const onUp = (e: PointerEvent) => {
        const wasClick = ptr.down && ptr.moved < 8;
        ptr.down = false;
        if (wasClick && mode === "row") { const h = hit(e); if (h) pick.current?.(h.kind); }
      };
      const onLeave = () => { ptr.tx = 0; ptr.ty = 0; hovered = null; ptr.down = false; };
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointerleave", onLeave);

      // Tilt with the phone, where the browser lets us.
      const onTilt = (e: DeviceOrientationEvent) => {
        if (e.gamma == null || e.beta == null) return;
        ptr.tx = Math.max(-1, Math.min(1, e.gamma / 30));
        ptr.ty = Math.max(-1, Math.min(1, (e.beta - 50) / 30));
      };
      if (window.matchMedia("(hover: none)").matches) window.addEventListener("deviceorientation", onTilt);

      // Render loop, only while on screen
      let raf = 0, running = false, last = performance.now(), t = 0;
      function frame(now: number) {
        const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
        ptr.x += (ptr.tx - ptr.x) * 0.06; ptr.y += (ptr.ty - ptr.y) * 0.06;
        if (!ptr.down) { ptr.drag += ptr.dragV; ptr.dragV *= 0.94; }

        let scroll = 0;
        if (mode === "single") {
          const r = el!.getBoundingClientRect();
          scroll = ((window.innerHeight - r.top) / (window.innerHeight + r.height)) * Math.PI * 1.4;
        }

        visibleItems.forEach((it) => {
          const hv = hovered === it ? 1 : 0;
          it.hover += (hv - it.hover) * 0.12;
          const bob = Math.sin(t * 1.2 + it.phase) * 0.06;
          it.holder.position.y = bob + it.hover * 0.18;
          it.holder.scale.setScalar(1 + it.hover * 0.06);
          if (mode === "single") it.holder.rotation.y = 0.5 + scroll + ptr.drag + t * 0.25;
          else it.holder.rotation.y = Math.sin(t * 0.5 + it.phase) * 0.35 + ptr.x * 0.5 + it.hover * 0.6;
          it.holder.rotation.x = mode === "row" ? ptr.y * 0.08 : 0;
          it.holder.children.forEach((c) => {
            if (c.userData?.puff) {
              const k = c.userData.k as number, base = c.userData.base as THREE.Vector3;
              const p = ((t * 0.28 + k / 7) % 1);
              c.position.set(base.x + Math.sin(p * 6 + k) * 0.12, base.y + p * 1.4, base.z + Math.cos(p * 5 + k) * 0.08);
              c.scale.setScalar(0.35 + p * 0.7);
              (c as THREE.Sprite).material.opacity = Math.sin(p * Math.PI) * 0.4;
            }
          });
        });
        if (mode === "row") { camera.position.x = ptr.x * 0.6; camera.lookAt(0, 1.05, 0); }
        renderer.render(scene, camera);
        if (running) raf = requestAnimationFrame(frame);
      }
      const start = () => { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); } };
      const stop = () => { running = false; cancelAnimationFrame(raf); };
      const playIO = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.02 });
      playIO.observe(el!);
      const onVis = () => (document.hidden ? stop() : undefined);
      document.addEventListener("visibilitychange", onVis);

      teardown = () => {
        stop(); playIO.disconnect(); ro.disconnect();
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("deviceorientation", onTilt);
        document.removeEventListener("visibilitychange", onVis);
        scene.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.geometry) m.geometry.dispose();
          const mat = m.material as THREE.Material | THREE.Material[] | undefined;
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose()); else mat?.dispose();
        });
        blob.dispose(); puff.dispose();
        renderer.dispose();
        canvas.remove();
      };
    }

    // Don't pay for a renderer, geometry and textures until the stage is
    // getting close to the viewport — a page can hold several of these.
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
