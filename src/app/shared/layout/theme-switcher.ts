import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ThemeService } from '../../core/theme/theme.service';
import { Icon } from '../ui/icon';

/**
 * Theme picker: five presets as a native radio group (arrow keys work out of
 * the box) plus an optional custom brand colour.
 */
@Component({
  selector: 'app-theme-switcher',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'theme-switcher',
    '(document:click)': 'onDocumentClick($event)',
    '(keydown.escape)': 'close(true)',
  },
  template: `
    <button
      #trigger
      type="button"
      class="btn btn--ghost btn--icon"
      aria-controls="theme-panel"
      [attr.aria-expanded]="open()"
      (click)="toggle()"
    >
      <app-icon name="palette" label="Change theme" />
    </button>

    <div id="theme-panel" class="panel" [hidden]="!open()">
      <fieldset>
        <legend>Theme</legend>
        <div class="options">
          @for (preset of theme.presets; track preset.id) {
            <label class="option" [class.is-active]="theme.themeId() === preset.id">
              <input
                type="radio"
                name="theme"
                [value]="preset.id"
                [checked]="theme.themeId() === preset.id"
                (change)="theme.setTheme(preset.id)"
              />
              <span class="swatch" aria-hidden="true">
                <span [style.background]="preset.tokens.bg"></span>
                <span [style.background]="preset.tokens.primary"></span>
                <span [style.background]="preset.tokens.accent"></span>
              </span>
              <span class="text">
                <span class="name">{{ preset.label }}</span>
                <span class="desc">{{ preset.description }}</span>
              </span>
            </label>
          }
        </div>
      </fieldset>

      <div class="custom">
        <label for="custom-color">Custom brand colour</label>
        <div class="custom__row">
          <input
            id="custom-color"
            type="color"
            [value]="theme.customPrimary() ?? theme.current().tokens.primary"
            (change)="onCustom($event)"
            aria-describedby="custom-hint"
          />
          @if (theme.customPrimary()) {
            <button type="button" class="btn btn--sm btn--outline" (click)="theme.resetCustom()">Reset</button>
          }
        </div>
        <p id="custom-hint" class="hint">Adjusted automatically to keep text readable.</p>
      </div>
    </div>
  `,
  styles: `
    :host { position: relative; display: inline-block; }
    .panel {
      position: absolute; right: 0; top: calc(100% + .5rem); z-index: 60;
      width: min(19rem, calc(100vw - 2rem)); padding: 1rem;
      background: var(--color-surface); border: 1px solid var(--color-border);
      border-radius: var(--radius-md); box-shadow: var(--shadow-lg);
    }
    .panel[hidden] { display: none; }
    fieldset { border: 0; margin: 0; padding: 0; }
    legend { font-weight: 700; margin-bottom: .5rem; }
    .options { display: grid; gap: .25rem; }
    .option { display: flex; align-items: center; gap: .75rem; padding: .5rem; border-radius: var(--radius-sm); cursor: pointer; border: 1.5px solid transparent; }
    .option:hover { background: var(--color-surface-alt); }
    .option.is-active { border-color: var(--color-primary); background: var(--color-primary-soft); }
    .option:has(input:focus-visible) { outline: 3px solid var(--color-primary); outline-offset: 1px; }
    input[type=radio] { position: absolute; opacity: 0; pointer-events: none; }
    .swatch { display: flex; border-radius: 50%; overflow: hidden; width: 2rem; height: 2rem; border: 1px solid var(--color-border); flex-shrink: 0; transform: rotate(-30deg); }
    .swatch span { flex: 1; }
    .text { display: grid; line-height: 1.25; }
    .name { font-weight: 600; font-size: var(--font-size-sm); }
    .desc { font-size: var(--font-size-xs); color: var(--color-text-muted); }
    .custom { margin-top: .75rem; padding-top: .75rem; border-top: 1px solid var(--color-border); display: grid; gap: .4rem; }
    .custom label { font-weight: 600; font-size: var(--font-size-sm); }
    .custom__row { display: flex; gap: .5rem; align-items: center; }
    input[type=color] { width: 3rem; height: 2.5rem; padding: 2px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-surface); cursor: pointer; }
    .hint { margin: 0; font-size: var(--font-size-xs); color: var(--color-text-muted); }
  `,
})
export class ThemeSwitcher {
  protected readonly theme = inject(ThemeService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  protected readonly open = signal(false);

  toggle(): void {
    this.open.update((v) => !v);
  }

  close(returnFocus = false): void {
    if (!this.open()) return;
    this.open.set(false);
    if (returnFocus) this.trigger()?.nativeElement.focus();
  }

  onDocumentClick(event: Event): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) this.close();
  }

  onCustom(event: Event): void {
    this.theme.setCustomPrimary((event.target as HTMLInputElement).value);
  }
}
