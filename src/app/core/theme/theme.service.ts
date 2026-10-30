import { DOCUMENT, Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HEX_RE, ensureContrast, mix, readableOn } from './color';
import {
  DEFAULT_THEME_ID,
  THEME_CUSTOM_STORAGE_KEY,
  THEME_PRESETS,
  THEME_STORAGE_KEY,
  THEME_VARS_STORAGE_KEY,
  ThemePreset,
  buildThemeCss,
  findPreset,
  tokensToCssVars,
} from './themes';

const STYLE_ID = 'theme-presets';

/**
 * Manages the active theme preset and an optional custom brand colour.
 *
 * - Preset CSS variables are rendered into <head> on the server, so the first
 *   paint is already themed (no flash, no layout shift).
 * - A tiny inline script in index.html applies the saved choice before paint.
 * - The choice is persisted in localStorage (browser only).
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly presets = THEME_PRESETS;
  private readonly _themeId = signal<string>(DEFAULT_THEME_ID);
  private readonly _customPrimary = signal<string | null>(null);

  readonly themeId = this._themeId.asReadonly();
  readonly customPrimary = this._customPrimary.asReadonly();
  readonly current = computed<ThemePreset>(() => findPreset(this._themeId()) ?? THEME_PRESETS[0]);

  constructor() {
    this.ensurePresetStyles();
    if (this.isBrowser) this.restore();
  }

  setTheme(id: string): void {
    const preset = findPreset(id);
    if (!preset) return;
    this._themeId.set(preset.id);
    this.doc.documentElement.setAttribute('data-theme', preset.id);
    this.persist(THEME_STORAGE_KEY, preset.id);
    // Re-derive the custom colour against the new background, if one is set.
    const custom = this._customPrimary();
    if (custom) this.setCustomPrimary(custom);
    else this.updateThemeColorMeta();
  }

  /** Applies a user-chosen brand colour on top of the current preset. */
  setCustomPrimary(hex: string): boolean {
    if (!HEX_RE.test(hex)) return false;
    const vars = deriveCustomVars(hex, this.current());
    this.clearInlineVars();
    for (const [k, v] of Object.entries(vars)) this.doc.documentElement.style.setProperty(k, v);
    this._customPrimary.set(hex.toLowerCase());
    this.persist(THEME_CUSTOM_STORAGE_KEY, hex.toLowerCase());
    this.persist(THEME_VARS_STORAGE_KEY, JSON.stringify(vars));
    this.updateThemeColorMeta();
    return true;
  }

  resetCustom(): void {
    this.clearInlineVars();
    this._customPrimary.set(null);
    this.remove(THEME_CUSTOM_STORAGE_KEY);
    this.remove(THEME_VARS_STORAGE_KEY);
    this.updateThemeColorMeta();
  }

  private restore(): void {
    const saved = this.read(THEME_STORAGE_KEY) ?? this.doc.documentElement.getAttribute('data-theme');
    const preset = findPreset(saved) ?? findPreset(DEFAULT_THEME_ID)!;
    this._themeId.set(preset.id);
    this.doc.documentElement.setAttribute('data-theme', preset.id);
    const custom = this.read(THEME_CUSTOM_STORAGE_KEY);
    if (custom && HEX_RE.test(custom)) this.setCustomPrimary(custom);
    else this.updateThemeColorMeta();
  }

  private ensurePresetStyles(): void {
    if (this.doc.getElementById(STYLE_ID)) return;
    const style = this.doc.createElement('style');
    style.id = STYLE_ID;
    style.textContent = buildThemeCss();
    this.doc.head.insertBefore(style, this.doc.head.firstChild);
  }

  private clearInlineVars(): void {
    const style = this.doc.documentElement.style;
    for (const name of Array.from({ length: style.length }, (_, i) => style.item(i))) {
      if (name.startsWith('--color-')) style.removeProperty(name);
    }
  }

  private updateThemeColorMeta(): void {
    const color = this.current().tokens.surface;
    let meta = this.doc.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = this.doc.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      this.doc.head.appendChild(meta);
    }
    meta.setAttribute('content', color);
  }

  private read(key: string): string | null {
    if (!this.isBrowser) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private persist(key: string, value: string): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      /* storage unavailable (private mode / blocked) — theme still applies for this visit */
    }
  }

  private remove(key: string): void {
    if (!this.isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}

/** Derives accessible primary-colour tokens for a custom brand colour. */
export function deriveCustomVars(hex: string, base: ThemePreset): Record<string, string> {
  const t = base.tokens;
  const dark = base.scheme === 'dark';
  const primary = ensureContrast(hex.toLowerCase(), t.surface, 4.5);
  const primaryHover = ensureContrast(mix(primary, dark ? '#ffffff' : '#000000', 0.18), t.surface, 4.5);
  const primarySoft = mix(t.surface, primary, dark ? 0.22 : 0.1);
  return tokensToCssVars({
    primary,
    primaryHover,
    onPrimary: readableOn(primary),
    primarySoft,
    accent: hex.toLowerCase(),
  });
}
