import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteImage } from '../../core/data/images';
import { Icon } from './icon';
import { InrPipe } from './inr.pipe';

@Component({
  selector: 'app-product-card',
  imports: [NgOptimizedImage, RouterLink, Icon, InrPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card card--flush card--interactive">
      <div class="media media--contain">
        <img [ngSrc]="image().src" [alt]="image().alt" fill sizes="(min-width: 900px) 33vw, 100vw" [priority]="priority()" />
      </div>
      <div class="card__body">
        @if (tag()) {
          <span class="badge">{{ tag() }}</span>
        }
        <h3 class="card__title">
          <a class="stretched-link" [routerLink]="link()">{{ name() }}</a>
        </h3>
        <p class="card__text">{{ summary() }}</p>
        @if (highlights().length) {
          <div class="hl">
            @if (highlightsTitle()) {
              <p class="hl__title">{{ highlightsTitle() }}</p>
            }
            <ul class="hl__list">
              @for (h of highlights(); track h) {
                <li><span class="hl__tick" aria-hidden="true"><app-icon name="check" [size]="12" /></span>{{ h }}</li>
              }
            </ul>
          </div>
        }
        <div class="card__footer">
          @if (fromPrice()) {
            <span class="muted">From <span class="price">{{ fromPrice() | inr }}</span></span>
          } @else {
            <span class="muted">Price on request</span>
          }
          <span class="more" aria-hidden="true">Read more <app-icon name="arrow-right" [size]="16" /></span>
        </div>
      </div>
    </article>
  `,
  styles: `
    :host { display: block; height: 100%; }
    .card { transition: box-shadow .3s ease, border-color .3s ease, transform .3s ease; }
    .card:hover, .card:focus-within { transform: translateY(-6px); box-shadow: 0 22px 44px color-mix(in srgb, var(--color-primary) 18%, transparent); }
    .card__title { font-size: var(--font-size-xl); }
    .card__title a { color: var(--color-text); text-decoration: none; }
    .card__title a:hover { color: var(--color-primary); }
    .media { border-radius: 0; --ratio: 4 / 3; position: relative; overflow: hidden;
      background: radial-gradient(circle at 50% 70%, color-mix(in srgb, var(--color-accent, var(--color-primary)) 26%, #fff), color-mix(in srgb, var(--color-accent, var(--color-primary)) 8%, var(--color-surface)) 70%); }
    .media img { transition: transform .5s cubic-bezier(.2, .7, .2, 1); }
    .card:hover .media img { transform: scale(1.07) translateY(-2%); }
    /* water line at the foot of the image */
    .media::after { content: ''; position: absolute; inset: auto 0 0; height: 3px; background: linear-gradient(90deg, transparent, var(--color-accent, var(--color-primary)), var(--color-primary), transparent); opacity: .7; }
    .badge { align-self: flex-start; }
    .hl { margin-top: var(--space-3); padding: .9rem 1rem; border-radius: var(--radius-md); border: 1px solid color-mix(in srgb, var(--color-primary) 14%, transparent);
      background: color-mix(in srgb, var(--color-primary-soft) 55%, var(--color-surface)); }
    .hl__title { margin: 0 0 .6rem; font-size: var(--font-size-xs); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--color-primary); }
    .hl__list { list-style: none; margin: 0; padding: 0; display: grid; gap: .45rem .75rem; grid-template-columns: repeat(auto-fit, minmax(9.5rem, 1fr)); font-size: var(--font-size-xs); font-weight: 600; color: var(--color-text); }
    .hl__list li { display: flex; align-items: center; gap: .45rem; line-height: 1.25; }
    .hl__tick { flex: none; display: grid; place-items: center; width: 1.1rem; height: 1.1rem; border-radius: 50%; color: var(--color-on-primary);
      background: linear-gradient(145deg, var(--color-accent, var(--color-primary)), var(--color-primary)); }
    .card__footer { border-top: 1px solid var(--color-border); margin-top: auto; }
    .more { display: inline-flex; align-items: center; gap: .3rem; padding: .4rem .9rem; border-radius: var(--radius-pill); color: var(--color-primary); font-weight: 700; font-size: var(--font-size-sm);
      background: var(--color-primary-soft); transition: background .25s ease, color .25s ease, gap .25s ease; }
    .card:hover .more { background: var(--color-primary); color: var(--color-on-primary); gap: .55rem; }
    @media (prefers-reduced-motion: reduce) { .card, .media img, .more { transition: none; } .card:hover { transform: none; } .card:hover .media img { transform: none; } }
  `,
})
export class ProductCard {
  readonly name = input.required<string>();
  readonly summary = input.required<string>();
  readonly link = input.required<string>();
  readonly image = input.required<SiteImage>();
  readonly fromPrice = input<number | undefined>(undefined);
  readonly tag = input<string>('');
  readonly highlightsTitle = input<string>('');
  readonly highlights = input<string[]>([]);
  readonly priority = input(false);
}
