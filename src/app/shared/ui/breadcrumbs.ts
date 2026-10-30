import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Breadcrumb } from '../../core/seo/seo.models';
import { Icon } from './icon';

/** Visible breadcrumb trail. The matching BreadcrumbList JSON-LD is emitted by SeoService. */
@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav aria-label="Breadcrumb">
      <ol>
        @for (item of items(); track item.label; let last = $last) {
          <li>
            @if (!last && item.path) {
              <a [routerLink]="item.path">{{ item.label }}</a>
              <app-icon name="chevron-right" [size]="14" />
            } @else {
              <span aria-current="page">{{ item.label }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: `
    ol { display: flex; flex-wrap: wrap; align-items: center; gap: .25rem .5rem; list-style: none; margin: 0 0 1rem; padding: 0; font-size: var(--font-size-xs); }
    li { display: inline-flex; align-items: center; gap: .5rem; color: var(--color-text-muted); }
    a { color: var(--color-text-muted); text-decoration: none; }
    a:hover { color: var(--color-primary); text-decoration: underline; }
    [aria-current] { color: var(--color-text); font-weight: 600; }
  `,
})
export class Breadcrumbs {
  readonly items = input.required<Breadcrumb[]>();
}
