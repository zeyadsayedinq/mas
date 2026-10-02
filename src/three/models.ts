import * as THREE from "three";

export type Kind = "cup" | "steak" | "feteer" | "iced" | "juice";

const TAU = Math.PI * 2;
const V2 = (x: number, y: number) => new THREE.Vector2(x, y);

/* ------------------------------------------------------------------ helpers */

/** Small seeded PRNG so every build draws the same textures. */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Gaussian-ish bump on a circular parameter. */
function bump(t: number, c: number, w: number) {
  const d = Math.atan2(Math.sin(t - c), Math.cos(t - c));
  return Math.exp(-(d * d) / (w * w));
}

function canvasTex(w: number, h: number, draw: (x: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Tag a material whose map (and bumpMap, always the same texture here) the scene should dispose. */
function owns<M extends THREE.Material>(m: M): M {
  m.userData.disposeMaps = true;
  return m;
}

const std = (color: number | string, rough = 0.5, metal = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });

const porcelainMat = () =>
  new THREE.MeshPhysicalMaterial({ color: 0xfbf9f4, emissive: 0x302e2a, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.12 });

/**
 * Glass without transmission or an environment: low base opacity, and the
 * fragment's alpha is lifted at grazing angles and wherever a light's
 * highlight lands, so the silhouette and rim read as glass off lights alone.
 */
function glassMat(opacity = 0.12, edge = 0.55, color = 0xffffff) {
  const m = new THREE.MeshPhysicalMaterial({
    color, roughness: 0.06, metalness: 0, transparent: true, opacity,
    clearcoat: 1, clearcoatRoughness: 0.04, side: THREE.DoubleSide, depthWrite: false,
  });
  const e = edge.toFixed(2);
  m.onBeforeCompile = (s) => {
    s.fragmentShader = s.fragmentShader.replace(
      "#include <opaque_fragment>",
      `float gEdge = pow(1.0 - saturate(abs(dot(geometryNormal, geometryViewDir))), 2.2);
      vec3 gSpec = reflectedLight.directSpecular;
      #ifdef USE_CLEARCOAT
        gSpec += clearcoatSpecularDirect;
      #endif
      float gHi = max(max(gSpec.r, gSpec.g), gSpec.b);
      outgoingLight += vec3(0.92, 0.96, 1.0) * gEdge * ${e} * 0.45;
      diffuseColor.a = saturate(diffuseColor.a + gEdge * ${e} + gHi * 0.9);
      #include <opaque_fragment>`,
    );
  };
  m.customProgramCacheKey = () => "aroma-glass-" + e;
  return m;
}

const lathe = (pts: [number, number][], mat: THREE.Material, seg = 32) =>
  new THREE.Mesh(new THREE.LatheGeometry(pts.map(([x, y]) => V2(x, y)), seg), mat);

/** Smooth normals per material group of a non-indexed geometry (ExtrudeGeometry is faceted otherwise). */
function smoothNormals(geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const nor = geo.attributes.normal as THREE.BufferAttribute;
  const groups = geo.groups.length ? geo.groups : [{ start: 0, count: pos.count }];
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const key = (i: number) => `${Math.round(pos.getX(i) * 1e4)},${Math.round(pos.getY(i) * 1e4)},${Math.round(pos.getZ(i) * 1e4)}`;
  for (const gr of groups) {
    const acc = new Map<string, THREE.Vector3>();
    for (let i = gr.start; i < gr.start + gr.count; i += 3) {
      a.fromBufferAttribute(pos, i); b.fromBufferAttribute(pos, i + 1); c.fromBufferAttribute(pos, i + 2);
      const n = b.clone().sub(a).cross(c.clone().sub(a));
      for (let k = 0; k < 3; k++) {
        const kk = key(i + k);
        const v = acc.get(kk);
        if (v) v.add(n); else acc.set(kk, n.clone());
      }
    }
    for (let i = gr.start; i < gr.start + gr.count; i++) {
      const n = acc.get(key(i))!.clone().normalize();
      nor.setXYZ(i, n.x, n.y, n.z);
    }
  }
  nor.needsUpdate = true;
}

/** Extrude a flat outline upward with a bevel; cap UVs span the outline's bounding box. */
function slab(shape: THREE.Shape, depth: number, bevel: number, segs = 3, curveSegments = 6) {
  const box = new THREE.Box2().setFromPoints(shape.getPoints(curveSegments));
  const w = box.max.x - box.min.x, h = box.max.y - box.min.y;
  const uv: THREE.UVGenerator = {
    generateTopUV: (_g, v, ia, ib, ic) =>
      [ia, ib, ic].map((i) => V2((v[i * 3] - box.min.x) / w, (v[i * 3 + 1] - box.min.y) / h)),
    generateSideWallUV: () => [V2(0, 0), V2(1, 0), V2(1, 1), V2(0, 1)],
  };
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: segs,
    curveSegments, steps: 1, UVGenerator: uv,
  });
  smoothNormals(geo);
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, bevel, 0);
  return { geo, box, w, h, top: depth + bevel * 2 };
}

/** Canvas whose drawing space is the outline's own units (y up), uniformly scaled. */
function shapeCanvas(box: THREE.Box2, w: number, h: number, draw: (x: CanvasRenderingContext2D, px: number) => void) {
  const W = 512, H = Math.round((512 * h) / w);
  const k = W / w;
  return canvasTex(W, H, (x) => {
    x.setTransform(k, 0, 0, -k, -box.min.x * k, box.max.y * k);
    draw(x, 1 / k);
  });
}

const tracePoly = (x: CanvasRenderingContext2D, pts: THREE.Vector2[]) => {
  x.beginPath();
  pts.forEach((p, i) => (i ? x.lineTo(p.x, p.y) : x.moveTo(p.x, p.y)));
  x.closePath();
};

/* ---------------------------------------------------------------- coffee cup */

function latteTex() {
  return canvasTex(512, 512, (x) => {
    const r = rng(11), c = 256;
    x.fillStyle = "#3e2210"; x.fillRect(0, 0, 512, 512);
    const g = x.createRadialGradient(c, c, 40, c, c, 256);
    g.addColorStop(0, "#b8834f"); g.addColorStop(0.62, "#a06a3a"); g.addColorStop(0.88, "#7a4522"); g.addColorStop(1, "#4a2712");
    x.fillStyle = g; x.beginPath(); x.arc(c, c, 256, 0, TAU); x.fill();
    for (let i = 0; i < 380; i++) {
      x.fillStyle = r() < 0.5 ? `rgba(214,168,112,${0.08 + r() * 0.14})` : `rgba(96,52,24,${0.08 + r() * 0.14})`;
      const a = r() * TAU, d = Math.sqrt(r()) * 240;
      x.beginPath(); x.arc(c + Math.cos(a) * d, c + Math.sin(a) * d, 2 + r() * 7, 0, TAU); x.fill();
    }
    // rosetta: nested leaves narrowing to a heart, pulled through by one line
    x.save();
    x.translate(c, c + 6); x.rotate(-0.1);
    x.lineCap = "round";
    x.shadowColor = "rgba(250,242,228,0.85)"; x.shadowBlur = 7;
    x.strokeStyle = "#f8f0e3";
    for (let i = 0; i < 10; i++) {
      const y = 158 - i * 30, hw = 158 - i * 13.5, sag = 36 - i * 1.6;
      x.lineWidth = 17 - i * 0.9;
      x.beginPath(); x.moveTo(-hw, y - sag); x.quadraticCurveTo(0, y + sag * 1.2, hw, y - sag); x.stroke();
    }
    x.fillStyle = "#f8f0e3";
    x.beginPath(); x.ellipse(0, -150, 36, 30, 0, 0, TAU); x.fill();
    x.shadowBlur = 3; x.shadowColor = "rgba(150,96,52,0.8)";
    x.strokeStyle = "#a8703f"; x.lineWidth = 6;
    x.beginPath(); x.moveTo(0, -178); x.quadraticCurveTo(4, 20, 0, 212); x.stroke();
    x.restore();
    // darker crema meniscus at the wall
    const e = x.createRadialGradient(c, c, 200, c, c, 256);
    e.addColorStop(0, "rgba(60,30,12,0)"); e.addColorStop(1, "rgba(60,30,12,0.75)");
    x.fillStyle = e; x.beginPath(); x.arc(c, c, 256, 0, TAU); x.fill();
  });
}

/** Cup of coffee on a saucer. Height about 1.1, radius about 1.1. */
function cup(accent: string) {
  const g = new THREE.Group();
  const porcelain = porcelainMat();
  g.add(lathe([[0, 0], [0.95, 0], [1.05, 0.05], [1.12, 0.14], [1.1, 0.16], [0.5, 0.11], [0, 0.1]], porcelain));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.016, 6, 40), std(accent, 0.4));
  ring.rotation.x = Math.PI / 2; ring.position.y = 0.153; g.add(ring);
  const body = lathe([[0, 0.12], [0.3, 0.12], [0.37, 0.15], [0.45, 0.23], [0.53, 0.36], [0.6, 0.52], [0.65, 0.68], [0.68, 0.84], [0.7, 0.98], [0.66, 1.0], [0.6, 0.98], [0.58, 0.8], [0.54, 0.6], [0.46, 0.42], [0.36, 0.32], [0, 0.28]], porcelain);
  body.position.y = 0.05; g.add(body);
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.692, 0.012, 6, 40), std(accent, 0.4));
  band.rotation.x = Math.PI / 2; band.position.y = 0.97; g.add(band);
  const coffee = new THREE.Mesh(
    new THREE.CircleGeometry(0.588, 32),
    owns(new THREE.MeshStandardMaterial({ map: latteTex(), roughness: 0.32 })),
  );
  coffee.rotation.x = -Math.PI / 2; coffee.position.y = 0.915; g.add(coffee);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.06, 10, 28, Math.PI * 1.15), porcelain);
  handle.position.set(0.66, 0.62, 0); handle.rotation.z = -Math.PI * 0.62; g.add(handle);
  g.userData.steam = new THREE.Vector3(0, 1.0, 0);
  return g;
}

/* --------------------------------------------------------------------- steak */

/** Rib eye outline radius at angle t: a lopsided kidney with a fatty tail. */
function ribeyeR(t: number) {
  let r = 1 + 0.045 * Math.sin(3 * t + 0.7) + 0.03 * Math.sin(5 * t + 2.1) + 0.015 * Math.sin(8 * t + 0.4);
  r *= 1 - 0.2 * bump(t, 4.35, 0.38);
  r *= 1 + 0.12 * bump(t, 0.2, 0.55);
  r *= 1 - 0.06 * bump(t, 2.3, 0.4);
  return r;
}
const RX = 0.9, RY = 0.6;
const ribeyeAt = (t: number, s = 1) => V2(Math.cos(t) * RX * ribeyeR(t) * s, Math.sin(t) * RY * ribeyeR(t) * s);

function ribeyeTex(box: THREE.Box2, w: number, h: number, outline: THREE.Vector2[]) {
  return shapeCanvas(box, w, h, (x, px) => {
    const r = rng(3);
    x.fillStyle = "#4a2412"; x.fillRect(box.min.x - 1, box.min.y - 1, w + 2, h + 2);
    x.save();
    tracePoly(x, outline); x.clip();
    const base = x.createRadialGradient(-0.1, 0.02, 0, -0.1, 0.02, 1.05);
    base.addColorStop(0, "#b56c3c"); base.addColorStop(0.55, "#9a5529"); base.addColorStop(1, "#6e3519");
    x.fillStyle = base; x.fillRect(box.min.x, box.min.y, w, h);
    const tones = ["#a3602f", "#6a3219", "#b36f3b", "#4a220f", "#8c4a24"];
    for (let i = 0; i < 700; i++) {
      x.globalAlpha = 0.1 + r() * 0.22;
      x.fillStyle = tones[(r() * tones.length) | 0];
      x.beginPath();
      x.ellipse(box.min.x + r() * w, box.min.y + r() * h, 0.01 + r() * 0.04, 0.008 + r() * 0.025, r() * 3, 0, TAU);
      x.fill();
    }
    x.globalAlpha = 1;
    // fat cap along the tail edge, rendered golden on the grill
    x.lineJoin = "round"; x.lineCap = "round";
    const edge: THREE.Vector2[] = [];
    for (let t = -1.0; t <= 1.35; t += 0.05) edge.push(ribeyeAt(t));
    const fatLine = (pts: THREE.Vector2[], width: number, color: string) => {
      x.strokeStyle = color; x.lineWidth = width;
      x.beginPath(); pts.forEach((p, i) => (i ? x.lineTo(p.x, p.y) : x.moveTo(p.x, p.y))); x.stroke();
    };
    fatLine(edge, 0.36, "rgba(206,150,90,0.45)");
    fatLine(edge, 0.24, "rgba(232,190,128,0.95)");
    // seam of fat between the eye and the cap
    const seam: THREE.Vector2[] = [];
    for (let t = -1.5; t <= 1.9; t += 0.05) {
      const p = ribeyeAt(t, 0.64 + 0.05 * Math.sin(t * 3));
      seam.push(p.add(V2(0.1, 0)));
    }
    fatLine(seam, 0.075, "rgba(200,150,95,0.55)");
    fatLine(seam, 0.04, "rgba(232,196,138,0.9)");
    // marbling
    for (let i = 0; i < 70; i++) {
      const a = r() * TAU, d = Math.sqrt(r()) * 0.8;
      let px0 = Math.cos(a) * RX * d, py0 = Math.sin(a) * RY * d;
      let dir = r() * TAU;
      x.strokeStyle = `rgba(230,192,140,${0.3 + r() * 0.35})`;
      x.lineWidth = 0.006 + r() * 0.014;
      x.beginPath(); x.moveTo(px0, py0);
      for (let k = 0; k < 6; k++) {
        dir += (r() - 0.5) * 1.4;
        px0 += Math.cos(dir) * 0.035; py0 += Math.sin(dir) * 0.035;
        x.lineTo(px0, py0);
      }
      x.stroke();
    }
    // a layer of crust over everything
    x.fillStyle = "rgba(120,60,26,0.16)"; x.fillRect(box.min.x, box.min.y, w, h);
    // crosshatched grill marks: a bold first pass, a lighter quarter-turn second pass
    for (const [ang, strong] of [[0.68, 1], [-0.9, 0.7]] as const) {
      const dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx;
      for (let i = -4; i <= 4; i++) {
        const off = i * 0.34 + (strong === 1 ? 0.06 : -0.1);
        const cx = nx * off, cy = ny * off;
        x.shadowColor = "rgba(70,30,10,0.8)"; x.shadowBlur = 12;
        x.strokeStyle = `rgba(92,44,16,${0.45 * strong})`; x.lineWidth = 0.12;
        x.beginPath(); x.moveTo(cx - dx * 1.4, cy - dy * 1.4); x.lineTo(cx + dx * 1.4, cy + dy * 1.4); x.stroke();
        x.shadowBlur = 4; x.shadowColor = "rgba(20,8,2,0.8)";
        for (let s = -1.4; s < 1.4;) {
          const len = 0.15 + r() * 0.35;
          x.strokeStyle = `rgba(${22 + r() * 16},${10 + r() * 6},${4 + r() * 4},${(0.8 + r() * 0.15) * strong + (1 - strong) * 0.3})`;
          x.lineWidth = (0.055 + r() * 0.015) * (0.75 + 0.25 * strong);
          x.beginPath(); x.moveTo(cx + dx * s, cy + dy * s); x.lineTo(cx + dx * (s + len), cy + dy * (s + len)); x.stroke();
          s += len + (r() < 0.2 ? 0.04 : 0);
        }
      }
    }
    x.shadowBlur = 0;
    // juicy glints and cracked pepper
    for (let i = 0; i < 40; i++) {
      x.fillStyle = `rgba(255,214,160,${0.1 + r() * 0.15})`;
      x.beginPath(); x.ellipse(box.min.x + r() * w, box.min.y + r() * h, 0.01 + r() * 0.03, 0.006 + r() * 0.012, r() * 3, 0, TAU); x.fill();
    }
    for (let i = 0; i < 160; i++) {
      x.fillStyle = `rgba(20,12,8,${0.5 + r() * 0.4})`;
      x.beginPath(); x.arc(box.min.x + r() * w, box.min.y + r() * h, px * (1 + r() * 2.2), 0, TAU); x.fill();
    }
    // charred rim
    x.shadowColor = "rgba(30,12,4,0.9)"; x.shadowBlur = 14;
    x.strokeStyle = "rgba(42,18,7,0.75)"; x.lineWidth = 0.07;
    tracePoly(x, outline); x.stroke();
    x.restore();
  });
}

function woodTex(box: THREE.Box2, w: number, h: number, groove: THREE.Vector2[]) {
  return shapeCanvas(box, w, h, (x, px) => {
    const r = rng(21);
    const base = x.createLinearGradient(box.min.x, 0, box.max.x, 0);
    base.addColorStop(0, "#a8713e"); base.addColorStop(0.5, "#b98249"); base.addColorStop(1, "#a36c3a");
    x.fillStyle = base; x.fillRect(box.min.x, box.min.y, w, h);
    const tones = ["#8a552a", "#c8925a", "#7a4a24", "#a06635", "#d09c64"];
    const knot = V2(0.72, -0.42);
    for (let i = 0; i < 140; i++) {
      const y0 = box.min.y + r() * h;
      const f1 = 1 + r() * 2, f2 = 4 + r() * 5, p1 = r() * TAU, p2 = r() * TAU;
      const a1 = 0.015 + r() * 0.03, a2 = 0.004 + r() * 0.008;
      x.strokeStyle = tones[(r() * tones.length) | 0];
      x.globalAlpha = 0.18 + r() * 0.4;
      x.lineWidth = px * (0.7 + r() * 3.5);
      x.beginPath();
      for (let xx = box.min.x - 0.05; xx <= box.max.x + 0.05; xx += 0.03) {
        let y = y0 + a1 * Math.sin(xx * f1 + p1) + a2 * Math.sin(xx * f2 + p2);
        const d = Math.hypot(xx - knot.x, (y - knot.y) * 2.2);
        if (d < 0.45) y += Math.sign(y - knot.y || 1) * (0.45 - d) * 0.25;
        if (xx === box.min.x - 0.05) x.moveTo(xx, y); else x.lineTo(xx, y);
      }
      x.stroke();
    }
    x.globalAlpha = 1;
    for (let i = 0; i < 6; i++) {
      x.strokeStyle = `rgba(92,54,24,${0.5 - i * 0.06})`; x.lineWidth = px * 2;
      x.beginPath(); x.ellipse(knot.x, knot.y, 0.03 + i * 0.03, 0.012 + i * 0.012, 0.05, 0, TAU); x.stroke();
    }
    x.fillStyle = "rgba(70,38,16,0.8)"; x.beginPath(); x.ellipse(knot.x, knot.y, 0.025, 0.01, 0, 0, TAU); x.fill();
    // juice groove: a dark channel with a lit lower lip
    x.lineJoin = "round";
    x.strokeStyle = "rgba(96,58,28,0.95)"; x.lineWidth = 0.055; tracePoly(x, groove); x.stroke();
    x.strokeStyle = "rgba(62,34,14,0.9)"; x.lineWidth = 0.025; tracePoly(x, groove); x.stroke();
    x.save(); x.translate(0.008, -0.01);
    x.strokeStyle = "rgba(222,176,120,0.55)"; x.lineWidth = 0.01; tracePoly(x, groove); x.stroke();
    x.restore();
  });
}

function roundRect(w: number, h: number, rad: number) {
  const s = new THREE.Shape();
  const x0 = -w / 2, y0 = -h / 2;
  s.moveTo(x0 + rad, y0);
  s.lineTo(x0 + w - rad, y0); s.absarc(x0 + w - rad, y0 + rad, rad, -Math.PI / 2, 0, false);
  s.lineTo(x0 + w, y0 + h - rad); s.absarc(x0 + w - rad, y0 + h - rad, rad, 0, Math.PI / 2, false);
  s.lineTo(x0 + rad, y0 + h); s.absarc(x0 + rad, y0 + h - rad, rad, Math.PI / 2, Math.PI, false);
  s.lineTo(x0, y0 + rad); s.absarc(x0 + rad, y0 + rad, rad, Math.PI, Math.PI * 1.5, false);
  return s;
}

/** A rosemary sprig lying along +x from the origin. */
function rosemary(len: number, seed: number) {
  const g = new THREE.Group();
  const r = rng(seed);
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.02, 0), new THREE.Vector3(len * 0.35, 0.04, -0.05 * len),
    new THREE.Vector3(len * 0.7, 0.05, 0.02 * len), new THREE.Vector3(len, 0.045, -0.03 * len),
  ]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.014, 5), std(0x6a5530, 0.7)));
  const needle = new THREE.CylinderGeometry(0.006, 0.018, 0.22, 4, 1);
  needle.translate(0, 0.11, 0); needle.scale(1.4, 1, 0.55);
  const n = 46;
  const inst = new THREE.InstancedMesh(needle, std(0xffffff, 0.55), n);
  const up = new THREE.Vector3(0, 1, 0), Y = new THREE.Vector3(0, 1, 0);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), col = new THREE.Color();
  const dark = new THREE.Color(0x2f4a24), light = new THREE.Color(0x6a8a4c);
  for (let i = 0; i < n; i++) {
    const t = 0.06 + (0.92 * i) / n;
    const p = curve.getPointAt(t), T = curve.getTangentAt(t);
    const s1 = new THREE.Vector3().crossVectors(T, up).normalize();
    const s2 = new THREE.Vector3().crossVectors(s1, T).normalize();
    const a = i * 2.39996;
    const dir = s1.multiplyScalar(Math.cos(a)).add(s2.multiplyScalar(Math.sin(a) * 0.55 + 0.25)).add(T.clone().multiplyScalar(0.8)).normalize();
    q.setFromUnitVectors(Y, dir);
    const sc = 1 - 0.55 * t * t;
    m.compose(p, q, new THREE.Vector3(1, sc * (0.85 + r() * 0.3), 1));
    inst.setMatrixAt(i, m);
    inst.setColorAt(i, col.copy(dark).lerp(light, r()));
  }
  inst.computeBoundingBox(); inst.computeBoundingSphere();
  g.add(inst);
  return g;
}

/** Grilled rib eye on a wooden board with a juice groove, rosemary and flaky salt. */
function steak() {
  const g = new THREE.Group();

  // board
  const bw = 2.75, bh = 1.9;
  const board = slab(roundRect(bw, bh, 0.4), 0.1, 0.04, 2, 8);
  const groove: THREE.Vector2[] = roundRect(bw - 0.26, bh - 0.26, 0.28).getPoints(8);
  const wood = woodTex(board.box, board.w, board.h, groove);
  const boardTop = owns(new THREE.MeshStandardMaterial({ map: wood, bumpMap: wood, bumpScale: 2, roughness: 0.72 }));
  g.add(new THREE.Mesh(board.geo, [boardTop, std(0x8d5a2f, 0.78)]));

  // rib eye
  const outline: THREE.Vector2[] = [];
  const N = 64;
  for (let i = 0; i < N; i++) outline.push(ribeyeAt((i / N) * TAU));
  const shape = new THREE.Shape(outline);
  const meat = slab(shape, 0.13, 0.06, 3);
  const crust = ribeyeTex(meat.box, meat.w, meat.h, outline);
  const top = owns(new THREE.MeshPhysicalMaterial({
    map: crust, bumpMap: crust, bumpScale: 3, roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.4,
  }));
  const sides = new THREE.MeshStandardMaterial({ color: 0x5c3822, roughness: 0.62 });
  const sg = new THREE.Group();
  sg.position.set(-0.18, board.top - 0.01, -0.05);
  sg.rotation.y = 0.18;
  sg.add(new THREE.Mesh(meat.geo, [top, sides]));
  g.add(sg);

  // rosemary tucked against the steak
  // rosemary: one sprig laid across the steak, one on the board in front
  const sprig = rosemary(0.95, 5);
  sprig.position.set(-0.55, meat.top - 0.01, 0.12); sprig.rotation.y = 0.3;
  sg.add(sprig);
  const sprig2 = rosemary(0.8, 9);
  sprig2.position.set(0.35, board.top, 0.72); sprig2.rotation.y = -0.2;
  g.add(sprig2);

  // flaky salt on the meat and the board
  const r = rng(8);
  const count = 46;
  const salt = new THREE.InstancedMesh(new THREE.OctahedronGeometry(1, 0), std(0xfdfcf8, 0.3), count);
  sg.updateMatrix();
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < count; i++) {
    let p: THREE.Vector3;
    if (i < 34) {
      const t = r() * TAU, d = Math.sqrt(r()) * 0.82;
      const o = ribeyeAt(t, d);
      p = new THREE.Vector3(o.x, meat.top + 0.004, -o.y).applyMatrix4(sg.matrix);
    } else {
      p = new THREE.Vector3(0.2 + r() * 1.0, board.top + 0.004, 0.25 + r() * 0.5);
    }
    q.setFromEuler(e.set((r() - 0.5) * 0.4, r() * TAU, (r() - 0.5) * 0.4));
    const s = 0.012 + r() * 0.014;
    m.compose(p, q, new THREE.Vector3(s, s * 0.45, s * (0.7 + r() * 0.5)));
    salt.setMatrixAt(i, m);
  }
  salt.computeBoundingBox(); salt.computeBoundingSphere();
  g.add(salt);
  return g;
}

/* -------------------------------------------------------------------- feteer */

const wob = (a: number) => 1 + 0.02 * Math.sin(3 * a + 0.4) + 0.014 * Math.sin(5 * a + 1.3) + 0.007 * Math.sin(9 * a + 2);

function feteerTopTex() {
  return canvasTex(512, 512, (x) => {
    const r = rng(17), c = 256;
    const inDisc = () => { const a = r() * TAU, d = Math.pow(r(), 0.4) * 244; return [c + Math.cos(a) * d, c + Math.sin(a) * d, d / 244]; };
    x.fillStyle = "#a8641f"; x.fillRect(0, 0, 512, 512);
    const g = x.createRadialGradient(c - 18, c - 22, 10, c, c, 256);
    g.addColorStop(0, "#f5c86e"); g.addColorStop(0.5, "#eab04f"); g.addColorStop(0.8, "#d8963a"); g.addColorStop(0.94, "#b8722a"); g.addColorStop(1, "#8e5019");
    x.fillStyle = g; x.beginPath(); x.arc(c, c, 256, 0, TAU); x.fill();
    // uneven bake
    for (let i = 0; i < 40; i++) {
      const [bx, by] = inDisc(), rad = 20 + r() * 50;
      const p = x.createRadialGradient(bx, by, 0, bx, by, rad);
      const col = r() < 0.5 ? "190,112,36" : "250,214,130";
      p.addColorStop(0, `rgba(${col},${0.18 + r() * 0.15})`); p.addColorStop(1, `rgba(${col},0)`);
      x.fillStyle = p; x.beginPath(); x.arc(bx, by, rad, 0, TAU); x.fill();
    }
    // golden-brown blisters, more of them toward the crisp edge
    for (let i = 0; i < 220; i++) {
      const [bx, by, d] = inDisc();
      const rad = 2.5 + r() * r() * 13 * (0.6 + d * 0.6);
      const br = x.createRadialGradient(bx, by, 0, bx, by, rad);
      const dk = (0.3 + r() * 0.35) * (0.6 + d * 0.5);
      br.addColorStop(0, `rgba(140,70,16,${dk})`); br.addColorStop(0.65, `rgba(170,94,28,${dk * 0.55})`); br.addColorStop(1, "rgba(170,94,28,0)");
      x.fillStyle = br; x.beginPath(); x.arc(bx, by, rad, 0, TAU); x.fill();
    }
    // curled flakes following the folds: a lit lip over a thin shadow
    for (let i = 0; i < 240; i++) {
      const [fx, fy, d] = inDisc();
      const ang = Math.atan2(fy - c, fx - c) + Math.PI / 2 + (r() - 0.5) * 0.6;
      const len = 5 + r() * 12 * (0.7 + d * 0.5), bend = (r() - 0.3) * 5;
      const ex = Math.cos(ang) * len, ey = Math.sin(ang) * len;
      x.lineCap = "round";
      x.strokeStyle = `rgba(130,66,16,${0.25 + r() * 0.3})`; x.lineWidth = 1.2 + r() * 1.3;
      x.beginPath(); x.moveTo(fx - ex, fy - ey + 1.6); x.quadraticCurveTo(fx, fy + bend + 1.6, fx + ex, fy + ey + 1.6); x.stroke();
      x.strokeStyle = `rgba(255,${228 + r() * 20},${160 + r() * 40},${0.3 + r() * 0.35})`; x.lineWidth = 1 + r() * 1.8;
      x.beginPath(); x.moveTo(fx - ex, fy - ey); x.quadraticCurveTo(fx, fy + bend, fx + ex, fy + ey); x.stroke();
    }
    // melted ghee catching the light
    for (let i = 0; i < 36; i++) {
      const [bx, by] = inDisc();
      x.fillStyle = `rgba(255,242,200,${0.12 + r() * 0.2})`;
      x.beginPath(); x.ellipse(bx, by, 5 + r() * 18, 2 + r() * 6, r() * 3, 0, TAU); x.fill();
    }
    // cut into squares at the counter, the way it is served
    x.save();
    x.beginPath(); x.arc(c, c, 236, 0, TAU); x.clip();
    x.translate(c, c); x.rotate(0.22);
    for (const k of [-1.5, -0.5, 0.5, 1.5]) {
      for (const vert of [true, false]) {
        const o = k * 118;
        const line = (dx: number, col: string, wd: number) => {
          x.strokeStyle = col; x.lineWidth = wd;
          x.beginPath();
          if (vert) { x.moveTo(o + dx, -260); x.lineTo(o + dx + 3, 260); } else { x.moveTo(-260, o + dx); x.lineTo(260, o + dx - 3); }
          x.stroke();
        };
        line(0, "rgba(255,226,160,0.55)", 7);
        line(0, "rgba(110,54,12,0.75)", 2.5);
      }
    }
    x.restore();
    const e = x.createRadialGradient(c, c, 205, c, c, 256);
    e.addColorStop(0, "rgba(130,64,14,0)"); e.addColorStop(1, "rgba(130,64,14,0.55)");
    x.fillStyle = e; x.beginPath(); x.arc(c, c, 256, 0, TAU); x.fill();
  });
}

function feteerSideTex() {
  return canvasTex(512, 256, (x) => {
    const r = rng(29), W = 512, H = 256;
    const g = x.createLinearGradient(0, H, 0, 0);
    g.addColorStop(0, "#e4b264"); g.addColorStop(0.6, "#d9a049"); g.addColorStop(1, "#b9772a");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    // paper-thin laminated layers, wavy and broken, tileable around the edge
    const layers = 30;
    for (let i = 0; i < layers; i++) {
      const y0 = ((i + 0.5) / layers) * H + (r() - 0.5) * 4;
      const pale = i % 2 === 0;
      const k1 = 1 + ((r() * 4) | 0), k2 = 5 + ((r() * 6) | 0), a1 = 1 + r() * 3, a2 = 0.5 + r() * 1.5, p1 = r() * TAU, p2 = r() * TAU;
      x.strokeStyle = pale ? `rgba(255,236,186,${0.55 + r() * 0.35})` : `rgba(122,62,16,${0.4 + r() * 0.3})`;
      x.lineWidth = pale ? 1.6 + r() * 2.4 : 0.8 + r() * 1.4;
      x.beginPath();
      let on = true;
      for (let px = 0; px <= W; px += 4) {
        const y = y0 + a1 * Math.sin((px / W) * TAU * k1 + p1) + a2 * Math.sin((px / W) * TAU * k2 + p2);
        if (r() < 0.03) on = !on;
        if (on) x.lineTo(px, y); else x.moveTo(px, y);
      }
      x.stroke();
    }
    for (let i = 0; i < 260; i++) {
      x.fillStyle = r() < 0.5 ? `rgba(255,236,190,${0.3 + r() * 0.4})` : `rgba(110,56,14,${0.25 + r() * 0.3})`;
      x.beginPath(); x.ellipse(r() * W, r() * H, 2 + r() * 6, 0.6 + r() * 1.4, (r() - 0.5) * 0.3, 0, TAU); x.fill();
    }
  });
}

/** Feteer meshaltet: a puffed, flaky, butter-glossy round on a white plate. */
function feteer(accent: string) {
  const g = new THREE.Group();
  g.add(lathe([[0, 0], [1.2, 0], [1.38, 0.07], [1.5, 0.17], [1.46, 0.18], [1.25, 0.1], [0, 0.09]], porcelainMat()));
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.37, 0.012, 6, 48), std(accent, 0.4));
  rim.rotation.x = Math.PI / 2; rim.position.y = 0.147; g.add(rim);

  // flaky side wall
  const R = 1.08, y0 = 0.09, Hs = 0.13, L = 12;
  const prof: THREE.Vector2[] = [V2(0.001, y0), V2(R * 0.9, y0)];
  for (let k = 0; k <= L; k++) {
    const f = k / L;
    const base = R * (0.93 + 0.07 * Math.sin(f * Math.PI * 0.75)) * (1 - 0.03 * f * f * f);
    const flake = k === 0 || k === L ? 0 : k % 2 ? 0.01 : -0.004;
    prof.push(V2(base + flake, y0 + 0.004 + f * Hs));
  }
  const n = prof.length;
  const rTop = prof[n - 1].x, yTop = prof[n - 1].y;
  const sideTex = feteerSideTex();
  const sideMat = owns(new THREE.MeshPhysicalMaterial({
    map: sideTex, bumpMap: sideTex, bumpScale: 2, roughness: 0.5, clearcoat: 0.45, clearcoatRoughness: 0.3,
  }));
  const sideGeo = new THREE.LatheGeometry(prof, 32);
  const sp = sideGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < sp.count; i++) {
    const j = i % n;
    const px = sp.getX(i), pz = sp.getZ(i);
    const a = Math.atan2(px, pz);
    const flaky = j > 1 && j < n - 1 ? 1 + 0.012 * Math.sin(7 * a + j * 1.7) + 0.008 * Math.sin(13 * a + j * 2.9) : 1;
    const s = wob(a) * flaky;
    sp.setXYZ(i, px * s, sp.getY(i), pz * s);
  }
  sideGeo.computeVertexNormals();
  g.add(new THREE.Mesh(sideGeo, sideMat));

  // puffed top with a rounded shoulder
  const topGeo = new THREE.RingGeometry(0.0001, 1, 32, 16);
  topGeo.rotateX(-Math.PI / 2);
  const tp = topGeo.attributes.position as THREE.BufferAttribute;
  const tuv = topGeo.attributes.uv as THREE.BufferAttribute;
  const dome = 0.13;
  for (let i = 0; i < tp.count; i++) {
    const px = tp.getX(i), pz = tp.getZ(i);
    const d0 = Math.min(1, Math.hypot(px, pz));
    const d = 1 - Math.pow(1 - d0, 1.7);
    const a = Math.atan2(px, pz);
    const s = d0 > 0 ? (d * rTop * wob(a)) / d0 : 0;
    const h = dome * Math.pow(1 - Math.pow(d, 2.6), 0.55) + 0.01 * Math.sin(d * 16 + a * 3) * d * (1 - d);
    tp.setXYZ(i, px * s, yTop + h, pz * s);
    tuv.setXY(i, 0.5 + (px * s) / (2.2 * rTop), 0.5 - (pz * s) / (2.2 * rTop));
  }
  topGeo.computeVertexNormals();
  const topTex = feteerTopTex();
  const topMat = owns(new THREE.MeshPhysicalMaterial({
    map: topTex, bumpMap: topTex, bumpScale: 2.5, roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.2,
  }));
  g.add(new THREE.Mesh(topGeo, topMat));
  return g;
}

/* ------------------------------------------------------------- tall glasses */

function icedLiquidTex() {
  return canvasTex(256, 512, (x) => {
    const r = rng(41), W = 256, H = 512;
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#4a2813"); g.addColorStop(0.24, "#5a3118"); g.addColorStop(0.4, "#8a5a36");
    g.addColorStop(0.56, "#c9a881"); g.addColorStop(0.76, "#e4d3b8"); g.addColorStop(1, "#ecdfc9");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    // espresso ribbons sinking into the milk and milk curling up, painted small
    // and scaled up so the swirl stays soft without canvas filters
    const paint = (sw: number, sh: number, count: number, width: number, alpha: number) => {
      const c = document.createElement("canvas");
      c.width = sw; c.height = sh;
      const y = c.getContext("2d")!;
      y.lineCap = "round"; y.lineJoin = "round";
      for (let i = 0; i < count; i++) {
        const down = i % 3 !== 2;
        const x0 = r() * sw, y0 = sh * (down ? 0.26 + r() * 0.14 : 0.5 + r() * 0.12);
        const len = sh * (0.14 + r() * 0.28) * (down ? 1 : -0.6);
        const amp = sw * (0.05 + r() * 0.12), fq = 0.5 + r() * 0.7, ph = r() * TAU;
        y.strokeStyle = down ? `rgba(84,46,22,${alpha * (0.6 + r() * 0.6)})` : `rgba(242,230,208,${alpha * (0.6 + r() * 0.6)})`;
        y.lineWidth = width * (0.5 + r());
        for (const off of [0, -sw, sw]) {
          y.beginPath();
          for (let s = 0; s <= 1.0001; s += 0.05) {
            const px = x0 + off + Math.sin(s * fq * TAU + ph) * amp * (0.3 + s), py = y0 + len * s;
            if (s === 0) y.moveTo(px, py); else y.lineTo(px, py);
          }
          y.stroke();
        }
      }
      x.imageSmoothingEnabled = true;
      x.drawImage(c, 0, 0, W, H);
    };
    paint(32, 64, 20, 3, 0.5);
    paint(64, 128, 16, 2.2, 0.45);
    paint(128, 256, 10, 1.6, 0.35);
    for (let i = 0; i < 60; i++) {
      x.fillStyle = `rgba(255,255,255,${0.1 + r() * 0.2})`;
      x.beginPath(); x.arc(r() * W, r() * H, 0.8 + r() * 1.8, 0, TAU); x.fill();
    }
  });
}

function juiceLiquidTex() {
  return canvasTex(256, 512, (x) => {
    const r = rng(53), W = 256, H = 512;
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#ffbd45"); g.addColorStop(0.4, "#fca42a"); g.addColorStop(1, "#ec7a0c");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 700; i++) {
      x.fillStyle = r() < 0.6 ? `rgba(255,214,120,${0.25 + r() * 0.35})` : `rgba(214,96,8,${0.2 + r() * 0.3})`;
      x.beginPath(); x.ellipse(r() * W, r() * H, 1 + r() * 2.5, 0.6 + r() * 1.2, r() * 3, 0, TAU); x.fill();
    }
    for (let i = 0; i < 50; i++) {
      x.strokeStyle = `rgba(255,236,190,${0.3 + r() * 0.3})`; x.lineWidth = 1;
      x.beginPath(); x.arc(r() * W, r() * H * 0.25, 1 + r() * 2.5, 0, TAU); x.stroke();
    }
  });
}

function orangeSliceTex() {
  return canvasTex(256, 256, (x) => {
    const r = rng(61), c = 128, R = 127;
    x.fillStyle = "#ee7410"; x.beginPath(); x.arc(c, c, R, 0, TAU); x.fill();
    for (let i = 0; i < 140; i++) {
      const a = r() * TAU, d = R - 2 - r() * 8;
      x.fillStyle = `rgba(${r() < 0.5 ? "255,160,50" : "200,90,10"},0.5)`;
      x.beginPath(); x.arc(c + Math.cos(a) * d, c + Math.sin(a) * d, 1 + r(), 0, TAU); x.fill();
    }
    x.fillStyle = "#fcecce"; x.beginPath(); x.arc(c, c, R * 0.88, 0, TAU); x.fill();
    const segs = 10, rf = R * 0.8;
    for (let s = 0; s < segs; s++) {
      const a0 = (s / segs) * TAU + 0.035, a1 = ((s + 1) / segs) * TAU - 0.035;
      const mid = (a0 + a1) / 2;
      x.save();
      x.beginPath(); x.moveTo(c + Math.cos(mid) * 9, c + Math.sin(mid) * 9); x.arc(c, c, rf, a0, a1); x.closePath();
      const fg = x.createRadialGradient(c, c, 6, c, c, rf);
      fg.addColorStop(0, "#ffd27a"); fg.addColorStop(0.55, "#ffae36"); fg.addColorStop(1, "#f58a14");
      x.fillStyle = fg; x.fill();
      x.clip();
      for (let v = 0; v < 46; v++) {
        const a = a0 + r() * (a1 - a0), d0 = 12 + r() * (rf - 20), l = 6 + r() * 12;
        x.strokeStyle = r() < 0.6 ? `rgba(255,228,150,${0.35 + r() * 0.3})` : `rgba(230,110,10,${0.3 + r() * 0.3})`;
        x.lineWidth = 1.5 + r() * 2; x.lineCap = "round";
        x.beginPath(); x.moveTo(c + Math.cos(a) * d0, c + Math.sin(a) * d0); x.lineTo(c + Math.cos(a) * (d0 + l), c + Math.sin(a) * (d0 + l)); x.stroke();
      }
      x.restore();
    }
    x.fillStyle = "#fdf0d6"; x.beginPath(); x.arc(c, c, 8, 0, TAU); x.fill();
    const hl = x.createRadialGradient(c - 30, c - 34, 4, c - 30, c - 34, 80);
    hl.addColorStop(0, "rgba(255,255,240,0.35)"); hl.addColorStop(1, "rgba(255,255,240,0)");
    x.fillStyle = hl; x.beginPath(); x.arc(c, c, R * 0.86, 0, TAU); x.fill();
  });
}

/** Tapered tumbler with a liquid fill. Glass spans y 0..2.2, radius 0.52 → 0.62. */
function tallGlass(accent: string, liquid: { side: THREE.Material; top: THREE.Material; level: number }) {
  const g = new THREE.Group();
  const rAt = (y: number) => 0.52 + ((y - 0.1) / 2.1) * 0.1;
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.52, 2.1, 32, 1, true), glassMat(0.1, 0.6));
  shell.position.y = 1.15; g.add(shell);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.51, 0.16, 32), glassMat(0.28, 0.6, 0xf2f8f6));
  base.position.y = 0.08; g.add(base);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.617, 0.013, 6, 48), glassMat(0.4, 0.5));
  lip.rotation.x = Math.PI / 2; lip.position.y = 2.2; g.add(lip);
  const lb = 0.17, lt = liquid.level;
  const liq = new THREE.Mesh(
    new THREE.CylinderGeometry(rAt(lt) - 0.025, rAt(lb) - 0.025, lt - lb, 32),
    [liquid.side, liquid.top, liquid.top],
  );
  liq.position.y = (lt + lb) / 2; liq.rotation.y = Math.PI; g.add(liq);
  const straw = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.5, 12), std(accent, 0.35));
  straw.position.set(0.2, 1.55, 0); straw.rotation.z = -0.12; g.add(straw);
  return g;
}

function iced(accent: string) {
  const tex = icedLiquidTex();
  const g = tallGlass(accent, {
    side: owns(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.18 })),
    top: std(0x5a3219, 0.25),
    level: 1.78,
  });
  const ice = glassMat(0.32, 0.75, 0xeef6ff);
  const cube = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const spots: [number, number, number][] = [[-0.22, 1.8, 0.12], [0.08, 1.86, -0.24], [-0.05, 1.62, 0.3], [0.3, 1.7, 0.2], [-0.28, 1.58, -0.18]];
  spots.forEach(([px, py, pz], i) => {
    const cb = new THREE.Mesh(cube, ice);
    cb.position.set(px, py, pz); cb.rotation.set(i * 0.7, i * 1.3, i * 0.5);
    g.add(cb);
  });
  return g;
}

function juice(accent: string) {
  const tex = juiceLiquidTex();
  const g = tallGlass(accent, {
    side: owns(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.22 })),
    top: std(0xffc766, 0.5),
    level: 1.92,
  });
  const face = owns(new THREE.MeshStandardMaterial({ map: orangeSliceTex(), roughness: 0.4 }));
  const slice = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.05, 32), [std(0xf07a12, 0.5), face, face]);
  slice.rotation.x = Math.PI / 2;
  const holder = new THREE.Group();
  const phi = 0.45;
  holder.position.set(Math.cos(phi) * 0.66, 2.1, Math.sin(phi) * 0.66);
  holder.rotation.y = -phi;
  holder.add(slice);
  g.add(holder);
  return g;
}

/* --------------------------------------------------------------------- api */

export function buildModel(kind: Kind, accent: string): THREE.Group {
  const m = kind === "cup" ? cup(accent) : kind === "steak" ? steak() : kind === "feteer" ? feteer(accent) : kind === "iced" ? iced(accent) : juice(accent);
  m.traverse((c) => { if ((c as THREE.Mesh).isMesh) c.castShadow = false; });
  m.userData.kind = kind;
  return m;
}

/** Height of each model, so the scene can centre and scale them. */
export const HEIGHT: Record<Kind, number> = { cup: 1.1, steak: 1.0, feteer: 0.9, iced: 2.7, juice: 2.7 };
