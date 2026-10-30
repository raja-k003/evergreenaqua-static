/** Small, dependency-free colour helpers used to derive a custom theme. */

export const HEX_RE = /^#[0-9a-f]{6}$/i;

export function hexToRgb(hex: string): [number, number, number] | null {
  if (!HEX_RE.test(hex)) return null;
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex([r, g, b]: [number, number, number]): string {
  return '#' + [r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('');
}

export function luminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio between two hex colours (1–21). */
export function contrastRatio(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** Linear mix: weight 0 = a, 1 = b. */
export function mix(a: string, b: string, weight: number): string {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  if (!ra || !rb) return a;
  return rgbToHex([0, 1, 2].map((i) => ra[i] + (rb[i] - ra[i]) * weight) as [number, number, number]);
}

/**
 * Darkens (or lightens, for dark backgrounds) a colour until it reaches the
 * target contrast against `background`, so user-picked brand colours always
 * stay readable as text and link colours.
 */
export function ensureContrast(color: string, background: string, target = 4.5): string {
  const towards = luminance(background) > 0.5 ? '#000000' : '#ffffff';
  let result = color;
  for (let step = 0; step <= 20 && contrastRatio(result, background) < target; step++) {
    result = mix(color, towards, step * 0.05);
  }
  return result;
}

/** Picks white or near-black text for a coloured background. */
export function readableOn(background: string): string {
  return contrastRatio('#ffffff', background) >= contrastRatio('#0b1120', background) ? '#ffffff' : '#0b1120';
}
