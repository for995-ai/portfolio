import { MeshStandardMaterial } from 'three';

/**
 * 全站金屬材質系統（共用實例，卸載時統一 dispose）。
 * 層次原則：霧面主體(A) + 亮面點綴(B, 面積 ≈ 1:8) + 暗色縫隙(C) + 多巴胺發光件(D)。
 */
export interface StageMaterials {
  /** A. 霧面主體（拉絲鋁）：手把主體、基座、軌道 */
  matte: MeshStandardMaterial;
  /** B. 亮面點綴（拋光金屬）：邊框、倒角、按鍵環、獎牌邊緣 */
  polish: MeshStandardMaterial;
  /** C. 暗色縫隙：分模線、螺絲孔、接縫 */
  seam: MeshStandardMaterial;
  /** D. 多巴胺發光件（洋紅）：START 鍵、代表作光環 */
  glowMagenta: MeshStandardMaterial;
  /** D. 多巴胺發光件（青）：當前節點標記 */
  glowCyan: MeshStandardMaterial;
  all: MeshStandardMaterial[];
}

export function createStageMaterials(): StageMaterials {
  const matte = new MeshStandardMaterial({
    color: 0x9ba0ad,
    metalness: 0.9,
    roughness: 0.45,
    envMapIntensity: 0.9,
  });
  const polish = new MeshStandardMaterial({
    color: 0xc8cedc,
    metalness: 0.98,
    roughness: 0.18,
    envMapIntensity: 1.3,
  });
  const seam = new MeshStandardMaterial({
    color: 0x3a3f4c,
    metalness: 0.4,
    roughness: 0.85,
  });
  const glowMagenta = new MeshStandardMaterial({
    color: 0x2a1020,
    metalness: 0.6,
    roughness: 0.35,
    emissive: 0xff2e9f,
    emissiveIntensity: 1.2,
  });
  const glowCyan = new MeshStandardMaterial({
    color: 0x0a1a20,
    metalness: 0.6,
    roughness: 0.35,
    emissive: 0x00f0ff,
    emissiveIntensity: 1.2,
  });

  return {
    matte,
    polish,
    seam,
    glowMagenta,
    glowCyan,
    all: [matte, polish, seam, glowMagenta, glowCyan],
  };
}
