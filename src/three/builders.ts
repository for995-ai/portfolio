import {
  BufferGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  SphereGeometry,
  TorusGeometry,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { StageMaterials } from './materials';

/**
 * 幾何細節 helper：倒角、分模線、螺絲、面板層次、邊緣亮條。
 * 幾何體以 cache 共用實例（效能要求 #9），dispose 時統一釋放。
 */

const geoCache = new Map<string, BufferGeometry>();

/**
 * Level B 輕量模式（每次掛載前由 Stage 設定一次）：
 * 倒角段數減半、圓柱／環／球段數降階，並讓 addScrews / addSeam 直接略過。
 * 快取鍵含 LITE，避免與完整版幾何撞鍵。
 */
let LITE = false;
export function setLiteDetail(v: boolean) {
  LITE = v;
}

export function disposeSharedGeometries() {
  for (const g of geoCache.values()) g.dispose();
  geoCache.clear();
}

/** 倒角盒（快取共用；絕不使用銳利直角） */
export function rbox(w: number, h: number, d: number, r = 0.03): BufferGeometry {
  const seg = LITE ? 1 : 2;
  const key = `rb:${w}:${h}:${d}:${r}:${seg}`;
  let g = geoCache.get(key);
  if (!g) {
    g = new RoundedBoxGeometry(w, h, d, seg, Math.min(r, Math.min(w, h, d) / 2.5));
    geoCache.set(key, g);
  }
  return g;
}

export function cyl(rTop: number, rBottom: number, h: number, seg = 24): BufferGeometry {
  const s = LITE ? Math.min(seg, 12) : seg;
  const key = `cy:${rTop}:${rBottom}:${h}:${s}`;
  let g = geoCache.get(key);
  if (!g) {
    g = new CylinderGeometry(rTop, rBottom, h, s);
    geoCache.set(key, g);
  }
  return g;
}

export function torus(r: number, tube: number, seg = 24): BufferGeometry {
  const s = LITE ? Math.min(seg, 14) : seg;
  const radial = LITE ? 8 : 12;
  const key = `to:${r}:${tube}:${s}:${radial}`;
  let g = geoCache.get(key);
  if (!g) {
    g = new TorusGeometry(r, tube, radial, s);
    geoCache.set(key, g);
  }
  return g;
}

export function sphere(r: number): BufferGeometry {
  const wSeg = LITE ? 12 : 20;
  const hSeg = LITE ? 8 : 14;
  const key = `sp:${r}:${wSeg}`;
  let g = geoCache.get(key);
  if (!g) {
    g = new SphereGeometry(r, wSeg, hSeg);
    geoCache.set(key, g);
  }
  return g;
}

/** 螺絲／鉚釘（材質 B，直徑 0.03–0.05）；輕量模式略過 */
export function addScrews(
  parent: Group,
  mats: StageMaterials,
  positions: Array<[number, number, number]>,
  r = 0.02,
) {
  if (LITE) return;
  for (const [x, y, z] of positions) {
    const s = new Mesh(cyl(r, r, 0.025, 10), mats.polish);
    s.rotation.x = Math.PI / 2;
    s.position.set(x, y, z);
    parent.add(s);
  }
}

/** 分模線：細長凹槽（材質 C）；輕量模式略過 */
export function addSeam(
  parent: Group,
  mats: StageMaterials,
  w: number,
  h: number,
  pos: [number, number, number],
  vertical = false,
) {
  if (LITE) return;
  const g = vertical ? rbox(0.015, w, h, 0.006) : rbox(w, 0.015, h, 0.006);
  const m = new Mesh(g, mats.seam);
  m.position.set(...pos);
  parent.add(m);
}

/** 邊緣亮條：細長拋光條（材質 B），捕捉環境光形成高光線 */
export function addEdgeStrip(
  parent: Group,
  mats: StageMaterials,
  length: number,
  pos: [number, number, number],
  vertical = false,
) {
  const g = vertical ? rbox(0.02, length, 0.02, 0.008) : rbox(length, 0.02, 0.02, 0.008);
  const m = new Mesh(g, mats.polish);
  m.position.set(...pos);
  parent.add(m);
}

/**
 * 金屬面板：倒角底板＋錯開 0.015 的浮雕頂板＋分模線＋角落螺絲＋上緣亮條。
 * 用於標籤板、卡片、裝飾板。
 */
export function makePanel(mats: StageMaterials, w: number, h: number, d = 0.06): Group {
  const g = new Group();
  const base = new Mesh(rbox(w, h, d, 0.025), mats.matte);
  g.add(base);
  const face = new Mesh(rbox(w * 0.9, h * 0.78, 0.02, 0.012), mats.matte);
  face.position.set(0, h * 0.03, d / 2 + 0.005);
  g.add(face);
  addSeam(g, mats, w * 0.86, 0.012, [0, -h * 0.32, d / 2 + 0.002]);
  addEdgeStrip(g, mats, w * 0.92, [0, h / 2 - 0.03, d / 2 + 0.008]);
  const sx = w / 2 - 0.05;
  const sy = h / 2 - 0.05;
  addScrews(g, mats, [
    [-sx, -sy, d / 2 + 0.01],
    [sx, -sy, d / 2 + 0.01],
  ]);
  return g;
}

/** 展示基座：圓柱主體＋拋光頂環＋分模凹環＋可選發光環（代表作） */
export function makePedestal(
  mats: StageMaterials,
  radius: number,
  height: number,
  glow = false,
): Group {
  const g = new Group();
  const body = new Mesh(cyl(radius, radius * 1.06, height, 28), mats.matte);
  g.add(body);
  const rim = new Mesh(torus(radius * 0.97, 0.02, 32), mats.polish);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = height / 2 - 0.01;
  g.add(rim);
  const groove = new Mesh(torus(radius * 1.02, 0.012, 32), mats.seam);
  groove.rotation.x = Math.PI / 2;
  groove.position.y = -height * 0.18;
  g.add(groove);
  if (glow) {
    const ring = new Mesh(torus(radius * 1.12, 0.025, 40), mats.glowMagenta);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -height / 2 + 0.08;
    g.add(ring);
  }
  addScrews(g, mats, [
    [radius * 0.6, height / 2 + 0.002, radius * 0.35],
    [-radius * 0.6, height / 2 + 0.002, -radius * 0.35],
  ]);
  return g;
}

/** 金屬獎牌：霧面圓面＋拋光邊環＋中央浮雕圓＋掛孔螺絲 */
export function makeMedal(mats: StageMaterials, r: number): Group {
  const g = new Group();
  const face = new Mesh(cyl(r, r, 0.06, 32), mats.matte);
  face.rotation.x = Math.PI / 2;
  g.add(face);
  const edge = new Mesh(torus(r, 0.035, 36), mats.polish);
  g.add(edge);
  const emboss = new Mesh(cyl(r * 0.55, r * 0.55, 0.02, 28), mats.matte);
  emboss.rotation.x = Math.PI / 2;
  emboss.position.z = 0.045;
  g.add(emboss);
  const grooveRing = new Mesh(torus(r * 0.72, 0.01, 32), mats.seam);
  g.add(grooveRing);
  addScrews(g, mats, [[0, r * 0.82, 0.04]], 0.025);
  return g;
}

/** 金屬卡片：薄倒角盒＋邊緣亮條＋浮雕面＋接縫 */
export function makeCard(mats: StageMaterials, w: number, h: number): Group {
  const g = new Group();
  const base = new Mesh(rbox(w, h, 0.05, 0.025), mats.matte);
  g.add(base);
  const face = new Mesh(rbox(w * 0.88, h * 0.6, 0.015, 0.01), mats.matte);
  face.position.set(0, h * 0.12, 0.032);
  g.add(face);
  addEdgeStrip(g, mats, w * 0.94, [0, h / 2 - 0.025, 0.03]);
  addSeam(g, mats, w * 0.86, 0.01, [0, -h * 0.28, 0.028]);
  addScrews(g, mats, [[-w / 2 + 0.05, -h / 2 + 0.05, 0.035]]);
  return g;
}

/* ============ 手把（8 零件，拆解→飄散→重組共用同一組件） ============ */

export interface PadPart {
  name: string;
  group: Group;
}

export interface GamepadBuild {
  holder: Group;
  parts: PadPart[];
  startMesh: Mesh;
}

/**
 * 程式生成 PS5 造型手把：主體霧面鋁、按鍵搖桿拋光、中央分模線、
 * 握把螺絲、搖桿拋光環、START 鍵洋紅發光。
 */
export function buildGamepad(mats: StageMaterials): GamepadBuild {
  const holder = new Group();
  const parts: PadPart[] = [];
  let startMesh!: Mesh;

  const addPart = (name: string, build: (g: Group) => void) => {
    const g = new Group();
    g.name = name;
    build(g);
    holder.add(g);
    parts.push({ name, group: g });
  };

  const bodyGeo = rbox(2.3, 1.5, 0.9, 0.28);

  addPart('body-left', (g) => {
    g.add(new Mesh(bodyGeo, mats.matte));
    addSeam(g, mats, 1.3, 0.02, [0.2, 0, 0.455]);
    addScrews(g, mats, [
      [-0.6, -0.45, 0.46],
      [-0.85, 0.3, 0.46],
    ]);
    g.position.set(-1.05, -0.1, 0);
    g.rotation.z = 0.1;
  });
  addPart('body-right', (g) => {
    g.add(new Mesh(bodyGeo, mats.matte));
    addSeam(g, mats, 1.3, 0.02, [-0.2, 0, 0.455]);
    addScrews(g, mats, [
      [0.6, -0.45, 0.46],
      [0.85, 0.3, 0.46],
    ]);
    g.position.set(1.05, -0.1, 0);
    g.rotation.z = -0.1;
  });

  addPart('dpad', (g) => {
    g.add(new Mesh(rbox(0.62, 0.18, 0.14, 0.03), mats.polish));
    g.add(new Mesh(rbox(0.18, 0.62, 0.14, 0.03), mats.polish));
    const wells = new Mesh(cyl(0.36, 0.36, 0.02, 24), mats.seam);
    wells.rotation.x = Math.PI / 2;
    wells.position.z = -0.06;
    g.add(wells);
    g.position.set(-1.15, 0.28, 0.48);
  });

  addPart('buttons', (g) => {
    const geo = cyl(0.11, 0.11, 0.14, 20);
    const ringGeo = torus(0.13, 0.012, 20);
    const offsets: Array<[number, number]> = [
      [0, 0.24],
      [0.24, 0],
      [0, -0.24],
      [-0.24, 0],
    ];
    for (const [ox, oy] of offsets) {
      const b = new Mesh(geo, mats.polish);
      b.rotation.x = Math.PI / 2;
      b.position.set(ox, oy, 0);
      g.add(b);
      const ring = new Mesh(ringGeo, mats.seam);
      ring.position.set(ox, oy, 0.07);
      g.add(ring);
    }
    g.position.set(1.15, 0.28, 0.48);
  });

  const stickBuild = (g: Group) => {
    const shaft = new Mesh(cyl(0.12, 0.14, 0.3, 20), mats.matte);
    shaft.rotation.x = Math.PI / 2;
    const cap = new Mesh(sphere(0.2), mats.polish);
    cap.position.z = 0.2;
    const ring = new Mesh(torus(0.24, 0.018, 26), mats.polish);
    ring.position.z = 0.04;
    g.add(shaft, cap, ring);
  };
  addPart('stick-left', (g) => {
    stickBuild(g);
    g.position.set(-0.55, -0.38, 0.42);
  });
  addPart('stick-right', (g) => {
    stickBuild(g);
    g.position.set(0.55, -0.38, 0.42);
  });

  addPart('touchpad', (g) => {
    const plate = new Mesh(rbox(1.35, 0.6, 0.14, 0.05), mats.matte);
    plate.position.set(0, 0.42, 0.45);
    const inset = new Mesh(rbox(1.2, 0.48, 0.02, 0.02), mats.seam);
    inset.position.set(0, 0.42, 0.525);
    startMesh = new Mesh(rbox(0.46, 0.18, 0.12, 0.04), mats.glowMagenta);
    startMesh.name = 'start-key';
    startMesh.position.set(0, -0.02, 0.52);
    g.add(plate, inset, startMesh);
  });

  addPart('trigger', (g) => {
    const geo = rbox(0.7, 0.3, 0.4, 0.08);
    const l = new Mesh(geo, mats.matte);
    l.position.set(-1.15, 0.82, -0.15);
    const r = new Mesh(geo, mats.matte);
    r.position.set(1.15, 0.82, -0.15);
    addEdgeStrip(g, mats, 0.6, [-1.15, 0.95, -0.02]);
    addEdgeStrip(g, mats, 0.6, [1.15, 0.95, -0.02]);
    g.add(l, r);
  });

  holder.traverse((o) => {
    if (o instanceof Mesh) o.castShadow = true;
  });

  return { holder, parts, startMesh };
}
