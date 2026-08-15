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
  MeshBasicMaterial,
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
  setLiteDetail,
} from './builders';

interface StageProps {
  /** 各展台對應的頁面滾動進度錨點（7 個，遞增 0–1），由 Home 量測供給 */
  anchorsRef: MutableRefObject<number[]>;
  /** 'A' = 桌機完整；'B' = 高階行動裝置輕量 */
  tier: 'A' | 'B';
  onReady: () => void;
  onFail: () => void;
}

const STAGE_COUNT = 7; // Stage00–Stage06
const STATION_GAP = 11;
const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/* Level A 站位（帶橫向與垂直起伏）；Level B 用直式（純 Z） */
const LATERAL = [0, 0.5, -0.4, 0.3, -0.5, 0.4, 0];
const VERTICAL = [0, 0.5, -0.35, 0.4, -0.5, 0.35, 0];
const stationAt = (i: number) => new Vector3(LATERAL[i], VERTICAL[i], -i * STATION_GAP);

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

export default function StageComponent({ anchorsRef, tier, onReady, onFail }: StageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onFailRef = useRef(onFail);
  onFailRef.current = onFail;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const lite = tier === 'B';

    const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
    /* 輕量：pixelRatio 上限 1.5、關陰影 */
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lite ? 1.5 : 2));
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.78;
    renderer.shadowMap.enabled = !lite;
    renderer.shadowMap.type = PCFSoftShadowMap;

    const scene = new Scene();
    /* 輕量：霧拉近，減少同時渲染物件 */
    scene.fog = lite ? new Fog(0x0d0b1a, 6, 22) : new Fog(0x0d0b1a, 10, 50);
    /* 輕量：直式螢幕用較廣 fov 45 */
    const camera = new PerspectiveCamera(lite ? 45 : 38, 1, 0.1, 120);

    /* ===== 燈光 ===== */
    scene.add(new AmbientLight(0x1a1730, lite ? 0.32 : 0.25));
    const dir = new DirectionalLight(0xffffff, lite ? 0.85 : 0.75);
    dir.position.set(4, 6, 5);
    dir.castShadow = !lite;
    if (!lite) {
      dir.shadow.mapSize.set(1024, 1024);
      dir.shadow.camera.near = 0.5;
      dir.shadow.camera.far = 30;
    }
    scene.add(dir);
    const rimCyan = new PointLight(0x00f0ff, lite ? 2.4 : 2.8, lite ? 14 : 18);
    rimCyan.position.set(-6, 2, -2);
    scene.add(rimCyan);
    /* 輕量：僅單一彩色點光（無洋紅點光、無聚光燈） */
    let rimMagenta: PointLight | null = null;
    let spot: SpotLight | null = null;
    let spotTarget: Object3D | null = null;
    if (!lite) {
      rimMagenta = new PointLight(0xff2e9f, 2.4, 18);
      rimMagenta.position.set(6, -1, -3);
      scene.add(rimMagenta);
      spot = new SpotLight(0xe8f0ff, 1.2, 20, Math.PI / 6, 0.4);
      spotTarget = new Object3D();
      scene.add(spot, spotTarget);
      spot.target = spotTarget;
    }

    const pmrem = new PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    setLiteDetail(lite);
    const mats = createStageMaterials();
    const extraMaterials: MeshStandardMaterial[] = [];
    const localGeos: PlaneGeometry[] = [];

    /* 平滑滾動進度（兩個 update 分支共用同一區域變數） */
    let prog = 0;
    let update: (now: number) => void;

    if (lite) {
      /* ============================================================
       * Level B — 輕量 3D（直式：中央 55% 淨空，物件置上下緣band）
       * 只保留：首屏手把、地板、各站核心物件；無側牆／桁架／遠景／陰影
       * ============================================================ */
      const liteStationZ = (i: number) => -i * STATION_GAP;

      /* 地板 */
      const floorMat = new MeshStandardMaterial({
        color: 0x2b3040,
        metalness: 0.9,
        roughness: 0.28,
        envMapIntensity: 0.7,
      });
      extraMaterials.push(floorMat);
      /* 短地板：跟隨攝影機、遠緣止於地平線之下，只落在畫面下緣 band（不進中央） */
      const floorGeo = new PlaneGeometry(18, 12);
      localGeos.push(floorGeo);
      const floor = new Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(0, -3.2, -8);
      scene.add(floor);

      /* 首屏手把（不拆解；置文字下方＝下緣band）＋平面漸層假陰影 */
      const pad = buildGamepad(mats);
      const padGroup = new Group();
      padGroup.scale.setScalar(0.5);
      padGroup.position.set(0, -1.9, 0);
      padGroup.add(pad.holder);
      scene.add(padGroup);

      const fakeShadowMat = new MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.32,
      });
      const fakeShadowGeo = new PlaneGeometry(3, 1.4);
      localGeos.push(fakeShadowGeo);
      const fakeShadow = new Mesh(fakeShadowGeo, fakeShadowMat);
      fakeShadow.rotation.x = -Math.PI / 2;
      fakeShadow.position.set(0, -2.7, 0);
      scene.add(fakeShadow);

      /* 各站核心物件：上/下緣band 交錯；垂直安全區 clamp 保障中央淨空 */
      type LC = { obj: Object3D; home: Vector3; stageIdx: number; radius: number; up: boolean };
      const liteClamps: LC[] = [];
      const coreGroups: Group[] = [];
      for (let i = 1; i <= 6; i++) {
        const g = new Group();
        g.position.set(0, 0, liteStationZ(i));
        scene.add(g);
        coreGroups.push(g);
      }
      const rotorsLite: Group[] = [];
      const glowClipMats: MeshStandardMaterial[] = [];
      let medalLite: Group | null = null;

      /* Stage1 技術：標籤板（上緣） */
      {
        const panel = makePanel(mats, 1.1, 0.62);
        panel.position.set(0, 2.7, 0);
        coreGroups[0].add(panel);
        liteClamps.push({ obj: panel, home: panel.position.clone(), stageIdx: 1, radius: 0.6, up: true });
      }
      /* Stage2 專案：展示台＋旋轉象徵（代表作光環，下緣） */
      {
        const unit = new Group();
        const ped = makePedestal(mats, 0.7, 0.9, true);
        ped.position.y = -0.35;
        unit.add(ped);
        const rotor = new Group();
        rotor.add(new Mesh(rbox(0.45, 0.18, 0.18, 0.05), mats.matte));
        rotor.add(new Mesh(rbox(0.18, 0.45, 0.18, 0.05), mats.polish));
        rotor.position.y = 0.5;
        unit.add(rotor);
        rotorsLite.push(rotor);
        unit.position.set(0, -2.5, 0);
        coreGroups[1].add(unit);
        liteClamps.push({ obj: unit, home: unit.position.clone(), stageIdx: 2, radius: 0.9, up: false });
      }
      /* Stage3 經歷：短金屬軌道＋發光扣件（上緣） */
      {
        const railG = new Group();
        railG.add(new Mesh(rbox(0.4, 2.2, 0.3, 0.08), mats.matte));
        for (let k = 0; k < 3; k++) {
          const glow = mats.glowCyan.clone();
          glow.emissiveIntensity = k === 1 ? 1.2 : 0.25;
          glowClipMats.push(glow);
          extraMaterials.push(glow);
          const clip = new Mesh(rbox(0.55, 0.28, 0.4, 0.06), glow);
          clip.position.set(0, 0.75 - k * 0.75, 0.12);
          railG.add(clip);
        }
        railG.position.set(0, 2.6, 0);
        coreGroups[2].add(railG);
        liteClamps.push({ obj: railG, home: railG.position.clone(), stageIdx: 3, radius: 1.2, up: true });
      }
      /* Stage4 活動：金屬獎牌（下緣） */
      {
        const medal = makeMedal(mats, 0.6);
        medal.position.set(0, -2.6, 0);
        coreGroups[3].add(medal);
        medalLite = medal;
        liteClamps.push({ obj: medal, home: medal.position.clone(), stageIdx: 4, radius: 0.65, up: false });
      }
      /* Stage5 證照：層疊卡片（上緣） */
      {
        const rack = new Group();
        for (let k = 0; k < 3; k++) {
          const card = makeCard(mats, 1.3, 0.9);
          card.position.set(k * 0.12 - 0.12, 0, -k * 0.06);
          card.rotation.z = (k - 1) * 0.06;
          rack.add(card);
        }
        rack.position.set(0, 2.6, 0);
        coreGroups[4].add(rack);
        liteClamps.push({ obj: rack, home: rack.position.clone(), stageIdx: 5, radius: 0.9, up: true });
      }
      /* Stage6 結尾：中央底座（例外區，不 clamp） */
      const outroRing = makePedestal(mats, 1.2, 0.32, false);
      outroRing.position.set(0, -1.4, 0);
      coreGroups[5].add(outroRing);

      /* 垂直安全區 clamp：中央 55%（上緣 ndc.y≥0.6、下緣 ndc.y≤-0.5 為可用區） */
      const cUp = new Vector3();
      const pA = new Vector3();
      const pB = new Vector3();
      const clampVertical = () => {
        camera.updateMatrixWorld();
        cUp.setFromMatrixColumn(camera.matrixWorld, 1);
        for (const c of liteClamps) {
          const g = coreGroups[c.stageIdx - 1];
          if (!g.visible) continue;
          pA.copy(c.home).add(g.position);
          pB.copy(pA).add(cUp);
          pA.project(camera);
          if (pA.z >= 1 || pA.z <= -1) {
            c.obj.position.y = c.home.y;
            continue;
          }
          pB.project(camera);
          const per = pB.y - pA.y;
          const rNDC = Math.abs(per) * c.radius;
          const target = c.up ? 0.6 + 0.05 + rNDC : -0.5 - 0.05 - rNDC;
          const intrudes = c.up ? pA.y < target : pA.y > target;
          if (intrudes && Math.abs(per) > 1e-4) {
            const dy = (target - pA.y) / per;
            c.obj.position.y = MathUtils.lerp(c.obj.position.y, c.home.y + dy, 0.3);
          } else {
            c.obj.position.y = MathUtils.lerp(c.obj.position.y, c.home.y, 0.15);
          }
        }
      };

      update = (now: number) => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const targetP = max > 0 ? MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
        prog += (targetP - prog) * 0.08;

        const a = anchorsRef.current;
        let seg = 0;
        while (seg < STAGE_COUNT - 2 && prog > a[seg + 1]) seg++;
        const span = Math.max(a[seg + 1] - a[seg], 1e-4);
        const eased = smootherstep(MathUtils.clamp((prog - a[seg]) / span, 0, 1));
        const stageP = seg + eased;

        /* 直式攝影機：純 Z 前進，無橫移、無 roll */
        const camZ = -stageP * STATION_GAP + 7.2;
        camera.position.set(0, 0.2, camZ);
        camera.up.set(0, 1, 0);
        camera.lookAt(0, 0, camZ - 8);
        /* 地板跟隨攝影機，遠緣止於中央帶下方 */
        floor.position.z = camZ - 8;

        /* 同時可見上限 2（|Δ|<0.6） */
        for (let i = 0; i < coreGroups.length; i++) {
          coreGroups[i].visible = Math.abs(stageP - (i + 1)) < 0.6;
        }
        outroRing.visible = stageP > 5.6;

        /* 手把：hero（下緣）淡出；結尾聚合回中央底座上方 */
        const heroVisible = stageP < 1.4;
        const outroVisible = stageP > 5.6;
        padGroup.visible = heroVisible || outroVisible;
        fakeShadow.visible = heroVisible;
        if (outroVisible) {
          const k = smootherstep(MathUtils.clamp((stageP - 5.6) / 0.4, 0, 1));
          padGroup.position.set(0, MathUtils.lerp(-1.9, -0.8, k), MathUtils.lerp(0, camZ + 4.5, k));
          padGroup.scale.setScalar(MathUtils.lerp(0.5, 0.42, k));
        } else {
          padGroup.position.set(0, -1.9, 0);
          padGroup.scale.setScalar(0.5);
        }
        pad.holder.rotation.y = 0.4 + Math.sin(now * 0.0003) * 0.14;
        pad.holder.rotation.x = -0.15 + Math.sin(now * 0.00022) * 0.06;

        /* 核心物件動畫（cheap） */
        if (coreGroups[1].visible) for (const r of rotorsLite) r.rotation.y = now * 0.0006;
        if (medalLite && coreGroups[3].visible) medalLite.rotation.y = now * 0.0009;
        mats.glowMagenta.emissiveIntensity = outroVisible ? 1.2 + Math.sin(now * 0.004) * 0.5 : 1.2;

        clampVertical();
      };
    } else {
      /* ============================================================
       * Level A — 完整 3D（桌機；側廊帶＋環境結構＋逐幀水平 clamp）
       * ============================================================ */
      const stages: Group[] = [];
      for (let i = 0; i < STAGE_COUNT; i++) {
        const g = new Group();
        g.position.copy(stationAt(i));
        scene.add(g);
        stages.push(g);
      }

      const clampables: Array<{ obj: Object3D; home: Vector3; stage: Group; radius: number }> = [];
      const registerClamp = (obj: Object3D, stage: Group, radius: number) => {
        clampables.push({ obj, home: obj.position.clone(), stage, radius });
      };

      const floorMat = new MeshStandardMaterial({
        color: 0x2b3040,
        metalness: 0.9,
        roughness: 0.25,
        envMapIntensity: 0.8,
      });
      extraMaterials.push(floorMat);
      const apronGeo = new PlaneGeometry(10, 5);
      localGeos.push(apronGeo);
      const apronGroups: Group[] = [];
      for (let i = 1; i <= 6; i++) {
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

      const lightMat = new MeshStandardMaterial({
        color: 0x1a2030,
        metalness: 0.6,
        roughness: 0.4,
        emissive: 0x8fd0e8,
        emissiveIntensity: 0.8,
      });
      extraMaterials.push(lightMat);

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
      const heroFloorGeo = new PlaneGeometry(14, 10);
      localGeos.push(heroFloorGeo);
      const heroFloor = new Mesh(heroFloorGeo, heroFloorMat);
      heroFloor.rotation.x = -Math.PI / 2;
      heroFloor.position.set(1.4, -1.35, 0);
      stages[0].add(heroFloor);
      const shadowMat = new ShadowMaterial({ opacity: 0.35 });
      extraMaterials.push(shadowMat as unknown as MeshStandardMaterial);
      const shadowGeo = new PlaneGeometry(14, 10);
      localGeos.push(shadowGeo);
      const shadowPlane = new Mesh(shadowGeo, shadowMat);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.set(1.4, -1.34, 0);
      shadowPlane.receiveShadow = true;
      stages[0].add(shadowPlane);

      const d1 = stationAt(1).clone().sub(padGroup.position);
      const d6 = stationAt(6).clone().sub(padGroup.position).add(new Vector3(0, 0.1, 0));
      const partStates = pad.parts.map((p, idx) => {
        const F = d6.clone().multiplyScalar(1 / 0.62).add(p.group.position);
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

      for (let i = 0; i < SCATTER.length; i++) {
        const [ox, oy, oz] = SCATTER[i].off;
        const plate = makePanel(mats, 0.9, 0.5);
        plate.position.set(ox + Math.sign(ox) * 0.85, oy - 0.45, oz);
        plate.rotation.y = -Math.sign(ox) * 0.25;
        stages[1].add(plate);
        registerClamp(plate, stages[1], 0.75);
      }

      const rotors: Group[] = [];
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

      const railGroup = new Group();
      railGroup.add(new Mesh(rbox(0.42, 9, 0.3, 0.08), mats.matte));
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

      const outroRing = makePedestal(mats, 1.5, 0.35, false);
      outroRing.position.set(0, -1.15, 0);
      stages[6].add(outroRing);

      const camPts: Vector3[] = [];
      const lookPts: Vector3[] = [];
      const CAM_LAT = [0.3, -0.2, 0.25, -0.2, 0.2, -0.15, 0.1];
      const CAM_VERT = [0.35, 0.4, -0.15, 0.3, -0.2, 0.3, 0.3];
      for (let i = 0; i < STAGE_COUNT; i++) {
        camPts.push(stationAt(i).clone().add(new Vector3(CAM_LAT[i], CAM_VERT[i], 7.2)));
        lookPts.push(stationAt(i).clone().add(new Vector3(i === 0 ? 0.9 : 0, 0, 0)));
      }
      const curve = new CatmullRomCurve3(camPts, false, 'catmullrom', 0.35);

      const tmpA = new Vector3();
      const tmpB = new Vector3();
      const camRight = new Vector3();
      const clampSafeZone = () => {
        camera.updateMatrixWorld();
        camRight.setFromMatrixColumn(camera.matrixWorld, 0);
        const limit = 0.64 + 160 / window.innerWidth;
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

      const lookCur = new Vector3().copy(lookPts[0]);
      const tmpLook = new Vector3();

      update = (now: number) => {
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
        spot!.position.copy(camera.position).add(new Vector3(0, 1.6, 0));
        spotTarget!.position.copy(lookCur);

        for (let i = 0; i < STAGE_COUNT; i++) stages[i].visible = Math.abs(stageP - i) < 0.95;
        padGroup.visible = stageP < 2.2 || stageP > 4.6;
        outroRing.visible = stageP > 5.85;
        for (let i = 0; i < apronGroups.length; i++) {
          apronGroups[i].visible = Math.abs(stageP - (i + 1)) < 0.5;
        }

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
            medals[i].group.rotation.y = medals[i].baseY + (i % 2 === 0 ? 1 : -1) * local * 1.6;
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

        clampSafeZone();
      };
    }

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    /* ===== render loop（FPS 守門：桌機 2s<30fps、手機 1.5s<24fps 降級） ===== */
    let raf = 0;
    let running = false;
    let disposed = false;
    const fpsWindow = lite ? 750 : 1000;
    const fpsFloor = lite ? 24 : 30;
    let startTime = performance.now();
    let frames = 0;
    let lastCheck = performance.now();
    let lowStreak = 0;

    const tick = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      update(now);
      renderer.render(scene, camera);

      frames++;
      if (now - lastCheck >= fpsWindow) {
        const fps = (frames * 1000) / (now - lastCheck);
        frames = 0;
        lastCheck = now;
        if (now - startTime > 2000) {
          if (fps < fpsFloor) {
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
    /* 頁面失焦／切換 App 立即暫停 render loop */
    const onVisibility = () => (document.hidden ? stop() : start());
    const onBlur = () => stop();
    const onFocus = () => {
      if (!document.hidden) start();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      onFailRef.current();
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    update(performance.now());
    renderer.render(scene, camera);
    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>).__stage = { renderer, scene, camera, update, tier };
    }
    onReady();
    if (!document.hidden) start();

    return () => {
      disposed = true;
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      for (const g of localGeos) g.dispose();
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

  /* canvas 一律 pointer-events:none：不攔截頁面捲動手勢（手機關鍵） */
  return <canvas ref={canvasRef} className="pointer-events-none h-full w-full" />;
}
