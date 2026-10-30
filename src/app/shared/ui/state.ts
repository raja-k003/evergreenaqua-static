import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Icon } from './icon';

export type StateKind = 'loading' | 'empty' | 'error';

/**
 * Loading, empty and error placeholder. Uses role="status" (polite) for
 * loading/empty and role="alert" for errors so screen readers announce them.
 * Projected content (e.g. a retry button) appears below the message.
 */
@Component({
  selector: 'app-state',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.role]': 'kind() === "error" ? "alert" : "status"', '[class]': '"state state--" + kind()' },
  template: `
    @if (kind() === 'loading') {
      <span class="spinner" aria-hidden="true"></span>
    } @else {
      <span class="state__icon"><app-icon [name]="icon()" [size]="26" /></span>
    }
    <p class="state__title">{{ title() }}</p>
    @if (message()) {
      <p class="state__message">{{ message() }}</p>
    }
    <ng-content />
  `,
  styles: `
    :host { display: grid; justify-items: center; gap: .5rem; text-align: center; padding: 2.5rem 1.5rem; border: 1px dashed var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); }
    .spinner { width: 2rem; height: 2rem; color: var(--color-primary); }
    .state__icon { display: grid; place-items: center; width: 3.25rem; height: 3.25rem; border-radius: 50%; background: var(--color-primary-soft); color: var(--color-primary); }
    :host(.state--error) .state__icon { color: var(--color-danger); background: color-mix(in srgb, var(--color-danger) 10%, var(--color-surface)); }
    .state__title { margin: 0; font-weight: 700; }
    .state__message { margin: 0 0 .5rem; color: var(--color-text-muted); max-width: 32rem; }
  `,
})
export class StateView {
  readonly kind = input<StateKind>('empty');
  readonly title = input.required<string>();
  readonly message = input<string>('');
  protected readonly icon = computed(() => (this.kind() === 'error' ? 'alert' : 'inbox'));
}
