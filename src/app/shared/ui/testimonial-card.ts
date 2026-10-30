import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Testimonial } from '../../core/data/content';
import { Icon } from './icon';

@Component({
  selector: 'app-testimonial-card',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="card">
      <app-icon name="quote" [size]="44" class="q" />
      <blockquote>
        <p>{{ item().quote }}</p>
      </blockquote>
      <figcaption>
        <span class="avatar" aria-hidden="true">
          @if (look(); as a) {
            @if (a.photo) {
              <img [src]="a.photo" alt="" loading="lazy" />
            } @else {
              <svg viewBox="0 0 80 80" [style.--skin]="a.skin" [style.--hair]="a.hair" [style.--cloth]="a.cloth">
                @if (a.gender === 'f') {
                  <path class="hair" d="M19 42C14 10 66 10 61 42L64 72H16Z" />
                }
                <path class="cloth" d="M8 82C10 64 26 59 40 59S70 64 72 82Z" />
                <rect class="skin shade" x="34" y="47" width="12" height="15" rx="5" />
                <ellipse class="skin" cx="40" cy="36" rx="14" ry="16" />
                @if (a.gender === 'f') {
                  <path class="hair" d="M25 35C23 17 57 15 55 35C49 26 37 24 25 35Z" />
                  <circle class="gold" cx="26" cy="42" r="1.8" /><circle class="gold" cx="54" cy="42" r="1.8" />
                } @else {
                  <path class="hair" d="M25 33C22 14 58 14 55 33C52 24 28 24 25 33Z" />
                }
                <circle class="eye" cx="34" cy="37" r="1.7" /><circle class="eye" cx="46" cy="37" r="1.7" />
                @if (a.glasses) {
                  <g class="glass"><circle cx="34" cy="37" r="5" /><circle cx="46" cy="37" r="5" /><path d="M39 37h2" /></g>
                }
                @if (a.stache) {
                  <path class="hair" d="M33 43c3-2 5 0 7 0s4-2 7 0c-2 3-5 2-7 2s-5 1-7-2z" />
                }
                <path class="smile" d="M35 45Q40 50 45 45" />
              </svg>
            }
          } @else {
            {{ initials() }}
          }
        </span>
        <span><strong>{{ item().name }}</strong><span class="muted">Customer, Chennai</span></span>
      </figcaption>
    </figure>
  `,
  styles: `
    :host { display: block; height: 100%; }
    figure { margin: 0; gap: 1.1rem; position: relative; overflow: hidden; border: 0; border-radius: 1.25rem; padding: 1.75rem 1.5rem 1.5rem;
      background: linear-gradient(var(--color-surface), var(--color-surface)) padding-box, linear-gradient(140deg, var(--color-accent, var(--color-primary)), transparent 55%, var(--color-primary)) border-box;
      border: 1.5px solid transparent; box-shadow: 0 12px 30px color-mix(in srgb, var(--color-primary) 10%, transparent);
      transition: transform .35s cubic-bezier(.2, .7, .2, 1), box-shadow .35s ease; }
    figure::after { content: ''; position: absolute; right: -3.5rem; bottom: -3.5rem; width: 10rem; height: 10rem; border-radius: 50%; pointer-events: none;
      background: radial-gradient(circle, color-mix(in srgb, var(--color-accent, var(--color-primary)) 20%, transparent), transparent 70%); transition: transform .5s ease; }
    figure:hover { transform: translateY(-6px); box-shadow: 0 24px 46px color-mix(in srgb, var(--color-primary) 22%, transparent); }
    figure:hover::after { transform: scale(1.5); }
    .q { color: var(--color-accent, var(--color-primary)); opacity: .5; }
    blockquote { margin: 0; flex: 1; position: relative; z-index: 1; }
    blockquote p { margin: 0; line-height: 1.65; }
    figcaption { position: relative; z-index: 1; display: flex; align-items: center; gap: .85rem; padding-top: 1rem; border-top: 1px solid var(--color-border); font-size: var(--font-size-sm); line-height: 1.3; }
    figcaption strong { display: block; font-size: var(--font-size-md); }
    .avatar { flex: none; display: grid; place-items: center; width: 3.5rem; height: 3.5rem; border-radius: 50%; overflow: hidden; font-weight: 700; color: var(--color-on-primary);
      background: linear-gradient(145deg, var(--color-accent, var(--color-primary)), var(--color-primary)); box-shadow: 0 0 0 3px var(--color-surface), 0 0 0 5px color-mix(in srgb, var(--color-accent, var(--color-primary)) 55%, transparent); }
    .avatar svg, .avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .avatar svg { background: linear-gradient(160deg, color-mix(in srgb, var(--color-accent, var(--color-primary)) 35%, #fff), color-mix(in srgb, var(--color-primary) 25%, #fff)); }
    .hair { fill: var(--hair); } .skin { fill: var(--skin); } .shade { filter: brightness(.88); } .cloth { fill: var(--cloth); }
    .gold { fill: #f5c542; } .eye { fill: #1b1210; }
    .smile { fill: none; stroke: #5b2a1c; stroke-width: 1.6; stroke-linecap: round; }
    .glass { fill: none; stroke: #1b1210; stroke-width: 1.2; }
    @media (prefers-reduced-motion: reduce) { figure, figure::after { transition: none; } figure:hover { transform: none; } }
  `,
})
export class TestimonialCard {
  readonly item = input.required<Testimonial>();
  protected readonly look = computed(() => this.item().avatar);
  protected readonly initials = computed(() =>
    this.item().name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase(),
  );
}
