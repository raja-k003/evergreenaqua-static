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
  /** Second brand hue: decorative badges, icon tiles, secondary highlights. Never an action colour. */
  secondary: string;
  secondarySoft: string;
  onSecondary: string;
  /** Deep neutral (lightly tinted by the theme) for dark bands: footer, CTA, feature sections. */
  ink: string;
  /** Status colours, deliberately independent of the selected primary. */
  info: string;
  warning: string;
}

export interface ThemePreset {
  id: string;
  label: string;
  description: string;
  scheme: 'light' | 'dark';
  tokens: ThemeTokens;
}

const status = { success: '#15803d', danger: '#b91c1c', info: '#0b6bcb', warning: '#b45309' };

/**
 * The five built-in presets. Every text/background pair here is checked for
 * WCAG AA contrast (4.5:1) by theme.spec.ts.
 */
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'aqua',
    label: 'Aqua',
    description: 'Evergreen Aqua Systems brand blue',
    scheme: 'light',
    tokens: {
      primary: '#3857f1', primaryHover: '#2440d4', onPrimary: '#ffffff', primarySoft: '#e9eeff', accent: '#0ea5e9',
      bg: '#f6f8fe', surface: '#ffffff', surfaceAlt: '#eef2fc', text: '#0f172a', textMuted: '#475569', border: '#d9e0f0', ...status,
      secondary: '#0e7490', secondarySoft: '#e0f2f7', onSecondary: '#ffffff', ink: '#0f1b36',
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
      secondary: '#0369a1', secondarySoft: '#e1f0f9', onSecondary: '#ffffff', ink: '#0d2422',
    },
  },
  {
    id: 'forest',
    label: 'Forest',
    description: 'Fresh green',
    scheme: 'light',
    tokens: {
      primary: '#166534', primaryHover: '#114d28', onPrimary: '#ffffff', primarySoft: '#e6f4ea', accent: '#22c55e',
      bg: '#f6faf6', surface: '#ffffff', surfaceAlt: '#ecf5ee', text: '#122016', textMuted: '#4a5f50', border: '#d6e6d9', success: '#166534', danger: '#b91c1c', info: '#0b6bcb', warning: '#b45309',
      secondary: '#8f5206', secondarySoft: '#f8f0d9', onSecondary: '#ffffff', ink: '#0f2217',
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
      secondary: '#9d174d', secondarySoft: '#fbe7f0', onSecondary: '#ffffff', ink: '#2a1710',
    },
  },
  {
    id: 'midnight',
    label: 'Midnight',
    description: 'Dark mode',
    scheme: 'dark',
    tokens: {
      primary: '#8ea6ff', primaryHover: '#b0c1ff', onPrimary: '#0b1120', primarySoft: '#1d2948', accent: '#38bdf8',
      bg: '#0b1120', surface: '#121a2f', surfaceAlt: '#18223b', text: '#e6ebf5', textMuted: '#a3afc4', border: '#26324f', success: '#4ade80', danger: '#f87171', info: '#60a5fa', warning: '#fbbf24',
      secondary: '#c4b5fd', secondarySoft: '#2a2552', onSecondary: '#0b1120', ink: '#050813',
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
