/**
 * 3D 能力三級分流（不 import three.js，供首屏同步判定）。
 *   Level A — 完整 3D：桌機（寬 ≥1024 且 cores ≥4 且 WebGL 可用）
 *   Level B — 輕量 3D：高階行動裝置（390 ≤寬 <1024 且 cores ≥6 且 deviceMemory ≥4
 *             〔若不支援則跳過〕且 WebGL2 且非 reduced-motion）
 *   Level C — 2D：其餘所有情況，或任一保護機制觸發
 */

export type Tier = 'A' | 'B' | 'C';

function webglOK(version: 1 | 2): boolean {
  try {
    const c = document.createElement('canvas');
    if (version === 2) return !!c.getContext('webgl2');
    return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

/** 同步判定基礎分級（電池／記憶體等非同步檢查由 levelBAllowed 另行 gate）。 */
export function detectTier(): Tier {
  if (typeof window === 'undefined') return 'C';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'C';

  const w = window.innerWidth;
  const cores = navigator.hardwareConcurrency ?? 0;

  // Level A：桌機完整
  if (w >= 1024 && cores >= 4 && webglOK(1)) return 'A';

  // Level B：高階行動裝置輕量
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  const memOK = mem === undefined || mem >= 4;
  if (w >= 390 && w < 1024 && cores >= 6 && memOK && webglOK(2)) return 'B';

  return 'C';
}

/**
 * Level B 專屬非同步 gate（載入 3D chunk 前執行）：
 *   - 記憶體：performance.memory 已用 >50% → 拒絕
 *   - 電池：navigator.getBattery 可用且電量 <20% 且未充電 → 拒絕
 * bypassBattery=true（使用者手動開啟）時略過電池偏好檢查，僅保留記憶體硬保護。
 */
export async function levelBAllowed(bypassBattery = false): Promise<boolean> {
  const perf = performance as unknown as {
    memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number };
  };
  if (perf.memory && perf.memory.jsHeapSizeLimit > 0) {
    if (perf.memory.usedJSHeapSize / perf.memory.jsHeapSizeLimit > 0.5) return false;
  }

  if (!bypassBattery) {
    const getBattery = (navigator as unknown as {
      getBattery?: () => Promise<{ charging: boolean; level: number }>;
    }).getBattery;
    if (typeof getBattery === 'function') {
      try {
        const bat = await getBattery.call(navigator);
        if (bat && bat.charging === false && bat.level < 0.2) return false;
      } catch {
        /* 不支援或被拒 → 忽略此條 */
      }
    }
  }

  return true;
}

/* ===== sessionStorage 偏好與熱節流（不用 localStorage，避免 artifact 限制衝突） ===== */

const PREF_KEY = 'arcade3d.pref'; // 'on' | 'off'
const BLOCKED_KEY = 'arcade3d.blocked'; // '1' = 本 session 熱節流封鎖

function ss(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function get3DPref(): 'on' | 'off' | 'auto' {
  const v = ss()?.getItem(PREF_KEY);
  return v === 'on' || v === 'off' ? v : 'auto';
}

export function set3DPref(v: 'on' | 'off'): void {
  ss()?.setItem(PREF_KEY, v);
}

export function is3DBlocked(): boolean {
  return ss()?.getItem(BLOCKED_KEY) === '1';
}

export function block3DForSession(): void {
  ss()?.setItem(BLOCKED_KEY, '1');
}
