import * as THREE from "three";
import { buildModel, type Kind } from "./models";

/**
 * Shared pieces for the two Aroma WebGL stages (hero still life and the
 * scroll story): renderer setup, lights, the normalised model "piece", the
 * bounce-spin, steam puffs, camera fitting and a full teardown.
 */

export const TALL = (k: Kind) => k === "iced" || k === "juice";

export function blobTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(64, 64, 4, 64, 64, 62);
  g.addColorStop(0, "rgba(40,50,25,0.38)");
  g.addColorStop(1, "rgba(40,50,25,0)");
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export function puffTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(32, 32, 2, 32, 32, 30);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

/** A renderer tuned for these small stages, or null when WebGL is missing. */
export function makeRenderer(host: HTMLElement): { renderer: THREE.WebGLRenderer; canvas: HTMLCanvasElement; coarse: boolean } | null {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: !coarse, alpha: true, powerPreference: "low-power" });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const canvas = renderer.domElement;
  canvas.style.cssText = "display:block;width:100%;height:100%;touch-action:pan-y;outline:none;-webkit-user-select:none;user-select:none";
  host.appendChild(canvas);
  return { renderer, canvas, coarse };
}

/**
 * Lights only, no PMREM environment: skipping the environment pass keeps the
 * mount snappy, and the matte, porcelain and glass materials read fine off
 * three lights.
 */
export function addLights(scene: THREE.Scene) {
  scene.add(new THREE.HemisphereLight(0xfff6e8, 0xdfe8cc, 0.7));
  const sun = new THREE.DirectionalLight(0xffffff, 1.5);
  sun.position.set(3, 6, 4); scene.add(sun);
  const fill = new THREE.DirectionalLight(0xcfe0ff, 0.45);
  fill.position.set(-4, 2, -3); scene.add(fill);
}

export interface Piece {
  kind: Kind;
  /** Placed by the layout (position, scale). */
  root: THREE.Group;
  /** Animated (bob, spin, bounce). Holds the model. */
  holder: THREE.Group;
  phase: number;
  hover: number;
  /** Seconds since the bounce-spin started; <0 when idle. */
  spinT: number;
  /** Extra yaw from drag / spins, eased. */
  yaw: number;
  yawV: number;
  /** Seconds since it dropped in; drives the entrance. */
  enterAt: number;
  /** Local height, for labels and fitting. */
  height: number;
  width: number;
}

/** One model, normalised to a common footprint, with a contact shadow and steam. */
export function makePiece(kind: Kind, accent: string, blob: THREE.Texture, puff: THREE.Texture, phase = 0): Piece {
  const model = buildModel(kind, accent);
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const tall = TALL(kind);
  const target = tall ? 3.1 : 2.9;
  const s = target / Math.max(size.y * (tall ? 1 : 2.2), size.x, size.z);
  model.scale.setScalar(s);
  const b2 = new THREE.Box3().setFromObject(model);
  const c2 = b2.getCenter(new THREE.Vector3());
  model.position.y -= b2.min.y;
  model.position.x -= c2.x;
  model.position.z -= c2.z;
  const holder = new THREE.Group();
  holder.add(model);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 3.2),
    new THREE.MeshBasicMaterial({ map: blob, transparent: true, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.01;
  shadow.userData.shadow = true;
  const root = new THREE.Group();
  root.add(shadow, holder);
  const steam = model.userData.steam as THREE.Vector3 | undefined;
  if (steam) {
    for (let k = 0; k < 7; k++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: puff, transparent: true, depthWrite: false, opacity: 0 }));
      sp.userData = { puff: true, k, base: steam.clone().multiplyScalar(s).add(model.position) };
      holder.add(sp);
    }
  }
  const sz = b2.getSize(new THREE.Vector3());
  return { kind, root, holder, phase, hover: 0, spinT: -1, yaw: 0, yawV: 0, enterAt: 0, height: sz.y, width: Math.max(sz.x, sz.z) };
}

const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

/** Kick off the playful bounce-spin on a piece. */
export function bounce(p: Piece) {
  if (p.spinT < 0 || p.spinT > 0.5) p.spinT = 0;
}

/**
 * Per-frame animation shared by both stages: idle bob, hover lift, the
 * bounce-spin (jump, squash on landing, one full turn) and steam.
 * Returns the extra yaw the bounce adds, so callers can add their own.
 */
export function animatePiece(p: Piece, t: number, dt: number, idleBob = 0.06) {
  let y = Math.sin(t * 1.2 + p.phase) * idleBob + p.hover * 0.18;
  let sy = 1, sxz = 1, spin = 0;
  if (p.spinT >= 0) {
    p.spinT += dt;
    const d = 0.95;
    const k = Math.min(1, p.spinT / d);
    spin = easeOut(k) * Math.PI * 2;
    // up and down in the first 70%, then a squash on landing
    if (k < 0.7) {
      const u = k / 0.7;
      y += Math.sin(u * Math.PI) * 0.9;
      sy = 1 + Math.sin(u * Math.PI) * 0.06;
      sxz = 1 - Math.sin(u * Math.PI) * 0.03;
    } else {
      const u = (k - 0.7) / 0.3;
      const sq = Math.sin(u * Math.PI) * (1 - u) * 0.16;
      sy = 1 - sq; sxz = 1 + sq * 0.6;
    }
    if (k >= 1) p.spinT = -1;
  }
  const hs = 1 + p.hover * 0.06;
  p.holder.position.y = y;
  p.holder.scale.set(sxz * hs, sy * hs, sxz * hs);
  // steam
  for (const c of p.holder.children) {
    if (!c.userData?.puff) continue;
    const k = c.userData.k as number, base = c.userData.base as THREE.Vector3;
    const ph = (t * 0.28 + k / 7) % 1;
    c.position.set(base.x + Math.sin(ph * 6 + k) * 0.12, base.y + ph * 1.4, base.z + Math.cos(ph * 5 + k) * 0.08);
    c.scale.setScalar(0.35 + ph * 0.7);
    (c as THREE.Sprite).material.opacity = Math.sin(ph * Math.PI) * 0.4;
  }
  return spin;
}

/** The eight corners of a piece's footprint box, in world space. */
export function pieceCorners(p: Piece, out: THREE.Vector3[] = []) {
  p.root.updateMatrixWorld(true);
  const w = p.width / 2, h = p.height;
  const pts: [number, number, number][] = [];
  for (const x of [-w, w]) for (const y of [0, h]) for (const z of [-w, w]) pts.push([x, y, z]);
  for (const [x, y, z] of pts) out.push(new THREE.Vector3(x, y, z).applyMatrix4(p.root.matrixWorld));
  return out;
}

/**
 * Put the camera on a given elevation (radians above the horizon) and find
 * the distance and aim that make the points fill the frame with a margin.
 */
export function fitCamera(camera: THREE.PerspectiveCamera, pts: THREE.Vector3[], elev: number, margin = 0.86, yaw = 0) {
  const dir = new THREE.Vector3(Math.sin(yaw) * Math.cos(elev), Math.sin(elev), Math.cos(yaw) * Math.cos(elev));
  const target = new THREE.Vector3();
  for (const p of pts) target.add(p);
  target.divideScalar(Math.max(1, pts.length));
  const v = new THREE.Vector3();
  const place = (d: number) => {
    camera.position.copy(target).addScaledVector(dir, d);
    camera.lookAt(target);
    camera.updateMatrixWorld(true);
  };
  const extent = () => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of pts) {
      v.copy(p).project(camera);
      minX = Math.min(minX, v.x); maxX = Math.max(maxX, v.x);
      minY = Math.min(minY, v.y); maxY = Math.max(maxY, v.y);
    }
    return { minX, maxX, minY, maxY };
  };
  let dist = 10;
  for (let pass = 0; pass < 3; pass++) {
    let lo = 1, hi = 80;
    for (let i = 0; i < 22; i++) {
      const mid = (lo + hi) / 2;
      place(mid);
      const e = extent();
      const s = Math.max(Math.abs(e.minX), Math.abs(e.maxX), Math.abs(e.minY), Math.abs(e.maxY));
      if (s > margin) lo = mid; else hi = mid;
    }
    dist = hi;
    place(dist);
    // recentre on the projected box
    const e = extent();
    const cx = (e.minX + e.maxX) / 2, cy = (e.minY + e.maxY) / 2;
    const halfH = Math.tan((camera.fov * Math.PI) / 360) * dist;
    const halfW = halfH * camera.aspect;
    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
    target.addScaledVector(right, cx * halfW).addScaledVector(up, cy * halfH);
  }
  place(dist);
  return { target: target.clone(), dist, dir };
}

/** Dispose every geometry, material and owned texture under the scene. */
export function disposeScene(scene: THREE.Scene) {
  scene.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    const drop = (x: THREE.Material) => {
      if (x.userData?.disposeMaps) (x as THREE.MeshStandardMaterial).map?.dispose();
      x.dispose();
    };
    if (Array.isArray(mat)) mat.forEach(drop); else if (mat) drop(mat);
  });
}

/** Screen point (px, relative to the canvas) of a world position. */
export function toScreen(v: THREE.Vector3, camera: THREE.Camera, canvas: HTMLCanvasElement) {
  const p = v.clone().project(camera);
  return { x: ((p.x + 1) / 2) * canvas.clientWidth, y: ((1 - p.y) / 2) * canvas.clientHeight };
}
