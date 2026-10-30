import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { contrastRatio, ensureContrast } from './color';
import { ThemeService, deriveCustomVars } from './theme.service';
import { THEME_PRESETS, buildThemeCss } from './themes';

describe('theme presets', () => {
  it('ships exactly five presets', () => expect(THEME_PRESETS.length).toBe(5));

  for (const t of THEME_PRESETS) {
    it(`${t.id} meets WCAG AA contrast`, () => {
      const k = t.tokens;
      expect(contrastRatio(k.text, k.bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(k.textMuted, k.surfaceAlt)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(k.primary, k.surface)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(k.primary, k.primarySoft)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(k.onPrimary, k.primary)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(k.onPrimary, k.primaryHover)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(k.danger, k.surface)).toBeGreaterThanOrEqual(4.5);
    });
  }

  it('builds CSS for every preset plus a :root default', () => {
    const css = buildThemeCss();
    expect(css).toContain(':root{--color-primary:#0f766e');
    for (const t of THEME_PRESETS) expect(css).toContain(`[data-theme="${t.id}"]`);
  });

  it('custom colours are adjusted to stay readable', () => {
    const light = THEME_PRESETS[0];
    const vars = deriveCustomVars('#ffee00', light); // yellow: unreadable on white as-is
    expect(contrastRatio(vars['--color-primary'], light.tokens.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(vars['--color-on-primary'], vars['--color-primary'])).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(ensureContrast('#222222', '#0b1120'), '#0b1120')).toBeGreaterThanOrEqual(4.5);
  });
});

describe('ThemeService', () => {
  let service: ThemeService;
  let doc: Document;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    doc = TestBed.inject(DOCUMENT);
    doc.documentElement.removeAttribute('style');
    doc.documentElement.removeAttribute('data-theme');
    service = TestBed.inject(ThemeService);
  });

  it('injects preset styles once and defaults to ocean', () => {
    expect(doc.querySelectorAll('#theme-presets').length).toBe(1);
    expect(service.themeId()).toBe('ocean');
  });

  it('applies and persists a preset', () => {
    service.setTheme('midnight');
    expect(doc.documentElement.dataset['theme']).toBe('midnight');
    expect(localStorage.getItem('smp-theme')).toBe('midnight');
    expect(doc.querySelector('meta[name=theme-color]')?.getAttribute('content')).toBe('#121a2f');
  });

  it('ignores unknown presets and invalid colours', () => {
    service.setTheme('neon');
    expect(service.themeId()).toBe('ocean');
    expect(service.setCustomPrimary('red')).toBe(false);
  });

  it('applies and resets a custom brand colour', () => {
    expect(service.setCustomPrimary('#e11d48')).toBe(true);
    expect(doc.documentElement.style.getPropertyValue('--color-primary')).not.toBe('');
    expect(JSON.parse(localStorage.getItem('smp-theme-vars')!)['--color-primary']).toBeTruthy();
    service.resetCustom();
    expect(doc.documentElement.style.getPropertyValue('--color-primary')).toBe('');
    expect(localStorage.getItem('smp-theme-vars')).toBeNull();
  });
});
