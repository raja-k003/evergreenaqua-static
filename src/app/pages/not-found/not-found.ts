import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PAGES } from '../../core/config/pages';
import { PRODUCT_LINKS } from '../../core/config/navigation';
import { markNotFound } from '../../core/routing/route-utils';
import { SeoService } from '../../core/seo/seo.service';
import { ButtonDirective } from '../../shared/ui/button';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container nf">
        <p class="code" aria-hidden="true">404</p>
        <h1>We couldn’t find that page</h1>
        <p class="lead">The page may have moved, or the link may be mistyped. Try one of these instead:</p>
        <div class="btn-row center">
          <a appButton routerLink="/">Go to the home page</a>
          <a appButton variant="outline" routerLink="/contact">Contact us</a>
        </div>
        <nav aria-labelledby="nf-popular" class="popular">
          <h2 id="nf-popular">Popular pages</h2>
          <ul class="chips">
            @for (l of links; track l.path) {
              <li><a class="badge" [routerLink]="l.path">{{ l.label }}</a></li>
            }
          </ul>
        </nav>
      </div>
    </section>
  `,
  styles: `
    .nf { text-align: center; max-width: 40rem; }
    .code { font-size: clamp(4rem, 10vw, 7rem); font-weight: 800; line-height: 1; margin: 0 0 1rem; color: var(--color-primary); opacity: .25; }
    .lead { margin-inline: auto; }
    .center { justify-content: center; }
    .popular { margin-top: 2.5rem; }
    .popular h2 { font-size: var(--font-size-lg); }
    .chips { justify-content: center; }
    .badge { text-decoration: none; padding: .45rem .85rem; color: var(--color-text); }
    .badge:hover { color: var(--color-primary); border-color: var(--color-primary); }
  `,
})
export class NotFound {
  protected readonly links = PRODUCT_LINKS;

  constructor() {
    markNotFound();
    const p = PAGES.notFound;
    // noindex + HTTP 404 keep it out of search; no canonical is emitted for noindex pages.
    inject(SeoService).setPage({ title: p.title, description: p.description, path: p.path, noindex: true });
  }
}
