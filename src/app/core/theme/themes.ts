export interface ThemeTokens {
  primary: string;
  primaryHover: string;
  onPrimary: string;
  primarySoft: string;
  accent: string;
  bg: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  danger: string;
}

export interface ThemePreset {
  id: string;
  label: string;
  description: string;
  scheme: 'light' | 'dark';
  tokens: ThemeTokens;
}

const status = { success: '#15803d', danger: '#b91c1c' };

/**
 * The five built-in presets. Every text/background pair here is checked for
 * WCAG AA contrast (4.5:1) by theme.spec.ts.
 */
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'aqua',
    label: 'Aqua',
    description: 'Evergreen Aqua brand blue',
    scheme: 'light',
    tokens: {
      primary: '#3857f1', primaryHover: '#2440d4', onPrimary: '#ffffff', primarySoft: '#e9eeff', accent: '#0ea5e9',
      bg: '#f6f8fe', surface: '#ffffff', surfaceAlt: '#eef2fc', text: '#0f172a', textMuted: '#475569', border: '#d9e0f0', ...status,
    },
  },
  {
    id: 'ocean',
    label: 'Ocean',
    description: 'Calm teal',
    scheme: 'light',
    tokens: {
      primary: '#0f766e', primaryHover: '#0b5c56', onPrimary: '#ffffff', primarySoft: '#e3f4f1', accent: '#14b8a6',
      bg: '#f4faf9', surface: '#ffffff', surfaceAlt: '#e9f4f2', text: '#0f1f1d', textMuted: '#45605c', border: '#d3e5e2', ...status,
    },
  },
  {
    id: 'forest',
    label: 'Forest',
    description: 'Fresh green',
    scheme: 'light',
    tokens: {
      primary: '#166534', primaryHover: '#114d28', onPrimary: '#ffffff', primarySoft: '#e6f4ea', accent: '#22c55e',
      bg: '#f6faf6', surface: '#ffffff', surfaceAlt: '#ecf5ee', text: '#122016', textMuted: '#4a5f50', border: '#d6e6d9', success: '#166534', danger: '#b91c1c',
    },
  },
  {
    id: 'sunset',
    label: 'Sunset',
    description: 'Warm terracotta',
    scheme: 'light',
    tokens: {
      primary: '#c2410c', primaryHover: '#9a330a', onPrimary: '#ffffff', primarySoft: '#fdeee4', accent: '#f59e0b',
      bg: '#fffaf6', surface: '#ffffff', surfaceAlt: '#fbf0e8', text: '#24150d', textMuted: '#6b5446', border: '#efdccf', ...status,
    },
  },
  {
    id: 'midnight',
    label: 'Midnight',
    description: 'Dark mode',
    scheme: 'dark',
    tokens: {
      primary: '#8ea6ff', primaryHover: '#b0c1ff', onPrimary: '#0b1120', primarySoft: '#1d2948', accent: '#38bdf8',
      bg: '#0b1120', surface: '#121a2f', surfaceAlt: '#18223b', text: '#e6ebf5', textMuted: '#a3afc4', border: '#26324f', success: '#4ade80', danger: '#f87171',
    },
  },
];

export const DEFAULT_THEME_ID = 'ocean';
export const THEME_STORAGE_KEY = 'smp-theme';
export const THEME_VARS_STORAGE_KEY = 'smp-theme-vars';
export const THEME_CUSTOM_STORAGE_KEY = 'smp-theme-custom';

export const findPreset = (id: string | null | undefined): ThemePreset | undefined =>
  THEME_PRESETS.find((t) => t.id === id);

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

export function tokensToCssVars(tokens: Partial<ThemeTokens>): Record<string, string> {
  return Object.fromEntries(Object.entries(tokens).map(([k, v]) => [`--color-${kebab(k)}`, v as string]));
}

/** CSS for all presets. Rendered once into <head> during SSR. */
export function buildThemeCss(presets: ThemePreset[] = THEME_PRESETS, defaultId = DEFAULT_THEME_ID): string {
  const block = (t: ThemePreset) => {
    const vars = Object.entries(tokensToCssVars(t.tokens))
      .map(([k, v]) => `${k}:${v}`)
      .join(';');
    return `${vars};color-scheme:${t.scheme}`;
  };
  const def = findPreset(defaultId) ?? presets[0];
  return [`:root{${block(def)}}`, ...presets.map((t) => `:root[data-theme="${t.id}"]{${block(t)}}`)].join('\n');
}
