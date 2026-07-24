/**
 * 3D 舞台能力閘門（不 import three.js，供首屏同步判定）。
 * 任一條件不符 → 使用完整的 2D 版本：
 *   1. WebGL 不支援
 *   2. prefers-reduced-motion
 *   3. hardwareConcurrency < 4
 *   4. 螢幕寬 < 1024px（手機與小平板一律不跑 3D）
 */
export function supports3D(): boolean {
  if (typeof window === 'undefined') return false;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

  if ((navigator.hardwareConcurrency ?? 0) < 4) return false;

  if (window.innerWidth < 1024) return false;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');
    if (!gl) return false;
  } catch {
    return false;
  }

  return true;
}
