import { useEffect, useRef, type MutableRefObject } from 'react';
import {
  ACESFilmicToneMapping,
  AmbientLight,
  CatmullRomCurve3,
  DirectionalLight,
  Fog,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  PMREMGenerator,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  ShadowMaterial,
  SpotLight,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createStageMaterials } from './materials';
import {
  buildGamepad,
  disposeSharedGeometries,
  makeCard,
  makeMedal,
  makePanel,
  makePedestal,
  rbox,
} from './builders';

interface StageProps {
  /** 各展台對應的頁面滾動進度錨點（7 個，遞增 0–1），由 Home 量測供給 */
  anchorsRef: MutableRefObject<number[]>;
  onReady: () => void;
  onFail: () => void;
}

const STAGE_COUNT = 7; // Stage00–Stage06

/**
 * 內容安全區（方案一＋二混合）：
 * - 物件「配置」於側廊帶（|x-station.x| ≥ 3.4）
 * - 另以逐幀 NDC 投影夾制強制排除：任何裝飾物件投影進入中央
 *   18%–82%＋80px margin 時，沿較近一側推移出安全區（含過場狀態）
 * 例外：首屏手把（右側 55–95%）、結尾底座（中央）、
 * 畫面下方的地板前裙、上緣桁架燈條。
 */
const LATERAL = [0, 0.5, -0.4, 0.3, -0.5, 0.4, 0];
const VERTICAL = [0, 0.5, -0.35, 0.4, -0.5, 0.35, 0];
const STATION_GAP = 11;

const stationAt = (i: number) => new Vector3(LATERAL[i], VERTICAL[i], -i * STATION_GAP);

const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/** 8 零件的側廊飄散位置（左右交錯、刻意不均勻）與自轉速度 */
const SCATTER: Array<{ off: [number, number, number]; spin: number }> = [
  { off: [-4.5, 1.2, -0.6], spin: 0.9 },
  { off: [4.4, 0.6, 0.4], spin: -0.7 },
  { off: [-5.1, -0.4, 0.8], spin: 1.3 },
  { off: [4.8, 1.8, -0.9], spin: -1.1 },
  { off: [-4.2, -1.3, 0.1], spin: 0.8 },
  { off: [5.3, -0.7, -0.4], spin: -1.4 },
  { off: [-4.8, 0.3, 1.2], spin: 1.0 },
  { off: [5.0, -1.6, 0.7], spin: -0.9 },
];

export default function StageComponent({ anchorsRef, onReady, onFail }: StageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onFailRef = useRef(onFail);
  onFailRef.current = onFail;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.78;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    const scene = new Scene();
    scene.fog = new Fog(0x0d0b1a, 10, 50);
    const camera = new PerspectiveCamera(38, 1, 0.1, 120);

    /* ===== 燈光 ===== */
    scene.add(new AmbientLight(0x1a1730, 0.25));
    const dir = new DirectionalLight(0xffffff, 0.75);
    dir.position.set(4, 6, 5);
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    dir.shadow.camera.near = 0.5;
    dir.shadow.camera.far = 30;
    scene.add(dir);
    const rimCyan = new PointLight(0x00f0ff, 2.8, 18);
    rimCyan.position.set(-6, 2, -2);
    scene.add(rimCyan);
    const rimMagenta = new PointLight(0xff2e9f, 2.4, 18);
    rimMagenta.position.set(6, -1, -3);
    scene.add(rimMagenta);
    const spot = new SpotLight(0xe8f0ff, 1.2, 20, Math.PI / 6, 0.4);
    const spotTarget = new Object3D();
    scene.add(spot, spotTarget);
    spot.target = spotTarget;

    const pmrem = new PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const mats = createStageMaterials();
    const extraMaterials: MeshStandardMaterial[] = [];

    const stages: Group[] = [];
    for (let i = 0; i < STAGE_COUNT; i++) {
      const g = new Group();
      g.position.copy(stationAt(i));
      scene.add(g);
      stages.push(g);
    }

    /* ===== 安全區夾制註冊表（方案一：逐幀 NDC 檢查＋推移，含物件半寬） ===== */
    const clampables: Array<{ obj: Object3D; home: Vector3; stage: Group; radius: number }> = [];
    const registerClamp = (obj: Object3D, stage: Group, radius: number) => {
      clampables.push({ obj, home: obj.position.clone(), stage, radius });
    };

    /* ===== 環境結構 ===== */

    /* 地板前裙：每站短平面（僅出現於畫面下方；長地板會在地平線進入中央帶，依規格優先序捨棄） */
    const floorMat = new MeshStandardMaterial({
      color: 0x2b3040,
      metalness: 0.9,
      roughness: 0.25,
      envMapIntensity: 0.8,
    });
    extraMaterials.push(floorMat);
    const apronGeo = new PlaneGeometry(10, 5);
    const apronGroups: Group[] = [];
    for (let i = 1; i <= 6; i++) {
      /* 前裙獨立群組：僅在自站聚焦（|Δ|<0.5）顯示，避免鄰站前裙遠距入鏡成中央橫線 */
      const ag = new Group();
      const apron = new Mesh(apronGeo, floorMat);
      apron.rotation.x = -Math.PI / 2;
      apron.position.set(0, -2.9, 2.5);
      apron.receiveShadow = true;
      ag.add(apron);
      for (const sx of [-3.3, 3.3]) {
        const railStrip = new Mesh(rbox(0.08, 0.05, 4, 0.02), mats.polish);
        railStrip.position.set(sx, -2.86, 2.5);
        ag.add(railStrip);
      }
      stages[i].add(ag);
      apronGroups.push(ag);
    }

    /* 頂部桁架燈條（僅畫面上緣） */
    const lightMat = new MeshStandardMaterial({
      color: 0x1a2030,
      metalness: 0.6,
      roughness: 0.4,
      emissive: 0x8fd0e8,
      emissiveIntensity: 0.8,
    });
    extraMaterials.push(lightMat);

    /* 側牆（每展台造型不同）＋遠景暗色結構 */
    const WALL_H = [0, 3.2, 2.6, 3.6, 2.8, 3.0, 0];
    const WALL_W = [0, 3.4, 4.2, 3.0, 3.8, 3.6, 0];
    for (let i = 1; i <= 5; i++) {
      for (const side of [-1, 1]) {
        const wall = makePanel(mats, WALL_W[i], WALL_H[i], 0.16);
        wall.position.set(side * 5.4, 0.2, side === -1 ? -1.2 : 0.8);
        wall.rotation.y = -side * 0.18;
        stages[i].add(wall);
        registerClamp(wall, stages[i], WALL_W[i] / 2 + 0.2);
      }
      const truss = new Group();
      truss.add(new Mesh(rbox(7, 0.14, 0.28, 0.04), mats.matte));
      const strip = new Mesh(rbox(6.4, 0.05, 0.12, 0.02), lightMat);
      strip.position.y = -0.09;
      truss.add(strip);
      truss.position.set(0, 3.8, -1.5);
      stages[i].add(truss);
      for (const side of [-1, 1]) {
        const far = new Mesh(rbox(4.5, 3.2, 0.5, 0.1), mats.seam);
        far.position.set(side * 8.2, 0.4, -7);
        stages[i].add(far);
        registerClamp(far, stages[i], 2.4);
      }
    }

    /* ===== Stage00 — Hero（例外區）：手把＋攝影棚地板＋接地陰影 ===== */
    const pad = buildGamepad(mats);
    const padGroup = new Group();
    padGroup.scale.setScalar(0.62);
    padGroup.position.copy(stationAt(0)).add(new Vector3(1.4, 0.1, 0));
    padGroup.add(pad.holder);
    scene.add(padGroup);

    const heroFloorMat = new MeshStandardMaterial({
      color: 0x3a3f4c,
      metalness: 0.9,
      roughness: 0.15,
      transparent: true,
      opacity: 0.55,
    });
    extraMaterials.push(heroFloorMat);
    const heroFloor = new Mesh(new PlaneGeometry(14, 10), heroFloorMat);
    heroFloor.rotation.x = -Math.PI / 2;
    heroFloor.position.set(1.4, -1.35, 0);
    stages[0].add(heroFloor);
    const shadowMat = new ShadowMaterial({ opacity: 0.35 });
    extraMaterials.push(shadowMat as unknown as MeshStandardMaterial);
    const shadowPlane = new Mesh(new PlaneGeometry(14, 10), shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(1.4, -1.34, 0);
    shadowPlane.receiveShadow = true;
    stages[0].add(shadowPlane);

    const d1 = stationAt(1).clone().sub(padGroup.position);
    const d6 = stationAt(6).clone().sub(padGroup.position).add(new Vector3(0, 0.1, 0));
    const partStates = pad.parts.map((p, idx) => {
      const F = d6.clone().multiplyScalar(1 / 0.62).add(p.group.position);
      /* 重組中繼點：結尾展台旁的側廊（避免飛行穿越中央帶） */
      const W = F.clone();
      W.x += Math.sign(SCATTER[idx].off[0]) * 12;
      W.y += 1.2 + (idx % 3) * 0.4;
      return {
        group: p.group,
        A: p.group.position.clone(),
        S: d1.clone().multiplyScalar(1 / 0.62).add(new Vector3(...SCATTER[idx].off).multiplyScalar(1.6)),
        W,
        F,
        baseRot: p.group.rotation.clone(),
        spin: SCATTER[idx].spin,
      };
    });

    /* ===== Stage01 — 技術能力：側廊零件陣列＋金屬標籤板 ===== */
    for (let i = 0; i < SCATTER.length; i++) {
      const [ox, oy, oz] = SCATTER[i].off;
      const plate = makePanel(mats, 0.9, 0.5);
      plate.position.set(ox + Math.sign(ox) * 0.85, oy - 0.45, oz);
      plate.rotation.y = -Math.sign(ox) * 0.25;
      stages[1].add(plate);
      registerClamp(plate, stages[1], 0.75);
    }

    /* ===== Stage02 — 專案：側廊展示台（左右交錯，代表作較大＋洋紅光環） ===== */
    const rotors: Group[] = [];
    /* 六座對應六件專案（代表作較大＋洋紅光環）；全數落於側廊並逐幀夾制於安全區外 */
    const PED: Array<{ x: number; z: number; boss: boolean }> = [
      { x: 3.8, z: 1.2, boss: true },
      { x: -3.7, z: 0.4, boss: false },
      { x: 3.7, z: -0.5, boss: false },
      { x: -3.8, z: -1.4, boss: false },
      { x: 3.9, z: -2.2, boss: false },
      { x: -3.9, z: -3.1, boss: false },
    ];
    for (const cfg of PED) {
      const unit = new Group();
      const ped = makePedestal(mats, cfg.boss ? 0.85 : 0.55, cfg.boss ? 1.1 : 0.8, cfg.boss);
      ped.position.y = cfg.boss ? -0.6 : -0.85;
      unit.add(ped);
      const rotor = new Group();
      rotor.add(new Mesh(rbox(0.45, 0.18, 0.18, 0.05), mats.matte));
      rotor.add(new Mesh(rbox(0.18, 0.45, 0.18, 0.05), cfg.boss ? mats.polish : mats.matte));
      rotor.position.y = cfg.boss ? 0.5 : 0.05;
      unit.add(rotor);
      rotors.push(rotor);
      unit.position.set(cfg.x, 0, cfg.z);
      stages[2].add(unit);
      registerClamp(unit, stages[2], cfg.boss ? 1.1 : 0.75);
    }

    /* ===== Stage03 — 經歷：垂直軌道（左側廊，整組可被推移） ===== */
    const railGroup = new Group();
    const rail = new Mesh(rbox(0.42, 9, 0.3, 0.08), mats.matte);
    railGroup.add(rail);
    const clipGlowMats: MeshStandardMaterial[] = [];
    for (let i = 0; i < 7; i++) {
      const glow = mats.glowCyan.clone();
      glow.emissiveIntensity = 0;
      clipGlowMats.push(glow);
      extraMaterials.push(glow);
      const clip = new Mesh(rbox(0.6, 0.3, 0.4, 0.06), glow);
      clip.position.set(0, 3.6 - i * 1.2, 0.12);
      railGroup.add(clip);
      const bracket = new Mesh(rbox(0.72, 0.1, 0.34, 0.03), mats.polish);
      bracket.position.set(0, 3.6 - i * 1.2 - 0.22, 0.1);
      railGroup.add(bracket);
    }
    railGroup.position.set(-3.7, 0, 0);
    stages[3].add(railGroup);
    registerClamp(railGroup, stages[3], 0.5);

    /* ===== Stage04 — 活動競賽：側廊懸掛徽章牆 ===== */
    const medals: Array<{ group: Group; baseY: number }> = [];
    const MEDAL: Array<[number, number, number]> = [
      [-3.8, 1.3, 0.4], [-3.7, 0.1, -0.4], [-3.9, -1.1, 0.3], [-3.6, 1.9, -1.0],
      [3.8, 1.5, 0.2], [3.7, 0.3, -0.6], [3.9, -0.9, 0.5], [3.6, -1.8, -0.3],
    ];
    for (let i = 0; i < MEDAL.length; i++) {
      const medal = makeMedal(mats, i % 3 === 0 ? 0.55 : 0.42);
      medal.position.set(...MEDAL[i]);
      const facing = -Math.sign(MEDAL[i][0]) * 0.85;
      medal.rotation.y = facing;
      medal.rotation.x = 0.1 * (i % 2 === 0 ? 1 : -1);
      stages[4].add(medal);
      medals.push({ group: medal, baseY: facing });
      registerClamp(medal, stages[4], 0.65);
    }

    /* ===== Stage05 — 證照：右側廊層疊卡片架（整架可被推移） ===== */
    const cardRack = new Group();
    const cards: Group[] = [];
    for (let i = 0; i < 6; i++) {
      const card = makeCard(mats, 1.5, 1.0);
      card.position.set(0, 0, -i * 0.09);
      cards.push(card);
      cardRack.add(card);
    }
    cardRack.rotation.y = -0.5;
    cardRack.position.set(3.9, 0, 0);
    stages[5].add(cardRack);
    registerClamp(cardRack, stages[5], 1.4);

    /* ===== Stage06 — 結尾（例外區）：中央底座，零件重組於其上 ===== */
    const outroRing = makePedestal(mats, 1.5, 0.35, false);
    outroRing.position.set(0, -1.15, 0);
    stages[6].add(outroRing);

    /* ===== 攝影機軌道 ===== */
    const camPts: Vector3[] = [];
    const lookPts: Vector3[] = [];
    const CAM_LAT = [0.3, -0.2, 0.25, -0.2, 0.2, -0.15, 0.1];
    const CAM_VERT = [0.35, 0.4, -0.15, 0.3, -0.2, 0.3, 0.3];
    for (let i = 0; i < STAGE_COUNT; i++) {
      camPts.push(stationAt(i).clone().add(new Vector3(CAM_LAT[i], CAM_VERT[i], 7.2)));
      lookPts.push(stationAt(i).clone().add(new Vector3(i === 0 ? 0.9 : 0, 0, 0)));
    }
    const curve = new CatmullRomCurve3(camPts, false, 'catmullrom', 0.35);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    /* ===== 安全區夾制：投影進入中央帶（±0.64 NDC＋80px margin）→ 沿較近側推出 ===== */
    const tmpA = new Vector3();
    const tmpB = new Vector3();
    const camRight = new Vector3();
    const clampSafeZone = () => {
      camera.updateMatrixWorld();
      camRight.setFromMatrixColumn(camera.matrixWorld, 0);
      const limit = 0.64 + 160 / window.innerWidth; // 80px margin（NDC）
      for (const c of clampables) {
        if (!c.stage.visible) continue;
        tmpA.copy(c.home).add(c.stage.position);
        tmpB.copy(tmpA).add(camRight);
        tmpA.project(camera);
        if (tmpA.z >= 1 || tmpA.z <= -1) {
          c.obj.position.x = c.home.x;
          continue;
        }
        tmpB.project(camera);
        const perWorld = tmpB.x - tmpA.x;
        /* 需求邊界＝安全區邊界＋物件半寬（投影至 NDC） */
        const need = limit + Math.abs(perWorld) * c.radius;
        if (Math.abs(tmpA.x) < need && Math.abs(perWorld) > 1e-4) {
          const side = tmpA.x >= 0 ? 1 : -1;
          const dx = (side * need - tmpA.x) / perWorld;
          c.obj.position.x = MathUtils.lerp(c.obj.position.x, c.home.x + dx, 0.3);
          continue;
        }
        c.obj.position.x = MathUtils.lerp(c.obj.position.x, c.home.x, 0.15);
      }
    };

    /* ===== render loop ===== */
    let raf = 0;
    let running = false;
    let disposed = false;
    let prog = 0;
    let startTime = performance.now();
    let frames = 0;
    let lastCheck = performance.now();
    let lowStreak = 0;
    const lookCur = new Vector3().copy(lookPts[0]);
    const tmpLook = new Vector3();

    const update = (now: number) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const target = max > 0 ? MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
      prog += (target - prog) * 0.08;

      const a = anchorsRef.current;
      let seg = 0;
      while (seg < STAGE_COUNT - 2 && prog > a[seg + 1]) seg++;
      const span = Math.max(a[seg + 1] - a[seg], 1e-4);
      const s = MathUtils.clamp((prog - a[seg]) / span, 0, 1);
      const eased = smootherstep(s);
      const stageP = seg + eased;
      const curveT = MathUtils.clamp(stageP / (STAGE_COUNT - 1), 0, 1);

      camera.position.copy(curve.getPointAt(curveT));
      tmpLook.copy(lookPts[seg]).lerp(lookPts[Math.min(seg + 1, STAGE_COUNT - 1)], eased);
      lookCur.lerp(tmpLook, 0.12);
      camera.lookAt(lookCur);
      spot.position.copy(camera.position).add(new Vector3(0, 1.6, 0));
      spotTarget.position.copy(lookCur);

      /* 離開視窗的展台不進入渲染（收窄至 0.95 降低遠處結構的中央匯聚） */
      for (let i = 0; i < STAGE_COUNT; i++) stages[i].visible = Math.abs(stageP - i) < 0.95;
      padGroup.visible = stageP < 2.2 || stageP > 4.6;
      /* 結尾底座（中央豁免物）僅於終幕現身，避免提前壓在文章區 */
      outroRing.visible = stageP > 5.85;
      /* 前裙僅自站聚焦顯示 */
      for (let i = 0; i < apronGroups.length; i++) {
        apronGroups[i].visible = Math.abs(stageP - (i + 1)) < 0.5;
      }

      /* 雙軸擺動；隨拆解把 holder 旋轉淡出至 0——否則側廊散佈座標會被旋轉映射扭進中央帶 */
      const swayAmp = MathUtils.clamp(1 - stageP * 1.1, 0, 1);
      const rotFade = MathUtils.clamp(1 - stageP / 0.6, 0, 1);
      pad.holder.rotation.y = (0.4 + Math.sin(now * 0.0003) * 0.12 * swayAmp) * rotFade;
      pad.holder.rotation.x = (-0.15 + Math.sin(now * 0.00022) * 0.06 * swayAmp) * rotFade;

      for (let i = 0; i < partStates.length; i++) {
        const ps = partStates[i];
        if (stageP <= 1) {
          const k = smootherstep(MathUtils.clamp(stageP, 0, 1));
          ps.group.position.lerpVectors(ps.A, ps.S, k);
          ps.group.rotation.set(
            ps.baseRot.x + ps.spin * 2 * k,
            ps.baseRot.y + ps.spin * 3 * k,
            ps.baseRot.z + ps.spin * 1.4 * k,
          );
        } else if (stageP >= 5) {
          /* 三段重組：側廊過境（5.0–5.7）→ 停留（–5.85）→ 末端進場合體（5.85–6.0） */
          const k1 = smootherstep(MathUtils.clamp((stageP - 5) / 0.7, 0, 1));
          const k2 = smootherstep(MathUtils.clamp((stageP - 5.85) / 0.15, 0, 1));
          if (k2 <= 0) {
            ps.group.position.lerpVectors(ps.S, ps.W, k1);
          } else {
            ps.group.position.lerpVectors(ps.W, ps.F, k2);
          }
          const kr = smootherstep(MathUtils.clamp((stageP - 5) / 1, 0, 1));
          ps.group.rotation.set(
            MathUtils.lerp(ps.baseRot.x + ps.spin * 2, ps.baseRot.x, kr),
            MathUtils.lerp(ps.baseRot.y + ps.spin * 3, ps.baseRot.y, kr),
            MathUtils.lerp(ps.baseRot.z + ps.spin * 1.4, ps.baseRot.z, kr),
          );
        } else {
          ps.group.position.copy(ps.S);
          ps.group.position.y += Math.sin(now * 0.0004 + i * 1.7) * 0.18;
          ps.group.rotation.y = ps.baseRot.y + ps.spin * 3 + now * 0.00015 * ps.spin;
        }
      }

      mats.glowMagenta.emissiveIntensity =
        stageP > 5.9 ? 1.2 + Math.sin(now * 0.004) * 0.5 : 1.2;

      if (stages[2].visible) {
        for (const rotor of rotors) rotor.rotation.y = now * 0.0006;
      }

      if (stages[3].visible) {
        const local = seg === 3 ? eased : stageP < 3 ? 0 : 1;
        const active = Math.min(Math.floor(local * 7), 6);
        for (let i = 0; i < clipGlowMats.length; i++) {
          clipGlowMats[i].emissiveIntensity = i === active ? 1.2 : 0;
        }
      }

      if (stages[4].visible) {
        const local = seg === 4 ? eased : stageP < 4 ? 0 : 1;
        for (let i = 0; i < medals.length; i++) {
          medals[i].group.rotation.y =
            medals[i].baseY + (i % 2 === 0 ? 1 : -1) * local * 1.6;
        }
      }

      if (stages[5].visible) {
        const k = MathUtils.clamp(1 - Math.abs(stageP - 5) * 1.6, 0, 1);
        for (let i = 0; i < cards.length; i++) {
          const off = i - (cards.length - 1) / 2;
          cards[i].position.x = off * 0.26 * k;
          cards[i].position.y = off * 0.3 * k;
          cards[i].rotation.z = off * -0.07 * k;
        }
      }

      /* 安全區強制排除（含過場狀態） */
      clampSafeZone();
    };

    const tick = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      update(now);
      renderer.render(scene, camera);

      frames++;
      if (now - lastCheck >= 1000) {
        const fps = (frames * 1000) / (now - lastCheck);
        frames = 0;
        lastCheck = now;
        if (now - startTime > 2000) {
          if (fps < 30) {
            lowStreak++;
            if (lowStreak >= 2) {
              onFailRef.current();
              return;
            }
          } else {
            lowStreak = 0;
          }
        }
      }
    };

    const start = () => {
      if (running || disposed) return;
      running = true;
      startTime = performance.now();
      lastCheck = startTime;
      frames = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      onFailRef.current();
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    update(performance.now());
    renderer.render(scene, camera);
    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>).__stage = { renderer, scene, camera, update };
    }
    onReady();
    if (!document.hidden) start();

    return () => {
      disposed = true;
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      apronGeo.dispose();
      heroFloor.geometry.dispose();
      shadowPlane.geometry.dispose();
      disposeSharedGeometries();
      for (const m of mats.all) m.dispose();
      for (const m of extraMaterials) m.dispose();
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (import.meta.env.DEV) {
        delete (window as unknown as Record<string, unknown>).__stage;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}
