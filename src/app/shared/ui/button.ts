import { Directive, booleanAttribute, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'light';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Applies the design-system button styles to a native <button> or <a>, so
 * semantics (links navigate, buttons act) stay correct.
 *
 *   <a appButton variant="outline" routerLink="/contact">Contact</a>
 *   <button appButton type="submit" [loading]="saving()">Send</button>
 */
@Directive({
  selector: 'button[appButton], a[appButton]',
  host: {
    class: 'btn',
    '[class.btn--outline]': 'variant() === "outline"',
    '[class.btn--ghost]': 'variant() === "ghost"',
    '[class.btn--light]': 'variant() === "light"',
    '[class.btn--sm]': 'size() === "sm"',
    '[class.btn--lg]': 'size() === "lg"',
    '[class.btn--block]': 'block()',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[attr.aria-disabled]': 'loading() ? "true" : null',
  },
})
export class ButtonDirective {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly block = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
}
