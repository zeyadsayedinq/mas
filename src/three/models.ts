import * as THREE from "three";

export type Kind = "cup" | "steak" | "feteer" | "iced" | "juice";

const std = (color: number | string, rough = 0.5, metal = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });

const glassMat = () =>
  new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.22,
    clearcoat: 1, clearcoatRoughness: 0.05, side: THREE.DoubleSide, depthWrite: false,
  });

const lathe = (pts: [number, number][], mat: THREE.Material, seg = 26) =>
  new THREE.Mesh(new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg), mat);

function cast<T extends THREE.Object3D>(o: T): T {
  o.traverse((c) => { if ((c as THREE.Mesh).isMesh) { c.castShadow = false; } });
  return o;
}

/** Cup of coffee on a saucer. Height about 1.1, radius about 1.1. */
function cup(accent: string) {
  const g = new THREE.Group();
  const porcelain = std(0xfaf8f2, 0.25);
  g.add(lathe([[0, 0], [0.95, 0], [1.05, 0.05], [1.12, 0.14], [1.1, 0.16], [0.5, 0.11], [0, 0.1]], porcelain));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.018, 6, 28), std(accent, 0.4));
  ring.rotation.x = Math.PI / 2; ring.position.y = 0.155; g.add(ring);
  const body = lathe([[0, 0.12], [0.3, 0.12], [0.42, 0.2], [0.62, 0.55], [0.7, 0.98], [0.66, 1.0], [0.6, 0.98], [0.56, 0.6], [0.4, 0.3], [0, 0.26]], porcelain);
  body.position.y = 0.05; g.add(body);
  const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.59, 22), std(0x3b2314, 0.25));
  coffee.rotation.x = -Math.PI / 2; coffee.position.y = 0.86; g.add(coffee);
  const crema = new THREE.Mesh(new THREE.RingGeometry(0.34, 0.5, 22), std(0x9a6a3e, 0.4));
  crema.rotation.x = -Math.PI / 2; crema.position.y = 0.865; g.add(crema);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.06, 10, 28, Math.PI * 1.15), porcelain);
  handle.position.set(0.66, 0.62, 0); handle.rotation.z = -Math.PI * 0.62; g.add(handle);
  g.userData.steam = new THREE.Vector3(0, 1.0, 0);
  return g;
}

/** Steak on a board with grill marks and a herb sprig. */
function steak() {
  const g = new THREE.Group();
  const board = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.3, 0.16, 26), std(0x6b4a2e, 0.7));
  board.position.y = 0.08; g.add(board);
  const groove = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.02, 5, 26), std(0x4d341f, 0.8));
  groove.rotation.x = Math.PI / 2; groove.position.y = 0.165; g.add(groove);
  const meat = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), std(0x6e3220, 0.55));
  meat.scale.set(0.98, 0.26, 0.7); meat.position.set(-0.05, 0.36, 0); meat.rotation.y = 0.2; g.add(meat);
  for (let i = -2; i <= 2; i++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.95 - Math.abs(i) * 0.12), std(0x1e100a, 0.7));
    m.position.set(i * 0.24 - 0.05, 0.6 - Math.abs(i) * 0.025 + 0.02, 0); m.rotation.y = 0.55; g.add(m);
  }
  for (let i = 0; i < 3; i++) {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8), std(0x5f8a2f, 0.6));
    leaf.scale.set(1.6, 0.35, 0.7); leaf.position.set(0.55 + i * 0.16, 0.6 - i * 0.02, 0.28 - i * 0.12); leaf.rotation.y = i * 0.9; g.add(leaf);
  }
  return g;
}

/** Feteer: golden layered stack on a white plate. */
function feteer(accent: string) {
  const g = new THREE.Group();
  const plate = lathe([[0, 0], [1.25, 0], [1.4, 0.06], [1.5, 0.16], [1.45, 0.17], [1.2, 0.09], [0, 0.08]], std(0xfaf8f2, 0.3));
  g.add(plate);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.02, 6, 28), std(accent, 0.4));
  rim.rotation.x = Math.PI / 2; rim.position.y = 0.14; g.add(rim);
  const gold = [0xc4801f, 0xcf8d28, 0xb87418, 0xd89a35];
  for (let i = 0; i < 5; i++) {
    const r = 1.0 - Math.abs(i - 2) * 0.03 + (i % 2) * 0.03;
    const d = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.97, r, 0.1, 26), std(gold[i % 4], 0.55));
    d.position.y = 0.16 + i * 0.09; d.rotation.y = i * 0.6; g.add(d);
  }
  const top = new THREE.Mesh(new THREE.SphereGeometry(1, 22, 8), std(0xd9982f, 0.3));
  top.scale.set(0.95, 0.09, 0.95); top.position.y = 0.66; g.add(top);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), std(0xa96a1d, 0.6));
    dot.position.set(Math.cos(a) * 0.55, 0.72, Math.sin(a) * 0.55); g.add(dot);
  }
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8), std(0x6f9a38, 0.5));
  leaf.scale.set(1.5, 0.3, 0.7); leaf.position.set(0.1, 0.75, 0.05); leaf.rotation.y = 0.6; g.add(leaf);
  return g;
}

function tallGlass(liquid: number, cream: number | null, accent: string, ice: boolean) {
  const g = new THREE.Group();
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.52, 2.1, 22, 1, true), glassMat());
  shell.position.y = 1.15; g.add(shell);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.1, 22), glassMat());
  base.position.y = 0.1; g.add(base);
  const liq = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.5, cream ? 1.05 : 1.6, 22), std(liquid, 0.2));
  liq.position.y = cream ? 0.66 : 0.95; g.add(liq);
  if (cream) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.58, 0.7, 22), std(cream, 0.35));
    c.position.y = 1.55; g.add(c);
  }
  if (ice) {
    for (let i = 0; i < 4; i++) {
      const cb = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, roughness: 0.1, clearcoat: 1 }));
      cb.position.set(Math.cos(i * 1.9) * 0.22, 1.5 + (i % 2) * 0.22, Math.sin(i * 1.9) * 0.22);
      cb.rotation.set(i, i * 1.3, i * 0.7); g.add(cb);
    }
  }
  const straw = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.5, 10), std(accent, 0.4));
  straw.position.set(0.2, 1.55, 0); straw.rotation.z = -0.12; g.add(straw);
  return g;
}

const iced = (accent: string) => tallGlass(0x4a2a17, 0xf0e2c8, accent, true);

function juice(accent: string) {
  const g = tallGlass(0xffa62b, null, accent, false);
  const slice = new THREE.Group();
  const rind = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.06, 18), std(0xff8f1f, 0.5));
  const flesh = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.07, 18), std(0xffc04d, 0.4));
  slice.add(rind, flesh);
  slice.rotation.x = Math.PI / 2; slice.position.set(0.5, 2.05, 0.05); slice.rotation.y = 0.4;
  g.add(slice);
  return g;
}

export function buildModel(kind: Kind, accent: string): THREE.Group {
  const m = kind === "cup" ? cup(accent) : kind === "steak" ? steak() : kind === "feteer" ? feteer(accent) : kind === "iced" ? iced(accent) : juice(accent);
  cast(m);
  m.userData.kind = kind;
  return m;
}

/** Height of each model, so the scene can centre and scale them. */
export const HEIGHT: Record<Kind, number> = { cup: 1.1, steak: 1.0, feteer: 0.9, iced: 2.7, juice: 2.7 };
