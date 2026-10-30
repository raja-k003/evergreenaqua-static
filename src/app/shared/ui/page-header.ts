import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Breadcrumb } from '../../core/seo/seo.models';
import { Breadcrumbs } from './breadcrumbs';

/** Inner-page hero: breadcrumbs, the page's single H1 and an optional lead. */
@Component({
  selector: 'app-page-header',
  imports: [Breadcrumbs],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-header">
      <div class="container">
        @if (breadcrumbs().length) {
          <app-breadcrumbs [items]="breadcrumbs()" />
        }
        @if (eyebrow()) {
          <p class="eyebrow">{{ eyebrow() }}</p>
        }
        <h1>{{ title() }}</h1>
        @if (lead()) {
          <p class="lead">{{ lead() }}</p>
        }
        <ng-content />
      </div>
    </header>
  `,
  styles: `
    .page-header {
      padding-block: clamp(2rem, 1.5rem + 3vw, 4rem) clamp(1.75rem, 1rem + 2vw, 3rem);
      background:
        radial-gradient(60rem 20rem at 85% -10%, var(--color-primary-soft), transparent 70%),
        var(--color-surface);
      border-bottom: 1px solid var(--color-border);
    }
    h1 { font-size: var(--font-size-3xl); max-width: 48rem; }
    .lead { margin: 0; }
  `,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly lead = input<string>('');
  readonly eyebrow = input<string>('');
  readonly breadcrumbs = input<Breadcrumb[]>([]);
}
